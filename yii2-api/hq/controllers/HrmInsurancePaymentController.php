<?php

namespace frontend\modules\hq\controllers;

use frontend\modules\hq\models\HrmInsurancePayment;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;

class HrmInsurancePaymentController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmInsurancePayment';

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
        return HrmInsurancePayment::get_all();
    }

    public function actionView($id)
    {
        return HrmInsurancePayment::_view($id);
    }

    public function actionCreate()
    {
        return HrmInsurancePayment::_save();
    }

    public function actionUpdate($id)
    {
        return HrmInsurancePayment::_save($id);
    }

    public function actionDelete($id)
    {
        return HrmInsurancePayment::_delete($id);
    }
}