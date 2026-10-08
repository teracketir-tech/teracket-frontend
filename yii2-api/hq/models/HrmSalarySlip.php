<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;
use yii\data\ActiveDataProvider;

class HrmSalarySlip extends ActiveRecord
{
    const STATUS_DRAFT = 0;
    const STATUS_FINAL = 1;
    const STATUS_PAID = 2;

    public static function tableName()
    {
        return 'hrm_salary_slips';
    }

    public function rules()
    {
        return [
            [['user_id', 'year', 'month', 'month_name'], 'required'],
            [['user_id', 'year', 'month', 'work_days', 'vacation_days', 'mission_days', 'absent_days', 'holiday_days', 'status', 'created_by', 'approved_by', 'child_count'], 'integer'],
            [[
                'base_salary', 'daily_salary', 'hourly_salary', 
                'work_hours', 'vacation_hours', 'mission_hours', 'absent_hours', 'overtime_hours',
                'special_overtime_hours', 'mission_overtime_hours',
                'base_pay', 'vacation_pay', 'mission_pay', 'overtime_pay', 
                'special_overtime_pay', 'mission_overtime_pay', 'friday_work_pay', 'holiday_work_pay',
                'absent_deduction', 'bonus_amount', 'penalty_amount', 'arrears_amount', 
                'company_purchase', 'other_deduction', 'transportation_allowance', 'other_allowance',
                'advance_amount', 'loan_installment', 'insurance_amount', 'supplementary_insurance',
                'tax', 'delay', 'early_leave', 'absence', 'penalty', 'unauthorized_exit',
                'student_vacation', 'unpaid_vacation', 'late_penalty_8_hours',
                'deduct_29_days', 'total_additions', 'total_deductions', 'net_payable',
                'housing_allowance', 'food_allowance', 'insurable_base_salary', 'prev_month_remain',
                'current_month_expenses', 'distribution_commission', 'outside_commission',
                'equivalent_commission', 'child_allowance', 'mission_allowance',
                'performance_bonus', 'compensatory_31_days', 'annual_bonus', 'vacation_buyback',
                'seniority_allowance', 'insurable_and_non_insurable', 'employee_insurance',
                'responsibility_allowance', 'insurable_base_salary',
            ], 'number'],
            [['description'], 'string'],
            [['approved_at', 'paid_at', 'created_at', 'updated_at', 'finalized_date'], 'safe'],
            [['bank_name'], 'string', 'max' => 255],
            [['account_number'], 'string', 'max' => 50],
            [['user_id', 'year', 'month'], 'unique', 'targetAttribute' => ['user_id', 'year', 'month']],
        ];
    }

