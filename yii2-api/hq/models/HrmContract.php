<?php

namespace frontend\modules\hq\models;
use frontend\modules\hq\models\Persian;

use Yii;
use yii\db\ActiveRecord;
use yii\data\ActiveDataProvider;

class HrmContract extends ActiveRecord
{
    // انواع قرارداد
    const TYPE_TEMPORARY = 1;   // موقت
    const TYPE_HOURLY = 2;      // ساعتی
    const TYPE_PROJECT = 3;     // پیمانکاری

    // وضعیت قرارداد
    const STATUS_DRAFT = 0;
    const STATUS_ACTIVE = 1;
    const STATUS_EXPIRED = 2;
    const STATUS_CANCELLED = 3;

    // حالت قراردادی
    const MODE_STAFF = 1;       // ستادی
    const MODE_TRANSPORT = 2;   // حمل و نقل

    // نوع شخصیت
    const PERSON_INDIVIDUAL = 1;
    const PERSON_CORPORATE = 2;

    // وضعیت تاهل
    const MARITAL_SINGLE = 1;
    const MARITAL_MARRIED = 2;
    const MARITAL_DIVORCED = 3;

    // جنسیت
    const GENDER_MALE = 1;
    const GENDER_FEMALE = 2;

    public static function tableName()
    {
        return 'hrm_contracts';
    }

