<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;
use yii\data\ActiveDataProvider;

class HrmVacation extends ActiveRecord
{
    const STATUS_PENDING = 0;
    const STATUS_APPROVED = 1;
    const STATUS_REJECTED = 2;
    const STATUS_CANCELLED = 3;

    public static function tableName()
    {
        return 'hrm_vacations';
    }

    public function rules()
    {
        return [
            [['user_id', 'vacation_type_id', 'date_from', 'date_from_persian', 'date_to', 'date_to_persian'], 'required'],
            [['user_id', 'vacation_type_id', 'days_count', 'work_days_count', 'status', 'approved_by'], 'integer'],
            [['date_from', 'date_to', 'approved_at', 'created_at', 'updated_at'], 'safe'],
            [['description'], 'string'],
            [['attachment'], 'string', 'max' => 255],
            ['date_to', 'compare', 'compareAttribute' => 'date_from', 'operator' => '>=', 'message' => 'تاریخ پایان باید از تاریخ شروع بزرگتر یا مساوی باشد'],
            [['time_from', 'time_to'], 'safe'],

        ];
    }

    public function attributeLabels()
    {
        return [
            'id' => 'شناسه',
            'user_id' => 'پرسنل',
            'vacation_type_id' => 'نوع مرخصی',
            'date_from' => 'تاریخ شروع',
            'date_from_persian' => 'تاریخ شروع (شمسی)',
            'date_to' => 'تاریخ پایان',
            'date_to_persian' => 'تاریخ پایان (شمسی)',
            'days_count' => 'تعداد روز',
            'work_days_count' => 'روزهای کاری',
            'status' => 'وضعیت',
            'description' => 'توضیحات',
            'attachment' => 'پیوست',
            'approved_by' => 'تایید کننده',
            'approved_at' => 'تاریخ تایید',
            'created_at' => 'تاریخ ثبت',
            'updated_at' => 'تاریخ ویرایش',
            'time_from' => 'ساعت شروع',
            'time_to' => 'ساعت پایان',
        ];
    }

    public function getStatusLabel()
    {
        $statuses = [
            self::STATUS_PENDING => 'در انتظار',
            self::STATUS_APPROVED => 'تایید شده',
            self::STATUS_REJECTED => 'رد شده',
            self::STATUS_CANCELLED => 'لغو شده',
        ];
        return $statuses[$this->status] ?? 'نامشخص';
    }

    public function getStatusColor()
    {
        $colors = [
            self::STATUS_PENDING => 'text-yellow-600',
            self::STATUS_APPROVED => 'text-green-600',
            self::STATUS_REJECTED => 'text-red-600',
            self::STATUS_CANCELLED => 'text-gray-600',
        ];
        return $colors[$this->status] ?? 'text-gray-400';
    }

    // ============== روابط ==============

    public function getUser()
    {
        return $this->hasOne(User::class, ['id' => 'user_id']);
    }

    public function getVacationType()
    {
        return $this->hasOne(HrmVacationType::class, ['id' => 'vacation_type_id']);
    }

    public function getApprovedBy()
    {
        return $this->hasOne(User::class, ['id' => 'approved_by']);
    }

    // ============== متدهای API ==============

    public static function get_all()
    {
        User::checkAccess(702);

        $params = Yii::$app->request->get();
        $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
        $page = isset($params['page']) ? (int) $params['page'] : 1;

        $query = self::find()
            ->with(['user', 'vacationType', 'approvedBy'])
            ->orderBy(['id' => SORT_DESC]);

        // فیلتر بر اساس کاربر
        if (!empty($params['user_id'])) {
            $query->andWhere(['user_id' => $params['user_id']]);
        }

        // فیلتر بر اساس نوع مرخصی
        if (!empty($params['vacation_type_id'])) {
            $query->andWhere(['vacation_type_id' => $params['vacation_type_id']]);
        }

        // فیلتر بر اساس وضعیت
        if (isset($params['status']) && $params['status'] !== '') {
            $query->andWhere(['status' => $params['status']]);
        }

        // فیلتر بر اساس بازه تاریخ
        if (!empty($params['date_from'])) {
            $query->andWhere(['>=', 'date_from', $params['date_from']]);
        }
        if (!empty($params['date_to'])) {
            $query->andWhere(['<=', 'date_to', $params['date_to']]);
        }

        $totalCount = $query->count();
        $models = $query
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->asArray()
            ->all();

        // اضافه کردن اطلاعات روابط
        foreach ($models as &$model) {
            $model['user'] = User::find()->where(['id' => $model['user_id']])->asArray()->one();
            $model['vacationType'] = HrmVacationType::find()->where(['id' => $model['vacation_type_id']])->asArray()->one();
            if ($model['approved_by']) {
                $model['approvedBy'] = User::find()->where(['id' => $model['approved_by']])->asArray()->one();
            }
        }

        return [
            'pages' => ceil($totalCount / $perPage),
            'totalCount' => $totalCount,
            'data' => $models,
        ];
    }

