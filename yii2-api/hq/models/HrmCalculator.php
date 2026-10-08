<?php

namespace frontend\modules\hq\models;

use Yii;

class HrmCalculator
{
    /**
     * محاسبه حقوق ماهانه یک پرسنل
     */
    public static function calculateSalary($userId, $year, $month)
    {
        // دریافت تنظیمات
        $standardHoursPerDay = HrmSetting::getFloat('salary.standard_hours_per_day', 8);
        $standardDaysPerMonth = HrmSetting::getFloat('salary.standard_days_per_month', 22);
        $overtimeRate = HrmSetting::getFloat('salary.overtime_rate', 1.4);

        // دریافت خلاصه ماهانه
        $summary = HrmMonthlySummary::find()
            ->where(['user_id' => $userId, 'year' => $year, 'month' => $month])
            ->one();

        if (!$summary) {
            return ['success' => false, 'message' => 'خلاصه ماهانه پیدا نشد'];
        }

        // دریافت اطلاعات قرارداد پرسنل
        $contract = HrmContract::find()
            ->where(['user_id' => $userId, 'contract_status' => HrmContract::STATUS_ACTIVE])
            ->orderBy(['id' => SORT_DESC])
            ->one();

        if (!$contract) {
            return ['success' => false, 'message' => 'قرارداد فعالی برای این پرسنل یافت نشد'];
        }

        $baseSalary = $contract->base_salary;
        $dailySalary = $baseSalary / $standardDaysPerMonth;
        $hourlySalary = $dailySalary / $standardHoursPerDay;

        // محاسبات
        $workHours = $summary->total_work_hours;
        $overtimeHours = $summary->total_overtime_hours;
        $vacationHours = $summary->total_vacation_hours;
        $missionHours = $summary->total_mission_hours;
        $absentHours = $summary->total_absent_hours;

        // حقوق پایه
        $basePay = $dailySalary * $summary->work_days_count;

        // اضافه کار
        $overtimePay = $overtimeHours * $hourlySalary * $overtimeRate;

        // مرخصی (با حقوق)
        $vacationPay = $vacationHours * $hourlySalary;

        // ماموریت (با حقوق)
        $missionPay = $missionHours * $hourlySalary;

        // کسر غیبت
        $absentDeduction = $absentHours * $hourlySalary;

        // جمع کل
        $totalPay = $basePay + $overtimePay + $vacationPay + $missionPay - $absentDeduction;

        return [
            'success' => true,
            'data' => [
                'user_id' => $userId,
                'year' => $year,
                'month' => $month,
                'base_salary' => $baseSalary,
                'daily_salary' => round($dailySalary, 2),
                'hourly_salary' => round($hourlySalary, 2),
                'work_days' => $summary->work_days_count,
                'work_hours' => $workHours,
                'overtime_hours' => $overtimeHours,
                'vacation_hours' => $vacationHours,
                'mission_hours' => $missionHours,
                'absent_hours' => $absentHours,
                'base_pay' => round($basePay, 2),
                'overtime_pay' => round($overtimePay, 2),
                'vacation_pay' => round($vacationPay, 2),
                'mission_pay' => round($missionPay, 2),
                'absent_deduction' => round($absentDeduction, 2),
                'total_pay' => round($totalPay, 2),
            ]
        ];
    }

