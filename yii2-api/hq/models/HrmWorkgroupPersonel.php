<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;

class HrmWorkgroupPersonel extends ActiveRecord
{
    const STATUS_INACTIVE = 0;
    const STATUS_ACTIVE = 1;

    public static function tableName()
    {
        return 'hrm_workgroup_personel';
    }

    public function rules()
    {
        return [
            [['user_id', 'workgroup_id', 'bakhsh_id', 'ghesmat_id', 'onvan_id'], 'required'],
            [['user_id', 'workgroup_id', 'bakhsh_id', 'ghesmat_id', 'onvan_id', 'status', 'created_by'], 'integer'],
            [['created_at', 'updated_at'], 'safe'],
            [['user_id', 'workgroup_id', 'bakhsh_id', 'ghesmat_id', 'onvan_id'], 'unique', 
                'targetAttribute' => ['user_id', 'workgroup_id', 'bakhsh_id', 'ghesmat_id', 'onvan_id'],
                'message' => 'این گروه کاری قبلاً به این پرسنل اختصاص داده شده است'
            ],
        ];
    }

    public function attributeLabels()
    {
        return [
            'id' => 'شناسه',
            'user_id' => 'پرسنل',
            'workgroup_id' => 'گروه کاری',
            'bakhsh_id' => 'بخش',
            'ghesmat_id' => 'قسمت',
            'onvan_id' => 'عنوان (سمت شغلی)',
            'status' => 'وضعیت',
            'created_at' => 'تاریخ ثبت',
            'updated_at' => 'تاریخ ویرایش',
            'created_by' => 'ایجاد کننده',
        ];
    }

    public function getStatusLabel()
    {
        return $this->status == self::STATUS_ACTIVE ? 'فعال' : 'غیرفعال';
    }

    public function getUser()
    {
        return $this->hasOne(User::class, ['id' => 'user_id']);
    }

    public function getWorkgroup()
    {
        return $this->hasOne(HrmWorkgroup::class, ['id' => 'workgroup_id']);
    }

    public function getBakhsh()
    {
        return $this->hasOne(HrmWorkgroupBakhsh::class, ['id' => 'bakhsh_id']);
    }

    public function getGhesmat()
    {
        return $this->hasOne(HrmWorkgroupGhesmat::class, ['id' => 'ghesmat_id']);
    }

    public function getOnvan()
    {
        return $this->hasOne(HrmWorkgroupOnvan::class, ['id' => 'onvan_id']);
    }

    public function getCreatedBy()
    {
        return $this->hasOne(User::class, ['id' => 'created_by']);
    }

    public static function get_all()
    {
        $params = Yii::$app->request->get();
        $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
        $page = isset($params['page']) ? (int) $params['page'] : 1;

        $query = self::find()
            ->with(['user', 'workgroup', 'bakhsh', 'ghesmat', 'onvan', 'createdBy'])
            ->orderBy(['id' => SORT_DESC]);

        if (!empty($params['user_id'])) {
            $query->andWhere(['user_id' => $params['user_id']]);
        }

        if (!empty($params['workgroup_id'])) {
            $query->andWhere(['workgroup_id' => $params['workgroup_id']]);
        }

        if (!empty($params['bakhsh_id'])) {
            $query->andWhere(['bakhsh_id' => $params['bakhsh_id']]);
        }

        if (!empty($params['ghesmat_id'])) {
            $query->andWhere(['ghesmat_id' => $params['ghesmat_id']]);
        }

        if (!empty($params['onvan_id'])) {
            $query->andWhere(['onvan_id' => $params['onvan_id']]);
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
            $model['workgroup'] = HrmWorkgroup::find()->where(['id' => $model['workgroup_id']])->asArray()->one();
            $model['bakhsh'] = HrmWorkgroupBakhsh::find()->where(['id' => $model['bakhsh_id']])->asArray()->one();
            $model['ghesmat'] = HrmWorkgroupGhesmat::find()->where(['id' => $model['ghesmat_id']])->asArray()->one();
            $model['onvan'] = HrmWorkgroupOnvan::find()->where(['id' => $model['onvan_id']])->asArray()->one();
            $model['createdBy'] = User::find()->where(['id' => $model['created_by']])->asArray()->one();
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
            ->with(['user', 'workgroup', 'bakhsh', 'ghesmat', 'onvan', 'createdBy'])
            ->where(['id' => $id])
            ->asArray()
            ->one();

        if (!$model) {
            return ['success' => false, 'message' => 'یافت نشد'];
        }

        $model['user'] = User::find()->where(['id' => $model['user_id']])->asArray()->one();
        $model['workgroup'] = HrmWorkgroup::find()->where(['id' => $model['workgroup_id']])->asArray()->one();
        $model['bakhsh'] = HrmWorkgroupBakhsh::find()->where(['id' => $model['bakhsh_id']])->asArray()->one();
        $model['ghesmat'] = HrmWorkgroupGhesmat::find()->where(['id' => $model['ghesmat_id']])->asArray()->one();
        $model['onvan'] = HrmWorkgroupOnvan::find()->where(['id' => $model['onvan_id']])->asArray()->one();

        return ['success' => true, 'data' => $model];
    }

    public static function _save($id = null)
    {
        $params = Yii::$app->request->post();

        if (!$id) {
            $model = new self();
            $model->created_by = Yii::$app->user->id;
        } else {
            $model = self::findOne($id);
            if (!$model) {
                return ['success' => false, 'message' => 'یافت نشد'];
            }
        }

        if ($model->load($params, '') && $model->save()) {
            return ['success' => true, 'data' => $model];
        }

        return ['success' => false, 'errors' => $model->errors];
    }

    public static function _delete($id)
    {
        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'یافت نشد'];
        }

        $model->delete();
        return ['success' => true];
    }

    public static function getByUser($userId)
    {
        return self::find()
            ->with(['workgroup', 'bakhsh', 'ghesmat', 'onvan'])
            ->where(['user_id' => $userId, 'status' => self::STATUS_ACTIVE])
            ->asArray()
            ->all();
    }

    // HrmWorkgroupPersonel.php

public static function getContractsByUser($userId)
{
    $contracts = HrmContract::find()
        ->with(['user', 'workgroup', 'bakhsh', 'ghesmat', 'onvan'])
        ->where(['user_id' => $userId])
        ->orderBy(['id' => SORT_DESC])
        ->asArray()
        ->all();

    foreach ($contracts as &$contract) {
        $contract['user'] = User::find()->where(['id' => $contract['user_id']])->asArray()->one();
        $contract['workgroup'] = HrmWorkgroup::find()->where(['id' => $contract['workgroup_id']])->asArray()->one();
        $contract['bakhsh'] = HrmWorkgroupBakhsh::find()->where(['id' => $contract['bakhsh_id']])->asArray()->one();
        $contract['ghesmat'] = HrmWorkgroupGhesmat::find()->where(['id' => $contract['ghesmat_id']])->asArray()->one();
        $contract['onvan'] = HrmWorkgroupOnvan::find()->where(['id' => $contract['onvan_id']])->asArray()->one();
        
        // تبدیل تاریخ‌ها
        $dateFields = ['contract_from_date', 'contract_to_date'];
        foreach ($dateFields as $field) {
            if (!empty($contract[$field])) {
                $contract[$field . '_persian'] = Persian::convert_date_to_fa($contract[$field]);
            }
        }
    }

    return $contracts;
}
}