    public function attributeLabels()
    {
        return [
            'id' => 'شناسه',
            'user_id' => 'پرسنل',
            'year' => 'سال',
            'month' => 'ماه',
            'month_name' => 'نام ماه',
            'child_count' => 'تعداد فرزند',
            
            // حقوق پایه و ساعات کارکرد
            'base_salary' => 'حقوق ثابت',
            'daily_salary' => 'حقوق روزانه',
            'hourly_salary' => 'حقوق ساعتی',
            'work_days' => 'روزهای کاری',
            'work_hours' => 'ساعت کارکرد',
            'overtime_hours' => 'ساعات اضافه کار',
            'special_overtime_hours' => 'ساعات اضافه کار ویژه',
            'mission_overtime_hours' => 'ساعات اضافه کار در ماموریت',
            
            // پرداختی‌ها
            'base_pay' => 'حقوق پایه',
            'overtime_pay' => 'پرداختی اضافه کار',
            'special_overtime_pay' => 'پرداختی اضافه کار ویژه',
            'mission_overtime_pay' => 'پرداختی اضافه کار در ماموریت',
            'friday_work_pay' => 'پرداختی جمعه کار',
            'holiday_work_pay' => 'پرداختی تعطیل کار',
            'vacation_pay' => 'حقوق مرخصی',
            'mission_pay' => 'حقوق ماموریت',
            
            // مزایا و کمک هزینه‌ها
            'housing_allowance' => 'حق مسکن',
            'food_allowance' => 'بن و خوار و بار',
            'transportation_allowance' => 'کمک ایاب و ذهاب',
            'responsibility_allowance' => 'حق مسئولیت',
            'child_allowance' => 'حق اولاد',
            'mission_allowance' => 'ماموریت',
            'performance_bonus' => 'پاداش ارزیابی عملکرد',
            'bonus_amount' => 'پاداش',
            
            // سایر اضافات
            'current_month_expenses' => 'هزینه های جاری ماه',
            'distribution_commission' => 'پورسانت توزیع',
            'outside_commission' => 'پورسانت خارج محدوده',
            'equivalent_commission' => 'پورسانت معادلی',
            'compensatory_31_days' => 'جبران کارکرد ماه 31 روزه',
            'arrears_amount' => 'معوقه',
            'annual_bonus' => 'عیدی',
            'vacation_buyback' => 'بازخرید مرخصی',
            'seniority_allowance' => 'حق سنوات',
            
            // بیمه و مالیات
            'insurable_base_salary' => 'حقوق پایه مشمول بیمه',
            'insurable_and_non_insurable' => 'حقوق پایه مشمول و غیر مشمول',
            'employee_insurance' => 'بیمه سهم کارمند',
            'supplementary_insurance' => 'بیمه تکمیلی',
            'tax' => 'مالیات حقوق',
            
            // کسورات
            'advance_amount' => 'مساعده',
            'loan_installment' => 'قسط وام ها',
            'delay' => 'تاخیر',
            'early_leave' => 'تعجیل',
            'absence' => 'غیبت',
            'penalty_amount' => 'جریمه',
            'unauthorized_exit' => 'خروج غیرمجاز',
            'student_vacation' => 'مرخصی دانشجویی',
            'unpaid_vacation' => 'مرخصی بدون حقوق',
            'late_penalty_8_hours' => 'جریمه تاخیر بیش از 8 ساعت',
            'company_purchase' => 'خرید از شرکت',
            'deduct_29_days' => 'کسر کارکرد ماه 29 روزه',
            'other_deduction' => 'کسور متفرقه',
            
            // جمع‌ها
            'total_additions' => 'جمع اضافات',
            'total_deductions' => 'جمع کسورات',
            'net_payable' => 'خالص پرداختی',
            
            // اطلاعات بانکی
            'bank_name' => 'نام بانک',
            'account_number' => 'شماره حساب',
            
            // وضعیت
            'status' => 'وضعیت',
            'description' => 'توضیحات',
            'approved_at' => 'تاریخ تایید',
            'paid_at' => 'تاریخ پرداخت',
            'finalized_date' => 'تاریخ ثبت نهایی',
            'created_at' => 'تاریخ ثبت',
            'updated_at' => 'تاریخ ویرایش',
        ];
    }

    // ============== متدهای کمکی ==============

    public function getStatusLabel()
    {
        $statuses = [
            self::STATUS_DRAFT => 'پیش‌نویس',
            self::STATUS_FINAL => 'نهایی',
            self::STATUS_PAID => 'پرداخت شده',
        ];
        return $statuses[$this->status] ?? 'نامشخص';
    }

    public function getStatusColor()
    {
        $colors = [
            self::STATUS_DRAFT => 'text-yellow-600',
            self::STATUS_FINAL => 'text-blue-600',
            self::STATUS_PAID => 'text-green-600',
        ];
        return $colors[$this->status] ?? 'text-gray-400';
    }

    // ============== روابط ==============

    public function getUser()
    {
        return $this->hasOne(User::class, ['id' => 'user_id']);
    }

    public function getCreatedBy()
    {
        return $this->hasOne(User::class, ['id' => 'created_by']);
    }

    public function getApprovedBy()
    {
        return $this->hasOne(User::class, ['id' => 'approved_by']);
    }

    // ============== متدهای گزارش ==============