    /**
     * محاسبه عیدی (قبلی)
     */
    public static function calculateBonus($userId, $year)
    {
        // دریافت تنظیمات
        $baseMonths = HrmSetting::getInt('bonus.base_salary_months', 3);
        $method = HrmSetting::getValue('bonus.calculation_method', 'last_3_months_avg');
        $minAmount = HrmSetting::getInt('bonus.min_amount', 0);
        $maxAmount = HrmSetting::getInt('bonus.max_amount', 0);
        $eligibilityDays = HrmSetting::getInt('bonus.eligibility_days', 90);

        // ====== ۱. دریافت حقوق پایه ======
        $baseSalary = self::getBaseSalary($userId);

        if ($baseSalary == 0) {
            return [
                'success' => false, 
                'message' => 'هیچ حقوق پایه‌ای برای این پرسنل یافت نشد'
            ];
        }

        // ====== ۲. اطمینان از وجود خلاصه ماهانه ======
        self::ensureMonthlySummaries($userId, $year);

        // ====== ۳. دریافت خلاصه ماهانه ======
        $summaries = HrmMonthlySummary::find()
            ->where(['user_id' => $userId, 'year' => $year])
            ->all();

        $totalWorkDays = 0;
        $totalWorkHours = 0;
        $totalVacationDays = 0;
        $totalMissionDays = 0;
        $totalAbsentDays = 0;

        foreach ($summaries as $summary) {
            $totalWorkDays += $summary->work_days_count;
            $totalWorkHours += $summary->total_work_hours;
            $totalVacationDays += $summary->vacation_days_count;
            $totalMissionDays += $summary->mission_days_count;
            $totalAbsentDays += $summary->absent_days_count;
        }

        // اگر باز هم چیزی نداشت، از کارکرد روزانه مستقیم بگیر
        if ($totalWorkDays == 0 && $totalWorkHours == 0) {
            $attendanceRecords = HrmDailyAttendance::find()
                ->where(['user_id' => $userId])
                ->andWhere(['between', 'attendance_date', "{$year}-01-01", "{$year}-12-31"])
                ->all();

            foreach ($attendanceRecords as $record) {
                if ($record->is_full_day) {
                    $totalWorkDays++;
                    $totalWorkHours += 8;
                } elseif ($record->work_duration > 0) {
                    $totalWorkDays++;
                    $totalWorkHours += $record->work_duration;
                }
                if ($record->is_absent) {
                    $totalAbsentDays++;
                }
            }

            // مرخصی‌ها
            $vacationRecords = HrmVacation::find()
                ->where(['user_id' => $userId, 'status' => HrmVacation::STATUS_APPROVED])
                ->andWhere(['between', 'date_from', "{$year}-01-01", "{$year}-12-31"])
                ->all();

            foreach ($vacationRecords as $record) {
                $totalVacationDays += $record->days_count;
            }

            // ماموریت‌ها
            $missionRecords = HrmMission::find()
                ->where(['user_id' => $userId, 'status' => HrmMission::STATUS_APPROVED])
                ->andWhere(['between', 'date_from', "{$year}-01-01", "{$year}-12-31"])
                ->all();

            foreach ($missionRecords as $record) {
                $totalMissionDays += $record->days_count;
            }
        }

        // مجموع روزهای کارکرد (شامل مرخصی و ماموریت)
        $totalWorkDaysWithVacation = $totalWorkDays + $totalVacationDays + $totalMissionDays;

        // ====== ۴. بررسی حداقل روزهای کارکرد ======
        if ($totalWorkDaysWithVacation < $eligibilityDays) {
            return [
                'success' => true,
                'data' => [
                    'user_id' => $userId,
                    'year' => $year,
                    'work_days' => $totalWorkDaysWithVacation,
                    'work_days_only' => $totalWorkDays,
                    'vacation_days' => $totalVacationDays,
                    'mission_days' => $totalMissionDays,
                    'absent_days' => $totalAbsentDays,
                    'base_salary' => $baseSalary,
                    'bonus_amount' => 0,
                    'message' => 'پرسنل حداقل روزهای کارکرد را ندارد'
                ]
            ];
        }

        // ====== ۵. محاسبه بر اساس روش انتخاب شده ======
        switch ($method) {
            case 'last_month':
                $lastSummary = HrmMonthlySummary::find()
                    ->where(['user_id' => $userId])
                    ->orderBy(['year' => SORT_DESC, 'month' => SORT_DESC])
                    ->one();
                
                if ($lastSummary && $lastSummary->total_work_hours > 0) {
                    $baseSalary = ($lastSummary->total_work_hours / 8) * ($baseSalary / 22);
                }
                break;
                
            case 'last_3_months_avg':
            default:
                $lastMonths = [];
                $currentMonth = (int) date('n');
                $currentYear = (int) date('Y');
                
                for ($i = 1; $i <= $baseMonths; $i++) {
                    $month = $currentMonth - $i;
                    $yearCalc = $currentYear;
                    if ($month <= 0) {
                        $month += 12;
                        $yearCalc--;
                    }
                    $summary = HrmMonthlySummary::find()
                        ->where(['user_id' => $userId, 'year' => $yearCalc, 'month' => $month])
                        ->one();
                    
                    if ($summary && $summary->total_work_hours > 0) {
                        $monthlySalary = ($summary->total_work_hours / 8) * ($baseSalary / 22);
                        $lastMonths[] = $monthlySalary;
                    }
                }
                
                if (count($lastMonths) > 0) {
                    $baseSalary = array_sum($lastMonths) / count($lastMonths);
                }
                break;
        }

        // محاسبه عیدی
        $bonusAmount = $baseMonths * $baseSalary;

        // اعمال حداقل و حداکثر
        if ($minAmount > 0 && $bonusAmount < $minAmount) {
            $bonusAmount = $minAmount;
        }
        if ($maxAmount > 0 && $bonusAmount > $maxAmount) {
            $bonusAmount = $maxAmount;
        }

        return [
            'success' => true,
            'data' => [
                'user_id' => $userId,
                'year' => $year,
                'work_days' => $totalWorkDaysWithVacation,
                'work_days_only' => $totalWorkDays,
                'vacation_days' => $totalVacationDays,
                'mission_days' => $totalMissionDays,
                'absent_days' => $totalAbsentDays,
                'base_salary' => round($baseSalary, 2),
                'bonus_amount' => round($bonusAmount, 2),
                'method' => $method,
            ]
        ];
    }

