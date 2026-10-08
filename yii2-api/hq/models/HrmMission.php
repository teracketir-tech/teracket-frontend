<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;
use yii\data\ActiveDataProvider;

class HrmMission extends ActiveRecord
{
    const STATUS_PENDING = 0;
    const STATUS_APPROVED = 1;
    const STATUS_REJECTED = 2;
    const STATUS_CANCELLED = 3;

    public static function tableName()
    {
        return 'hrm_missions';
    }

    public function rules()
    {
        return [
            [['user_id', 'mission_type_id', 'date_from', 'date_from_persian', 'date_to', 'date_to_persian'], 'required'],
            [['user_id', 'mission_type_id', 'days_count', 'work_days_count', 'status', 'approved_by'], 'integer'],
            [['date_from', 'date_to', 'approved_at', 'created_at', 'updated_at'], 'safe'],
            [['description'], 'string'],
            [['location', 'attachment'], 'string', 'max' => 255],
            ['date_to', 'compare', 'compareAttribute' => 'date_from', 'operator' => '>=', 'message' => 'تاریخ پایان باید از تاریخ شروع بزرگتر یا مساوی باشد'],
            [['time_from', 'time_to'], 'safe'], 
        ];
    }

    public function attributeLabels()
    {
        return [
            'id' => 'شناسه',
            'user_id' => 'پرسنل',
            'mission_type_id' => 'نوع ماموریت',
            'date_from' => 'تاریخ شروع',
            'date_from_persian' => 'تاریخ شروع (شمسی)',
            'date_to' => 'تاریخ پایان',
            'date_to_persian' => 'تاریخ پایان (شمسی)',
            'days_count' => 'تعداد روز',
            'work_days_count' => 'روزهای کاری',
            'location' => 'مکان ماموریت',
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

    public function getMissionType()
    {
        return $this->hasOne(HrmMissionType::class, ['id' => 'mission_type_id']);
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
        ->with(['user', 'missionType', 'approvedBy'])
        ->orderBy(['id' => SORT_DESC]);

    // ============== فیلتر بر اساس user_id ==============
    if (!empty($params['user_id'])) {
        $query->andWhere(['user_id' => $params['user_id']]);
    }

    // ============== فیلتر بر اساس mission_type_id ==============
    if (!empty($params['mission_type_id'])) {
        $query->andWhere(['mission_type_id' => $params['mission_type_id']]);
    }

    // ============== فیلتر بر اساس status ==============
    if (isset($params['status']) && $params['status'] !== '') {
        $query->andWhere(['status' => $params['status']]);
    }

    // ============== فیلتر بر اساس بازه تاریخ (میلادی) ==============
    if (!empty($params['date_from'])) {
        $query->andWhere(['>=', 'date_from', $params['date_from']]);
    }
    if (!empty($params['date_to'])) {
        $query->andWhere(['<=', 'date_to', $params['date_to']]);
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
        $model['missionType'] = HrmMissionType::find()->where(['id' => $model['mission_type_id']])->asArray()->one();
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
            //User::checkAccess(701);
            $model = new self();
            $model->status = self::STATUS_PENDING;
        } else {
            //User::checkAccess(703);
            $model = self::findOne($id);
            if (!$model) {
                return ['success' => false, 'message' => 'رکورد یافت نشد'];
            }
        }

        if (!empty($params['date_from']) && !empty($params['date_to'])) {
            $dateFrom = new \DateTime($params['date_from']);
            $dateTo = new \DateTime($params['date_to']);
            $dateTo->modify('+1 day');
            $interval = $dateFrom->diff($dateTo);
            $params['days_count'] = $interval->days;

            $workDays = 0;
            $current = clone $dateFrom;
            while ($current < $dateTo) {
                $dayOfWeek = $current->format('N');
                if ($dayOfWeek != 5) {
                    $workDays++;
                }
                $current->modify('+1 day');
            }
            $params['work_days_count'] = $workDays;
        }

        if (!empty($params['date_from'])) {
            $params['date_from_persian'] = Persian::convert_date_to_fa($params['date_from']);
        }
        if (!empty($params['date_to'])) {
            $params['date_to_persian'] = Persian::convert_date_to_fa($params['date_to']);
        }

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
        //User::checkAccess(704);

        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'رکورد یافت نشد'];
        }

        $model->delete();
        return ['success' => true];
    }

    public static function approve($id)
    {
        //User::checkAccess(703);

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

    public static function reject($id)
    {
        //User::checkAccess(703);

        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'رکورد یافت نشد'];
        }

        $model->status = self::STATUS_REJECTED;
        $model->save();

        return ['success' => true, 'data' => $model];
    }
}