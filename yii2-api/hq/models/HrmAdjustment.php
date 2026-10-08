<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;
use yii\data\ActiveDataProvider;

class HrmAdjustment extends ActiveRecord
{
    const STATUS_UNPAID = 0;
    const STATUS_PAID = 1;

    // انواع اضافه/کسر
    const TYPE_BONUS = 1;           // پاداش
    const TYPE_PENALTY = 2;         // جریمه
    const TYPE_ARREARS = 3;         // معوقه
    const TYPE_COMPANY_PURCHASE = 4; // خرید از شرکت
    const TYPE_OTHER_DEDUCTION = 5;  // کسور متفرقه
    const TYPE_TRANSPORTATION = 6;   // کمک ایاب ذهاب

    public static function tableName()
    {
        return 'hrm_adjustments';
    }

    public function rules()
    {
        return [
            [['user_id', 'type', 'amount', 'month', 'year'], 'required'],
            [['user_id', 'type', 'month', 'year', 'status'], 'integer'],
            [['amount'], 'number'],
            [['description'], 'string'],
            ['amount', 'compare', 'compareValue' => 0, 'operator' => '>', 'message' => 'مبلغ باید بیشتر از 0 باشد'],
            ['month', 'in', 'range' => range(1, 12), 'message' => 'ماه باید بین 1 تا 12 باشد'],
            ['type', 'in', 'range' => array_keys(self::getTypeList()), 'message' => 'نوع نامعتبر است'],
        ];
    }

    public function attributeLabels()
    {
        return [
            'id' => 'شناسه',
            'user_id' => 'کد پرسنلی',
            'type' => 'نوع',
            'amount' => 'مبلغ (ریال)',
            'month' => 'ماه',
            'year' => 'سال',
            'status' => 'وضعیت',
            'description' => 'توضیحات',
            'created_at' => 'تاریخ ثبت',
            'updated_at' => 'تاریخ ویرایش',
        ];
    }

    public static function getTypeList()
    {
        return [
            self::TYPE_BONUS => 'پاداش',
            self::TYPE_PENALTY => 'جریمه',
            self::TYPE_ARREARS => 'معوقه',
            self::TYPE_COMPANY_PURCHASE => 'خرید از شرکت',
            self::TYPE_OTHER_DEDUCTION => 'کسور متفرقه',
            self::TYPE_TRANSPORTATION => 'کمک ایاب ذهاب',
        ];
    }

    public function getTypeLabel()
    {
        $types = self::getTypeList();
        return $types[$this->type] ?? 'نامشخص';
    }

    public function getTypeClass()
    {
        // برای تشخیص اضافه یا کسر
        $additions = [
            self::TYPE_BONUS,
            self::TYPE_ARREARS,
            self::TYPE_TRANSPORTATION,
        ];
        return in_array($this->type, $additions) ? 'addition' : 'deduction';
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

        // فیلتر بر اساس نوع
        if (!empty($params['type'])) {
            $query->andWhere(['type' => $params['type']]);
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
            $model['type_label'] = self::getTypeList()[$model['type']] ?? 'نامشخص';
            $model['type_class'] = in_array($model['type'], [self::TYPE_BONUS, self::TYPE_ARREARS, self::TYPE_TRANSPORTATION]) ? 'addition' : 'deduction';
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

        $user = User::find()->where(['id' => $model['user_id']])->asArray()->one();
        $model['user'] = $user;
        $model['type_label'] = self::getTypeList()[$model['type']] ?? 'نامشخص';
        $model['type_class'] = in_array($model['type'], [self::TYPE_BONUS, self::TYPE_ARREARS, self::TYPE_TRANSPORTATION]) ? 'addition' : 'deduction';

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

    // تسویه
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