    /**
     * ========== جدید: محاسبه تسویه حساب آخر سال (عیدی + سنوات + پایه سنوات) ==========
     */
    public static function calculateYearEndSettlement($userId, $year)
    {
        // دریافت اطلاعات کاربر
        $user = User::findOne($userId);
        if (!$user) {
            return ['success' => false, 'message' => 'کاربر یافت نشد'];
        }

        // دریافت سال مالی فعال
        $financialYear = HrmFinancialYear::getActive();
        if (!$financialYear) {
            return ['success' => false, 'message' => 'سال مالی فعالی یافت نشد'];
        }

        // ========== 1. محاسبه حقوق پایه ==========
        $baseSalary = self::getBaseSalary($userId);
        if ($baseSalary == 0) {
            $baseSalary = $financialYear->salary ?? 0;
        }

        // ========== 2. محاسبه روزهای کارکرد ==========
        $workDays = self::calculateWorkDays($userId, $year);

        // ========== 3. محاسبه عیدی ==========
        $bonusAmount = self::calculateBonusAmount($baseSalary, $workDays);

        // ========== 4. محاسبه سنوات ==========
        $serviceYears = self::calculateServiceYears($userId, $year);
        $seniorityAmount = ($baseSalary * $serviceYears) / 12;

        // ========== 5. محاسبه پایه سنوات ==========
        $baseServiceYears = $serviceYears;
        $baseSeniorityAmount = $serviceYears * 2000000; // ۲,۰۰۰,۰۰۰ ریال به ازای هر سال

        // ========== 6. مجموع تسویه ==========
        $totalSettlement = $bonusAmount + $seniorityAmount + $baseSeniorityAmount;

        return [
            'success' => true,
            'data' => [
                'user_id' => $userId,
                'year' => $year,
                'work_days' => $workDays,
                'base_salary' => round($baseSalary, 2),
                'bonus_amount' => round($bonusAmount, 2),
                'service_years' => $serviceYears,
                'seniority_amount' => round($seniorityAmount, 2),
                'base_service_years' => $baseServiceYears,
                'base_seniority_amount' => round($baseSeniorityAmount, 2),
                'total_settlement' => round($totalSettlement, 2),
            ]
        ];
    }

    /**
     * محاسبه حقوق پایه از منابع مختلف
     */
    private static function getBaseSalary($userId)
    {
        $baseSalary = 0;

        // از قرارداد فعال
        $contract = HrmContract::find()
            ->where(['user_id' => $userId, 'contract_status' => HrmContract::STATUS_ACTIVE])
            ->orderBy(['id' => SORT_DESC])
            ->one();

        if ($contract && $contract->base_salary > 0) {
            $baseSalary = $contract->base_salary;
        }

        // از آخرین قرارداد
        if ($baseSalary == 0) {
            $lastContract = HrmContract::find()
                ->where(['user_id' => $userId])
                ->orderBy(['id' => SORT_DESC])
                ->one();
            
            if ($lastContract && $lastContract->base_salary > 0) {
                $baseSalary = $lastContract->base_salary;
            }
        }

        // از سال مالی جاری
        if ($baseSalary == 0) {
            $financialYear = HrmFinancialYear::find()
                ->where(['status' => HrmFinancialYear::STATUS_ACTIVE])
                ->one();
            
            if ($financialYear && $financialYear->salary > 0) {
                $baseSalary = $financialYear->salary;
            }
        }

        return $baseSalary;
    }

