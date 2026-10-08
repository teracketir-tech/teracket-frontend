<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;

class HrmProcessCalc extends ActiveRecord
{
    const STATUS_PRE  = 0; // پیش‌ثبت
    const STATUS_PAID = 1; // ثبت نهایی / پرداخت‌شده

    public static function tableName()
    {
        return 'hrm_process_calc';
    }

    public function rules()
    {
        return [
            [['user_id', 'contract_id', 'year', 'month'], 'required'],
            [['user_id', 'contract_id', 'workgroup_id', 'year', 'month', 'count', 'status', 'created_by'], 'integer'],
            [['unit_price', 'total_amount'], 'number', 'min' => 0],
            [['date_paid', 'created_at', 'updated_at'], 'safe'],
            [['bank_name', 'bank_account'], 'string', 'max' => 255],
            [['description'], 'string'],
        ];
    }

    public function beforeSave($insert)
    {
        if (parent::beforeSave($insert)) {
            if ($insert) {
                $this->created_by = Yii::$app->user->id;
                $this->created_at = date('Y-m-d H:i:s');
            }
            $this->total_amount = (int)$this->count * (int)$this->unit_price;
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

    public function getProcess()
    {
        return $this->hasOne(HrmProcess::class, ['id' => 'process_id']);
    }

    // ================= API =================

    /**
     * لیست برای محاسبه (پیش‌ثبت‌ها)
     */
    public static function get_calculate_list()
    {
        return self::list_query(self::STATUS_PRE);
    }

    /**
     * سابقه واریز فرآیند (ثبت‌نهایی‌شده‌ها)
     */
    public static function get_history()
    {
        return self::list_query(self::STATUS_PAID);
    }

    private static function list_query($status)
    {
        $params = Yii::$app->request->get();

        $perPage = isset($params['per-page']) ? (int)$params['per-page'] : 10;
        $page    = isset($params['page'])     ? (int)$params['page']     : 1;

        $query = self::find()
            ->with(['user', 'contract', 'workgroup'])
            ->where(['status' => $status]);

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

        foreach ($models as &$m) {
            $m['user'] = User::find()->where(['id' => $m['user_id']])->asArray()->one();
            $m['user']['workgroup_name'] = $m['workgroup']['name'] ?? null;
            $m['amount'] = (int)$m['total_amount'];
            $m['month_name'] = Persian::get_month_name($m['month']);
        }

        return [
            'pages' => (int)ceil($totalCount / $perPage),
            'totalCount' => $totalCount,
            'data' => $models,
        ];
    }

    public static function _delete($id)
    {
        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'رکورد یافت نشد'];
        }
        $model->delete();
        return ['success' => true];
    }
}