    public function rules()
    {
        return [
            [['contract_type'], 'required'],
            [
                ['user_id'],
                'required',
                'when' => function ($model) {
                    return $model->has_user == 1;
                },
                'whenClient' => "function (attribute, value) {
                return $('#has_user').val() == 1;
            }"
            ],
            [
                [
                    'user_id',
                    'contract_type',
                    'contract_status',
                    'employer_id',
                    'contract_mode',
                    'person_type',
                    'marital_status',
                    'gender',
                    'state_id',
                    'city_id',
                    'agent_id',
                    'has_introducer',
                    'has_trial_period',
                    'job_position_id',
                    'parent_contract_id',
                    'created_by',
                    'approved_by',
                    'minimum_hours_period',
                    'contract_payment_type',
                    'has_user',
                    'company_type',
                    'company_position',
                    'child_count',
                ],
                'integer'
            ],

            [
                [
                    'birth_date',
                    'contract_from_date',
                    'contract_to_date',
                    'contract_unvalid_date',
                    'trial_from_date',
                    'trial_to_date',
                    'approved_at',
                    'created_at',
                    'updated_at',
                    'agreement_date',
                ],
                'safe'
            ],
            [['address', 'introducer_address', 'description', 'job_position_ids'], 'safe'],
            [
                [
                    'base_salary',
                    'child_allowance',
                    'housing_allowance',
                    'welfare_allowance',
                    'seniority_allowance',
                    'performance_bonus',
                    'responsibility_allowance',
                    'transportation_allowance',
                    'other_allowance',
                    'total_salary',
                    'hourly_salary',
                    'hourly_housing_allowance',
                    'hourly_welfare_allowance',
                    'hourly_child_allowance',
                    'hourly_seniority_allowance',
                    'hourly_bonus',
                    'hourly_leave_salary',
                    'hourly_performance_bonus',
                    'contract_amount',
                ],
                'number'
            ],
            [
                [
                    'first_name',
                    'last_name',
                    'father_name',
                    'shenasname_city',
                    'introducer_first_name',
                    'introducer_last_name',
                    'introducer_relation',
                    'title',
                    'service_subject',
                    'personnel_code',
                    'company_name',
                    'company_registration_number',
                    'phone_prefix',
                    'introducer_phone_prefix',
                    'minimum_hours_unit',
                ],
                'string',
                'max' => 255
            ],
            [['national_code', 'postal_code'], 'string', 'max' => 10],
            [['shenasname_number'], 'string', 'max' => 50],
            [['phone', 'mobile', 'introducer_phone', 'introducer_mobile'], 'string', 'max' => 15],
            [
                [
                    'birth_date_persian',
                    'contract_from_date_persian',
                    'agreement_date_persian',
                    'contract_to_date_persian',
                    'contract_unvalid_date_persian',
                    'trial_from_date_persian',
                    'trial_to_date_persian'
                ],
                'string',
                'max' => 10
            ],
            [
                [
                    'workgroup_id',
                    'bakhsh_id',
                    'ghesmat_id',
                    'onvan_id',
                ],
                'integer'
            ],
            [['is_terminated', 'termination_date', 'termination_date_persian', 'termination_reason'], 'safe'],

            ['contract_duration_months', 'default', 'value' => 0],
            ['contract_duration_days', 'default', 'value' => 0],
        ];
    }

    public function attributeLabels()
    {
        return [
            'id' => 'شناسه',
            'user_id' => 'پرسنل',
            'contract_type' => 'نوع قرارداد',
            'contract_status' => 'وضعیت قرارداد',
            'employer_id' => 'کارفرما',
            'title' => 'عنوان قرارداد',
            'contract_mode' => 'حالت قراردادی',
            'person_type' => 'نوع شخصیت',
            'first_name' => 'نام',
            'last_name' => 'نام خانوادگی',
            'father_name' => 'نام پدر',
            'national_code' => 'کد ملی',
            'shenasname_number' => 'شماره شناسنامه',
            'shenasname_city' => 'محل صدور شناسنامه',
            'birth_date' => 'تاریخ تولد',
            'birth_date_persian' => 'تاریخ تولد (شمسی)',
            'marital_status' => 'وضعیت تاهل',
            'gender' => 'جنسیت',
            'address' => 'آدرس',
            'postal_code' => 'کد پستی',
            'phone' => 'تلفن ثابت',
            'mobile' => 'موبایل',
            'state_id' => 'استان',
            'city_id' => 'شهر',
            'agent_id' => 'نمایندگی',
            'has_introducer' => 'دارای معرف',
            'introducer_first_name' => 'نام معرف',
            'introducer_last_name' => 'نام خانوادگی معرف',
            'introducer_phone' => 'تلفن معرف',
            'introducer_phone_prefix' => 'پیش‌شماره تلفن معرف',
            'introducer_mobile' => 'موبایل معرف',
            'introducer_relation' => 'نسبت معرف',
            'introducer_address' => 'آدرس معرف',
            'contract_duration_months' => 'مدت قرارداد (ماه)',
            'contract_duration_days' => 'مدت قرارداد (روز)',
            'contract_from_date' => 'تاریخ شروع قرارداد',
            'contract_from_date_persian' => 'تاریخ شروع قرارداد (شمسی)',
            'contract_to_date' => 'تاریخ پایان قرارداد',
            'contract_to_date_persian' => 'تاریخ پایان قرارداد (شمسی)',
            'contract_unvalid_date' => 'تاریخ عدم اعتبار قرارداد',
            'contract_unvalid_date_persian' => 'تاریخ عدم اعتبار قرارداد (شمسی)',
            'has_trial_period' => 'دوره آزمایشی',
            'trial_from_date' => 'دوره آزمایشی از',
            'trial_from_date_persian' => 'دوره آزمایشی از (شمسی)',
            'trial_to_date' => 'دوره آزمایشی تا',
            'trial_to_date_persian' => 'دوره آزمایشی تا (شمسی)',
            'job_position_id' => 'سمت شغلی',
            'job_position_ids' => 'سمت شغلی (مالتی)',
            'base_salary' => 'مزد ماهانه',
            'child_allowance' => 'حق اولاد',
            'housing_allowance' => 'کمک هزینه مسکن',
            'welfare_allowance' => 'مزایای رفاهی و انگیزشی',
            'seniority_allowance' => 'حق سنوات',
            'performance_bonus' => 'پاداش عملکرد',
            'responsibility_allowance' => 'حق مسئولیت',
            'transportation_allowance' => 'کمک ایاب و ذهاب',
            'other_allowance' => 'سایر',
            'total_salary' => 'مجموع حق السعی',
            'description' => 'توضیحات',
            'parent_contract_id' => 'قرارداد والد',

            'is_terminated' => 'قطع همکاری',
            'termination_date' => 'تاریخ قطع همکاری',
            'termination_date_persian' => 'تاریخ قطع همکاری (شمسی)',
            'termination_reason' => 'دلیل قطع همکاری',
            'created_by' => 'ایجاد کننده',
            'approved_by' => 'تایید کننده',
            'approved_at' => 'تاریخ تایید',
            'created_at' => 'تاریخ ثبت',
            'updated_at' => 'تاریخ ویرایش',
            'service_subject' => 'موضوع قرارداد',

            'agreement_date' => 'تاریخ توافق',
            'agreement_date_persian' => 'تاریخ توافق (شمسی)',

            'minimum_hours' => 'حداقل کارکرد',
            'minimum_hours_unit' => 'واحد حداقل کارکرد',
            'minimum_hours_period' => 'دوره کارکرد',

            'hourly_salary' => 'مزد ساعتی',
            'hourly_housing_allowance' => 'کمک هزینه مسکن ساعتی',
            'hourly_welfare_allowance' => 'مزایای رفاهی ساعتی',
            'hourly_child_allowance' => 'حق اولاد ساعتی',
            'hourly_seniority_allowance' => 'حق سنوات ساعتی',
            'hourly_bonus' => 'حق عیدی',
            'hourly_leave_salary' => 'مزد مرخصی',
            'hourly_performance_bonus' => 'پاداش عملکرد ساعتی',

            'contract_amount' => 'مبلغ قرارداد',
            'contract_payment_type' => 'نحوه پرداخت مبلغ قرارداد',

            // ===== فیلدهای جدید =====
            'has_user' => 'اختصاص کاربر',
            'personnel_code' => 'کد پرسنلی',
            'company_name' => 'نام شخص حقوقی',
            'company_registration_number' => 'شماره ثبت',
            'company_type' => 'نوع شخص حقوقی',
            'company_position' => 'سمت طرف قرارداد',
            'child_count' => 'تعداد فرزند',
            'phone_prefix' => 'پیش‌شماره تلفن',

            'workgroup_id' => 'گروه کاری',
            'bakhsh_id' => 'بخش',
            'ghesmat_id' => 'قسمت',
            'onvan_id' => 'عنوان (سمت شغلی)',
        ];
    }

    // ============== روابط ==============



    public function getUser()
    {
        return $this->hasOne(User::class, ['id' => 'user_id']);
    }

    public function getEmployer()
    {
        return $this->hasOne(Company::class, ['id' => 'employer_id']);
    }

    public function getState()
    {
        return $this->hasOne(State::class, ['id' => 'state_id']);
    }

    public function getCity()
    {
        return $this->hasOne(City::class, ['id' => 'city_id']);
    }

    public function getAgent()
    {
        return $this->hasOne(City::class, ['id' => 'agent_id']); // اگر مدل Agent وجود دارد
    }

    public function getJobPosition()
    {
        return $this->hasOne(Group::class, ['id' => 'job_position_id']);
    }

    public function getParentContract()
    {
        return $this->hasOne(self::class, ['id' => 'parent_contract_id']);
    }

    public function getCreatedBy()
    {
        return $this->hasOne(User::class, ['id' => 'created_by']);
    }

    public function getApprovedBy()
    {
        return $this->hasOne(User::class, ['id' => 'approved_by']);
    }

    public function getWorkgroup()
    {
        return $this->hasOne(HrmWorkgroup::class, ['id' => 'workgroup_id']);
    }

    public function getBakhsh()
    {
        return $this->hasOne(HrmWorkgroupBakhsh::class, ['id' => 'bakhsh_id']);
    }

    public function getGhesmat()
    {
        return $this->hasOne(HrmWorkgroupGhesmat::class, ['id' => 'ghesmat_id']);
    }

    public function getOnvan()
    {
        return $this->hasOne(HrmWorkgroupOnvan::class, ['id' => 'onvan_id']);
    }

    // ============== متدهای کمکی ==============
