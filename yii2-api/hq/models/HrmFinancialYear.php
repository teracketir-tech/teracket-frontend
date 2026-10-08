<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;
use yii\data\ActiveDataProvider;

/**
 * @property int $id
 * @property int $year
 * @property int $status
 * @property float $salary
 * @property float $coupon
 * @property float $housing_benefits
 * @property float $child_allowance        // حق اولاد
 * @property float $welfare_allowance      // مزایای رفاهی و انگیزشی
 * @property float $seniority_allowance    // حق سنوات
 * @property float $performance_bonus      // پاداش عملکرد
 * @property float $responsibility_allowance // حق مسئولیت
 * @property float $transportation_allowance // کمک ایاب و ذهاب
 * @property string|null $day_count_months
 * @property string $registration_time
 */
class HrmFinancialYear extends ActiveRecord
{
    const STATUS_INACTIVE = 0;
    const STATUS_ACTIVE = 1;

    public static function tableName()
    {
        return 'hrm_financial_year';
    }

    public function rules()
    {
        return [
            [['year', 'salary', 'coupon', 'housing_benefits'], 'required'],
            [['year', 'status'], 'integer'],
            [['salary', 'coupon', 'housing_benefits', 'child_allowance', 'welfare_allowance', 
              'seniority_allowance', 'performance_bonus', 'responsibility_allowance', 
              'transportation_allowance'], 'number'],
            [['day_count_months'], 'safe'],
            [['registration_time'], 'safe'],
            ['year', 'unique', 'message' => 'این سال مالی قبلاً ثبت شده است'],
        ];
    }

    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'year' => 'سال مالی',
            'status' => 'وضعیت',
            'salary' => 'مزد ماهانه (ریال)',
            'coupon' => 'بن خواربار (ریال)',
            'housing_benefits' => 'کمک هزینه مسکن (ریال)',
            'child_allowance' => 'حق اولاد (ریال)',
            'welfare_allowance' => 'مزایای رفاهی و انگیزشی (ریال)',
            'seniority_allowance' => 'حق سنوات (ریال)',
            'performance_bonus' => 'پاداش عملکرد (ریال)',
            'responsibility_allowance' => 'حق مسئولیت (ریال)',
            'transportation_allowance' => 'کمک ایاب و ذهاب (ریال)',
            'day_count_months' => 'روزهای کاری ماه‌ها',
            'registration_time' => 'تاریخ ثبت',
        ];
    }

    // ============== متدهای API ==============

    public static function get_all()
    {
        User::checkAccess(702);

        $params = Yii::$app->request->get();
        $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
        $page = isset($params['page']) ? (int) $params['page'] : 1;

        $query = self::find()->orderBy(['year' => SORT_DESC]);

        if (!empty($params['year'])) {
            $query->andWhere(['year' => Persian::p2e($params['year'])]);
        }

        if (isset($params['status']) && $params['status'] !== '') {
            $query->andWhere(['status' => $params['status']]);
        }

        $totalCount = $query->count();
        $dataProvider = new ActiveDataProvider([
            'query' => $query,
            'pagination' => [
                'pageSize' => $perPage,
                'page' => $page - 1,
            ],
        ]);

        $models = $dataProvider->getModels();

        foreach ($models as $model) {
            $model->day_count_months = json_decode($model->day_count_months, true) ?: [];
              $model->registration_time = Persian::convert_date_to_fa($model->registration_time,true);
       
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

        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'سال مالی یافت نشد'];
        }

        $model->day_count_months = json_decode($model->day_count_months, true) ?: [];

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
                return ['success' => false, 'message' => 'سال مالی یافت نشد'];
            }
        }

        if (isset($params['day_count_months']) && is_array($params['day_count_months'])) {
            $params['day_count_months'] = json_encode($params['day_count_months']);
        }

        if ($model->load($params, '') && $model->save()) {
            $model->day_count_months = json_decode($model->day_count_months, true) ?: [];
            return ['success' => true, 'data' => $model];
        }

        return ['success' => false, 'errors' => $model->errors];
    }

    public static function _delete($id)
    {
        User::checkAccess(704);

        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'سال مالی یافت نشد'];
        }

        $model->delete();
        return ['success' => true];
    }

    public static function setActive($id)
    {
        User::checkAccess(703);

        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'سال مالی یافت نشد'];
        }

         self::updateAll(['status' => self::STATUS_INACTIVE]);

        $model->status = self::STATUS_ACTIVE;
        $model->save();

        return ['success' => true, 'data' => $model];
    }

    public static function getActive()
    {
        return self::find()->where(['status' => self::STATUS_ACTIVE])->one();
    }

    public static function getYearOptions()
    {
        $currentYear = 1405;
        $years = [];
        for ($i = $currentYear - 15; $i <= $currentYear + 15; $i++) {
            $years[$i] = $i;
        }
        return $years;
    }

    public static function getDefaultMonths()
    {
        $months = [
            ['month' => 1, 'name' => 'فروردین', 'days' => 31],
            ['month' => 2, 'name' => 'اردیبهشت', 'days' => 31],
            ['month' => 3, 'name' => 'خرداد', 'days' => 31],
            ['month' => 4, 'name' => 'تیر', 'days' => 31],
            ['month' => 5, 'name' => 'مرداد', 'days' => 31],
            ['month' => 6, 'name' => 'شهریور', 'days' => 31],
            ['month' => 7, 'name' => 'مهر', 'days' => 30],
            ['month' => 8, 'name' => 'آبان', 'days' => 30],
            ['month' => 9, 'name' => 'آذر', 'days' => 30],
            ['month' => 10, 'name' => 'دی', 'days' => 30],
            ['month' => 11, 'name' => 'بهمن', 'days' => 30],
            ['month' => 12, 'name' => 'اسفند', 'days' => 29],
        ];
        return $months;
    }
}