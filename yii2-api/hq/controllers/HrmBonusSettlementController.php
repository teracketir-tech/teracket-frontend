<?php

namespace frontend\modules\hq\controllers;

use Yii;
use frontend\modules\hq\models\HrmBonusSettlement;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;
use yii\web\ForbiddenHttpException;
use yii\filters\VerbFilter;

class HrmBonusSettlementController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmBonusSettlement';

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
        return HrmBonusSettlement::get_all();
    }

    public function actionView($id)
    {
        return HrmBonusSettlement::_view($id);
    }

    public function actionCreate()
    {
        $params = Yii::$app->request->post();
        return HrmBonusSettlement::calculateAndSave($params['user_id'], $params['year']);
    }

    public function actionUpdate($id)
    {
        return HrmBonusSettlement::_save($id);
    }

    public function actionDelete($id)
    {
        return HrmBonusSettlement::_delete($id);
    }

    public function actionCalculate()
    {
        $params = Yii::$app->request->post();
        return HrmBonusSettlement::calculateAndSave($params['user_id'], $params['year']);
    }

    public function actionApprove($id)
    {
        return HrmBonusSettlement::approve($id);
    }

    public function actionPay($id)
    {
        return HrmBonusSettlement::pay($id);
    }
}