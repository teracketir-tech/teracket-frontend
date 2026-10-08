<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;

class HrmWorkgroup extends ActiveRecord
{
    const STATUS_INACTIVE = 0;
    const STATUS_ACTIVE = 1;

    public static function tableName()
    {
        return 'hrm_workgroup';
    }

    public function rules()
    {
        return [
            [['name'], 'required'],
            [['status', 'created_by'], 'integer'],
            [['name'], 'string', 'max' => 255],
            [['created_at', 'updated_at'], 'safe'],
        ];
    }

    public function attributeLabels()
    {
        return [
            'id' => 'شناسه',
            'name' => 'نام گروه کاری',
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

    public function getStatusColor()
    {
        return $this->status == self::STATUS_ACTIVE ? 'text-green-600' : 'text-gray-400';
    }

    // روابط
    public function getBakhshs()
    {
        return $this->hasMany(HrmWorkgroupBakhsh::class, ['workgroup_id' => 'id']);
    }

    public function getActiveBakhshs()
    {
        return $this->hasMany(HrmWorkgroupBakhsh::class, ['workgroup_id' => 'id'])
            ->where(['status' => self::STATUS_ACTIVE]);
    }

    public function getCreatedBy()
    {
        return $this->hasOne(User::class, ['id' => 'created_by']);
    }

    // ============== متدهای API ==============

    public static function get_all()
    {
        $params = Yii::$app->request->get();
        $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
        $page = isset($params['page']) ? (int) $params['page'] : 1;

        $query = self::find()
            ->with(['createdBy'])
            ->orderBy(['id' => SORT_DESC]);

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
            $model['createdBy'] = User::find()->where(['id' => $model['created_by']])->asArray()->one();
            $model['status_label'] = (new self())->getStatusLabel();
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
            ->with(['createdBy'])
            ->where(['id' => $id])
            ->asArray()
            ->one();

        if (!$model) {
            return ['success' => false, 'message' => 'یافت نشد'];
        }

        $model['createdBy'] = User::find()->where(['id' => $model['created_by']])->asArray()->one();
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

    public static function getOptions()
    {
        return self::find()
            ->where(['status' => self::STATUS_ACTIVE])
            ->select(['id', 'name'])
            ->orderBy(['name' => SORT_ASC])
            ->asArray()
            ->all();
    }
}