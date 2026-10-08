<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;
use yii\data\ActiveDataProvider;

class HrmBankAccount extends ActiveRecord
{
    const STATUS_ACTIVE = 1;
    const STATUS_INACTIVE = 0;

    public static function tableName()
    {
        return 'hrm_bank_accounts';
    }

    public function rules()
    {
        return [
            [['user_id', 'bank_id', 'account_number'], 'required'],
            [['user_id', 'bank_id', 'status'], 'integer'],
            [['account_number', 'sheba_number'], 'string', 'max' => 50],
            [['card_number'], 'string', 'max' => 20],
            [['card_number','sheba_number'],'safe']
           /* ['card_number', 'match', 'pattern' => '/^[0-9]{16}$/', 'message' => 'شماره کارت باید 16 رقم باشد'],
            ['sheba_number', 'match', 'pattern' => '/^IR[0-9]{24}$/', 'message' => 'شماره شبا باید با IR شروع و 26 کاراکتر باشد'],*/
        ];
    }

    public function attributeLabels()
    {
        return [
            'id' => 'شناسه',
            'user_id' => 'نام کاربری',
            'bank_id' => 'نام بانک',
            'account_number' => 'شماره حساب',
            'sheba_number' => 'شماره شبا',
            'card_number' => 'شماره کارت',
            'status' => 'وضعیت',
            'created_at' => 'تاریخ ثبت',
            'updated_at' => 'تاریخ ویرایش',
        ];
    }

    // ============== روابط ==============

    public function getUser()
    {
        return $this->hasOne(User::class, ['id' => 'user_id']);
    }

    public function getBank()
    {
        return $this->hasOne(Bank::class, ['id' => 'bank_id']);
    }

    // ============== متدهای API ==============

    public static function get_all()
    {
        User::checkAccess(702);

        $params = Yii::$app->request->get();
        $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
        $page = isset($params['page']) ? (int) $params['page'] : 1;

        $query = self::find()
            ->with(['user', 'bank'])
            ->orderBy(['id' => SORT_DESC]);

        // ====== فیلترها ======

        // فیلتر بر اساس user_id
        if (!empty($params['user_id'])) {
            $query->andWhere(['user_id' => $params['user_id']]);
        }

        // فیلتر بر اساس bank_id
        if (!empty($params['bank_id'])) {
            $query->andWhere(['bank_id' => $params['bank_id']]);
        }

       // ====== فیلتر بر اساس کد پرسنلی (personnel_code) ======
    if (!empty($params['personnel_code'])) {
        $userIds = User::find()
            ->where(['like', 'user.personnel_code', $params['personnel_code']])
            ->select('id')
            ->column();
        
        if (!empty($userIds)) {
            $query->andWhere(['user_id' => $userIds]);
        } else {
            $query->andWhere('1=0');
        }
    }
    

    // ====== فیلتر بر اساس کد ملی (national_code) ======
   if (!empty($params['national_code'])) {
        
        $userIds = HrmPersonnelBasic::find()
            ->where(['like', 'national_code', $params['national_code']])
            ->select('user_id')
            ->column();
        
        if (!empty($userIds)) {
            $query->andWhere(['user_id' => $userIds]);
        } else {
            $query->andWhere('1=0');
        }
    }

        // ====== فیلتر بر اساس نام و نام خانوادگی ======
        if (!empty($params['first_name'])) {
            $userIds = User::find()
                ->where(['like', 'first_name', $params['first_name']])
                ->select('id')
                ->column();
            
            if (!empty($userIds)) {
                $query->andWhere(['user_id' => $userIds]);
            } else {
                $query->andWhere('1=0');
            }
        }

        if (!empty($params['last_name'])) {
            $userIds = User::find()
                ->where(['like', 'last_name', $params['last_name']])
                ->select('id')
                ->column();
            
            if (!empty($userIds)) {
                $query->andWhere(['user_id' => $userIds]);
            } else {
                $query->andWhere('1=0');
            }
        }

        // ====== دریافت داده‌ها ======
        $totalCount = $query->count();

        $models = $query
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->asArray()
            ->all();

        // اضافه کردن اطلاعات کاربر
        foreach ($models as &$model) {
            $model['user'] = User::find()->where(['id' => $model['user_id']])->asArray()->one();
            $model['bank'] = BankName::find()->where(['id' => $model['bank_id']])->asArray()->one();
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
            ->with(['user', 'bank'])
            ->where(['id' => $id])
            ->asArray()
            ->one();

        if (!$model) {
            return ['success' => false, 'message' => 'رکورد یافت نشد'];
        }

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
}