    /**
     * دریافت آخرین بررسی حقوق
     */
    public static function getLastReview()
    {
        User::checkAccess(702);

        $params = Yii::$app->request->get();
        $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
        $page = isset($params['page']) ? (int) $params['page'] : 1;

        $query = self::find()
            ->with(['user'])
            ->orderBy(['id' => SORT_DESC]);

        self::applyFilters($query, $params);

        $totalCount = $query->count();
        $models = $query
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->asArray()
            ->all();

        foreach ($models as &$model) {
            $model['user'] = User::find()->where(['id' => $model['user_id']])->asArray()->one();
        }

        return [
            'pages' => ceil($totalCount / $perPage),
            'totalCount' => $totalCount,
            'data' => $models,
        ];
    }

    /**
     * دریافت سابقه واریز حقوق
     */
    public static function getHistory()
    {
        User::checkAccess(702);

        $params = Yii::$app->request->get();
        $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
        $page = isset($params['page']) ? (int) $params['page'] : 1;

        $query = self::find()
            ->with(['user'])
            ->where(['status' => self::STATUS_PAID])
            ->orderBy(['id' => SORT_DESC]);

        self::applyFilters($query, $params);

        $totalCount = $query->count();
        $models = $query
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->asArray()
            ->all();

        foreach ($models as &$model) {
            $model['user'] = User::find()->where(['id' => $model['user_id']])->asArray()->one();
            $model['finalized_date'] = $model['approved_at'] ? Persian::convert_date_to_fa($model['approved_at']) : null;
        }

        return [
            'pages' => ceil($totalCount / $perPage),
            'totalCount' => $totalCount,
            'data' => $models,
        ];
    }

    /**
     * دریافت لیست محاسبه حقوق
     */
    public static function getCalculateList()
    {
        User::checkAccess(702);

        $params = Yii::$app->request->get();
        $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
        $page = isset($params['page']) ? (int) $params['page'] : 1;

        $query = self::find()
            ->with(['user'])
            ->orderBy(['id' => SORT_DESC]);

        self::applyFilters($query, $params);

        $totalCount = $query->count();
        $models = $query
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->asArray()
            ->all();

        foreach ($models as &$model) {
            $model['user'] = User::find()->where(['id' => $model['user_id']])->asArray()->one();
        }

        return [
            'pages' => ceil($totalCount / $perPage),
            'totalCount' => $totalCount,
            'data' => $models,
        ];
    }

    /**
     * دریافت لیست چک کردن کارکرد
     */
    public static function getCheckWork()
    {
        User::checkAccess(702);

        $params = Yii::$app->request->get();
        $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
        $page = isset($params['page']) ? (int) $params['page'] : 1;

        $query = self::find()
            ->with(['user'])
            ->orderBy(['id' => SORT_DESC]);

        self::applyFilters($query, $params);

        $totalCount = $query->count();
        $models = $query
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->asArray()
            ->all();

        foreach ($models as &$model) {
            $model['user'] = User::find()->where(['id' => $model['user_id']])->asArray()->one();
        }

        return [
            'pages' => ceil($totalCount / $perPage),
            'totalCount' => $totalCount,
            'data' => $models,
        ];
    }

