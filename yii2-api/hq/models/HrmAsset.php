<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;
use yii\data\ActiveDataProvider;

class HrmAsset extends ActiveRecord
{
    const STATUS_AVAILABLE = 1;
    const STATUS_ASSIGNED = 2;
    const STATUS_BROKEN = 3;
    const STATUS_LOST = 4;

    public static function tableName()
    {
        return 'hrm_assets';
    }

    public function rules()
    {
        return [
            // ✅ name و unit_price الزامی - total_count اختیاری شد
            [['name', 'unit_price'], 'required'],
            
            [['unit_price', 'total_count', 'available_count', 'status'], 'integer'],
            [['name', 'material'], 'string', 'max' => 255],
            [['description'], 'string'],
            
            // ✅ اعتبارسنجی total_count: میتونه 0 یا بیشتر باشه
            ['total_count', 'default', 'value' => 0],
            ['total_count', 'compare', 'compareValue' => 0, 'operator' => '>=', 'message' => 'تعداد کل باید 0 یا بیشتر باشد'],
            
            // ✅ available_count پیش‌فرض 0
            ['available_count', 'default', 'value' => 0],
        ];
    }

    public function attributeLabels()
    {
        return [
            'id' => 'شناسه',
            'name' => 'نام',
            'material' => 'جنس',
            'unit_price' => 'قیمت واحد (ریال)',
            'status' => 'وضعیت',
            'total_count' => 'تعداد کل',
            'available_count' => 'تعداد موجود',
            'description' => 'توضیحات',
            'created_at' => 'تاریخ ثبت',
            'updated_at' => 'تاریخ ویرایش',
        ];
    }

    public function getStatusLabel()
    {
        $statuses = [
            self::STATUS_AVAILABLE => 'موجود',
            self::STATUS_ASSIGNED => 'در اختیار',
            self::STATUS_BROKEN => 'خراب',
            self::STATUS_LOST => 'مفقود',
        ];
        return $statuses[$this->status] ?? 'نامشخص';
    }

    // ============== API متدها ==============

    // frontend/modules/hq/models/HrmAsset.php

public static function get_all()
{
    User::checkAccess(702);

    $params = Yii::$app->request->get();
    $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
    $page = isset($params['page']) ? (int) $params['page'] : 1;

    $query = self::find()->orderBy(['id' => SORT_DESC]);

    // فیلترها
    if (!empty($params['name'])) {
        $query->andWhere(['like', 'name', $params['name']]);
    }
    if (!empty($params['material'])) {
        $query->andWhere(['like', 'material', $params['material']]);
    }
    if (isset($params['status']) && $params['status'] !== '') {
        $query->andWhere(['status' => $params['status']]);
    }
    
    // ✅ فیلتر مبلغ از
    if (!empty($params['unit_price_from'])) {
        $query->andWhere(['>=', 'unit_price', $params['unit_price_from']]);
    }
    
    // ✅ فیلتر مبلغ تا
    if (!empty($params['unit_price_to'])) {
        $query->andWhere(['<=', 'unit_price', $params['unit_price_to']]);
    }

    $totalCount = $query->count();
    $dataProvider = new ActiveDataProvider([
        'query' => $query,
        'pagination' => [
            'pageSize' => $perPage,
            'page' => $page - 1,
        ],
    ]);

    return [
        'pages' => ceil($totalCount / $perPage),
        'totalCount' => $totalCount,
        'data' => $dataProvider->getModels(),
    ];
}

    public static function _view($id)
    {
        User::checkAccess(702);

        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'Asset یافت نشد'];
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
                return ['success' => false, 'message' => 'Asset یافت نشد'];
            }
        }

        // ✅ اگر total_count ارسال نشد، مقدار 0 بزار
        if (!isset($params['total_count'])) {
            $params['total_count'] = 0;
        }

        // ✅ محاسبه available_count: اگر total_count 0 باشه، available_count هم 0 میشه
        if (isset($params['total_count']) && !isset($params['available_count'])) {
            $params['available_count'] = $params['total_count'];
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
            return ['success' => false, 'message' => 'Asset یافت نشد'];
        }

        // چک کردن اینکه Asset در اختیار کسی نباشه
        $assignments = HrmAssetAssignment::find()->where(['asset_id' => $id, 'status' => HrmAssetAssignment::STATUS_ASSIGNED])->count();
        if ($assignments > 0) {
            return ['success' => false, 'message' => 'این Asset در اختیار پرسنل است و قابل حذف نمی‌باشد'];
        }

        $model->delete();
        return ['success' => true];
    }

    // ============== Relations ==============

    public function getAssignments()
    {
        return $this->hasMany(HrmAssetAssignment::class, ['asset_id' => 'id']);
    }

    public function getActiveAssignments()
    {
        return $this->hasMany(HrmAssetAssignment::class, ['asset_id' => 'id'])
            ->andWhere(['status' => HrmAssetAssignment::STATUS_ASSIGNED]);
    }
}