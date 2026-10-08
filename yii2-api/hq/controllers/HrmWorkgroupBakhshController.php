<?php

namespace frontend\modules\hq\controllers;

use Yii;
use frontend\modules\hq\models\HrmWorkgroupBakhsh;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;
use yii\filters\VerbFilter;

class HrmWorkgroupBakhshController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmWorkgroupBakhsh';

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
        return HrmWorkgroupBakhsh::get_all();
    }

    public function actionView($id)
    {
        return HrmWorkgroupBakhsh::_view($id);
    }

    public function actionCreate()
    {
        return HrmWorkgroupBakhsh::_save();
    }

    public function actionUpdate($id)
    {
        return HrmWorkgroupBakhsh::_save($id);
    }

    public function actionDelete($id)
    {
        return HrmWorkgroupBakhsh::_delete($id);
    }

    public function actionItems($workgroupId)
    {
        return ['success' => true, 'data' => HrmWorkgroupBakhsh::getOptions($workgroupId)];
    }
}