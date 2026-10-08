<?php

namespace frontend\modules\hq\controllers;

use Yii;
use frontend\modules\hq\models\HrmWorkgroupGhesmat;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;
use yii\filters\VerbFilter;

class HrmWorkgroupGhesmatController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmWorkgroupGhesmat';

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
        return HrmWorkgroupGhesmat::get_all();
    }

    public function actionView($id)
    {
        return HrmWorkgroupGhesmat::_view($id);
    }

    public function actionCreate()
    {
        return HrmWorkgroupGhesmat::_save();
    }

    public function actionUpdate($id)
    {
        return HrmWorkgroupGhesmat::_save($id);
    }

    public function actionDelete($id)
    {
        return HrmWorkgroupGhesmat::_delete($id);
    }

    public function actionItems($bakhshId)
    {
        return ['success' => true, 'data' => HrmWorkgroupGhesmat::getOptions($bakhshId)];
    }
}