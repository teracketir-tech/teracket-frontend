<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;
use yii\data\ActiveDataProvider;

class HrmLoan extends ActiveRecord
{
    const STATUS_UNPAID = 0;
    const STATUS_PAID = 1;

    public static function tableName()
    {
        return 'hrm_loans';
    }

    public function rules()
    {
        return [
            [['user_id', 'total_amount', 'installment_count', 'installment_amount'], 'required'],
            [['user_id', 'installment_count', 'paid_installments', 'status'], 'integer'],
            [['total_amount', 'installment_amount'], 'number'],
            [['description'], 'string'],
            ['total_amount', 'compare', 'compareValue' => 0, 'operator' => '>', 'message' => 'مبلغ وام باید بیشتر از 0 باشد'],
            ['installment_count', 'compare', 'compareValue' => 0, 'operator' => '>', 'message' => 'تعداد اقساط باید بیشتر از 0 باشد'],
            ['installment_amount', 'compare', 'compareValue' => 0, 'operator' => '>', 'message' => 'مبلغ هر قسط باید بیشتر از 0 باشد'],
        ];
    }

    public function attributeLabels()
    {
        return [
            'id' => 'شناسه',
            'user_id' => 'کد پرسنلی',
            'total_amount' => 'مبلغ کل وام (ریال)',
            'installment_count' => 'تعداد اقساط',
            'installment_amount' => 'مبلغ هر قسط (ریال)',
            'paid_installments' => 'تعداد اقساط پرداخت شده',
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

    public function getRemainingInstallments()
    {
        return $this->installment_count - $this->paid_installments;
    }

    public function getRemainingAmount()
    {
        return $this->getRemainingInstallments() * $this->installment_amount;
    }

    // ============== روابط ==============

    public function getUser()
    {
        return $this->hasOne(User::class, ['id' => 'user_id']);
    }

    // ============== متدهای API ==============

   // frontend/modules/hq/models/HrmLoan.php

public static function get_all()
{
    User::checkAccess(702);

    $params = Yii::$app->request->get();
    $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
    $page = isset($params['page']) ? (int) $params['page'] : 1;

    $query = self::find()
        ->with(['user'])
        ->orderBy(['id' => SORT_DESC]);

    // ====== فیلتر بر اساس کاربر ======
    if (!empty($params['user_id'])) {
        $query->andWhere(['user_id' => $params['user_id']]);
    }

    // ====== فیلتر بر اساس کد پرسنلی ======
    if (!empty($params['personnel_code'])) {
        $userIds = User::find()
            ->where(['like', 'personnel_code', $params['personnel_code']])
            ->select('id')
            ->column();
        if (!empty($userIds)) {
            $query->andWhere(['user_id' => $userIds]);
        } else {
            $query->andWhere('1=0');
        }
    }

    // ====== فیلتر بر اساس وضعیت ======
    if (isset($params['status']) && $params['status'] !== '') {
        $query->andWhere(['status' => $params['status']]);
    }

    

    // ====== فیلتر بر اساس تاریخ (از - تا) ======
    if (!empty($params['date_from'])) {
        $query->andWhere(['>=', 'created_at', Persian::convert_date_to_en($params['date_from']) . ' 00:00:00']);
    }
    if (!empty($params['date_to'])) {
        $query->andWhere(['<=', 'created_at', Persian::convert_date_to_en($params['date_to']). ' 23:59:59']);
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

    // اضافه کردن اطلاعات user
    foreach ($models as &$model) {
        $user = User::find()->where(['id' => $model['user_id']])->asArray()->one();
        $model['user'] = $user;
        $model['remaining_installments'] = $model['installment_count'] - $model['paid_installments'];
        $model['remaining_amount'] = $model['remaining_installments'] * $model['installment_amount'];
          $model['date_persian'] = Persian::convert_date_to_fa($model['created_at']);
          $model['update_date_persian'] =$model['updated_at'] ? Persian::convert_date_to_fa($model['updated_at']) : ' - ';
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
        $model['remaining_installments'] = $model['installment_count'] - $model['paid_installments'];
        $model['remaining_amount'] = $model['remaining_installments'] * $model['installment_amount'];

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

        // محاسبه مبلغ هر قسط
        if (isset($params['total_amount']) && isset($params['installment_count'])) {
            $params['installment_amount'] = ceil($params['total_amount'] / $params['installment_count']);
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

    // ثبت پرداخت قسط
    public static function payInstallment($id)
    {
        User::checkAccess(703);

        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'رکورد یافت نشد'];
        }

        if ($model->status == self::STATUS_PAID) {
            return ['success' => false, 'message' => 'این وام قبلاً تسویه شده است'];
        }

        $model->paid_installments = $model->paid_installments + 1;

        // اگر تمام اقساط پرداخت شد، وضعیت رو تسویه شده کن
        if ($model->paid_installments >= $model->installment_count) {
            $model->status = self::STATUS_PAID;
        }

        $model->save();

        return ['success' => true, 'data' => $model];
    }

    // تسویه کامل وام
    public static function settle($id)
    {
        User::checkAccess(703);

        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'رکورد یافت نشد'];
        }

        $model->paid_installments = $model->installment_count;
        $model->status = self::STATUS_PAID;
        $model->save();

        return ['success' => true, 'data' => $model];
    }
}