<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;
use yii\data\ActiveDataProvider;

class HrmPersonnelEducation extends ActiveRecord
{
    public static function tableName()
    {
        return 'hrm_personnel_education';
    }

    public function rules()
    {
        return [
            [['user_id'], 'required'],
            [['user_id', 'sort_order'], 'integer'],
            [['start_date', 'end_date', 'created_at', 'updated_at'], 'safe'],
            [['gpa'], 'number'],
            [['institution_name', 'field_of_study', 'orientation'], 'string', 'max' => 255],
            [['degree'], 'string', 'max' => 50],
            [['start_date_persian', 'end_date_persian'], 'string', 'max' => 10],
            ['gpa', 'number', 'min' => 0, 'max' => 20, 'message' => 'معدل باید بین ۰ تا ۲۰ باشد'],
        ];
    }

    public function attributeLabels()
    {
        return [
            'id' => 'شناسه',
            'user_id' => 'کاربر',
            'institution_name' => 'نام مرکز آموزشی',
            'degree' => 'مدرک تحصیلی',
            'field_of_study' => 'رشته تحصیلی',
            'orientation' => 'گرایش',
            'start_date' => 'تاریخ شروع',
            'start_date_persian' => 'تاریخ شروع (شمسی)',
            'end_date' => 'تاریخ پایان',
            'end_date_persian' => 'تاریخ پایان (شمسی)',
            'gpa' => 'معدل',
            'sort_order' => 'ترتیب',
            'created_at' => 'تاریخ ثبت',
            'updated_at' => 'تاریخ ویرایش',
        ];
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

        // تبدیل تاریخ‌ها
        if (!empty($params['start_date'])) {
            $params['start_date_persian'] = $params['start_date'];
            $params['start_date'] = Persian::convert_date_to_en($params['start_date']);
        }
        if (!empty($params['end_date'])) {
            $params['end_date_persian'] = $params['end_date'];
            $params['end_date'] = Persian::convert_date_to_en($params['end_date']);
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

    // حذف همه رکوردهای یک کاربر (برای هماهنگی با فرم)
    public static function deleteByUser($userId)
    {
        self::deleteAll(['user_id' => $userId]);
        return ['success' => true];
    }
}