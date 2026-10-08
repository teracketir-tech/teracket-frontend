<?php

namespace frontend\modules\hq\controllers;

use frontend\modules\hq\models\HrmAdjustment;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;

class HrmAdjustmentController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmAdjustment';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        $behaviors['jwtAuth'] = [
            'class' => JwtAuthBehavior::class,
            'actions' => ['index', 'view', 'create', 'edit', 'delete', 'settle'],
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
        return HrmAdjustment::get_all();
    }

    public function actionView($id)
    {
        return HrmAdjustment::_view($id);
    }

    public function actionCreate()
    {
        return HrmAdjustment::_save();
    }

    public function actionUpdate($id)
    {
        return HrmAdjustment::_save($id);
    }

    public function actionDelete($id)
    {
        return HrmAdjustment::_delete($id);
    }

    public function actionSettle($id)
    {
        return HrmAdjustment::settle($id);
    }
}