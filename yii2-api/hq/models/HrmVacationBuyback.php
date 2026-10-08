<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;
use yii\data\ActiveDataProvider;

class HrmVacationBuyback extends ActiveRecord
{
    const STATUS_DRAFT = 0;
    const STATUS_APPROVED = 1;
    const STATUS_PAID = 2;

    public static function tableName()
    {
        return 'hrm_vacation_buybacks';
    }

    public function rules()
    {
        return [
            [['user_id', 'year'], 'required'],
            [['user_id', 'year', 'total_vacation_days', 'remaining_days', 'buyback_days', 'status', 'approved_by'], 'integer'],
            [['daily_salary', 'buyback_amount'], 'number'],
            [['description'], 'string'],
            [['approved_at', 'paid_at', 'created_at', 'updated_at'], 'safe'],
            [['user_id', 'year'], 'unique', 'targetAttribute' => ['user_id', 'year']],
        ];
    }

    public function attributeLabels()
    {
        return [
            'id' => 'شناسه',
            'user_id' => 'پرسنل',
            'year' => 'سال',
            'total_vacation_days' => 'مجموع مرخصی',
            'remaining_days' => 'روزهای باقیمانده',
            'buyback_days' => 'روزهای بازخرید',
            'daily_salary' => 'حقوق روزانه',
            'buyback_amount' => 'مبلغ بازخرید',
            'status' => 'وضعیت',
            'description' => 'توضیحات',
            'approved_by' => 'تایید کننده',
            'approved_at' => 'تاریخ تایید',
            'paid_at' => 'تاریخ پرداخت',
            'created_at' => 'تاریخ ثبت',
            'updated_at' => 'تاریخ ویرایش',
        ];
    }

    public function getStatusLabel()
    {
        $statuses = [
            self::STATUS_DRAFT => 'پیش‌نویس',
            self::STATUS_APPROVED => 'تایید شده',
            self::STATUS_PAID => 'پرداخت شده',
        ];
        return $statuses[$this->status] ?? 'نامشخص';
    }

    public function getStatusColor()
    {
        $colors = [
            self::STATUS_DRAFT => 'text-yellow-600',
            self::STATUS_APPROVED => 'text-blue-600',
            self::STATUS_PAID => 'text-green-600',
        ];
        return $colors[$this->status] ?? 'text-gray-400';
    }

    // ============== روابط ==============

    public function getUser()
    {
        return $this->hasOne(User::class, ['id' => 'user_id']);
    }

    public function getApprovedBy()
    {
        return $this->hasOne(User::class, ['id' => 'approved_by']);
    }

    // ============== متدهای API ==============

    public static function get_all()
    {
       // User::checkAccess(702);

        $params = Yii::$app->request->get();
        $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
        $page = isset($params['page']) ? (int) $params['page'] : 1;

        $query = self::find()
            ->with(['user', 'approvedBy'])
            ->orderBy(['id' => SORT_DESC]);

        if (!empty($params['user_id'])) {
            $query->andWhere(['user_id' => $params['user_id']]);
        }
        if (!empty($params['year'])) {
            $query->andWhere(['year' => $params['year']]);
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

    public static function _view($id)
    {
       // User::checkAccess(702);

        $model = self::find()
            ->with(['user', 'approvedBy'])
            ->where(['id' => $id])
            ->asArray()
            ->one();

        if (!$model) {
            return ['success' => false, 'message' => 'رکورد یافت نشد'];
        }

        $model['user'] = User::find()->where(['id' => $model['user_id']])->asArray()->one();
        if ($model['approved_by']) {
            $model['approvedBy'] = User::find()->where(['id' => $model['approved_by']])->asArray()->one();
        }

        return ['success' => true, 'data' => $model];
    }

    public static function calculateAndSave($userId, $year)
    {
       // User::checkAccess(701);

        // محاسبه بازخرید مرخصی
        $result = HrmCalculator::calculateVacationBuyback($userId, $year);

        if (!$result['success']) {
            return $result;
        }

        $data = $result['data'];

        // بررسی وجود رکورد قبلی
        $existing = self::find()
            ->where(['user_id' => $userId, 'year' => $year])
            ->one();

        if ($existing) {
            $model = $existing;
        } else {
            $model = new self();
        }

        $model->user_id = $userId;
        $model->year = $year;
        $model->total_vacation_days = $data['total_vacation_days'] ?? 0;
        $model->remaining_days = $data['remaining_days'] ?? 0;
        $model->buyback_days = $data['buyback_days'] ?? 0;
        $model->daily_salary = $data['daily_salary'] ?? 0;
        $model->buyback_amount = $data['buyback_amount'] ?? 0;
        $model->status = self::STATUS_DRAFT;

        if ($model->save()) {
            return [
                'success' => true,
                'data' => $model,
                'calculated' => $data,
            ];
        }

        return ['success' => false, 'errors' => $model->errors];
    }

    public static function approve($id)
    {
       // User::checkAccess(703);

        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'رکورد یافت نشد'];
        }

        $model->status = self::STATUS_APPROVED;
        $model->approved_by = Yii::$app->user->id;
        $model->approved_at = date('Y-m-d H:i:s');
        $model->save();

        return ['success' => true, 'data' => $model];
    }

    public static function pay($id)
    {
       // User::checkAccess(703);

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
       // User::checkAccess(704);

        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'رکورد یافت نشد'];
        }

        $model->delete();
        return ['success' => true];
    }
}