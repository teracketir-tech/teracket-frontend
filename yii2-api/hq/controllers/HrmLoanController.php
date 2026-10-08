<?php

namespace frontend\modules\hq\controllers;

use frontend\modules\hq\models\HrmLoan;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;

class HrmLoanController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmLoan';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        $behaviors['jwtAuth'] = [
            'class' => JwtAuthBehavior::class,
            'actions' => ['index', 'view', 'create', 'edit', 'delete', 'pay-installment', 'settle'],
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
        return HrmLoan::get_all();
    }

    public function actionView($id)
    {
        return HrmLoan::_view($id);
    }

    public function actionCreate()
    {
        return HrmLoan::_save();
    }

    public function actionUpdate($id)
    {
        return HrmLoan::_save($id);
    }

    public function actionDelete($id)
    {
        return HrmLoan::_delete($id);
    }

    public function actionPayInstallment($id)
    {
        return HrmLoan::payInstallment($id);
    }

    public function actionSettle($id)
    {
        return HrmLoan::settle($id);
    }
}