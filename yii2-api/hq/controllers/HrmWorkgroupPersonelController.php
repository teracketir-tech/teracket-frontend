<?php

namespace frontend\modules\hq\controllers;

use Yii;
use frontend\modules\hq\models\HrmWorkgroupPersonel;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;
use yii\filters\VerbFilter;

class HrmWorkgroupPersonelController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmWorkgroupPersonel';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        
        $behaviors['jwtAuth'] = [
            'class' => JwtAuthBehavior::class,
            'actions' => ['index', 'view', 'create', 'update', 'delete', 'by-user'],
        ];
        
        $behaviors['verbs'] = [
            'class' => VerbFilter::class,
            'actions' => [
                'index' => ['GET'],
                'view' => ['GET'],
                'create' => ['POST'],
                'update' => ['PATCH', 'PUT'],
                'delete' => ['DELETE'],
                'by-user' => ['GET'],
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
        return HrmWorkgroupPersonel::get_all();
    }

    public function actionView($id)
    {
        return HrmWorkgroupPersonel::_view($id);
    }

    public function actionCreate()
    {
        return HrmWorkgroupPersonel::_save();
    }

    public function actionUpdate($id)
    {
        return HrmWorkgroupPersonel::_save($id);
    }

    public function actionDelete($id)
    {
        return HrmWorkgroupPersonel::_delete($id);
    }

    public function actionByUser($userId)
    {
        return ['success' => true, 'data' => HrmWorkgroupPersonel::getByUser($userId)];
    }
}