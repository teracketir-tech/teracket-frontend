<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;
use yii\data\ActiveDataProvider;

class HrmDailyAttendance extends ActiveRecord
{
    const SOURCE_MANUAL = 1;
    const SOURCE_DEVICE = 2;

    public static function tableName()
    {
        return 'hrm_daily_attendance';
    }

    public function rules()
    {
        return [
            [['user_id', 'attendance_date', 'attendance_date_persian'], 'required'],
            [['user_id', 'is_full_day', 'is_holiday', 'is_absent', 'is_vacation', 'is_mission', 'source', 'delay_minutes', 'early_leave_minutes'], 'integer'],
            [['attendance_date'], 'date', 'format' => 'php:Y-m-d'],
            [['check_in_time', 'check_out_time'], 'safe'],
            [['work_duration', 'overtime'], 'number'],
            [['description'], 'string'],
            [['workgroup_ids'], 'safe'],
            ['attendance_date', 'unique', 'targetAttribute' => ['user_id', 'attendance_date'], 'message' => 'این تاریخ برای این کاربر قبلاً ثبت شده است'],
        ];
    }

    public function attributeLabels()
    {
        return [
            'id' => 'شناسه',
            'user_id' => 'کد پرسنلی',
            'workgroup_ids' => 'گروه‌های کاری',
            'attendance_date' => 'تاریخ حضور',
            'attendance_date_persian' => 'تاریخ حضور (شمسی)',
            'check_in_time' => 'ساعت ورود',
            'check_out_time' => 'ساعت خروج',
            'is_full_day' => 'حضور کامل',
            'is_holiday' => 'روز تعطیل',
            'is_absent' => 'غیبت',
            'is_vacation' => 'مرخصی',
            'is_mission' => 'ماموریت',
            'work_duration' => 'مدت کارکرد (ساعت)',
            'overtime' => 'اضافه کار (ساعت)',
            'delay_minutes' => 'تاخیر (دقیقه)',
            'early_leave_minutes' => 'ترک زودهنگام (دقیقه)',
            'description' => 'توضیحات',
            'source' => 'منبع ثبت',
            'created_at' => 'تاریخ ثبت',
            'updated_at' => 'تاریخ ویرایش',
        ];
    }

    public function getSourceLabel()
    {
        $sources = [
            self::SOURCE_MANUAL => 'دستی',
            self::SOURCE_DEVICE => 'دستگاه',
        ];
        return $sources[$this->source] ?? 'نامشخص';
    }

    // ============== روابط ==============

    public function getUser()
    {
        return $this->hasOne(User::class, ['id' => 'user_id']);
    }

    // ============== متدهای API ==============

