<?php

namespace frontend\modules\hq\controllers;

use frontend\modules\hq\models\User;
use frontend\modules\hq\models\HrmAsset;
use frontend\modules\hq\models\HrmAssetAssignment;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;

class HrmAssetAssignmentController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmAssetAssignment';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        $behaviors['jwtAuth'] = [
            'class' => JwtAuthBehavior::class,
            'actions' => ['index', 'view', 'create', 'edit', 'delete', 'personnel-assets'],
        ];
        return $behaviors;
    }

    public function actions()
    {
        $actions = parent::actions();
        unset($actions['index'], $actions['view'], $actions['create'], $actions['update'], $actions['delete']);
        return $actions;
    }

    public function actionIndex()
    {
        return HrmAssetAssignment::getPersonnelAssets();
    }

    public function actionView($id)
    {
        $model = HrmAssetAssignment::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'رکورد یافت نشد'];
        }
        return ['success' => true, 'data' => $model];
    }

    public function actionCreate()
    {
        return HrmAssetAssignment::_save();
    }

    public function actionUpdate($id)
    {
        return HrmAssetAssignment::_save($id);
    }

    public function actionDelete($id)
    {
        User::checkAccess(704);

        $model = HrmAssetAssignment::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'رکورد یافت نشد'];
        }

        // برگردوندن تعداد به available_count
        $asset = HrmAsset::findOne($model->asset_id);
        if ($asset) {
            $asset->available_count += $model->assigned_count;
            $asset->status = HrmAsset::STATUS_AVAILABLE;
            $asset->save();
        }

        $model->delete();
        return ['success' => true];
    }

    
    public function actionDraftAssets($userId)
    {
        return HrmAssetAssignment::getDraftAssets($userId);
    }

    public function actionConfirmDraft($userId)
    {
        return HrmAssetAssignment::confirmDraftAssets($userId);
    }

    public function actionDeleteDraft($id)
    {
        return HrmAssetAssignment::deleteDraftAsset($id);
    }
    // دریافت اموال یک پرسنل خاص
    public function actionPersonnelAssets($userId)
    {
        return HrmAssetAssignment::getPersonnelAssets($userId);
    }
}