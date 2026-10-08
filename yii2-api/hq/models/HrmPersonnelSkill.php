<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;
use yii\data\ActiveDataProvider;

class HrmPersonnelSkill extends ActiveRecord
{
    const LEVEL_EXCELLENT = 'excellent';
    const LEVEL_GOOD = 'good';
    const LEVEL_AVERAGE = 'average';
    const LEVEL_WEAK = 'weak';

    public static function tableName()
    {
        return 'hrm_personnel_skills';
    }

    public function rules()
    {
        return [
            [['user_id'], 'required'],
            [['user_id', 'sort_order'], 'integer'],
            [['skill_title'], 'string', 'max' => 255],
            [['skill_description'], 'string'],
            [['skill_level'], 'string', 'max' => 20],
            ['skill_level', 'in', 'range' => [self::LEVEL_EXCELLENT, self::LEVEL_GOOD, self::LEVEL_AVERAGE, self::LEVEL_WEAK]],
        ];
    }

    public function attributeLabels()
    {
        return [
            'id' => 'شناسه',
            'user_id' => 'کاربر',
            'skill_title' => 'عنوان مهارت',
            'skill_level' => 'سطح مهارت',
            'skill_description' => 'توضیح مهارت',
            'sort_order' => 'ترتیب',
            'created_at' => 'تاریخ ثبت',
            'updated_at' => 'تاریخ ویرایش',
        ];
    }

    public function getLevelLabel()
    {
        $levels = [
            self::LEVEL_EXCELLENT => 'عالی',
            self::LEVEL_GOOD => 'خوب',
            self::LEVEL_AVERAGE => 'متوسط',
            self::LEVEL_WEAK => 'ضعیف',
        ];
        return $levels[$this->skill_level] ?? 'نامشخص';
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
            ->orderBy(['user_id' => SORT_ASC, 'sort_order' => SORT_ASC, 'id' => SORT_DESC]);

        if (!empty($params['user_id'])) {
            $query->andWhere(['user_id' => $params['user_id']]);
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
        User::checkAccess(702);

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

    public static function getByUser($userId)
    {
        $models = self::find()
            ->where(['user_id' => $userId])
            ->orderBy(['sort_order' => SORT_ASC, 'id' => SORT_DESC])
            ->asArray()
            ->all();

        return ['success' => true, 'data' => $models];
    }

    public static function deleteByUser($userId)
    {
        self::deleteAll(['user_id' => $userId]);
        return ['success' => true];
    }
}