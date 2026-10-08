<?php

namespace frontend\modules\hq\controllers;

use Yii;
use frontend\modules\hq\models\HrmMonthlySummary;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;
use yii\web\ForbiddenHttpException;
use yii\filters\VerbFilter;

class HrmMonthlySummaryController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmMonthlySummary';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        
        $behaviors['jwtAuth'] = [
            'class' => JwtAuthBehavior::class,
            'actions' => ['index', 'view', 'create', 'update', 'delete', 'calculate', 'finalize'],
        ];
        
        $behaviors['verbs'] = [
            'class' => VerbFilter::class,
            'actions' => [
                'index' => ['GET'],
                'view' => ['GET'],
                'create' => ['POST'],
                'update' => ['PATCH', 'PUT'],
                'delete' => ['DELETE'],
                'calculate' => ['POST'],
                'finalize' => ['POST'],
            ],
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
        return HrmMonthlySummary::get_all();
    }

    public function actionView($id)
    {
        return HrmMonthlySummary::_view($id);
    }

    public function actionCreate()
    {
        return HrmMonthlySummary::calculate();
    }

    public function actionUpdate($id)
    {
        return HrmMonthlySummary::_save($id);
    }

    public function actionDelete($id)
    {
        return HrmMonthlySummary::_delete($id);
    }

    public function actionCalculate()
    {
        return HrmMonthlySummary::calculate();
    }

    public function actionFinalize($id)
    {
        return HrmMonthlySummary::finalize($id);
    }
}