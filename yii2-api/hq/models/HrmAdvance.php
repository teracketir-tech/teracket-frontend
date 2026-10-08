<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;
use yii\data\ActiveDataProvider;

class HrmAdvance extends ActiveRecord
{
    const STATUS_UNPAID = 0;
    const STATUS_PAID = 1;

    public static function tableName()
    {
        return 'hrm_advances';
    }

    public function rules()
    {
        return [
            [['user_id', 'amount', 'month', 'year'], 'required'],
            [['user_id', 'month', 'year', 'status'], 'integer'],
            [['amount'], 'number'],
            [['description'], 'string'],
            ['amount', 'compare', 'compareValue' => 0, 'operator' => '>', 'message' => 'مبلغ باید بیشتر از 0 باشد'],
            ['month', 'in', 'range' => range(1, 12), 'message' => 'ماه باید بین 1 تا 12 باشد'],
        ];
    }

    public function attributeLabels()
    {
        return [
            'id' => 'شناسه',
            'user_id' => 'کد پرسنلی',
            'amount' => 'مبلغ مساعده (ریال)',
            'month' => 'ماه',
            'year' => 'سال',
            'status' => 'وضعیت',
            'description' => 'توضیحات',
            'created_at' => 'تاریخ ثبت',
            'updated_at' => 'تاریخ ویرایش',
        ];
    }

    public function getStatusLabel()
    {
        $statuses = [
            self::STATUS_UNPAID => 'تسویه نشده',
            self::STATUS_PAID => 'تسویه شده',
        ];
        return $statuses[$this->status] ?? 'نامشخص';
    }

    public function getMonthLabel()
    {
        $months = [
            1 => 'فروردین', 2 => 'اردیبهشت', 3 => 'خرداد',
            4 => 'تیر', 5 => 'مرداد', 6 => 'شهریور',
            7 => 'مهر', 8 => 'آبان', 9 => 'آذر',
            10 => 'دی', 11 => 'بهمن', 12 => 'اسفند'
        ];
        return $months[$this->month] ?? 'نامشخص';
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
            ->orderBy(['id' => SORT_DESC]);

        // فیلتر بر اساس کاربر
        if (!empty($params['user_id'])) {
            $query->andWhere(['user_id' => $params['user_id']]);
        }

        // فیلتر بر اساس ماه
        if (!empty($params['month'])) {
            $query->andWhere(['month' => $params['month']]);
        }

        // فیلتر بر اساس سال
        if (!empty($params['year'])) {
            $query->andWhere(['year' => $params['year']]);
        }

        // فیلتر بر اساس وضعیت
        if (isset($params['status']) && $params['status'] !== '') {
            $query->andWhere(['status' => $params['status']]);
        }


         if (!empty($params['personnel_code'])) {
            $userIds = User::find()
                ->where(['personnel_code' => $params['personnel_code']])
                ->select('id')
                ->column();


           
                $query->andWhere(['user_id' => $userIds]);
            
        }

        if (!empty($params['national_code'])) {
            $userIds = User::find()
                ->where(['national_id' => $params['national_code']])
                ->select('id')
                ->column();


            $query->andWhere(['user_id' => $userIds]);
            
        }
        
        $totalCount = $query->count();

        $models = $query
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->asArray()
            ->all();

        // اضافه کردن اطلاعات user به صورت دستی
        foreach ($models as &$model) {
            $user = User::find()->where(['id' => $model['user_id']])->asArray()->one();
            $model['user'] = $user;
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

        // اضافه کردن اطلاعات user
        $user = User::find()->where(['id' => $model['user_id']])->asArray()->one();
        $model['user'] = $user;

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

    // تسویه مساعده
    public static function settle($id)
    {
        User::checkAccess(703);

        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'رکورد یافت نشد'];
        }

        $model->status = self::STATUS_PAID;
        $model->save();

        return ['success' => true, 'data' => $model];
    }
}