    /**
     * اعمال فیلترهای مشترک
     */
    private static function applyFilters($query, $params)
    {
        // فیلتر بر اساس کاربر
        if (!empty($params['user_id'])) {
            $query->andWhere(['user_id' => $params['user_id']]);
        }

        // فیلتر بر اساس کد پرسنلی
        if (!empty($params['personnel_code'])) {
            $userIds = User::find()
                ->where(['like', 'personnel_code', $params['personnel_code']])
                ->select('id')
                ->column();
            if (!empty($userIds)) {
                $query->andWhere(['user_id' => $userIds]);
            } else {
                $query->andWhere('1=0');
            }
        }

        // فیلتر بر اساس کد ملی
        if (!empty($params['national_code'])) {
            $userIds = HrmPersonnelBasic::find()
                ->where(['like', 'national_code', $params['national_code']])
                ->select('user_id')
                ->column();
            if (!empty($userIds)) {
                $query->andWhere(['user_id' => $userIds]);
            } else {
                $query->andWhere('1=0');
            }
        }

        // فیلتر بر اساس گروه کاری
        if (!empty($params['workgroup_ids'])) {
            $workgroupIds = explode(',', $params['workgroup_ids']);
            $userIds = HrmWorkgroupPersonel::find()
                ->where(['workgroup_id' => $workgroupIds, 'status' => 1])
                ->select('user_id')
                ->column();
            if (!empty($userIds)) {
                $query->andWhere(['user_id' => $userIds]);
            } else {
                $query->andWhere('1=0');
            }
        }

        // فیلتر بر اساس ماه
        if (!empty($params['month'])) {
            $query->andWhere(['month' => $params['month']]);
        }

        // فیلتر بر اساس سال
        if (!empty($params['year'])) {
            $query->andWhere(['year' => $params['year']]);
        }

        // فیلتر بر اساس نوع قرارداد
        if (!empty($params['contract_type'])) {
            $userIds = HrmContract::find()
                ->where(['contract_type' => $params['contract_type']])
                ->select('user_id')
                ->column();
            if (!empty($userIds)) {
                $query->andWhere(['user_id' => $userIds]);
            } else {
                $query->andWhere('1=0');
            }
        }

        // فیلتر بر اساس وضعیت
        if (isset($params['status']) && $params['status'] !== '') {
            $query->andWhere(['status' => $params['status']]);
        }
    }

    // ============== متدهای عملیاتی ==============

    /**
     * حذف دسته‌ای
     */
    public static function batchDelete($ids)
    {
        User::checkAccess(704);

        $ids = explode(',', $ids);
        $models = self::find()->where(['id' => $ids])->all();
        $count = 0;

        foreach ($models as $model) {
            if ($model->status === self::STATUS_DRAFT) {
                $model->delete();
                $count++;
            }
        }

        return ['success' => true, 'deleted_count' => $count];
    }

    /**
     * محاسبه مجدد دسته‌ای
     */
    public static function batchRecalculate($ids)
    {
        User::checkAccess(703);

        $ids = explode(',', $ids);
        $models = self::find()->where(['id' => $ids])->all();
        $count = 0;

        foreach ($models as $model) {
            if ($model->status === self::STATUS_DRAFT) {
                $result = self::calculate($model->user_id, $model->year, $model->month);
                if ($result['success']) {
                    $count++;
                }
            }
        }

        return ['success' => true, 'recalculated_count' => $count];
    }

    /**
     * ثبت نهایی دسته‌ای
     */
    public static function batchFinalize($ids)
    {
        User::checkAccess(703);

        $ids = explode(',', $ids);
        $models = self::find()->where(['id' => $ids])->all();
        $count = 0;

        foreach ($models as $model) {
            if ($model->status === self::STATUS_DRAFT) {
                $model->status = self::STATUS_FINAL;
                $model->approved_by = Yii::$app->user->id;
                $model->approved_at = date('Y-m-d H:i:s');
                $model->finalized_date = date('Y-m-d H:i:s');
                $model->save();
                $count++;
            }
        }

        return ['success' => true, 'finalized_count' => $count];
    }

    /**
     * پیش ثبت دسته‌ای (برای محاسبه حقوق)
     */
    public static function batchPreSubmit($ids)
    {
        User::checkAccess(701);

        $ids = explode(',', $ids);
        $models = self::find()->where(['id' => $ids])->all();
        $count = 0;

        foreach ($models as $model) {
            // فقط در صورت عدم وجود رکورد، ایجاد کن
            $existing = self::find()
                ->where(['user_id' => $model->user_id, 'year' => $model->year, 'month' => $model->month])
                ->one();
            
            if (!$existing) {
                $result = self::calculate($model->user_id, $model->year, $model->month);
                if ($result['success']) {
                    $count++;
                }
            }
        }

        return ['success' => true, 'presubmit_count' => $count];
    }

