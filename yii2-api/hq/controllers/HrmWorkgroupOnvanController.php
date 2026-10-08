<?php

namespace frontend\modules\hq\controllers;

use Yii;
use frontend\modules\hq\models\HrmWorkgroupOnvan;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;
use yii\filters\VerbFilter;

class HrmWorkgroupOnvanController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmWorkgroupOnvan';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        
        $behaviors['jwtAuth'] = [
            'class' => JwtAuthBehavior::class,
            'actions' => ['index', 'view', 'create', 'update', 'delete', 'options'],
        ];
        
        $behaviors['verbs'] = [
            'class' => VerbFilter::class,
            'actions' => [
                'index' => ['GET'],
                'view' => ['GET'],
                'create' => ['POST'],
                'update' => ['PATCH', 'PUT'],
                'delete' => ['DELETE'],
                'options' => ['GET'],
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
        return HrmWorkgroupOnvan::get_all();
    }

    public function actionView($id)
    {
        return HrmWorkgroupOnvan::_view($id);
    }

    public function actionCreate()
    {
        return HrmWorkgroupOnvan::_save();
    }

    public function actionUpdate($id)
    {
        return HrmWorkgroupOnvan::_save($id);
    }

    public function actionDelete($id)
    {
        return HrmWorkgroupOnvan::_delete($id);
    }

    public function actionItems($ghesmatId)
    {
        return ['success' => true, 'data' => HrmWorkgroupOnvan::getOptions($ghesmatId)];
    }
}