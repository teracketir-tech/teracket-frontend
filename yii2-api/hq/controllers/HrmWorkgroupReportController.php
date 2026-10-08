<?php

namespace frontend\modules\hq\controllers;

use Yii;
use frontend\modules\hq\models\HrmWorkgroupReport;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;
use yii\filters\VerbFilter;

class HrmWorkgroupReportController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmWorkgroupReport';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        
        $behaviors['jwtAuth'] = [
            'class' => JwtAuthBehavior::class,
            'actions' => ['index'],
        ];
        
        $behaviors['verbs'] = [
            'class' => VerbFilter::class,
            'actions' => [
                'index' => ['GET'],
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

    /**
     * گزارش گروه کاری پرسنل
     * GET /hrm-workgroup-report
     */
    public function actionIndex()
    {
        return HrmWorkgroupReport::getReport();
    }
}