    /**
     * کارکرد صفر شود (برای چک کردن کارکرد)
     */
    public static function batchClearWork($ids)
    {
        User::checkAccess(703);

        $ids = explode(',', $ids);
        $models = self::find()->where(['id' => $ids])->all();
        $count = 0;

        foreach ($models as $model) {
            if ($model->status === self::STATUS_DRAFT) {
                $model->work_hours = 0;
                $model->overtime_hours = 0;
                $model->special_overtime_hours = 0;
                $model->mission_overtime_hours = 0;
                $model->work_days = 0;
                $model->base_pay = 0;
                $model->overtime_pay = 0;
                $model->net_payable = 0;
                $model->save();
                $count++;
            }
        }

        return ['success' => true, 'cleared_count' => $count];
    }

    // ============== متدهای قدیمی ==============

    public static function calculate($userId, $year, $month)
    {
         // دریافت تنظیمات
        $standardHoursPerDay = HrmSetting::getFloat('salary.standard_hours_per_day', 8);
        $standardDaysPerMonth = HrmSetting::getFloat('salary.standard_days_per_month', 22);
        $overtimeRate = HrmSetting::getFloat('salary.overtime_rate', 1.4);

        // ====== ۱. دریافت حقوق پایه ======
        $baseSalary = 0;
        $contract = HrmContract::find()
            ->where(['user_id' => $userId, 'contract_status' => HrmContract::STATUS_ACTIVE])
            ->orderBy(['id' => SORT_DESC])
            ->one();

        if ($contract && $contract->base_salary > 0) {
            $baseSalary = $contract->base_salary;
        }

        if ($baseSalary == 0) {
            $lastContract = HrmContract::find()
                ->where(['user_id' => $userId])
                ->orderBy(['id' => SORT_DESC])
                ->one();
            
            if ($lastContract && $lastContract->base_salary > 0) {
                $baseSalary = $lastContract->base_salary;
            }
        }

        if ($baseSalary == 0) {
            $financialYear = HrmFinancialYear::find()
                ->where(['status' => HrmFinancialYear::STATUS_ACTIVE])
                ->one();
            
            if ($financialYear && $financialYear->salary > 0) {
                $baseSalary = $financialYear->salary;
            }
        }

        if ($baseSalary == 0) {
            return ['success' => false, 'message' => 'هیچ حقوق پایه‌ای یافت نشد'];
        }

        // محاسبه روزانه و ساعتی
        $dailySalary = $baseSalary / $standardDaysPerMonth;
        $hourlySalary = $dailySalary / $standardHoursPerDay;

        // ====== ۲. دریافت خلاصه ماهانه ======
        $summary = HrmMonthlySummary::find()
            ->where(['user_id' => $userId, 'year' => $year, 'month' => $month])
            ->one();

        if (!$summary) {
            // محاسبه خودکار خلاصه ماهانه
            $calcResult = HrmMonthlySummary::calculate();
            if (!$calcResult['success']) {
                return ['success' => false, 'message' => 'خطا در محاسبه خلاصه ماهانه'];
            }
            $summary = HrmMonthlySummary::find()
                ->where(['user_id' => $userId, 'year' => $year, 'month' => $month])
                ->one();
        }

        if (!$summary) {
            return ['success' => false, 'message' => 'خلاصه ماهانه یافت نشد'];
        }

        // ====== ۳. دریافت اضافات و کسورات ======
        $adjustments = HrmAdjustment::find()
            ->where(['user_id' => $userId, 'month' => $month, 'year' => $year])
            ->all();

        $bonusAmount = 0;
        $penaltyAmount = 0;
        $arrearsAmount = 0;
        $companyPurchase = 0;
        $otherDeduction = 0;
        $transportationAllowance = 0;

        foreach ($adjustments as $adj) {
            switch ($adj->type) {
                case HrmAdjustment::TYPE_BONUS:
                    $bonusAmount += $adj->amount;
                    break;
                case HrmAdjustment::TYPE_PENALTY:
                    $penaltyAmount += $adj->amount;
                    break;
                case HrmAdjustment::TYPE_ARREARS:
                    $arrearsAmount += $adj->amount;
                    break;
                case HrmAdjustment::TYPE_COMPANY_PURCHASE:
                    $companyPurchase += $adj->amount;
                    break;
                case HrmAdjustment::TYPE_OTHER_DEDUCTION:
                    $otherDeduction += $adj->amount;
                    break;
                case HrmAdjustment::TYPE_TRANSPORTATION:
                    $transportationAllowance += $adj->amount;
                    break;
            }
        }

        // ====== ۴. دریافت مساعده و وام ======
        $advanceAmount = HrmAdvance::find()
            ->where(['user_id' => $userId, 'month' => $month, 'year' => $year, 'status' => HrmAdvance::STATUS_UNPAID])
            ->sum('amount') ?? 0;

        $loanInstallment = HrmLoan::find()
            ->where(['user_id' => $userId])
            ->andWhere(['<=', 'created_at', date('Y-m-d', strtotime("{$year}-{$month}-01"))])
            ->andWhere(['status' => HrmLoan::STATUS_UNPAID])
            ->sum('installment_amount') ?? 0;

        // ====== ۵. محاسبه مبالغ ======
        $workHours = $summary->total_work_hours;
        $overtimeHours = $summary->total_overtime_hours;
        $vacationHours = $summary->total_vacation_hours;
        $missionHours = $summary->total_mission_hours;
        $absentHours = $summary->total_absent_hours;

        $basePay = $hourlySalary * $workHours;
        $overtimePay = $overtimeHours * $hourlySalary * $overtimeRate;
        $vacationPay = $vacationHours * $hourlySalary;
        $missionPay = $missionHours * $hourlySalary;
        $absentDeduction = $absentHours * $hourlySalary;

        // جمع اضافات
        $totalAdditions = $basePay + $overtimePay + $vacationPay + $missionPay + $bonusAmount + $arrearsAmount + $transportationAllowance;

        // جمع کسورات
        $totalDeductions = $absentDeduction + $penaltyAmount + $companyPurchase + $otherDeduction + $advanceAmount + $loanInstallment;

        // قابل پرداخت خالص
        $netPayable = $totalAdditions - $totalDeductions;

        // ====== ۶. ذخیره یا بروزرسانی ======
        $existing = self::find()
            ->where(['user_id' => $userId, 'year' => $year, 'month' => $month])
            ->one();

        if ($existing) {
            $model = $existing;
        } else {
            $model = new self();
            $model->created_by = Yii::$app->user->id;
        }

        $monthName = self::getMonthName($month);

        $model->user_id = $userId;
        $model->year = $year;
        $model->month = $month;
        $model->month_name = $monthName;
        $model->base_salary = $baseSalary;
        $model->daily_salary = round($dailySalary, 2);
        $model->hourly_salary = round($hourlySalary, 2);
        $model->work_days = $summary->work_days_count;
        $model->vacation_days = $summary->vacation_days_count;
        $model->mission_days = $summary->mission_days_count;
        $model->absent_days = $summary->absent_days_count;
        $model->holiday_days = $summary->holiday_days_count;
        $model->work_hours = round($workHours, 2);
        $model->vacation_hours = round($vacationHours, 2);
        $model->mission_hours = round($missionHours, 2);
        $model->absent_hours = round($absentHours, 2);
        $model->overtime_hours = round($overtimeHours, 2);
        $model->base_pay = round($basePay, 0);
        $model->vacation_pay = round($vacationPay, 0);
        $model->mission_pay = round($missionPay, 0);
        $model->overtime_pay = round($overtimePay, 0);
        $model->absent_deduction = round($absentDeduction, 0);
        $model->bonus_amount = round($bonusAmount, 0);
        $model->penalty_amount = round($penaltyAmount, 0);
        $model->arrears_amount = round($arrearsAmount, 0);
        $model->company_purchase = round($companyPurchase, 0);
        $model->other_deduction = round($otherDeduction, 0);
        $model->transportation_allowance = round($transportationAllowance, 0);
        $model->advance_amount = round($advanceAmount, 0);
        $model->loan_installment = round($loanInstallment, 0);
        $model->total_additions = round($totalAdditions, 0);
        $model->total_deductions = round($totalDeductions, 0);
        $model->net_payable = round($netPayable, 0);
        $model->status = self::STATUS_DRAFT;

        if ($model->save()) {
            return [
                'success' => true,
                'data' => $model,
                'summary' => [
                    'base_pay' => round($basePay, 0),
                    'overtime_pay' => round($overtimePay, 0),
                    'vacation_pay' => round($vacationPay, 0),
                    'mission_pay' => round($missionPay, 0),
                    'absent_deduction' => round($absentDeduction, 0),
                    'bonus_amount' => round($bonusAmount, 0),
                    'penalty_amount' => round($penaltyAmount, 0),
                    'advance_amount' => round($advanceAmount, 0),
                    'loan_installment' => round($loanInstallment, 0),
                    'total_additions' => round($totalAdditions, 0),
                    'total_deductions' => round($totalDeductions, 0),
                    'net_payable' => round($netPayable, 0),
                ]
            ];
        }

        return ['success' => false, 'errors' => $model->errors];
   
    }

