<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;
use yii\data\ActiveDataProvider;

class HrmMonthlySummary extends ActiveRecord
{
    const STATUS_DRAFT = 0;
    const STATUS_FINAL = 1;

    public static function tableName()
    {
        return 'hrm_monthly_summary';
    }

    public function rules()
    {
        return [
            [['user_id', 'year', 'month', 'month_name', 'date_from', 'date_from_persian', 'date_to', 'date_to_persian'], 'required'],
            [['user_id', 'year', 'month', 'work_days_count', 'vacation_days_count', 'mission_days_count', 'absent_days_count', 'holiday_days_count', 'status'], 'integer'],
            [['total_work_hours', 'total_vacation_hours', 'total_mission_hours', 'total_absent_hours', 'total_overtime_hours'], 'number'],
            [['date_from', 'date_to', 'created_at', 'updated_at'], 'safe'],
            [['month_name'], 'string', 'max' => 20],
            [['date_from_persian', 'date_to_persian'], 'string', 'max' => 10],
            [['user_id', 'year', 'month'], 'unique', 'targetAttribute' => ['user_id', 'year', 'month'], 'message' => 'این ماه برای این کاربر قبلاً ثبت شده است'],
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
            'date_from' => 'تاریخ شروع',
            'date_from_persian' => 'تاریخ شروع (شمسی)',
            'date_to' => 'تاریخ پایان',
            'date_to_persian' => 'تاریخ پایان (شمسی)',
            'total_work_hours' => 'ساعت کارکرد',
            'total_vacation_hours' => 'ساعت مرخصی',
            'total_mission_hours' => 'ساعت ماموریت',
            'total_absent_hours' => 'ساعت غیبت',
            'total_overtime_hours' => 'ساعت اضافه کار',
            'work_days_count' => 'روزهای کاری',
            'vacation_days_count' => 'روزهای مرخصی',
            'mission_days_count' => 'روزهای ماموریت',
            'absent_days_count' => 'روزهای غیبت',
            'holiday_days_count' => 'روزهای تعطیل',
            'status' => 'وضعیت',
            'created_at' => 'تاریخ ثبت',
            'updated_at' => 'تاریخ ویرایش',
        ];
    }

    // ============== روابط ==============

    public function getUser()
    {
        return $this->hasOne(User::class, ['id' => 'user_id']);
    }

    // ============== متدهای API ==============

