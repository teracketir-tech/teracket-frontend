<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;
use yii\data\ActiveDataProvider;

class HrmInsurance extends ActiveRecord
{
    const TYPE_BEFORE_EMPLOYMENT = 1;
    const TYPE_AFTER_EMPLOYMENT = 2;
    
    const STATUS_ACTIVE = 1;
    const STATUS_INACTIVE = 0;

    public static function tableName()
    {
        return 'hrm_insurances';
    }

    public function rules()
    {
        return [
            [['user_id', 'insurance_type', 'insurance_number'], 'required'],
            [['user_id', 'insurance_type', 'status'], 'integer'],
            [['insurance_number', 'workshop_code'], 'string', 'max' => 50],
            [['workshop_name'], 'string', 'max' => 255],
            [['history_from', 'history_to'], 'safe'],
        ];
    }

    public function attributeLabels()
    {
        return [
            'id' => 'شناسه',
            'user_id' => 'نام کاربری',
            'insurance_type' => 'نوع بیمه',
            'insurance_number' => 'شماره بیمه',
            'workshop_code' => 'کد کارگاه',
            'workshop_name' => 'نام کارگاه',
            'history_from' => 'سابقه بیمه از',
            'history_to' => 'سابقه بیمه تا',
            'status' => 'وضعیت',
            'created_at' => 'تاریخ ثبت',
            'updated_at' => 'تاریخ ویرایش',
        ];
    }

    public function getInsuranceTypeLabel()
    {
        $types = [
            self::TYPE_BEFORE_EMPLOYMENT => 'قبل از استخدام در شرکت',
            self::TYPE_AFTER_EMPLOYMENT => 'بعد از استخدام در شرکت',
        ];
        return $types[$this->insurance_type] ?? 'نامشخص';
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

    // ====== فیلتر بر اساس user_id ======
    if (!empty($params['user_id'])) {
        $query->andWhere(['user_id' => $params['user_id']]);
    }

    // ====== فیلتر بر اساس نوع بیمه ======
    if (!empty($params['insurance_type'])) {
        $query->andWhere(['insurance_type' => $params['insurance_type']]);
    }

    // ====== فیلتر بر اساس شماره بیمه ======
    if (!empty($params['insurance_number'])) {
        $query->andWhere(['like', 'insurance_number', $params['insurance_number']]);
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

    // ====== فیلتر بر اساس گروه کاری (workgroup_id) ======
    if (!empty($params['workgroup_id'])) {
        $userIds = HrmWorkgroupPersonel::find()
            ->where(['workgroup_id' => $params['workgroup_id'], 'status' => 1])
            ->select('user_id')
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

    // اضافه کردن اطلاعات کاربر و تبدیل تاریخ
    foreach ($models as &$model) {
        $model['user'] = User::find()->where(['id' => $model['user_id']])->asArray()->one();
        
        // تبدیل تاریخ‌های میلادی به شمسی برای نمایش
        if (!empty($model['history_from'])) {
            $model['history_from_persian'] = Persian::convert_date_to_fa($model['history_from']);
        } else {
            $model['history_from_persian'] = null;
        }
        
        if (!empty($model['history_to'])) {
            $model['history_to_persian'] = Persian::convert_date_to_fa($model['history_to']);
        } else {
            $model['history_to_persian'] = null;
        }
        
        // برچسب نوع بیمه
        $model['insurance_type_label'] = (new self())->getInsuranceTypeLabel();
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