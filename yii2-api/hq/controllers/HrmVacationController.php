<?php

namespace frontend\modules\hq\controllers;

use frontend\modules\hq\models\HrmVacation;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;

class HrmVacationController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmVacation';

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
        return HrmVacation::get_all();
    }

    public function actionView($id)
    {
        return HrmVacation::_view($id);
    }

    public function actionCreate()
    {
        return HrmVacation::_save();
    }

    public function actionUpdate($id)
    {
        return HrmVacation::_save($id);
    }

    public function actionDelete($id)
    {
        return HrmVacation::_delete($id);
    }

    public function actionApprove($id)
    {
        return HrmVacation::approve($id);
    }

    public function actionReject($id)
    {
        return HrmVacation::reject($id);
    }
 
    public function actionOptions(){
return HrmVacation::getTypeOptions();
    }

    
public function actionVacationsList()
{
    return HrmVacation::getVacationsList();
}

public function actionDailyReport()
{
    return HrmVacation::getDailyReport();
}

public function actionMonthlyReport()
{
    return HrmVacation::getMonthlyReport();
}
}