  public static function get_all()
{
   // User::checkAccess(702);

    $params = Yii::$app->request->get();
    $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
    $page = isset($params['page']) ? (int) $params['page'] : 1;

    $query = self::find()
        ->with(['user'])
        ->orderBy(['year' => SORT_DESC, 'month' => SORT_DESC]);

    // ============== فیلتر بر اساس user_id ==============
    if (!empty($params['user_id'])) {
        $query->andWhere(['user_id' => $params['user_id']]);
    }

    // ============== فیلتر بر اساس سال (شمسی) ==============
    if (!empty($params['year'])) {
        $query->andWhere(['year' => Persian::p2e($params['year'])]);
    }

    // ============== فیلتر بر اساس ماه ==============
    if (!empty($params['month'])) {
        $query->andWhere(['month' => $params['month']]);
    }

    // ============== فیلتر بر اساس وضعیت ==============
    if (isset($params['status']) && $params['status'] !== '') {
        $query->andWhere(['status' => $params['status']]);
    }

    // ============== فیلتر بر اساس کد پرسنلی ==============
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

    // ============== فیلتر بر اساس کد ملی ==============
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

    // ============== فیلتر بر اساس گروه کاری ==============
    if (!empty($params['workgroup_id'])) {
        $userIds = HrmWorkgroupPersonel::find()
            ->where(['workgroup_id' => $params['workgroup_id'], 'status' => 1])
            ->select('user_id')
            ->column();
        if (!empty($userIds)) {
            $query->andWhere(['user_id' => $userIds]);
        } else {
            $query->andWhere('1=0');
        }
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
       // User::checkAccess(702);

        $model = self::find()
            ->with(['user'])
            ->where(['id' => $id])
            ->asArray()
            ->one();

        if (!$model) {
            return ['success' => false, 'message' => 'رکورد یافت نشد'];
        }

        $model['user'] = User::find()->where(['id' => $model['user_id']])->asArray()->one();

        return ['success' => true, 'data' => $model];
    }

    // ============== محاسبه عملکرد ماهانه ==============
    public static function calculate()
    {
        $params = Yii::$app->request->post();
        
        $userId = $params['user_id'] ?? null;
        $year = $params['year'] ?? null;
        $month = $params['month'] ?? null;
        $dateFrom = $params['date_from'] ?? null;
        $dateTo = $params['date_to'] ?? null;

        if (!$userId || !$year || !$month) {
            return ['success' => false, 'message' => 'اطلاعات کامل نیست: user_id, year, month الزامی است'];
        }

        // تعیین بازه تاریخ
        if ($dateFrom && $dateTo) {
            $dateFromGregorian =$dateFrom;
            $dateToGregorian = $dateTo;
        } else {
            // اگر بازه داده نشد، کل ماه رو حساب کن
            $monthDays = self::getMonthDays($month, $year);
            $dateFromGregorian = Persian::convert_date_to_en("{$year}/{$month}/01");
            $dateToGregorian = Persian::convert_date_to_en("{$year}/{$month}/{$monthDays}");
        }

        if (!$dateFromGregorian || !$dateToGregorian) {
            return ['success' => false, 'message' => 'فرمت تاریخ صحیح نیست'];
        }

        // دریافت تمام رکوردهای کارکرد روزانه
        $attendanceRecords = HrmDailyAttendance::find()
            ->where(['user_id' => $userId])
            ->andWhere(['between', 'attendance_date', $dateFromGregorian, $dateToGregorian])
            ->all();

        // دریافت تمام مرخصی‌ها
        $vacationRecords = HrmVacation::find()
            ->where(['user_id' => $userId, 'status' => HrmVacation::STATUS_APPROVED])
            ->andWhere(['between', 'date_from', $dateFromGregorian, $dateToGregorian])
            ->all();

        // دریافت تمام ماموریت‌ها
        $missionRecords = HrmMission::find()
            ->where(['user_id' => $userId, 'status' => HrmMission::STATUS_APPROVED])
            ->andWhere(['between', 'date_from', $dateFromGregorian, $dateToGregorian])
            ->all();

        // محاسبه مجموع ساعت‌ها
        $totalWorkHours = 0;
        $totalVacationHours = 0;
        $totalMissionHours = 0;
        $totalAbsentHours = 0;
        $totalOvertimeHours = 0;
        $workDays = 0;
        $vacationDays = 0;
        $missionDays = 0;
        $absentDays = 0;
        $holidayDays = 0;

        // کارکرد روزانه
        foreach ($attendanceRecords as $record) {
            if ($record->is_full_day) {
                $totalWorkHours += 8;
                $workDays++;
            } elseif ($record->work_duration > 0) {
                $totalWorkHours += $record->work_duration;
                $workDays++;
            }
            if ($record->overtime > 0) {
                $totalOvertimeHours += $record->overtime;
            }
            if ($record->is_absent) {
                $totalAbsentHours += 8;
                $absentDays++;
            }
            if ($record->is_holiday) {
                $holidayDays++;
            }
        }

        // مرخصی‌ها
        foreach ($vacationRecords as $record) {
            $totalVacationHours += $record->days_count * 8;
            $vacationDays += $record->days_count;
        }

        // ماموریت‌ها
        foreach ($missionRecords as $record) {
            $totalMissionHours += $record->days_count * 8;
            $missionDays += $record->days_count;
        }

        // بررسی وجود رکورد قبلی
        $existing = self::find()
            ->where(['user_id' => $userId, 'year' => $year, 'month' => $month])
            ->one();

        if ($existing) {
            $model = $existing;
        } else {
            $model = new self();
        }

        $monthName = self::getMonthName($month);
        $dateFromPersian = Persian::convert_date_to_fa($dateFromGregorian);
        $dateToPersian = Persian::convert_date_to_fa($dateToGregorian);

        $model->user_id = $userId;
        $model->year = $year;
        $model->month = $month;
        $model->month_name = $monthName;
        $model->date_from = $dateFromGregorian;
        $model->date_from_persian = trim($dateFromPersian);
        $model->date_to = $dateToGregorian;
        $model->date_to_persian = trim($dateToPersian);
        $model->total_work_hours = round($totalWorkHours, 2);
        $model->total_vacation_hours = round($totalVacationHours, 2);
        $model->total_mission_hours = round($totalMissionHours, 2);
        $model->total_absent_hours = round($totalAbsentHours, 2);
        $model->total_overtime_hours = round($totalOvertimeHours, 2);
        $model->work_days_count = $workDays;
        $model->vacation_days_count = $vacationDays;
        $model->mission_days_count = $missionDays;
        $model->absent_days_count = $absentDays;
        $model->holiday_days_count = $holidayDays;
        $model->status = self::STATUS_DRAFT;
      
        if ($model->save()) {
            return [
                'success' => true,
                'data' => $model,
                'summary' => [
                    'total_work_hours' => round($totalWorkHours, 2),
                    'total_vacation_hours' => round($totalVacationHours, 2),
                    'total_mission_hours' => round($totalMissionHours, 2),
                    'total_absent_hours' => round($totalAbsentHours, 2),
                    'total_overtime_hours' => round($totalOvertimeHours, 2),
                    'work_days' => $workDays,
                    'vacation_days' => $vacationDays,
                    'mission_days' => $missionDays,
                    'absent_days' => $absentDays,
                    'holiday_days' => $holidayDays,
                ]
            ];
        }

        return ['success' => false, 'errors' => $model->errors];
    }

    public static function finalize($id)
    {
       // User::checkAccess(703);

        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'رکورد یافت نشد'];
        }

        $model->status = self::STATUS_FINAL;
        $model->save();

        return ['success' => true, 'data' => $model];
    }

    public static function _delete($id)
    {
       // User::checkAccess(704);

        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'رکورد یافت نشد'];
        }

        $model->delete();
        return ['success' => true];
    }

    // ============== توابع کمکی ==============

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

    private static function getMonthDays($month, $year)
    {
        if ($month <= 6) {
            return 31;
        } elseif ($month <= 11) {
            return 30;
        } else {
            // اسفند - چک کردن کبیسه
            $isLeap = self::isLeapYear($year);
            return $isLeap ? 30 : 29;
        }
    }

    private static function isLeapYear($year)
    {
        // محاسبه کبیسه بودن سال شمسی
        $mod = $year % 33;
        return in_array($mod, [1, 5, 9, 13, 17, 22, 26, 30]);
    }
}