    public static function approve($id)
    {
        User::checkAccess(703);

        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'رکورد یافت نشد'];
        }

        $model->status = self::STATUS_FINAL;
        $model->approved_by = Yii::$app->user->id;
        $model->approved_at = date('Y-m-d H:i:s');
        $model->finalized_date = date('Y-m-d H:i:s');
        $model->save();

        return ['success' => true, 'data' => $model];
    }

    public static function pay($id)
    {
        User::checkAccess(703);

        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'رکورد یافت نشد'];
        }

        $model->status = self::STATUS_PAID;
        $model->paid_at = date('Y-m-d H:i:s');
        $model->save();

        return ['success' => true, 'data' => $model];
    }

    public static function _delete($id)
    {
        User::checkAccess(704);

        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'رکورد یافت نشد'];
        }

        $model->delete();
        return ['success' => true];
    }

    public static function get_all()
    {
        User::checkAccess(702);

        $params = Yii::$app->request->get();
        $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
        $page = isset($params['page']) ? (int) $params['page'] : 1;

        $query = self::find()
            ->with(['user', 'createdBy', 'approvedBy'])
            ->orderBy(['id' => SORT_DESC]);

        if (!empty($params['user_id'])) {
            $query->andWhere(['user_id' => $params['user_id']]);
        }
        if (!empty($params['year'])) {
            $query->andWhere(['year' => $params['year']]);
        }
        if (!empty($params['month'])) {
            $query->andWhere(['month' => $params['month']]);
        }
        if (isset($params['status']) && $params['status'] !== '') {
            $query->andWhere(['status' => $params['status']]);
        }

        $totalCount = $query->count();
        $models = $query
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->asArray()
            ->all();

        foreach ($models as &$model) {
            $model['user'] = User::find()->where(['id' => $model['user_id']])->asArray()->one();
        }

        return [
            'pages' => ceil($totalCount / $perPage),
            'totalCount' => $totalCount,
            'data' => $models,
        ];
    }

    public static function _view($id)
    {
        User::checkAccess(702);

        $model = self::find()
            ->with(['user', 'createdBy', 'approvedBy'])
            ->where(['id' => $id])
            ->asArray()
            ->one();

        if (!$model) {
            return ['success' => false, 'message' => 'رکورد یافت نشد'];
        }

        $model['user'] = User::find()->where(['id' => $model['user_id']])->asArray()->one();

        return ['success' => true, 'data' => $model];
    }

    private static function getMonthName($month)
    {
        $months = [
            1 => 'فروردین', 2 => 'اردیبهشت', 3 => 'خرداد',
            4 => 'تیر', 5 => 'مرداد', 6 => 'شهریور',
            7 => 'مهر', 8 => 'آبان', 9 => 'آذر',
            10 => 'دی', 11 => 'بهمن', 12 => 'اسفند'
        ];
        return $months[$month] ?? 'نامشخص';
    }
}