    public static function _save($id = null)
    {
        $params = Yii::$app->request->post();

        if (!$id) {
            User::checkAccess(701);
            $model = new self();
            $model->status = self::STATUS_PENDING;
        } else {
            User::checkAccess(703);
            $model = self::findOne($id);
            if (!$model) {
                return ['success' => false, 'message' => 'رکورد یافت نشد'];
            }
        }

        // محاسبه تعداد روزها
        if (!empty($params['date_from']) && !empty($params['date_to'])) {
            $dateFrom = new \DateTime($params['date_from']);
            $dateTo = new \DateTime($params['date_to']);
            $dateTo->modify('+1 day');
            $interval = $dateFrom->diff($dateTo);
            $params['days_count'] = $interval->days;

            // محاسبه روزهای کاری (بدون احتساب جمعه)
            $workDays = 0;
            $current = clone $dateFrom;
            while ($current < $dateTo) {
                $dayOfWeek = $current->format('N');
                if ($dayOfWeek != 5) { // 5 = جمعه
                    $workDays++;
                }
                $current->modify('+1 day');
            }
            $params['work_days_count'] = $workDays;
        }

        // تنظیم تاریخ شمسی
        if (!empty($params['date_from'])) {
            $params['date_from_persian'] = Persian::convert_date_to_fa($params['date_from']);
        }
        if (!empty($params['date_to'])) {
            $params['date_to_persian'] = Persian::convert_date_to_fa($params['date_to']);
        }

        // اگر تایید شده، تاریخ تایید رو ثبت کن
        if (!empty($params['status']) && $params['status'] == self::STATUS_APPROVED && empty($model->approved_at)) {
            $params['approved_at'] = date('Y-m-d H:i:s');
            $params['approved_by'] = Yii::$app->user->id;
        }

        if ($model->load($params, '') && $model->save()) {
            return ['success' => true, 'data' => $model];
        }

        return ['success' => false, 'errors' => $model->errors];
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

    // تایید مرخصی
    public static function approve($id)
    {
        User::checkAccess(703);

        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'رکورد یافت نشد'];
        }

        $model->status = self::STATUS_APPROVED;
        $model->approved_at = date('Y-m-d H:i:s');
        $model->approved_by = Yii::$app->user->id;
        $model->save();

        return ['success' => true, 'data' => $model];
    }

    // رد مرخصی
    public static function reject($id)
    {
        User::checkAccess(703);

        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'رکورد یافت نشد'];
        }

        $model->status = self::STATUS_REJECTED;
        $model->save();

        return ['success' => true, 'data' => $model];
    }

    
/**
 * دریافت لیست مرخصی‌ها (برای تب لیست مرخصی - با ویرایش)
 */
