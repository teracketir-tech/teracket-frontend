<?php

namespace frontend\modules\hq\controllers;

use Yii;
use frontend\modules\hq\models\HrmVacationBuyback;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;
use yii\web\ForbiddenHttpException;
use yii\filters\VerbFilter;

class HrmVacationBuybackController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmVacationBuyback';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        
        $behaviors['jwtAuth'] = [
            'class' => JwtAuthBehavior::class,
            'actions' => ['index', 'view', 'create', 'update', 'delete', 'calculate', 'approve', 'pay'],
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
                'approve' => ['POST'],
                'pay' => ['POST'],
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
        return HrmVacationBuyback::get_all();
    }

    public function actionView($id)
    {
        return HrmVacationBuyback::_view($id);
    }

    public function actionCreate()
    {
        $params = Yii::$app->request->post();
        return HrmVacationBuyback::calculateAndSave($params['user_id'], $params['year']);
    }

    public function actionUpdate($id)
    {
        return HrmVacationBuyback::_save($id);
    }

    public function actionDelete($id)
    {
        return HrmVacationBuyback::_delete($id);
    }

    public function actionCalculate()
    {
        $params = Yii::$app->request->post();
        return HrmVacationBuyback::calculateAndSave($params['user_id'], $params['year']);
    }

    public function actionApprove($id)
    {
        return HrmVacationBuyback::approve($id);
    }

    public function actionPay($id)
    {
        return HrmVacationBuyback::pay($id);
    }
}