    /**
     * محاسبه تعداد روزهای کارکرد در سال
     */
    private static function calculateWorkDays($userId, $year)
    {
        // اطمینان از وجود خلاصه ماهانه
        self::ensureMonthlySummaries($userId, $year);

        // دریافت خلاصه ماهانه
        $summaries = HrmMonthlySummary::find()
            ->where(['user_id' => $userId, 'year' => $year])
            ->all();

        $totalWorkDays = 0;
        $totalVacationDays = 0;
        $totalMissionDays = 0;

        foreach ($summaries as $summary) {
            $totalWorkDays += $summary->work_days_count;
            $totalVacationDays += $summary->vacation_days_count;
            $totalMissionDays += $summary->mission_days_count;
        }

        // اگر خلاصه ماهانه نداشت، از رکوردهای روزانه بگیر
        if ($totalWorkDays == 0) {
            $attendanceRecords = HrmDailyAttendance::find()
                ->where(['user_id' => $userId])
                ->andWhere(['between', 'attendance_date', "{$year}-01-01", "{$year}-12-31"])
                ->all();

            foreach ($attendanceRecords as $record) {
                if ($record->is_full_day || $record->work_duration > 0) {
                    $totalWorkDays++;
                }
            }

            // مرخصی‌ها
            $vacationRecords = HrmVacation::find()
                ->where(['user_id' => $userId, 'status' => HrmVacation::STATUS_APPROVED])
                ->andWhere(['between', 'date_from', "{$year}-01-01", "{$year}-12-31"])
                ->all();

            foreach ($vacationRecords as $record) {
                $totalVacationDays += $record->days_count;
            }

            // ماموریت‌ها
            $missionRecords = HrmMission::find()
                ->where(['user_id' => $userId, 'status' => HrmMission::STATUS_APPROVED])
                ->andWhere(['between', 'date_from', "{$year}-01-01", "{$year}-12-31"])
                ->all();

            foreach ($missionRecords as $record) {
                $totalMissionDays += $record->days_count;
            }
        }

        // مجموع روزهای کارکرد (شامل مرخصی و ماموریت)
        return $totalWorkDays + $totalVacationDays + $totalMissionDays;
    }

    /**
     * محاسبه سال‌های سابقه کار
     */
    private static function calculateServiceYears($userId, $year)
    {
        // دریافت اولین قرارداد کاربر
        $firstContract = HrmContract::find()
            ->where(['user_id' => $userId])
            ->orderBy(['contract_from_date' => SORT_ASC])
            ->one();

        if (!$firstContract) {
            return 0;
        }

        // تاریخ شروع به کار
        $startDate = strtotime($firstContract->contract_from_date);
        $endDate = strtotime("{$year}-12-29"); // آخر سال شمسی

        if ($startDate > $endDate) {
            return 0;
        }

        // محاسبه سال‌های سابقه
        $serviceYears = floor(($endDate - $startDate) / (365 * 24 * 60 * 60));
        return max(0, $serviceYears);
    }

    /**
     * محاسبه مبلغ عیدی بر اساس حقوق پایه و روزهای کارکرد
     */
    private static function calculateBonusAmount($baseSalary, $workDays)
    {
        // عیدی = (حقوق پایه × تعداد روزهای کارکرد) / 365
        $bonusAmount = ($baseSalary * $workDays) / 365;

        // سقف و کف عیدی طبق قانون کار
        $minBonus = $baseSalary * 2;  // حداقل 2 ماه حقوق
        $maxBonus = $baseSalary * 3;  // حداکثر 3 ماه حقوق

        if ($bonusAmount < $minBonus) {
            $bonusAmount = $minBonus;
        } elseif ($bonusAmount > $maxBonus) {
            $bonusAmount = $maxBonus;
        }

        return $bonusAmount;
    }