public static function getVacationsList()
{
    $params = Yii::$app->request->get();
    $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
    $page = isset($params['page']) ? (int) $params['page'] : 1;

    $query = self::find()
        ->with(['user', 'vacationType', 'approvedBy'])
        ->orderBy(['id' => SORT_DESC]);

    // فیلتر بر اساس کاربر
    if (!empty($params['user_id'])) {
        $query->andWhere(['user_id' => $params['user_id']]);
    }

    // فیلتر بر اساس نوع مرخصی
    if (!empty($params['vacation_type_id'])) {
        $query->andWhere(['vacation_type_id' => $params['vacation_type_id']]);
    }

    // فیلتر بر اساس وضعیت
    if (isset($params['status']) && $params['status'] !== '') {
        $query->andWhere(['status' => $params['status']]);
    }

    // فیلتر بر اساس بازه تاریخ
    if (!empty($params['date_from'])) {
        $query->andWhere(['>=', 'date_from', $params['date_from']]);
    }
    if (!empty($params['date_to'])) {
        $query->andWhere(['<=', 'date_to', $params['date_to']]);
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
        $model['vacationType'] = HrmVacationType::find()->where(['id' => $model['vacation_type_id']])->asArray()->one();
        if ($model['approved_by']) {
            $model['approvedBy'] = User::find()->where(['id' => $model['approved_by']])->asArray()->one();
        }
        // اضافه کردن ساعت مرخصی
        $model['vacation_hours'] = ($model['days_count'] ?? 0) * 8;
    }

    return [
        'pages' => ceil($totalCount / $perPage),
        'totalCount' => $totalCount,
        'data' => $models,
    ];
}
 /**
 * دریافت گزارش مرخصی ماهانه (جمع ساعات هر ماه)
 */
