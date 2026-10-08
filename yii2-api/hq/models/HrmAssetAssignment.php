<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;
use yii\data\ActiveDataProvider;

class HrmAssetAssignment extends ActiveRecord
{
    const STATUS_ASSIGNED = 1;
    const STATUS_RETURNED = 2;
    const STATUS_LOST = 3;


    const STATUS_INSERT_DRAFT = 0;
    const STATUS_INSERT_CONFIRM = 1;
    public static function tableName()
    {
        return 'hrm_asset_assignments';
    }

    public function rules()
    {
        return [
            [['asset_id', 'user_id', 'assigned_count', 'unit_price'], 'required'],
            [['asset_id', 'user_id', 'assigned_count', 'status', 'status_insert'], 'integer'],
            [['unit_price', 'total_price'], 'number'],
            [['label_number'], 'string', 'max' => 50],
            [['description'], 'string'],
            [['assignment_date', 'return_date', 'status_insert'], 'safe'],
            ['assigned_count', 'compare', 'compareValue' => 0, 'operator' => '>', 'message' => 'تعداد باید بیشتر از 0 باشد'],
        ];
    }

    public function attributeLabels()
    {
        return [
            'id' => 'شناسه',
            'asset_id' => 'Asset',
            'user_id' => 'پرسنل',
            'label_number' => 'شماره برچسب',
            'assigned_count' => 'تعداد',
            'unit_price' => 'قیمت واحد (ریال)',
            'total_price' => 'قیمت کل (ریال)',
            'assignment_date' => 'تاریخ واگذاری',
            'return_date' => 'تاریخ بازگشت',
            'status' => 'وضعیت',
            'description' => 'توضیحات',
        ];
    }

    // ============== API متدها ==============
   // frontend/modules/hq/models/HrmAssetAssignment.php

public static function getPersonnelAssets($userId = null)
{
    User::checkAccess(702);

    $params = Yii::$app->request->get();
    $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
    $page = isset($params['page']) ? (int) $params['page'] : 1;
    
    $type = $params['type'] ?? null;

    $query = self::find()
        ->with(['asset', 'user'])
        ->where(['status' => self::STATUS_ASSIGNED]) // فقط اموال در اختیار
        ->andWhere(['status_insert' => self::STATUS_INSERT_CONFIRM]);

    if ($userId) {
        $query->andWhere(['user_id' => $userId]);
    } elseif (!empty($params['user_id'])) {
        $query->andWhere(['user_id' => $params['user_id']]);
    }

    // فیلتر بر اساس نوع
    if ($type === 'original') {
        $query->andWhere(['or', ['transfer_type' => 0], ['transfer_type' => null]]);
    } elseif ($type === 'transferred') {
        $query->andWhere(['transfer_type' => 1]);
    }

    if (!empty($params['label_number'])) {
        $query->andWhere(['like', 'label_number', $params['label_number']]);
    }

    $totalCount = $query->count();

    $models = $query->orderBy(['id' => SORT_DESC])
        ->offset(($page - 1) * $perPage)
        ->limit($perPage)
        ->asArray()
        ->all();

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
            User::checkAccess(701);
            $model = new self();
        } else {
            User::checkAccess(703);
            $model = self::findOne($id);
            if (!$model) {
                return ['success' => false, 'message' => 'رکورد یافت نشد'];
            }
        }

        // محاسبه قیمت کل
        if (isset($params['unit_price']) && isset($params['assigned_count'])) {
            $params['total_price'] = $params['unit_price'] * $params['assigned_count'];
        }

        // تنظیم تاریخ واگذاری
        if (empty($params['assignment_date'])) {
            $params['assignment_date'] = date('Y-m-d H:i:s');
        }

        // تراکنش برای کاهش available_count
        $transaction = Yii::$app->db->beginTransaction();
        try {
            if ($model->load($params, '') && $model->save()) {
                // به‌روزرسانی available_count در Assets
                $asset = HrmAsset::findOne($model->asset_id);
                if ($asset) {
                    $asset->available_count = max(0, $asset->available_count - $model->assigned_count);
                    $asset->status = $asset->available_count > 0 ? HrmAsset::STATUS_AVAILABLE : HrmAsset::STATUS_ASSIGNED;
                    $asset->save();
                }
                $transaction->commit();
                return ['success' => true, 'data' => $model];
            }
        } catch (\Exception $e) {
            $transaction->rollBack();
            return ['success' => false, 'message' => $e->getMessage()];
        }

        return ['success' => false, 'errors' => $model->errors];
    }


    /**
     * دریافت اموال پیش‌ثبت (draft) یک کاربر
     */
    public static function getDraftAssets($userId)
    {
        $models = self::find()
            ->with(['asset', 'user'])
            ->where([
                'user_id' => $userId,
                'status_insert' => self::STATUS_INSERT_DRAFT
            ])
            ->orderBy(['id' => SORT_DESC])
            ->asArray()
            ->all();

        return [
            'success' => true,
            'data' => $models,
        ];
    }

    /**
     * تایید نهایی اموال پیش‌ثبت یک کاربر
     */
    public static function confirmDraftAssets($userId)
    {
        $models = self::find()
            ->where([
                'user_id' => $userId,
                'status_insert' => self::STATUS_INSERT_DRAFT
            ])
            ->all();

        if (empty($models)) {
            return ['success' => false, 'message' => 'هیچ اموال پیش‌ثبتی برای این کاربر یافت نشد'];
        }

        $transaction = Yii::$app->db->beginTransaction();
        try {
            foreach ($models as $model) {
                $model->status_insert = self::STATUS_INSERT_CONFIRM;
                $model->save();
            }
            $transaction->commit();
            return ['success' => true, 'message' => count($models) . ' مورد با موفقیت تایید شد'];
        } catch (\Exception $e) {
            $transaction->rollBack();
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * حذف یک اموال پیش‌ثبت
     */
    public static function deleteDraftAsset($id)
    {
        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'رکورد یافت نشد'];
        }

        if ($model->status_insert != self::STATUS_INSERT_DRAFT) {
            return ['success' => false, 'message' => 'این رکورد قابل حذف نیست'];
        }

        // برگردوندن موجودی به asset
        $asset = HrmAsset::findOne($model->asset_id);
        if ($asset) {
            $asset->available_count += $model->assigned_count;
            $asset->status = HrmAsset::STATUS_AVAILABLE;
            $asset->save();
        }

        $model->delete();
        return ['success' => true];
    }
    // ============== Relations ==============

    public function getAsset()
    {
        return $this->hasOne(HrmAsset::class, ['id' => 'asset_id']);
    }

    public function getUser()
    {
        return $this->hasOne(User::class, ['id' => 'user_id']);
    }

    public function getTransfers()
    {
        return $this->hasMany(HrmAssetTransfer::class, ['assignment_id' => 'id']);
    }
}