// HrmContract.php

    public static function updateWorkGroup($id)
    {
        $params = Yii::$app->request->post();

        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'قرارداد یافت نشد'];
        }

        $model->workgroup_id = $params['workgroup_id'] ?? null;
        $model->bakhsh_id = $params['bakhsh_id'] ?? null;
        $model->ghesmat_id = $params['ghesmat_id'] ?? null;
        $model->onvan_id = $params['onvan_id'] ?? null;

        if ($model->save()) {
            return ['success' => true, 'data' => $model];
        }

        return ['success' => false, 'errors' => $model->errors];
    }

    public function getContractLabel($contract_type)
    {
        if ($contract_type == 1) {
            return 'موقت';
        }
        if ($contract_type == 2) {
            return 'ساعتی';
        }
        if ($contract_type == 3) {
            return 'پیمانکاری';
        }
    }
    public function getContractTypeLabel()
    {

        $types = [
            self::TYPE_TEMPORARY => 'موقت',
            self::TYPE_HOURLY => 'ساعتی',
            self::TYPE_PROJECT => 'پیمانکاری',
        ];
        return $types[$this->contract_type] ?? 'نامشخص';
    }

    public function getContractStatusLabel()
    {
        $statuses = [
            self::STATUS_DRAFT => 'پیش نویس',
            self::STATUS_ACTIVE => 'تایید شده',
            self::STATUS_EXPIRED => 'منقضی',
            self::STATUS_CANCELLED => 'لغو شده',
        ];
        return $statuses[$this->contract_status] ?? 'نامشخص';
    }

    public function getContractModeLabel()
    {
        $modes = [
            self::MODE_STAFF => 'ستادی',
            self::MODE_TRANSPORT => 'حمل و نقل',
        ];
        return $modes[$this->contract_mode] ?? 'نامشخص';
    }

    public function getPersonTypeLabel()
    {
        $types = [
            self::PERSON_INDIVIDUAL => 'حقیقی',
            self::PERSON_CORPORATE => 'حقوقی',
        ];
        return $types[$this->person_type] ?? 'نامشخص';
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

    public function getGenderLabel()
    {
        $genders = [
            self::GENDER_MALE => 'مرد',
            self::GENDER_FEMALE => 'زن',
        ];
        return $genders[$this->gender] ?? 'نامشخص';
    }

    // ============== متدهای API ==============

    public static function get_all()
    {
        //User::checkAccess(702);

        $params = Yii::$app->request->get();
        $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
        $page = isset($params['page']) ? (int) $params['page'] : 1;

        $query = self::find()
            ->with(['user', 'employer', 'state', 'city', 'agent', 'jobPosition', 'createdBy', 'approvedBy', 'workgroup', 'bakhsh', 'ghesmat', 'onvan'])
            ->orderBy(['id' => SORT_DESC]);

        // فیلتر بر اساس کاربر
        if (!empty($params['user_id'])) {
            $query->andWhere(['user_id' => $params['user_id']]);
        }

        // فیلتر بر اساس نوع قرارداد
        if (!empty($params['contract_type'])) {
            $query->andWhere(['contract_type' => $params['contract_type']]);
        }

        if (!empty($params['employer_id'])) {
            $query->andWhere(['employer_id' => $params['employer_id']]);
        }

        // فیلتر بر اساس نوع قرارداد
        if (!empty($params['personnel_code'])) {
            $query->andWhere(['personnel_code' => $params['personnel_code']]);
        }

        // فیلتر بر اساس وضعیت
        if (isset($params['contract_status']) && $params['contract_status'] !== '') {
            $query->andWhere(['contract_status' => $params['contract_status']]);
        }

        // فیلتر بر اساس کد ملی
        if (!empty($params['national_code'])) {
            $query->andWhere(['like', 'national_code', $params['national_code']]);
        }

        // فیلتر بر اساس نام
        if (!empty($params['first_name'])) {
            $query->andWhere(['like', 'first_name', $params['first_name']]);
        }
        if (!empty($params['last_name'])) {
            $query->andWhere(['like', 'last_name', $params['last_name']]);
        }

        $totalCount = $query->count();

        $models = $query
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->asArray()
            ->all();

        // اضافه کردن اطلاعات روابط
        foreach ($models as &$model) {


            User::syncPersonnelCode($model['user_id']);
            $model['user'] = User::find()->where(['id' => $model['user_id']])->asArray()->one();
            $model['employer'] = Company::find()->where(['id' => $model['employer_id']])->asArray()->one();
            $model['state'] = State::find()->where(['id' => $model['state_id']])->asArray()->one();
            $model['city'] = City::find()->where(['id' => $model['city_id']])->asArray()->one();
            //if ($model['agent_id']) {
            //  $model['agent'] = Agent::find()->where(['id' => $model['agent_id']])->asArray()->one();
            //}
            $model['jobPosition'] = Group::find()->where(['id' => $model['job_position_id']])->asArray()->one();
            $model['createdBy'] = User::find()->where(['id' => $model['created_by']])->asArray()->one();
            $model['approvedBy'] = User::find()->where(['id' => $model['approved_by']])->asArray()->one();

            // دیکود کردن job_position_ids
            if (!empty($model['job_position_ids'])) {
                $model['job_position_ids'] = json_decode($model['job_position_ids'], true);
            } else {
                $model['job_position_ids'] = [];
            }

            $dateFields = ['birth_date', 'contract_from_date', 'contract_to_date', 'contract_unvalid_date', 'trial_from_date', 'trial_to_date'];

            foreach ($dateFields as $field) {
                if (!empty($model[$field])) {
                    $model[$field . '_persian'] = Persian::convert_date_to_fa($model[$field]);
                } else {
                    $model[$field . '_persian'] = null;
                }
            }
        }

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
            $model = new self();
            $model->contract_status = self::STATUS_DRAFT;
            $model->created_by = Yii::$app->user->id;
        } else {
            $model = self::findOne($id);
            if (!$model) {
                return ['success' => false, 'message' => 'قرارداد یافت نشد'];
            }
        }

        // ===== پردازش تلفن =====
        // اگر phone_prefix و phone هر دو وجود دارند، phone را بدون پیش‌شماره ذخیره کن
        if (isset($params['phone_prefix']) && isset($params['phone'])) {
            // فقط شماره را ذخیره کن (بدون پیش‌شماره)
            $params['phone'] = $params['phone'];
        }
        // اگر phone_prefix وجود دارد ولی phone خالی است، phone را null کن
        if (isset($params['phone_prefix']) && empty($params['phone'])) {
            $params['phone'] = null;
        }

        // ===== پردازش تلفن معرف =====
        if (isset($params['introducer_phone_prefix']) && isset($params['introducer_phone'])) {
            // فقط شماره را ذخیره کن (بدون پیش‌شماره)
            $params['introducer_phone'] = $params['introducer_phone'];
        }
        if (isset($params['introducer_phone_prefix']) && empty($params['introducer_phone'])) {
            $params['introducer_phone'] = null;
        }

        // ===== پردازش job_position_ids به JSON =====
        if (isset($params['job_position_ids']) && is_array($params['job_position_ids'])) {
            $params['job_position_ids'] = json_encode($params['job_position_ids']);
        }

        // ===== تنظیم مقدار پیش‌فرض برای has_user =====
        if (!isset($params['has_user'])) {
            $params['has_user'] = 0;
        }

        // محاسبه مجموع حق السعی (نوع موقت)
        if (
            isset($params['base_salary']) || isset($params['child_allowance']) ||
            isset($params['housing_allowance']) || isset($params['welfare_allowance']) ||
            isset($params['seniority_allowance']) || isset($params['performance_bonus']) ||
            isset($params['responsibility_allowance']) || isset($params['transportation_allowance']) ||
            isset($params['other_allowance'])
        ) {
            $total = 0;
            $total += isset($params['base_salary']) ? (float) $params['base_salary'] : 0;
            $total += isset($params['child_allowance']) ? (float) $params['child_allowance'] : 0;
            $total += isset($params['housing_allowance']) ? (float) $params['housing_allowance'] : 0;
            $total += isset($params['welfare_allowance']) ? (float) $params['welfare_allowance'] : 0;
            $total += isset($params['seniority_allowance']) ? (float) $params['seniority_allowance'] : 0;
            $total += isset($params['performance_bonus']) ? (float) $params['performance_bonus'] : 0;
            $total += isset($params['responsibility_allowance']) ? (float) $params['responsibility_allowance'] : 0;
            $total += isset($params['transportation_allowance']) ? (float) $params['transportation_allowance'] : 0;
            $total += isset($params['other_allowance']) ? (float) $params['other_allowance'] : 0;

            $params['total_salary'] = $total;
        }

        // محاسبه مجموع حق السعی (نوع ساعتی)
        if (($params['contract_type'] ?? null) == self::TYPE_HOURLY) {
            $params['total_salary'] =
                (float) ($params['hourly_salary'] ?? 0)
                + (float) ($params['hourly_housing_allowance'] ?? 0)
                + (float) ($params['hourly_welfare_allowance'] ?? 0)
                + (float) ($params['hourly_child_allowance'] ?? 0)
                + (float) ($params['hourly_seniority_allowance'] ?? 0)
                + (float) ($params['hourly_bonus'] ?? 0)
                + (float) ($params['hourly_leave_salary'] ?? 0)
                + (float) ($params['hourly_performance_bonus'] ?? 0);
        }

        if ($model->load($params, '') && $model->save()) {
            $model->job_position_ids = json_decode($model->job_position_ids, true) ?: [];

            if (!empty($params['user_id'])) {
                $user = User::findOne($params['user_id']);
                if (!empty($params['personnel_code'])) {
                    User::updatePersonnelCode($params['user_id'], $params['personnel_code']);
                }
                if ($user) {
                    if (!empty($params['personnel_code'])) {
                        $user->personnel_code = $params['personnel_code'];
                    }

                    if (!empty($params['national_code'])) {
                        $user->national_id = $params['national_code'];
                    }

                    if (!empty($params['first_name'])) {
                        $user->first_name = $params['first_name'];
                    }

                    if (!empty($params['last_name'])) {
                        $user->last_name = $params['last_name'];
                    }
                }
                $user->save(false);


            }




            return ['success' => true, 'data' => $model];
        }

        return ['success' => false, 'errors' => $model->errors];
    }

    // ===== اصلاح: متد view برای برگرداندن تلفن به فرمت صحیح =====
    public static function _view($id)
    {
        $model = self::find()
            ->with(['user', 'employer', 'state', 'city', 'agent', 'jobPosition', 'createdBy', 'approvedBy'])
            ->where(['id' => $id])
            ->asArray()
            ->one();

        if (!$model) {
            return ['success' => false, 'message' => 'قرارداد یافت نشد'];
        }

        $model['user'] = User::find()->where(['id' => $model['user_id']])->asArray()->one();
        $model['employer'] = Company::find()->where(['id' => $model['employer_id']])->asArray()->one();
        $model['state'] = State::find()->where(['id' => $model['state_id']])->asArray()->one();
        $model['city'] = City::find()->where(['id' => $model['city_id']])->asArray()->one();
        if ($model['agent_id']) {
            $model['agent'] = City::find()->where(['id' => $model['agent_id']])->asArray()->one();
        }
        $model['jobPosition'] = Group::find()->where(['id' => $model['job_position_id']])->asArray()->one();

        if (!empty($model['job_position_ids'])) {
            $model['job_position_ids'] = json_decode($model['job_position_ids'], true);
        } else {
            $model['job_position_ids'] = [];
        }

        $dateFields = ['birth_date', 'contract_from_date', 'contract_to_date', 'contract_unvalid_date', 'trial_from_date', 'trial_to_date'];

        foreach ($dateFields as $field) {
            if (!empty($model[$field])) {
                $model[$field . '_persian'] = Persian::convert_date_to_fa($model[$field]);
            } else {
                $model[$field . '_persian'] = null;
            }
        }

        // ===== اطمینان از اینکه phone و introducer_phone بدون پیش‌شماره برگردانده شوند =====
        // phone_prefix در جای خودش ذخیره شده و phone فقط شماره است

        return ['success' => true, 'data' => $model];
    }

    // ===== متد جدید: جستجوی دقیق برای همکاری مجدد =====
    public static function searchForRenew()
    {
        $params = Yii::$app->request->get();

        $query = self::find()
            ->with(['user', 'employer', 'state', 'city', 'jobPosition'])
            ->orderBy(['id' => SORT_DESC]);

        // ===== جستجوی دقیق (exact match) =====

        // کد ملی - دقیق
        if (!empty($params['national_code'])) {
            $query->andWhere(['national_code' => $params['national_code']]);
        }

        // کد پرسنلی - دقیق
        if (!empty($params['personnel_code'])) {
            $query->andWhere(['personnel_code' => $params['personnel_code']]);
        }

        // نوع قرارداد
        if (!empty($params['contract_type'])) {
            $query->andWhere(['contract_type' => $params['contract_type']]);
        }

        // گروه کاری - از طریق JOIN با جدول گروه کاری
        if (!empty($params['workgroup_id'])) {
            // اگر فیلد workgroup_id در جدول hrm_contracts وجود دارد
            $query->andWhere(['workgroup_id' => $params['workgroup_id']]);
        }

        // ===== اگر هیچ فیلتری پر نشده، خالی برگردان =====
        if (
            empty($params['national_code']) && empty($params['personnel_code']) &&
            empty($params['contract_type']) && empty($params['workgroup_id'])
        ) {
            return [
                'pages' => 0,
                'totalCount' => 0,
                'data' => [],
            ];
        }

        $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
        $page = isset($params['page']) ? (int) $params['page'] : 1;

        $totalCount = $query->count();

        $models = $query
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->asArray()
            ->all();

        // اضافه کردن اطلاعات روابط
        foreach ($models as &$model) {
            $model['user'] = User::find()->where(['id' => $model['user_id']])->asArray()->one();
            $model['employer'] = Company::find()->where(['id' => $model['employer_id']])->asArray()->one();
            $model['state'] = State::find()->where(['id' => $model['state_id']])->asArray()->one();
            $model['city'] = City::find()->where(['id' => $model['city_id']])->asArray()->one();
            $model['jobPosition'] = Group::find()->where(['id' => $model['job_position_id']])->asArray()->one();

            $dateFields = ['birth_date', 'contract_from_date', 'contract_to_date', 'contract_unvalid_date', 'trial_from_date', 'trial_to_date'];

            foreach ($dateFields as $field) {
                if (!empty($model[$field])) {
                    $model[$field . '_persian'] = Persian::convert_date_to_fa($model[$field]);
                } else {
                    $model[$field . '_persian'] = null;
                }
            }
        }

        return [
            'pages' => ceil($totalCount / $perPage),
            'totalCount' => $totalCount,
            'data' => $models,
        ];
    }

    public static function _delete($id)
    {
        //User::checkAccess(704);

        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'قرارداد یافت نشد'];
        }

        $model->delete();
        return ['success' => true];
    }

    public static function approve($id)
    {
        //User::checkAccess(703);

        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'قرارداد یافت نشد'];
        }

        $model->contract_status = self::STATUS_ACTIVE;
        $model->approved_by = Yii::$app->user->id;
        $model->approved_at = date('Y-m-d H:i:s');
        $model->save();

        return ['success' => true, 'data' => $model];
    }

    public static function renew($id)
    {
        //User::checkAccess(701);

        $oldContract = self::findOne($id);
        if (!$oldContract) {
            return ['success' => false, 'message' => 'قرارداد والد یافت نشد'];
        }

        $params = Yii::$app->request->post();

        $newContract = new self();

        // ===== کپی کردن تمام attributes از قرارداد قبلی =====
        $newContract->attributes = $oldContract->attributes;
        $newContract->id = null;
        $newContract->parent_contract_id = $oldContract->id;
        $newContract->contract_status = self::STATUS_DRAFT; // ✅ به جای ACTIVE، پیش‌نویس
        $newContract->created_by = Yii::$app->user->id;
        $newContract->approved_by = null;
        $newContract->approved_at = null;
        $newContract->created_at = date('Y-m-d H:i:s');
        $newContract->updated_at = null;

        // ===== پردازش job_position_ids به JSON =====
        if (isset($params['job_position_ids']) && is_array($params['job_position_ids'])) {
            $params['job_position_ids'] = json_encode($params['job_position_ids']);
        }

        // ===== تنظیم مقدار پیش‌فرض برای has_user =====
        if (!isset($params['has_user'])) {
            $params['has_user'] = 0;
        }

        // ===== پردازش تلفن =====
        // اگر phone_prefix و phone هر دو وجود دارند
        if (isset($params['phone_prefix']) && isset($params['phone'])) {
            $params['phone'] = $params['phone'];
        }
        if (isset($params['phone_prefix']) && empty($params['phone'])) {
            $params['phone'] = null;
        }

        // ===== پردازش تلفن معرف =====
        if (isset($params['introducer_phone_prefix']) && isset($params['introducer_phone'])) {
            $params['introducer_phone'] = $params['introducer_phone'];
        }
        if (isset($params['introducer_phone_prefix']) && empty($params['introducer_phone'])) {
            $params['introducer_phone'] = null;
        }

        // ===== بارگذاری تمام فیلدهای ارسال شده =====
        // لیست فیلدهایی که از فرم می‌آیند
        $fields = [
            'title',
            'description',
            'employer_id',
            'contract_type',
            'contract_mode',
            'user_id',
            'has_user',
            'personnel_code',
            'person_type',
            'first_name',
            'last_name',
            'father_name',
            'national_code',
            'shenasname_number',
            'shenasname_city',
            'birth_date',
            'marital_status',
            'gender',
            'address',
            'postal_code',
            'phone',
            'phone_prefix',
            'mobile',
            'company_name',
            'company_registration_number',
            'company_type',
            'company_position',
            'child_count',
            'state_id',
            'city_id',
            'agent_id',
            'has_introducer',
            'introducer_first_name',
            'introducer_last_name',
            'introducer_phone',
            'introducer_phone_prefix',
            'introducer_mobile',
            'introducer_relation',
            'introducer_address',
            'service_subject',
            'contract_duration_months',
            'contract_duration_days',
            'contract_from_date',
            'contract_to_date',
            'contract_unvalid_date',
            'has_trial_period',
            'trial_from_date',
            'trial_to_date',
            'agreement_date',
            'minimum_hours',
            'minimum_hours_unit',
            'minimum_hours_period',
            'job_position_ids',
            // حق‌السعی نوع موقت
            'base_salary',
            'child_allowance',
            'housing_allowance',
            'welfare_allowance',
            'seniority_allowance',
            'performance_bonus',
            'responsibility_allowance',
            'transportation_allowance',
            'other_allowance',
            // حق‌السعی نوع ساعتی
            'hourly_salary',
            'hourly_housing_allowance',
            'hourly_welfare_allowance',
            'hourly_child_allowance',
            'hourly_seniority_allowance',
            'hourly_bonus',
            'hourly_leave_salary',
            'hourly_performance_bonus',
            // حق‌السعی نوع پیمانکاری
            'contract_amount',
            'contract_payment_type',
        ];

        // بارگذاری فیلدها از params
        foreach ($fields as $field) {
            if (isset($params[$field])) {
                $newContract->$field = $params[$field];
            }
        }

        // ===== محاسبه مجموع حق‌السعی (نوع موقت) =====
        if (isset($params['contract_type']) && $params['contract_type'] == self::TYPE_TEMPORARY) {
            $total = 0;
            $total += isset($params['base_salary']) ? (float) $params['base_salary'] : 0;
            $total += isset($params['child_allowance']) ? (float) $params['child_allowance'] : 0;
            $total += isset($params['housing_allowance']) ? (float) $params['housing_allowance'] : 0;
            $total += isset($params['welfare_allowance']) ? (float) $params['welfare_allowance'] : 0;
            $total += isset($params['seniority_allowance']) ? (float) $params['seniority_allowance'] : 0;
            $total += isset($params['performance_bonus']) ? (float) $params['performance_bonus'] : 0;
            $total += isset($params['responsibility_allowance']) ? (float) $params['responsibility_allowance'] : 0;
            $total += isset($params['transportation_allowance']) ? (float) $params['transportation_allowance'] : 0;
            $total += isset($params['other_allowance']) ? (float) $params['other_allowance'] : 0;
            $newContract->total_salary = $total;
        }

        // ===== محاسبه مجموع حق‌السعی (نوع ساعتی) =====
        if (isset($params['contract_type']) && $params['contract_type'] == self::TYPE_HOURLY) {
            $newContract->total_salary =
                (float) ($params['hourly_salary'] ?? 0)
                + (float) ($params['hourly_housing_allowance'] ?? 0)
                + (float) ($params['hourly_welfare_allowance'] ?? 0)
                + (float) ($params['hourly_child_allowance'] ?? 0)
                + (float) ($params['hourly_seniority_allowance'] ?? 0)
                + (float) ($params['hourly_bonus'] ?? 0)
                + (float) ($params['hourly_leave_salary'] ?? 0)
                + (float) ($params['hourly_performance_bonus'] ?? 0);
        }

        // ===== تاریخ‌های شمسی =====
        if (!empty($params['contract_from_date'])) {
            $newContract->contract_from_date_persian = $params['contract_from_date_persian'] ?? null;
        }
        if (!empty($params['contract_to_date'])) {
            $newContract->contract_to_date_persian = $params['contract_to_date_persian'] ?? null;
        }
        if (!empty($params['contract_unvalid_date'])) {
            $newContract->contract_unvalid_date_persian = $params['contract_unvalid_date_persian'] ?? null;
        }
        if (!empty($params['trial_from_date'])) {
            $newContract->trial_from_date_persian = $params['trial_from_date_persian'] ?? null;
        }
        if (!empty($params['trial_to_date'])) {
            $newContract->trial_to_date_persian = $params['trial_to_date_persian'] ?? null;
        }
        if (!empty($params['agreement_date'])) {
            $newContract->agreement_date_persian = $params['agreement_date_persian'] ?? null;
        }
        if (!empty($params['birth_date'])) {
            $newContract->birth_date_persian = $params['birth_date_persian'] ?? null;
        }
        $newContract->contract_status = 0;
        if ($newContract->save()) {
            // برای بازگشت، job_position_ids را دیکود کن
            $newContract->job_position_ids = json_decode($newContract->job_position_ids, true) ?: [];

            if (!empty($params['personnel_code']) && !empty($params['user_id'])) {
                User::updatePersonnelCode($params['user_id'], $params['personnel_code']);
            }
            return ['success' => true, 'data' => $newContract];
        }

        return ['success' => false, 'errors' => $newContract->errors];
    }

    public static function getExpiringContracts($days = 30)
    {
        User::checkAccess(702);

        $params = Yii::$app->request->get();
        $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
        $page = isset($params['page']) ? (int) $params['page'] : 1;

        $query = self::find()
            ->with(['user', 'employer', 'state', 'city', 'jobPosition'])
            ->where(['contract_status' => self::STATUS_ACTIVE])
            ->andWhere(['is_terminated' => 0])
            ->andWhere(['between', 'contract_to_date', date('Y-m-d'), date('Y-m-d', strtotime("+{$days} days"))])
            ->orderBy(['contract_to_date' => SORT_ASC]);

        // اعمال فیلترها
        if (!empty($params['user_id'])) {
            $query->andWhere(['user_id' => $params['user_id']]);
        }
        if (!empty($params['national_code'])) {
            $query->andWhere(['like', 'national_code', $params['national_code']]);
        }
        if (!empty($params['first_name'])) {
            $query->andWhere(['like', 'first_name', $params['first_name']]);
        }
        if (!empty($params['last_name'])) {
            $query->andWhere(['like', 'last_name', $params['last_name']]);
        }
        if (!empty($params['employer_id'])) {
            $query->andWhere(['employer_id' => $params['employer_id']]);
        }
        if (!empty($params['contract_type'])) {
            $query->andWhere(['contract_type' => $params['contract_type']]);
        }
        if (!empty($params['date_from'])) {
            $query->andWhere(['>=', 'contract_to_date', $params['date_from']]);
        }
        if (!empty($params['date_to'])) {
            $query->andWhere(['<=', 'contract_to_date', $params['date_to']]);
        }

        $totalCount = $query->count();

        $models = $query
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->asArray()
            ->all();

        foreach ($models as &$model) {
            $model['user'] = User::find()->where(['id' => $model['user_id']])->asArray()->one();
            $model['employer'] = Company::find()->where(['id' => $model['employer_id']])->asArray()->one();
            $model['contract_to_date_persian'] = Persian::convert_date_to_fa($model['contract_to_date']);

            if (!empty($model['termination_date'])) {
                $model['termination_date_persian'] = Persian::convert_date_to_fa($model['termination_date']);
            }
        }

        return [
            'pages' => ceil($totalCount / $perPage),
            'totalCount' => $totalCount,
            'data' => $models,
        ];
    }

    public static function terminate($id)
    {
        User::checkAccess(703);

        $params = Yii::$app->request->post();

        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'قرارداد یافت نشد'];
        }

        $model->is_terminated = 1;
        $model->termination_date = $params['termination_date'] ?? date('Y-m-d');
        $model->termination_date_persian = !empty($params['termination_date'])
            ? Persian::convert_date_to_fa($params['termination_date'])
            : Persian::convert_date_to_fa(date('Y-m-d'));
        $model->termination_reason = $params['termination_reason'] ?? null;
        $model->contract_status = self::STATUS_EXPIRED;
        $model->save();

        return ['success' => true, 'data' => $model];
    }

    public static function getTerminatedReport()
    {
        User::checkAccess(702);

        $params = Yii::$app->request->get();
        $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
        $page = isset($params['page']) ? (int) $params['page'] : 1;

        $query = self::find()
            ->with(['user', 'employer', 'state', 'city', 'jobPosition'])
            ->where([
                'or',
                ['is_terminated' => 1],
                ['<=', 'contract_to_date', date('Y-m-d')]
            ])
            ->orderBy(['id' => SORT_DESC]);

        // فیلترها
        if (!empty($params['user_id'])) {
            $query->andWhere(['user_id' => $params['user_id']]);
        }
        if (!empty($params['national_code'])) {
            $query->andWhere(['like', 'national_code', $params['national_code']]);
        }
        if (!empty($params['first_name'])) {
            $query->andWhere(['like', 'first_name', $params['first_name']]);
        }
        if (!empty($params['last_name'])) {
            $query->andWhere(['like', 'last_name', $params['last_name']]);
        }
        if (!empty($params['employer_id'])) {
            $query->andWhere(['employer_id' => $params['employer_id']]);
        }
        if (!empty($params['contract_type'])) {
            $query->andWhere(['contract_type' => $params['contract_type']]);
        }
        if (!empty($params['date_from'])) {
            $query->andWhere(['>=', 'termination_date', $params['date_from']]);
        }
        if (!empty($params['date_to'])) {
            $query->andWhere(['<=', 'termination_date', $params['date_to']]);
        }

        $totalCount = $query->count();

        $models = $query
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->asArray()
            ->all();

        foreach ($models as &$model) {
            $model['user'] = User::find()->where(['id' => $model['user_id']])->asArray()->one();
            $model['employer'] = Company::find()->where(['id' => $model['employer_id']])->asArray()->one();
            $model['contract_to_date_persian'] = Persian::convert_date_to_fa($model['contract_to_date']);
            if (!empty($model['termination_date'])) {
                $model['termination_date_persian'] = Persian::convert_date_to_fa($model['termination_date']);
            }
        }

        return [
            'pages' => ceil($totalCount / $perPage),
            'totalCount' => $totalCount,
            'data' => $models,
        ];
    }
}