public static function getMonthlyReport()
{
    $params = Yii::$app->request->get();
    $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
    $page = isset($params['page']) ? (int) $params['page'] : 1;

    $query = self::find()
        ->with(['user', 'vacationType'])
        ->where(['status' => self::STATUS_APPROVED]);

    // ============== فیلتر بر اساس ماه (شمسی) ==============
    if (!empty($params['month'])) {
        $month = (int) $params['month'];
        // فیلتر روی تاریخ شمسی
        $query->andWhere([
            'OR',
            ['like', 'date_from_persian', '/0' . $month . '/', false], // مثل 1405/04/...
            ['like', 'date_to_persian', '/0' . $month . '/', false],
        ]);
    }

    // ============== فیلتر بر اساس سال (شمسی) ==============
    if (!empty($params['year'])) {
        $year = (int) $params['year'];
        $query->andWhere([
            'OR',
            ['like', 'date_from_persian', $year . '/%', false],
            ['like', 'date_to_persian', $year . '/%', false],
        ]);
    }

    // ============== فیلتر بر اساس کاربر ==============
    if (!empty($params['user_id'])) {
        $query->andWhere(['user_id' => $params['user_id']]);
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

    // ============== فیلتر بر اساس نوع مرخصی ==============
    if (!empty($params['vacation_type_id'])) {
        $query->andWhere(['vacation_type_id' => $params['vacation_type_id']]);
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

    $models = $query->asArray()->all();

    // ============== گروه‌بندی بر اساس (user_id, year, month, vacation_type_id) ==============
    $grouped = [];
    foreach ($models as $model) {
        // استفاده از تاریخ شمسی برای گروه‌بندی
        $persianDateFrom = $model['date_from_persian']; // مثل 1405/04/15
        $persianDateTo = $model['date_to_persian'];

        $year = (int) substr($persianDateFrom, 0, 4);
        $month = (int) substr($persianDateFrom, 5, 2);

        // اگر ماه درخواستی مشخص شده و ماه رکورد با اون مطابقت نداره، رد کن
        if (!empty($params['month']) && (int)$params['month'] !== $month) {
            // چک کن آیا ماه در date_to هم هست
            $monthTo = (int) substr($persianDateTo, 5, 2);
            $yearTo = (int) substr($persianDateTo, 0, 4);
            if ((int)$params['month'] !== $monthTo || (int)$params['year'] !== $yearTo) {
                continue;
            }
        }

        // اگر سال درخواستی مشخص شده و سال رکورد با اون مطابقت نداره، رد کن
        if (!empty($params['year']) && (int)$params['year'] !== $year) {
            $yearTo = (int) substr($persianDateTo, 0, 4);
            if ((int)$params['year'] !== $yearTo) {
                continue;
            }
        }

        $key = $model['user_id'] . '_' . $year . '_' . $month . '_' . $model['vacation_type_id'];

        if (!isset($grouped[$key])) {
            $grouped[$key] = [
                'user_id' => $model['user_id'],
                'year' => $year,
                'month' => $month,
                'month_name' => self::getMonthName($month),
                'vacation_type_id' => $model['vacation_type_id'],
                'vacationType' => HrmVacationType::find()->where(['id' => $model['vacation_type_id']])->asArray()->one(),
                'user' => User::find()->where(['id' => $model['user_id']])->asArray()->one(),
                'total_hours' => 0,
                'days_count' => 0,
                'created_at' => $model['created_at'],
            ];
        }

        // محاسبه روزهای مرخصی
        // راه ساده‌تر: استفاده از days_count یا محاسبه از تاریخ
        $daysCount = $model['days_count'] ?? 0;
        
        // اگر days_count خالی بود، از تاریخ شروع و پایان محاسبه کن
        if ($daysCount == 0 && !empty($model['date_from']) && !empty($model['date_to'])) {
            $dateFrom = new \DateTime($model['date_from']);
            $dateTo = new \DateTime($model['date_to']);
            $dateTo->modify('+1 day');
            $interval = $dateFrom->diff($dateTo);
            $daysCount = $interval->days;
        }

        $grouped[$key]['total_hours'] += $daysCount * 8;
        $grouped[$key]['days_count'] += $daysCount;
    }

    // ============== تبدیل به آرایه و مرتب‌سازی ==============
    $result = array_values($grouped);
    usort($result, function($a, $b) {
        if ($a['year'] != $b['year']) {
            return $b['year'] - $a['year'];
        }
        return $b['month'] - $a['month'];
    });

    $totalCount = count($result);
    $result = array_slice($result, ($page - 1) * $perPage, $perPage);

    return [
        'pages' => ceil($totalCount / $perPage),
        'totalCount' => $totalCount,
        'data' => $result,
    ];
}

/**
 * دریافت گزارش مرخصی روزانه (هر روز یک ردیف)
 */
public static function getDailyReport()
{
    $params = Yii::$app->request->get();
    $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
    $page = isset($params['page']) ? (int) $params['page'] : 1;

    $query = self::find()
        ->with(['user', 'vacationType'])
        ->where(['status' => self::STATUS_APPROVED])
        ->orderBy(['date_from' => SORT_DESC]);

    // ============== فیلتر بر اساس ماه (شمسی) ==============
    

    // فیلتر بر اساس بازه تاریخ (میلادی)
    if (!empty($params['date_from'])) {
        $query->andWhere(['>=', 'date_from', $params['date_from']]);
    }
    if (!empty($params['date_to'])) {
        $query->andWhere(['<=', 'date_to', $params['date_to']]);
    }

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

    // فیلتر بر اساس نوع مرخصی
    if (!empty($params['vacation_type_id'])) {
        $query->andWhere(['vacation_type_id' => $params['vacation_type_id']]);
    }

    // فیلتر بر اساس گروه کاری
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

    $models = $query->asArray()->all();

    $result = [];

    foreach ($models as $model) {
        $user = User::find()->where(['id' => $model['user_id']])->asArray()->one();
        $vacationType = HrmVacationType::find()->where(['id' => $model['vacation_type_id']])->asArray()->one();

        // محاسبه روزهای بین تاریخ شروع و پایان
        $dateFrom = new \DateTime($model['date_from']);
        $dateTo = new \DateTime($model['date_to']);
        $dateTo->modify('+1 day');
        $interval = new \DateInterval('P1D');
        $dateRange = new \DatePeriod($dateFrom, $interval, $dateTo);

        foreach ($dateRange as $date) {
            $result[] = [
                'id' => $model['id'],
                'date' => $date->format('Y-m-d'),
                'date_persian' => Persian::convert_date_to_fa($date->format('Y-m-d')),
                'user_id' => $model['user_id'],
                'user' => $user,
                'vacation_type_id' => $model['vacation_type_id'],
                'vacationType' => $vacationType,
                'vacation_hours' => 8,
                'days_count' => 1,
                'status' => $model['status'],
                'description' => $model['description'],
                'created_at' => $model['created_at'],
                'approved_at' => $model['approved_at'],
            ];
        }
    }

    // مرتب‌سازی بر اساس تاریخ (نزولی)
    usort($result, function($a, $b) {
        return strtotime($b['date']) - strtotime($a['date']);
    });

    $totalCount = count($result);
    $result = array_slice($result, ($page - 1) * $perPage, $perPage);

    return [
        'pages' => ceil($totalCount / $perPage),
        'totalCount' => $totalCount,
        'data' => $result,
    ];
}
/**
 * دریافت نام ماه
 */
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