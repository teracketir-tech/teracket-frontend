<?php
// frontend/modules/hq/controllers/HrmProcessController.php

namespace frontend\modules\hq\controllers;

use Yii;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;
use frontend\modules\hq\models\HrmProcess;
use frontend\modules\hq\models\HrmProcessCalc;
use frontend\modules\hq\services\HrmProcessService;
use frontend\modules\hq\services\ProcessExcelService;
class HrmProcessController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmProcess';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        $behaviors['jwtAuth'] = [
            'class' => JwtAuthBehavior::class,
            'actions' => [
                'index',
                'history',
                'calculate-list',
                'personnel-list',
                'upload',
                'pre-submit',
                'final-submit',
                'recalculate',
                'delete-calcs',
                'delete-processes',
                'clear-work',
                'export-excel',
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

    // ============== GET ==============

    /** GET /hrm-process — لیست کلی */
    public function actionIndex()
    {
        return HrmProcess::get_all();
    }

    /** GET /hrm-process/history — سابقه واریز */
    public function actionHistory()
    {
        return HrmProcessCalc::get_history();
    }

    /** GET /hrm-process/calculate-list — لیست پیش‌ثبت‌ها */
    public function actionCalculateList()
    {
        return HrmProcessCalc::get_calculate_list();
    }

    /** GET /hrm-process/personnel-list — لیست پرسنل فرآیندی */
    public function actionPersonnelList()
    {
        return HrmProcess::get_personnel_list();
    }

    // ============== POST ==============

    /** POST /hrm-process/upload — آپلود اکسل */
    public function actionUpload()
    {
        return HrmProcessService::upload();
    }

    /** POST /hrm-process/pre-submit — پیش‌ثبت */
    public function actionPreSubmit()
    {
        $ids = Yii::$app->request->post('ids', []);
        return HrmProcessService::pre_submit($ids);
    }

    /** POST /hrm-process/final-submit — ثبت نهایی */
    public function actionFinalSubmit()
    {
        $ids = Yii::$app->request->post('ids', []);
        return HrmProcessService::final_submit($ids);
    }

    /** POST /hrm-process/recalculate — محاسبه مجدد */
    public function actionRecalculate()
    {
        $ids = Yii::$app->request->post('ids', []);
        return HrmProcessService::recalculate($ids);
    }

    /** POST /hrm-process/delete-calcs — حذف calc */
    public function actionDeleteCalcs()
    {
        $ids = Yii::$app->request->post('ids', []);
        return HrmProcessService::delete_calcs($ids);
    }

    /** POST /hrm-process/delete-processes — حذف فرآیند */
    public function actionDeleteProcesses()
    {
        $ids = Yii::$app->request->post('ids', []);
        return HrmProcessService::delete_processes($ids);
    }

    /** POST /hrm-process/clear-work — کارکرد صفر */
    public function actionClearWork()
    {
        $userIds = Yii::$app->request->post('user_ids', []);
        $year = Yii::$app->request->post('year');
        $month = Yii::$app->request->post('month');
        return HrmProcessService::clear_work($userIds, $year, $month);
    }



    /**
     * POST /hrm-process/export-excel
     * body: { type: 'history' | 'calculate' | 'personnel', ids: [], user_ids: [] }
     */
    public function actionExportExcel()
    {
        $type = Yii::$app->request->post('type', 'history');
        $ids = Yii::$app->request->post('ids', []);
        $userIds = Yii::$app->request->post('user_ids', []);

        switch ($type) {
            case 'history':
                return ProcessExcelService::history($ids);
            case 'calculate':
                return ProcessExcelService::calculateList($ids);
            case 'personnel':
                return ProcessExcelService::personnelList($userIds);
            default:
                throw new \yii\web\BadRequestHttpException('نوع خروجی نامعتبر است');
        }
    }
}