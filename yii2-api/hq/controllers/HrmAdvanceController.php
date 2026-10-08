<?php

namespace frontend\modules\hq\controllers;

use frontend\modules\hq\models\HrmAdvance;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;

class HrmAdvanceController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmAdvance';

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
        return HrmAdvance::get_all();
    }

    public function actionView($id)
    {
        return HrmAdvance::_view($id);
    }

    public function actionCreate()
    {
        return HrmAdvance::_save();
    }

    public function actionUpdate($id)
    {
        return HrmAdvance::_save($id);
    }

    public function actionDelete($id)
    {
        return HrmAdvance::_delete($id);
    }

    public function actionSettle($id)
    {
        return HrmAdvance::settle($id);
    }
}