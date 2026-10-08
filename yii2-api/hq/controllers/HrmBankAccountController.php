<?php

namespace frontend\modules\hq\controllers;

use frontend\modules\hq\models\HrmBankAccount;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;

class HrmBankAccountController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmBankAccount';

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
        return HrmBankAccount::get_all();
    }

    public function actionView($id)
    {
        return HrmBankAccount::_view($id);
    }

    public function actionCreate()
    {
        return HrmBankAccount::_save();
    }

    public function actionUpdate($id)
    {
        return HrmBankAccount::_save($id);
    }

    public function actionDelete($id)
    {
        return HrmBankAccount::_delete($id);
    }
}