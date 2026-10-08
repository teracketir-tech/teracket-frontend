<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;
use yii\data\ActiveDataProvider;

class HrmPersonnelBasic extends ActiveRecord
{
    // جنسیت
    const GENDER_MALE = 1;
    const GENDER_FEMALE = 2;

    // وضعیت تاهل
    const MARITAL_SINGLE = 1;
    const MARITAL_MARRIED = 2;
    const MARITAL_DIVORCED = 3;

    // جنسیت فرزند
    const CHILD_GENDER_MALE = 1;
    const CHILD_GENDER_FEMALE = 2;

    public static function tableName()
    {
        return 'hrm_personnel_basic';
    }   

    public function rules()
    {
        return [
            [['user_id'], 'required'],
            [['user_id', 'gender', 'blood_type', 'marital_status', 'child_count', 'child_gender'], 'integer'],
            [['personnel_code', 'birth_date', 'spouse_birth_date', 'marriage_date', 'child_birth_date', 'created_at', 'updated_at'], 'safe'],
            [['first_name', 'last_name', 'father_name', 'shenasname_city', 'birth_place', 'religion_detail', 'spouse_first_name', 'spouse_last_name', 'child_first_name', 'child_last_name'], 'string', 'max' => 255],
            [['national_code', 'spouse_national_code', 'child_national_code'], 'string', 'max' => 10],
            [['shenasname_number', 'spouse_shenasname_number', 'child_shenasname_number'], 'string', 'max' => 50],
            [['shenasname_serial1', 'shenasname_serial2', 'shenasname_letter', 'nationality', 'religion'], 'string', 'max' => 50],
            [['birth_date_persian', 'spouse_birth_date_persian', 'marriage_date_persian', 'child_birth_date_persian'], 'string', 'max' => 10],
            [['status'], 'safe']
            //  ['national_code', 'unique', 'targetAttribute' => 'national_code', 'message' => 'این کد ملی قبلاً ثبت شده است'],
            //['user_id', 'unique', 'message' => 'این کاربر قبلاً ثبت شده است'],
        ];
    }
 
    public function attributeLabels()
    {
        return [
            'id' => 'شناسه',
            'user_id' => 'کاربر',
            'first_name' => 'نام',
            'last_name' => 'نام خانوادگی',
            'father_name' => 'نام پدر',
            'national_code' => 'کد ملی',
            'personnel_code' => 'کد پرسنلی',
            'shenasname_number' => 'شماره شناسنامه',
            'shenasname_serial1' => 'سریال شناسنامه (سری)',
            'shenasname_serial2' => 'سریال شناسنامه (سریال)',
            'shenasname_letter' => 'حرف سریال شناسنامه',
            'shenasname_city' => 'محل صدور شناسنامه',
            'birth_date' => 'تاریخ تولد',
            'birth_date_persian' => 'تاریخ تولد (شمسی)',
            'birth_place' => 'محل تولد',
            'nationality' => 'ملیت',
            'gender' => 'جنسیت',
            'blood_type' => 'گروه خونی',
            'religion' => 'دین',
            'religion_detail' => 'مذهب',
            'marital_status' => 'وضعیت تاهل',
            'spouse_first_name' => 'نام همسر',
            'spouse_last_name' => 'نام خانوادگی همسر',
            'spouse_national_code' => 'کد ملی همسر',
            'spouse_shenasname_number' => 'شماره شناسنامه همسر',
            'spouse_birth_date' => 'تاریخ تولد همسر',
            'spouse_birth_date_persian' => 'تاریخ تولد همسر (شمسی)',
            'marriage_date' => 'تاریخ ازدواج',
            'marriage_date_persian' => 'تاریخ ازدواج (شمسی)',
            'child_count' => 'تعداد فرزند',
            'child_first_name' => 'نام فرزند',
            'child_last_name' => 'نام خانوادگی فرزند',
            'child_national_code' => 'کد ملی فرزند',
            'child_shenasname_number' => 'شماره شناسنامه فرزند',
            'child_birth_date' => 'تاریخ تولد فرزند',
            'child_birth_date_persian' => 'تاریخ تولد فرزند (شمسی)',
            'child_gender' => 'جنسیت فرزند',
            'created_at' => 'تاریخ ثبت',
            'updated_at' => 'تاریخ ویرایش',
        ];
    }

    // ============== متدهای کمکی ==============

    public function getGenderLabel()
    {
        $genders = [
            self::GENDER_MALE => 'مرد',
            self::GENDER_FEMALE => 'زن',
        ];
        return $genders[$this->gender] ?? 'نامشخص';
    }

