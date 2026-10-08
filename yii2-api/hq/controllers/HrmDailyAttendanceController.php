<?php

namespace frontend\modules\hq\controllers;

use frontend\modules\hq\models\HrmDailyAttendance;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;
 
class HrmDailyAttendanceController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmDailyAttendance';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        $behaviors['jwtAuth'] = [
            'class' => JwtAuthBehavior::class,
            'actions' => ['index', 'view', 'create', 'edit', 'delete', 'save-range'],
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
        return HrmDailyAttendance::get_all();
    }

    public function actionView($id)
    {
        return HrmDailyAttendance::_view($id);
    }

    public function actionCreate()
    {
        return HrmDailyAttendance::_save();
    }

    public function actionUpdate($id)
    {
        return HrmDailyAttendance::_save($id);
    }

    public function actionDelete($id)
    {
        return HrmDailyAttendance::_delete($id);
    }

    public function actionSaveRange()
    {
        return HrmDailyAttendance::saveRange();
    } 

    public function actionBulkEditRange()
    {
        return HrmDailyAttendance::bulkEditRange();
    }
   
    public function actionBulkEditMonthly()
    {
        return HrmDailyAttendance::bulkEditMonthly();
    }
}