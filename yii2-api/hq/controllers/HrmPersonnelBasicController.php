<?php

namespace frontend\modules\hq\controllers;

use Yii;
use frontend\modules\hq\models\HrmPersonnelBasic;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;
use yii\web\ForbiddenHttpException;
use yii\filters\VerbFilter;

class HrmPersonnelBasicController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmPersonnelBasic';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        
        $behaviors['jwtAuth'] = [
            'class' => JwtAuthBehavior::class,
            'actions' => ['index', 'view', 'create', 'update', 'delete', 'get-by-user','accept-person'],
        ];
        
        $behaviors['verbs'] = [
            'class' => VerbFilter::class,
            'actions' => [
                'index' => ['GET'],
                'view' => ['GET'],
                'create' => ['POST'],
                'update' => ['PATCH', 'PUT'],
                'delete' => ['DELETE'],
                'get-by-user' => ['GET'] 
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
        return HrmPersonnelBasic::get_all();
    }

    public function actionView($id)
    {
        return HrmPersonnelBasic::_view($id);
    }

    public function actionCreate()
    {
        return HrmPersonnelBasic::_save();
    }

    public function actionUpdate($id)
    {
        return HrmPersonnelBasic::_save($id);
    }

    public function actionDelete($id)
    {
        return HrmPersonnelBasic::_delete($id);
    }

    public function actionGetByUser($userId)
    {
        
        return HrmPersonnelBasic::getByUser($userId);
    }
     public function actionAcceptPerson($userId)
    {
        
        return HrmPersonnelBasic::acceptPerson($userId);
    }

     
}