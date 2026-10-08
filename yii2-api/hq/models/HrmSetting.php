<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;

class HrmSetting extends ActiveRecord
{
    public static function tableName()
    {
        return 'hrm_settings';
    }

    public function rules()
    {
        return [
            [['key'], 'required'],
            [['value', 'description'], 'string'],
            [['is_active'], 'integer'],
            [['key', 'group'], 'string', 'max' => 100],
            ['key', 'unique'],
        ];
    }

    public function attributeLabels()
    {
        return [
            'id' => 'شناسه',
            'key' => 'کلید',
            'value' => 'مقدار',
            'description' => 'توضیحات',
            'group' => 'گروه',
            'is_active' => 'فعال',
            'created_at' => 'تاریخ ثبت',
            'updated_at' => 'تاریخ ویرایش',
        ];
    }

    // ============== متدهای کمکی ==============
    
    public static function getValue($key, $default = null)
    {
        $model = self::find()->where(['key' => $key, 'is_active' => 1])->one();
        return $model ? $model->value : $default;
    }

    public static function getInt($key, $default = 0)
    {
        return (int) self::getValue($key, $default);
    }

    public static function getFloat($key, $default = 0)
    {
        return (float) self::getValue($key, $default);
    }

    public static function getBool($key, $default = false)
    {
        return (bool) self::getValue($key, $default);
    }

    public static function getByGroup($group)
    {
        return self::find()
            ->where(['group' => $group, 'is_active' => 1])
            ->asArray()
            ->all();
    }

    // ============== متدهای API ==============

    public static function get_all()
    {
       // User::checkAccess(702);

        $params = Yii::$app->request->get();
        $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
        $page = isset($params['page']) ? (int) $params['page'] : 1;

        $query = self::find()->orderBy(['group' => SORT_ASC, 'key' => SORT_ASC]);

        if (!empty($params['group'])) {
            $query->andWhere(['group' => $params['group']]);
        }

        if (isset($params['is_active']) && $params['is_active'] !== '') {
            $query->andWhere(['is_active' => $params['is_active']]);
        }

        $totalCount = $query->count();
        $models = $query
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->asArray()
            ->all();

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
           // User::checkAccess(701);
            $model = new self();
        } else {
           // User::checkAccess(703);
            $model = self::findOne($id);
            if (!$model) {
                return ['success' => false, 'message' => 'تنظیمات یافت نشد'];
            }
        }

        if ($model->load($params, '') && $model->save()) {
            return ['success' => true, 'data' => $model];
        }

        return ['success' => false, 'errors' => $model->errors];
    }

    public static function _delete($id)
    {
       // User::checkAccess(704);

        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'تنظیمات یافت نشد'];
        }

        $model->delete();
        return ['success' => true];
    }
}