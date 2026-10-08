<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;

class HrmWorkgroupOnvan extends ActiveRecord
{
    const STATUS_INACTIVE = 0;
    const STATUS_ACTIVE = 1;

    public static function tableName()
    {
        return 'hrm_workgroup_onvan';
    }

    public function rules()
    {
        return [
            [['ghesmat_id', 'name'], 'required'],
            [['ghesmat_id', 'status', 'created_by'], 'integer'],
            [['name'], 'string', 'max' => 255],
            [['created_at', 'updated_at'], 'safe'],
        ];
    }

    public function attributeLabels()
    {
        return [
            'id' => 'شناسه',
            'ghesmat_id' => 'قسمت',
            'name' => 'نام عنوان (سمت شغلی)',
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

    public function getGhesmat()
    {
        return $this->hasOne(HrmWorkgroupGhesmat::class, ['id' => 'ghesmat_id']);
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
            ->with(['ghesmat', 'createdBy'])
            ->orderBy(['id' => SORT_DESC]);

        if (!empty($params['ghesmat_id'])) {
            $query->andWhere(['ghesmat_id' => $params['ghesmat_id']]);
        }

        if (!empty($params['name'])) {
            $query->andWhere(['like', 'name', $params['name']]);
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
            $model['ghesmat'] = HrmWorkgroupGhesmat::find()->where(['id' => $model['ghesmat_id']])->asArray()->one();
            if ($model['ghesmat']) {
                $model['ghesmat']['bakhsh'] = HrmWorkgroupBakhsh::find()
                    ->where(['id' => $model['ghesmat']['bakhsh_id']])
                    ->asArray()
                    ->one();
                if ($model['ghesmat']['bakhsh']) {
                    $model['ghesmat']['bakhsh']['workgroup'] = HrmWorkgroup::find()
                        ->where(['id' => $model['ghesmat']['bakhsh']['workgroup_id']])
                        ->asArray()
                        ->one();
                }
            }
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
            ->with(['ghesmat', 'createdBy'])
            ->where(['id' => $id])
            ->asArray()
            ->one();

        if (!$model) {
            return ['success' => false, 'message' => 'یافت نشد'];
        }

        $model['ghesmat'] = HrmWorkgroupGhesmat::find()->where(['id' => $model['ghesmat_id']])->asArray()->one();
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

    public static function getOptions($ghesmatId)
    {
        return self::find()
            ->where(['ghesmat_id' => $ghesmatId, 'status' => self::STATUS_ACTIVE])
            ->select(['id', 'name'])
            ->orderBy(['name' => SORT_ASC])
            ->asArray()
            ->all();
    }
}