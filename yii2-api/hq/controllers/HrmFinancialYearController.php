<?php

namespace frontend\modules\hq\controllers;

use frontend\modules\hq\models\HrmFinancialYear;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;

class HrmFinancialYearController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmFinancialYear';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        $behaviors['jwtAuth'] = [
            'class' => JwtAuthBehavior::class,
            'actions' => ['index', 'view', 'create', 'edit', 'delete', 'set-active', 'active'],
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
        return HrmFinancialYear::get_all();
    }

    public function actionView($id)
    {
        return HrmFinancialYear::_view($id);
    }

    public function actionCreate()
    {
        return HrmFinancialYear::_save();
    }

    public function actionUpdate($id)
    {
        return HrmFinancialYear::_save($id);
    }

    public function actionDelete($id)
    {
        return HrmFinancialYear::_delete($id);
    }

    public function actionSetActive($id)
    {
        return HrmFinancialYear::setActive($id);
    }

    public function actionActive()
    {
        $model = HrmFinancialYear::getActive();
        if ($model) {
            $model->day_count_months = json_decode($model->day_count_months, true) ?: [];
            return ['success' => true, 'data' => $model];
        }
        return ['success' => false, 'message' => 'سال مالی فعالی یافت نشد'];
    }

    public function actionYearOptions()
    {
        return ['success' => true, 'data' => HrmFinancialYear::getYearOptions()];
    }
}