    public function getMaritalStatusLabel()
    {
        $statuses = [
            self::MARITAL_SINGLE => 'مجرد',
            self::MARITAL_MARRIED => 'متاهل',
            self::MARITAL_DIVORCED => 'مطلقه',
        ];
        return $statuses[$this->marital_status] ?? 'نامشخص';
    }

    public function getChildGenderLabel()
    {
        $genders = [
            self::CHILD_GENDER_MALE => 'پسر',
            self::CHILD_GENDER_FEMALE => 'دختر',
        ];
        return $genders[$this->child_gender] ?? 'نامشخص';
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

    if (!empty($params['user_id'])) {
        $query->andWhere(['user_id' => $params['user_id']]);
    }
    
    if (!empty($params['national_code'])) {
        $query->andWhere(['like', 'national_code', $params['national_code']]);
    }
    
    // ✅ اصلاح: بررسی وضعیت
    if (isset($params['status']) && $params['status'] !== '') {
        $query->andWhere(['status' => $params['status']]);
    }
    
    // ✅ اصلاح: استفاده از >= به جای =>
    if (!empty($params['date_from'])) {
        $query->andWhere(['>=', 'created_at', $params['date_from'] . ' 00:00:00']);
    }
    
    // ✅ اصلاح: استفاده از <=
    if (!empty($params['date_to'])) {
        $query->andWhere(['<=', 'created_at', $params['date_to'] . ' 23:59:59']);
    }
    
    if (!empty($params['personnel_code'])) {
        $query->andWhere(['like', 'personnel_code', $params['personnel_code']]);
    }

    // فیلتر بر اساس نام و نام خانوادگی
    if (!empty($params['first_name'])) {
        $query->andWhere(['like', 'first_name', $params['first_name']]);
    }
    
    if (!empty($params['last_name'])) {
        $query->andWhere(['like', 'last_name', $params['last_name']]);
    }
    $query->andWhere(['!=', 'first_name', '']);
    $query->andWhere(['!=', 'last_name', '']);
    $totalCount = $query->count();
    $models = $query
        ->offset(($page - 1) * $perPage)
        ->limit($perPage)
        ->asArray()
        ->all();

    foreach ($models as &$model) {
        User::syncPersonnelCode($model['user_id']);
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

    // frontend/modules/hq/models/HrmPersonnelBasic.php

    public static function _save($id = null)
    {
        $params = Yii::$app->request->post();

        // اگر id ارسال نشده، بر اساس user_id چک کن
        if (!$id && isset($params['user_id'])) {
            // بررسی وجود رکورد با این user_id
            $existing = self::find()->where(['user_id' => $params['user_id']])->one();
            if ($existing) {
                $id = $existing->id;
            }
        }

        if (!$id) {
            // INSERT جدید
            User::checkAccess(701);
            $model = new self();
        } else {
            // UPDATE موجود
            User::checkAccess(703);
            $model = self::findOne($id);
            if (!$model) {
                return ['success' => false, 'message' => 'رکورد یافت نشد'];
            }
        }

        // تبدیل تاریخ‌های شمسی به میلادی
        if (!empty($params['birth_date'])) {

            $params['birth_date_persian'] = Persian::convert_date_to_fa($params['birth_date']);
            //  $params['birth_date'] = $params['birth_date'];
        }
        if (!empty($params['spouse_birth_date'])) {
            $params['spouse_birth_date_persian'] = $params['spouse_birth_date'];
            $params['spouse_birth_date'] = Persian::convert_date_to_en($params['spouse_birth_date']);
        }
        if (!empty($params['marriage_date'])) {
            $params['marriage_date_persian'] = $params['marriage_date'];
            $params['marriage_date'] = Persian::convert_date_to_en($params['marriage_date']);
        }
        if (!empty($params['child_birth_date'])) {
            $params['child_birth_date_persian'] = $params['child_birth_date'];
            $params['child_birth_date'] = Persian::convert_date_to_en($params['child_birth_date']);
        }

        if ($model->load($params, '') && $model->save()) {

            if (!empty($params['personnel_code']) && !empty($params['user_id'])) {
                User::updatePersonnelCode($params['user_id'], $params['personnel_code']);
            }
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

    // دریافت اطلاعات پایه یک کاربر خاص
    public static function getByUser($userId)
    {
        $model = self::find()
            ->where(['user_id' => $userId])
            ->asArray()
            ->one();

        if (!$model) {
            return ['success' => false, 'message' => 'اطلاعاتی برای این کاربر یافت نشد'];
        }

        return ['success' => true, 'data' => $model];
    }

    public static function acceptPerson($userId)
    {
        $model = self::find()
            ->where(['user_id' => $userId])

            ->one();

        if (!$model) {
            return ['success' => false, 'message' => 'اطلاعاتی برای این کاربر یافت نشد'];
        }
        $model->status = 1;
        $model->save(false);

        return ['success' => true];
    }
}