<?php

namespace frontend\modules\hq\controllers;

use Yii;
use frontend\modules\hq\models\HrmMission;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;

class HrmMissionController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmMission';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        $behaviors['jwtAuth'] = [
            'class' => JwtAuthBehavior::class,
            'actions' => ['index', 'view', 'create', 'edit', 'delete', 'approve', 'reject'],
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
        return HrmMission::get_all();
    }

    public function actionView($id)
    {
        return HrmMission::_view($id);
    }

    public function actionCreate()
    {
        return HrmMission::_save();
    }

    public function actionUpdate($id)
    {
        return HrmMission::_save($id);
    }

    public function actionDelete($id)
    {
        return HrmMission::_delete($id);
    }

    public function actionApprove($id)
    {
        return HrmMission::approve($id);
    }

    public function actionReject($id)
    {
        return HrmMission::reject($id);
    }

     public function actionDailyReport()
    {
        return HrmMission::getDailyReport();
    }

    public function actionMonthlyReport()
    {
        return HrmMission::getMonthlyReport();
    }
}