    public static function get_all()
    {
        User::checkAccess(702);

        $params = Yii::$app->request->get();
        $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
        $page = isset($params['page']) ? (int) $params['page'] : 1;

        $query = self::find()
            ->with(['user'])
            ->orderBy(['attendance_date' => SORT_DESC, 'id' => SORT_DESC]);

        // فیلترها
        if (!empty($params['user_id'])) {
            $query->andWhere(['user_id' => $params['user_id']]);
        }
        if (!empty($params['date_from'])) {
            $query->andWhere(['>=', 'attendance_date', $params['date_from']]);
        }
        if (!empty($params['date_to'])) {
            $query->andWhere(['<=', 'attendance_date', $params['date_to']]);
        }
        if (!empty($params['type'])) {
            switch ($params['type']) {
                case 'full_day':
                    $query->andWhere(['is_full_day' => 1]);
                    break;
                case 'absent':
                    $query->andWhere(['is_absent' => 1]);
                    break;
                case 'vacation':
                    $query->andWhere(['is_vacation' => 1]);
                    break;
                case 'mission':
                    $query->andWhere(['is_mission' => 1]);
                    break;
                case 'holiday':
                    $query->andWhere(['is_holiday' => 1]);
                    break;
            }
        }

        // فیلتر بر اساس گروه کاری (جستجو در JSON)
        if (!empty($params['workgroup_id'])) {
            $query->andWhere(['like', 'workgroup_ids', '"' . $params['workgroup_id'] . '"']);
        }

        $totalCount = $query->count();

        $models = $query
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->asArray()
            ->all();

        // اضافه کردن اطلاعات user و تبدیل تاریخ
        foreach ($models as &$model) {
            $user = User::find()->where(['id' => $model['user_id']])->asArray()->one();
            $model['user'] = $user;
            $model['attendance_date_persian'] = Persian::convert_date_to_fa($model['attendance_date']);

            // دیکود کردن workgroup_ids
            if (!empty($model['workgroup_ids'])) {
                $model['workgroup_ids'] = json_decode($model['workgroup_ids'], true);
            } else {
                $model['workgroup_ids'] = [];
            }

            // دریافت نام گروه‌های کاری
            $workgroupNames = [];
            if (!empty($model['workgroup_ids'])) {
                $workgroups = HrmWorkgroup::find()
                    ->where(['id' => $model['workgroup_ids']])
                    ->select(['id', 'name'])
                    ->asArray()
                    ->all();
                foreach ($workgroups as $wg) {
                    $workgroupNames[] = $wg['name'];
                }
            }
            $model['workgroup_names'] = implode(' - ', $workgroupNames);

            $model['work_duration_formatted'] = self::formatDuration($model['work_duration'] ?? 0);
            $model['overtime_formatted'] = self::formatDuration($model['overtime'] ?? 0);
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
            ->with(['user'])
            ->where(['id' => $id])
            ->asArray()
            ->one();

        if (!$model) {
            return ['success' => false, 'message' => 'رکورد یافت نشد'];
        }

        $user = User::find()->where(['id' => $model['user_id']])->asArray()->one();
        $model['user'] = $user;
        $model['attendance_date_persian'] = Persian::convert_date_to_fa($model['attendance_date']);

        if (!empty($model['workgroup_ids'])) {
            $model['workgroup_ids'] = json_decode($model['workgroup_ids'], true);
        } else {
            $model['workgroup_ids'] = [];
        }

        return ['success' => true, 'data' => $model];
    }

    public static function _save($id = null)
    {
        $params = Yii::$app->request->post();

        if (!$id) {
            User::checkAccess(701);
            $model = new self();
        } else {
            User::checkAccess(703);
            $model = self::findOne($id);
            if (!$model) {
                return ['success' => false, 'message' => 'رکورد یافت نشد'];
            }
        }

        // اگر تاریخ شمسی ارسال شده، به میلادی تبدیل کن
        if (!empty($params['attendance_date_persian']) && empty($params['attendance_date'])) {
            $params['attendance_date'] = Persian::convert_date_to_en($params['attendance_date_persian']);
        }

        // تبدیل workgroup_ids به JSON
        if (!empty($params['workgroup_ids']) && is_array($params['workgroup_ids'])) {
            $params['workgroup_ids'] = json_encode($params['workgroup_ids']);
        } else {
            $params['workgroup_ids'] = null;
        }

        // محاسبه خودکار مدت کارکرد
        if (!empty($params['check_in_time']) && !empty($params['check_out_time'])) {
            $checkIn = strtotime($params['check_in_time']);
            $checkOut = strtotime($params['check_out_time']);
            $diff = ($checkOut - $checkIn) / 3600;
            $params['work_duration'] = round($diff, 2);

            if ($diff > 8) {
                $params['overtime'] = round($diff - 8, 2);
            }
        }

        // اگر حضور کامل باشه، ساعت‌ها رو صفر کن
        if (!empty($params['is_full_day']) && $params['is_full_day'] == 1) {
            $params['check_in_time'] = null;
            $params['check_out_time'] = null;
            $params['work_duration'] = 0;
            $params['overtime'] = 0;
            $params['delay_minutes'] = 0;
            $params['early_leave_minutes'] = 0;
        }

        // تنظیم تاریخ شمسی
        if (!empty($params['attendance_date'])) {
            $params['attendance_date_persian'] = Persian::convert_date_to_fa($params['attendance_date']);
        }

        if ($model->load($params, '') && $model->save()) {
            return ['success' => true, 'data' => $model];
        }

        return ['success' => false, 'errors' => $model->errors];
    }

    public static function saveRange()
    {
        $params = Yii::$app->request->post();

        User::checkAccess(701);

        $userId = $params['user_id'] ?? null;
        $workgroupIds = $params['workgroup_ids'] ?? [];
        $dateFrom = $params['date_from'] ?? null;
        $dateTo = $params['date_to'] ?? null;
        $isFullDay = $params['is_full_day'] ?? 0;
        $checkInTime = $params['check_in_time'] ?? null;
        $checkOutTime = $params['check_out_time'] ?? null;
        $description = $params['description'] ?? null;

        if (!$userId || !$dateFrom || !$dateTo) {
            return ['success' => false, 'message' => 'اطلاعات کامل نیست'];
        }

        // تبدیل تاریخ‌های شمسی به میلادی
        $dateFromGregorian = Persian::convert_date_to_en($dateFrom);
        $dateToGregorian = Persian::convert_date_to_en($dateTo);

        if (!$dateFromGregorian || !$dateToGregorian) {
            return ['success' => false, 'message' => 'فرمت تاریخ صحیح نیست'];
        }

        $start = new \DateTime($dateFromGregorian);
        $end = new \DateTime($dateToGregorian);

        if ($start > $end) {
            $temp = $start;
            $start = $end;
            $end = $temp;
        }

        $end->modify('+1 day');
        $interval = new \DateInterval('P1D');
        $period = new \DatePeriod($start, $interval, $end);

        $savedCount = 0;
        $errors = [];
        $savedDates = [];

        // تبدیل workgroup_ids به JSON
        $workgroupIdsJson = !empty($workgroupIds) ? json_encode($workgroupIds) : null;

        foreach ($period as $date) {
            $attendanceDate = $date->format('Y-m-d');

            $dayOfWeek = $date->format('N');
            $isHoliday = ($dayOfWeek == 5);

            $exists = self::find()
                ->where(['user_id' => $userId, 'attendance_date' => $attendanceDate])
                ->exists();

            if ($exists) {
                $persianDate = Persian::convert_date_to_fa($attendanceDate);
                $errors[] = "تاریخ {$persianDate} قبلاً ثبت شده است";
                continue;
            }

            $model = new self();
            $model->user_id = $userId;
            $model->workgroup_ids = $workgroupIdsJson;
            $model->attendance_date = $attendanceDate;
            $model->attendance_date_persian = Persian::convert_date_to_fa($attendanceDate);
            $model->is_full_day = $isFullDay;
            $model->is_holiday = $isHoliday ? 1 : 0;
            $model->check_in_time = $isFullDay ? null : $checkInTime;
            $model->check_out_time = $isFullDay ? null : $checkOutTime;
            $model->description = $description;
            $model->source = self::SOURCE_MANUAL;

            if ($model->save()) {
                $savedCount++;
                $savedDates[] = $attendanceDate;
            } else {
                $errors[] = "خطا در ثبت تاریخ " . Persian::convert_date_to_fa($attendanceDate) . ": " . json_encode($model->errors);
            }
        }

        return [
            'success' => true,
            'message' => "{$savedCount} روز با موفقیت ثبت شد",
            'errors' => $errors,
            'saved_count' => $savedCount,
            'saved_dates' => $savedDates,
        ];
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
 

    /**
     * ویرایش دسته‌ای رنج تاریخ
     */
    public static function bulkEditRange()
    {
        $params = Yii::$app->request->post();

        $userId = $params['user_id'] ?? null;
        $dateFrom = $params['date_from'] ?? null;
        $dateTo = $params['date_to'] ?? null;
        $isFullDay = $params['is_full_day'] ?? 0;
        $checkInTime = $params['check_in_time'] ?? null;
        $checkOutTime = $params['check_out_time'] ?? null;
        $description = $params['description'] ?? null;

        if (!$userId || !$dateFrom || !$dateTo) {
            return ['success' => false, 'message' => 'اطلاعات کامل نیست'];
        }

        // پیدا کردن رکوردهای محدوده تاریخ
        $records = self::find()
            ->where(['user_id' => $userId])
            ->andWhere(['between', 'attendance_date', $dateFrom, $dateTo])
            ->all();

        if (empty($records)) {
            return ['success' => false, 'message' => 'هیچ رکوردی در این بازه یافت نشد'];
        }

        $updatedCount = 0;
        $errors = [];

        foreach ($records as $record) {
            // به‌روزرسانی فیلدها
            $record->is_full_day = $isFullDay;
            $record->description = $description ?? $record->description;

            if ($isFullDay == 1) {
                $record->check_in_time = null;
                $record->check_out_time = null;
                $record->work_duration = 0;
                $record->overtime = 0;
                $record->delay_minutes = 0;
                $record->early_leave_minutes = 0;
            } else {
                if ($checkInTime !== null) {
                    $record->check_in_time = $checkInTime;
                }
                if ($checkOutTime !== null) {
                    $record->check_out_time = $checkOutTime;
                }

                // محاسبه مجدد مدت کارکرد
                if (!empty($record->check_in_time) && !empty($record->check_out_time)) {
                    $checkIn = strtotime($record->check_in_time);
                    $checkOut = strtotime($record->check_out_time);
                    $diff = ($checkOut - $checkIn) / 3600;
                    $record->work_duration = round($diff, 2);

                    if ($diff > 8) {
                        $record->overtime = round($diff - 8, 2);
                    } else {
                        $record->overtime = 0;
                    }
                }
            }

            if ($record->save()) {
                $updatedCount++;
            } else {
                $errors[] = "خطا در ویرایش تاریخ " . $record->attendance_date . ": " . json_encode($record->errors);
            }
        }

        return [
            'success' => true,
            'message' => "{$updatedCount} رکورد با موفقیت ویرایش شد",
            'updated_count' => $updatedCount,
            'errors' => $errors,
        ];
    }

    /**
     * ویرایش دسته‌ای ماهانه
     */
    public static function bulkEditMonthly()
    {
        $params = Yii::$app->request->post();

        $userId = $params['user_id'] ?? null;
        $month = $params['month'] ?? null;
        $year = $params['year'] ?? null;
        $isFullDay = $params['is_full_day'] ?? 0;
        $checkInTime = $params['check_in_time'] ?? null;
        $checkOutTime = $params['check_out_time'] ?? null;
        $description = $params['description'] ?? null;

        if (!$userId || !$month || !$year) {
            return ['success' => false, 'message' => 'اطلاعات کامل نیست'];
        }

        // دریافت روزهای ماه
        $daysInMonth = cal_days_in_month(CAL_GREGORIAN, $month, $year);
        $dateFrom = "{$year}/{$month}/01";
        $dateTo = "{$year}/{$month}/{$daysInMonth}";

        


        // پیدا کردن رکوردهای ماه
        $records = self::find()
            ->where(['user_id' => $userId])
            ->andWhere(['between', 'attendance_date', Persian::convert_date_to_en($dateFrom),  Persian::convert_date_to_en($dateTo)])
            ->all();

        if (empty($records)) {
            return ['success' => false, 'message' => 'هیچ رکوردی در این ماه یافت نشد'];
        }

        $updatedCount = 0;
        $errors = [];

        foreach ($records as $record) {
            $record->is_full_day = $isFullDay;
            $record->description = $description ?? $record->description;

            if ($isFullDay == 1) {
                $record->check_in_time = null;
                $record->check_out_time = null;
                $record->work_duration = 0;
                $record->overtime = 0;
                $record->delay_minutes = 0;
                $record->early_leave_minutes = 0;
            } else {
                if ($checkInTime !== null) {
                    $record->check_in_time = $checkInTime;
                }
                if ($checkOutTime !== null) {
                    $record->check_out_time = $checkOutTime;
                }

                if (!empty($record->check_in_time) && !empty($record->check_out_time)) {
                    $checkIn = strtotime($record->check_in_time);
                    $checkOut = strtotime($record->check_out_time);
                    $diff = ($checkOut - $checkIn) / 3600;
                    $record->work_duration = round($diff, 2);

                    if ($diff > 8) {
                        $record->overtime = round($diff - 8, 2);
                    } else {
                        $record->overtime = 0;
                    }
                }
            }

            if ($record->save()) {
                $updatedCount++;
            } else {
                $errors[] = "خطا در ویرایش تاریخ " . $record->attendance_date . ": " . json_encode($record->errors);
            }
        }

        return [
            'success' => true,
            'message' => "{$updatedCount} رکورد با موفقیت ویرایش شد",
            'updated_count' => $updatedCount,
            'errors' => $errors,
        ];
    }
    // ===== تابع کمکی برای تبدیل ساعت به فرمت ساعت:دقیقه =====
    private static function formatDuration($hours)
    {
        if (empty($hours) || $hours <= 0) {
            return "00:00";
        }

        $h = floor($hours);
        $m = round(($hours - $h) * 60);

        if ($m >= 60) {
            $h += 1;
            $m = 0;
        }

        return sprintf("%02d:%02d", $h, $m);
    }



}