<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;
use yii\data\ActiveDataProvider;

class HrmAssetTransfer extends ActiveRecord
{
    const TYPE_ORIGINAL = 1;
    const TYPE_TRANSFERRED = 2;

    const STATUS_DONE = 1;
    const STATUS_RETURNED = 2;

    public static function tableName()
    {
        return 'hrm_asset_transfers';
    }

    public function rules()
    {
        return [
            [['assignment_id', 'from_user_id', 'to_user_id', 'transfer_type', 'transfer_count'], 'required'],
            [['assignment_id', 'from_user_id', 'to_user_id', 'transfer_type', 'transfer_count', 'status'], 'integer'],
            [['description'], 'string'],
            [['transfer_date'], 'safe'],
        ];
    }

    public function attributeLabels()
    {
        return [
            'id' => 'شناسه',
            'assignment_id' => 'شناسه تخصیص',
            'from_user_id' => 'از پرسنل',
            'to_user_id' => 'به پرسنل',
            'transfer_type' => 'نوع انتقال',
            'transfer_count' => 'تعداد',
            'transfer_date' => 'تاریخ انتقال',
            'status' => 'وضعیت',
            'description' => 'توضیحات',
        ];
    }

    public static function get_all_view()
    {


        $params = Yii::$app->request->get();
        $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
        $page = isset($params['page']) ? (int) $params['page'] : 1;

        $totalCount = self::find()->count();

        $from_user = 0;
        $to_user = 0;
   $params = Yii::$app->request->get();

        $transferItem = self::findOne(['assignment_id' => $params['assignment_id']]);
        if ($transferItem) {
            $from_user = $transferItem->from_user_id;
            $to_user = $transferItem->to_user_id;


             $query = self::find()
            ->with([
                'assignment',
                'assignment.asset',
                'fromUser',
                'toUser'
            ]);
       
            $query->andWhere(['from_user_id' =>$from_user]);
              $query->andWhere(['to_user_id' =>  $to_user ]);
        
         $models = $query->orderBy(['id' => SORT_DESC])
                ->offset(($page - 1) * $perPage)
                ->limit($perPage)
                ->asArray()  // این خط رو اضافه کن
                ->all();
 return [
            'pages' => ceil($totalCount / $perPage),
            'totalCount' => $totalCount,
            'data' => $models,
            'viewall' => true,
        ];
        }

    }
    public static function get_all($viewall = false)
    {


        User::checkAccess(702);

        $params = Yii::$app->request->get();
        $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
        $page = isset($params['page']) ? (int) $params['page'] : 1;

        $totalCount = self::find()->count();

        // استفاده از asArray برای برگردوندن آرایه
        $query = self::find()
            ->with([
                'assignment',
                'assignment.asset',
                'fromUser',
                'toUser'
            ]);
        if (!empty($params['user_id'])) {
            $query->andWhere([
                'or',
                ['from_user_id' => $params['user_id']],
                ['to_user_id' => $params['user_id']]
            ]);
        }

        if (!empty($params['personnel_code'])) {
            $userIds = User::find()
                ->where(['personnel_code' => $params['personnel_code']])
                ->select('id')
                ->column();


            if (empty($userIds)) {
                $query->andWhere([
                    'or',
                    ['from_user_id' => $userIds],
                    ['to_user_id' => $userIds]
                ]);
            }
        }

        if (!empty($params['asset_id'])) {
            $assignmentIds = HrmAssetAssignment::find()
                ->where(['asset_id' => $params['asset_id']])
                ->select('id')
                ->column();
            if (!empty($assignmentIds)) {
                $query->andWhere(['assignment_id' => $assignmentIds]);
            }
        }

        if ($viewall == false) {

            $models = $query->orderBy(['id' => SORT_DESC])
                ->groupBy(['from_user_id', 'to_user_id'])
                ->offset(($page - 1) * $perPage)
                ->limit($perPage)
                ->asArray()
                ->all();

            foreach ($models as &$model) {
                $model['transfer_count'] = self::find()
                    ->where(['from_user_id' => $model['from_user_id']])
                    ->andWhere(['to_user_id' => $model['to_user_id']]) // اصلاح: از to_user_id استفاده شد
                    ->sum('transfer_count');
            }
            unset($model);
        } else {
            $models = $query->orderBy(['id' => SORT_DESC])
                ->offset(($page - 1) * $perPage)
                ->limit($perPage)
                ->asArray()  // این خط رو اضافه کن
                ->all();
        }


        return [
            'pages' => ceil($totalCount / $perPage),
            'totalCount' => $totalCount,
            'data' => $models,
            'viewall' => $viewall,
        ];
    }
    // frontend/modules/hq/models/HrmAssetTransfer.php

    public static function _save()
    {
        User::checkAccess(701);

        $params = Yii::$app->request->post();
        $model = new self();

        if (empty($params['transfer_date'])) {
            $params['transfer_date'] = date('Y-m-d H:i:s');
        }

        $transaction = Yii::$app->db->beginTransaction();
        try {
            if ($model->load($params, '') && $model->save()) {

                // 1. به‌روزرسانی assignment مبدا: غیرفعال کردن (بازگشت)
                $assignment = HrmAssetAssignment::findOne($model->assignment_id);
                if ($assignment) {
                    $assignment->status = HrmAssetAssignment::STATUS_RETURNED; // 2 = بازگشت
                    $assignment->transfer_type = 1;
                    $assignment->save();
                }

                // 2. ایجاد assignment جدید برای کاربر مقصد
                $newAssignment = new HrmAssetAssignment();
                $newAssignment->asset_id = $assignment->asset_id;
                $newAssignment->user_id = $model->to_user_id;
                $newAssignment->label_number = $assignment->label_number;
                $newAssignment->assigned_count = $model->transfer_count;
                $newAssignment->unit_price = $assignment->unit_price;
                $newAssignment->total_price = $assignment->unit_price * $model->transfer_count;
                $newAssignment->status = HrmAssetAssignment::STATUS_ASSIGNED; // 1 = در اختیار
                $newAssignment->status_insert = HrmAssetAssignment::STATUS_INSERT_CONFIRM;
                $newAssignment->transfer_type = 1; // واگذار شده
                $newAssignment->assignment_date = date('Y-m-d H:i:s');
                $newAssignment->save();

                // 3. به‌روزرسانی available_count در Assets
                $asset = HrmAsset::findOne($assignment->asset_id);
                if ($asset) {
                    // موجودی تغییری نمیکنه چون فقط منتقل شده
                    // اما اگر نیاز به آپدیت دارید
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

    // ============== Relations ==============

    public function getAssignment()
    {
        return $this->hasOne(HrmAssetAssignment::class, ['id' => 'assignment_id']);
    }

    public function getFromUser()
    {
        return $this->hasOne(User::class, ['id' => 'from_user_id']);
    }

    public function getToUser()
    {
        return $this->hasOne(User::class, ['id' => 'to_user_id']);
    }
}