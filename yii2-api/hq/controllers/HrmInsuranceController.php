<?php

namespace frontend\modules\hq\controllers;

use frontend\modules\hq\models\HrmInsurance;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;

class HrmInsuranceController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmInsurance';

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
        return HrmInsurance::get_all();
    }

    public function actionView($id)
    {
        return HrmInsurance::_view($id);
    }

    public function actionCreate()
    {
        return HrmInsurance::_save();
    }

    public function actionUpdate($id)
    {
        return HrmInsurance::_save($id);
    }

    public function actionDelete($id)
    {
        return HrmInsurance::_delete($id);
    }
}