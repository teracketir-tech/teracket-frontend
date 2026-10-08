<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;
use yii\data\ActiveDataProvider;
use yii\web\UnauthorizedHttpException;

class HrmProcess extends ActiveRecord
{
    const STATUS_UPLOADED  = 0; // ثبت از اکسل، هنوز محاسبه نشده
    const STATUS_CALCULATED = 1; // محاسبه شد

    public static function tableName()
    {
        return 'hrm_process';
    }

    public function rules()
    {
        return [
            [['user_id', 'contract_id', 'year', 'month', 'date_from', 'date_to'], 'required'],
            [['user_id', 'contract_id', 'workgroup_id', 'year', 'month', 'count', 'status', 'created_by'], 'integer'],
            [['unit_price'], 'number', 'min' => 0],
            [['date_from', 'date_to', 'created_at', 'updated_at'], 'safe'],
            [['count'], 'integer', 'min' => 0],
            ['month', 'in', 'range' => range(1, 12)],
        ];
    }

    public function attributeLabels()
    {
        return [
            'id' => 'شناسه',
            'user_id' => 'پرسنل',
            'contract_id' => 'قرارداد',
            'workgroup_id' => 'گروه کاری',
            'year' => 'سال',
            'month' => 'ماه',
            'count' => 'تعداد فرآیند',
            'unit_price' => 'قیمت واحد',
            'date_from' => 'از تاریخ',
            'date_to' => 'تا تاریخ',
            'status' => 'وضعیت',
            'created_by' => 'ایجادکننده',
            'created_at' => 'تاریخ ثبت',
            'updated_at' => 'تاریخ ویرایش',
        ];
    }

    public function beforeSave($insert)
    {
        if (parent::beforeSave($insert)) {
            if ($insert) {
                $this->created_by = Yii::$app->user->id;
                $this->created_at = date('Y-m-d H:i:s');
            }
            $this->updated_at = date('Y-m-d H:i:s');
            return true;
        }
        return false;
    }

    // ================= Relations =================
    public function getUser()
    {
        return $this->hasOne(User::class, ['id' => 'user_id']);
    }

    public function getContract()
    {
        return $this->hasOne(HrmContract::class, ['id' => 'contract_id']);
    }

    public function getWorkgroup()
    {
        return $this->hasOne(HrmWorkgroup::class, ['id' => 'workgroup_id']);
    }

    public function getCalc()
    {
        return $this->hasOne(HrmProcessCalc::class, ['process_id' => 'id']);
    }

    // ================= API Methods =================

    /**
     * لیست کلی فرآیندها (تب محاسبه فرآیندها)
     */
    public static function get_all()
    {
        $params = Yii::$app->request->get();

        $perPage = isset($params['per-page']) ? (int)$params['per-page'] : 10;
        $page    = isset($params['page'])     ? (int)$params['page']     : 1;

        $query = self::find()->with(['user', 'contract', 'workgroup']);

        // فیلترها
        if (!empty($params['user_id'])) {
            $query->andWhere(['user_id' => $params['user_id']]);
        }
        if (!empty($params['workgroup_id'])) {
            $query->andWhere(['workgroup_id' => $params['workgroup_id']]);
        }
        if (!empty($params['year'])) {
            $query->andWhere(['year' => $params['year']]);
        }
        if (!empty($params['month'])) {
            $query->andWhere(['month' => $params['month']]);
        }

        // فیلتر کد پرسنلی / کد ملی از طریق join
        if (!empty($params['personnel_code']) || !empty($params['national_code'])) {
            $query->joinWith(['user u']);
            if (!empty($params['personnel_code'])) {
                $query->andWhere(['like', 'u.personnel_code', $params['personnel_code']]);
            }
            if (!empty($params['national_code'])) {
                $query->andWhere(['like', 'u.national_id', $params['national_code']]);
            }
        }

        $totalCount = $query->count();

        $models = $query
            ->orderBy(['year' => SORT_DESC, 'month' => SORT_DESC, 'id' => SORT_DESC])
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->asArray()
            ->all();

        // augment کردن داده برای React
        foreach ($models as &$m) {
            $user = User::find()->where(['id' => $m['user_id']])->asArray()->one();
            $m['user'] = $user;
            $m['user']['workgroup_name'] = $m['workgroup']['name'] ?? null;

            $m['amount'] = $m['count'] * $m['unit_price'];
            $m['month_name'] = Persian::get_month_name($m['month']);
        }

        return [
            'pages' => (int)ceil($totalCount / $perPage),
            'totalCount' => $totalCount,
            'data' => $models,
        ];
    }

    /**
     * لیست پرسنل فرآیندی (کسی که قرارداد پیمانکاری داره و قیمت فرآیند تنظیم شده)
     */
    public static function get_personnel_list()
    {
        $params = Yii::$app->request->get();

        $query = HrmContract::find()
            ->alias('c')
            ->joinWith(['user u'])
            ->where([
                'c.contract_status' => HrmContract::STATUS_ACTIVE,
                'c.contract_type'   => HrmContract::TYPE_PROJECT, // پیمانکاری
            ])
            ->andWhere(['>', 'c.numPersonelPadash', 0]);

        if (!empty($params['user_id'])) {
            $query->andWhere(['c.user_id' => $params['user_id']]);
        }
        if (!empty($params['personnel_code'])) {
            $query->andWhere(['like', 'u.personnel_code', $params['personnel_code']]);
        }
        if (!empty($params['national_code'])) {
            $query->andWhere(['like', 'u.national_id', $params['national_code']]);
        }
        if (!empty($params['workgroup_id'])) {
            $query->andWhere(['c.workgroup_id' => $params['workgroup_id']]);
        }

        $models = $query->orderBy(['u.id' => SORT_ASC])->asArray()->all();

        $result = [];
        foreach ($models as $m) {
            $result[] = [
                'id' => $m['id'],
                'user_id' => $m['user_id'],
                'user' => [
                    'personnel_code' => $m['user']['personnel_code'] ?? null,
                    'first_name' => $m['user']['first_name'] ?? '',
                    'last_name' => $m['user']['last_name'] ?? '',
                ],
                'workgroup_name' => $m['workgroup']['name'] ?? '-',
                'unit_price' => (int)$m['numPersonelPadash'],
            ];
        }

        return ['data' => $result];
    }
}