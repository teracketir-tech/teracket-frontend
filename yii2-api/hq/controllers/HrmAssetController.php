<?php

namespace frontend\modules\hq\controllers;

use frontend\modules\hq\models\HrmAsset;
use frontend\modules\hq\models\User;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;

class HrmAssetController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmAsset';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        $behaviors['jwtAuth'] = [
            'class' => JwtAuthBehavior::class,
            'actions' => ['index', 'view', 'create', 'edit', 'delete'],
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
        return HrmAsset::get_all();
    }

    public function actionView($id)
    {
        return HrmAsset::_view($id);
    }

    public function actionCreate()
    {
        return HrmAsset::_save();
    }

    public function actionUpdate($id)
    {
        return HrmAsset::_save($id);
    }

    public function actionDelete($id)
    {
        return HrmAsset::_delete($id);
    }
}