<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;
use yii\data\ActiveDataProvider;

class HrmBonusSettlement extends ActiveRecord
{
    const STATUS_DRAFT = 0;
    const STATUS_APPROVED = 1;
    const STATUS_PAID = 2;

    public static function tableName()
    {
        return 'hrm_bonus_settlements';
    }

    public function rules()
    {
        return [
            [['user_id', 'year'], 'required'],
            [['user_id', 'year', 'work_days', 'status', 'approved_by', 'service_years', 'base_service_years'], 'integer'],
            [['base_salary', 'bonus_amount', 'seniority_amount', 'base_seniority_amount'], 'number'],
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
            'work_days' => 'روزهای کارکرد',
            'base_salary' => 'حقوق پایه',
            'bonus_amount' => 'مبلغ عیدی',
            'service_years' => 'سال‌های سابقه',
            'seniority_amount' => 'مبلغ سنوات',
            'base_service_years' => 'پایه سنوات',
            'base_seniority_amount' => 'مبلغ پایه سنوات',
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
        // محاسبه عیدی، سنوات و پایه سنوات
        $result = HrmCalculator::calculateYearEndSettlement($userId, $year);

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
        $model->work_days = $data['work_days'] ?? 0;
        $model->base_salary = $data['base_salary'] ?? 0;
        $model->bonus_amount = $data['bonus_amount'] ?? 0;
        $model->service_years = $data['service_years'] ?? 0;
        $model->seniority_amount = $data['seniority_amount'] ?? 0;
        $model->base_service_years = $data['base_service_years'] ?? 0;
        $model->base_seniority_amount = $data['base_seniority_amount'] ?? 0;
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
        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'رکورد یافت نشد'];
        }

        $model->delete();
        return ['success' => true];
    }
}