    /**
     * اطمینان از وجود خلاصه ماهانه برای تمام ماه‌های سال
     */
    private static function ensureMonthlySummaries($userId, $year)
    {
        $allMonths = range(1, 12);
        foreach ($allMonths as $month) {
            $exists = HrmMonthlySummary::find()
                ->where(['user_id' => $userId, 'year' => $year, 'month' => $month])
                ->exists();
            
            if (!$exists) {
                // اگر خلاصه ماهانه وجود نداشت، آن را محاسبه کن
                $params = [
                    'user_id' => $userId,
                    'year' => $year,
                    'month' => $month,
                ];
                // استفاده از متد calculate خود HrmMonthlySummary
                HrmMonthlySummary::calculate($params);
            }
        }
    }

    /**
     * محاسبه بازخرید مرخصی
     */
    public static function calculateVacationBuyback($userId, $year)
    {
        // دریافت تنظیمات
        $dailyRateBase = HrmSetting::getValue('vacation.daily_rate_base', 'base_salary');
        $maxDays = HrmSetting::getInt('vacation.max_buyback_days', 9);
        $buybackRate = HrmSetting::getFloat('vacation.buyback_rate', 1);

        // ====== ۱. دریافت حقوق پایه ======
        $baseSalary = self::getBaseSalary($userId);

        if ($baseSalary == 0) {
            return [
                'success' => false, 
                'message' => 'هیچ حقوق پایه‌ای برای این پرسنل یافت نشد'
            ];
        }

        // ====== ۲. اطمینان از وجود خلاصه ماهانه ======
        self::ensureMonthlySummaries($userId, $year);

        // ====== ۳. دریافت خلاصه ماهانه و محاسبه روزهای مرخصی ======
        $summaries = HrmMonthlySummary::find()
            ->where(['user_id' => $userId, 'year' => $year])
            ->all();

        $totalWorkDays = 0;
        $totalVacationDays = 0;
        $totalMissionDays = 0;
        $totalAbsentDays = 0;

        foreach ($summaries as $summary) {
            $totalWorkDays += $summary->work_days_count;
            $totalVacationDays += $summary->vacation_days_count;
            $totalMissionDays += $summary->mission_days_count;
            $totalAbsentDays += $summary->absent_days_count;
        }

        // ====== ۴. اگر خلاصه ماهانه نداشت، از مرخصی‌ها مستقیم بگیر ======
        if ($totalVacationDays == 0) {
            $vacationRecords = HrmVacation::find()
                ->where(['user_id' => $userId, 'status' => HrmVacation::STATUS_APPROVED])
                ->andWhere(['between', 'date_from', "{$year}-01-01", "{$year}-12-31"])
                ->all();

            foreach ($vacationRecords as $record) {
                $totalVacationDays += $record->days_count;
            }
        }

        // ====== ۵. محاسبه روزهای مرخصی باقیمانده ======
        $standardVacationDays = 22; // مرخصی استاندارد سالانه
        $remainingDays = max(0, $standardVacationDays - $totalVacationDays);
        $buybackDays = min($remainingDays, $maxDays);

        // ====== ۶. محاسبه حقوق روزانه ======
        $standardDaysPerMonth = HrmSetting::getFloat('salary.standard_days_per_month', 22);
        $dailySalary = $baseSalary / $standardDaysPerMonth;

        // ====== ۷. محاسبه مبلغ بازخرید ======
        $buybackAmount = $buybackDays * $dailySalary * $buybackRate;

        return [
            'success' => true,
            'data' => [
                'user_id' => $userId,
                'year' => $year,
                'total_work_days' => $totalWorkDays,
                'total_vacation_days' => $totalVacationDays,
                'total_mission_days' => $totalMissionDays,
                'total_absent_days' => $totalAbsentDays,
                'remaining_days' => $remainingDays,
                'buyback_days' => $buybackDays,
                'daily_salary' => round($dailySalary, 2),
                'buyback_amount' => round($buybackAmount, 2),
                'base_salary' => $baseSalary,
            ]
        ];
    }
}