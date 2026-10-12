<?php

namespace frontend\modules\hq\controllers;

use Yii;
use yii\rest\ActiveController;
use yii\web\BadRequestHttpException;
use frontend\components\JwtAuthBehavior;
use frontend\modules\hq\models\HrmProcess;
use frontend\modules\hq\models\HrmProcessCalc;
use frontend\modules\hq\models\HrmProcessService;
use frontend\modules\hq\services\ProcessExcelService;

class HrmProcessController extends ActiveController
{
    public $modelClass = HrmProcess::class;

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

        unset(
            $actions['index'],
            $actions['view'],
            $actions['create'],
            $actions['update'],
            $actions['delete']
        );

        return $actions;
    }

    public function actionIndex()
    {
        return HrmProcess::get_all();
    }

    public function actionHistory()
    {
        return HrmProcessCalc::get_history();
    }

    public function actionCalculateList()
    {
        return HrmProcessCalc::get_calculate_list();
    }

    public function actionPersonnelList()
    {
        return HrmProcess::get_personnel_list();
    }

    public function actionUpload()
    {
        return HrmProcessService::upload();
    }

    public function actionPreSubmit()
    {
        return HrmProcessService::pre_submit(
            Yii::$app->request->post('ids', [])
        );
    }

    public function actionFinalSubmit()
    {
        return HrmProcessService::final_submit(
            Yii::$app->request->post('ids', [])
        );
    }

    public function actionRecalculate()
    {
        return HrmProcessService::recalculate(
            Yii::$app->request->post('ids', [])
        );
    }

    public function actionDeleteCalcs()
    {
        return HrmProcessService::delete_calcs(
            Yii::$app->request->post('ids', [])
        );
    }

    public function actionDeleteProcesses()
    {
        return HrmProcessService::delete_processes(
            Yii::$app->request->post('ids', [])
        );
    }

    public function actionClearWork()
    {
        return HrmProcessService::clear_work(
            Yii::$app->request->post('user_ids', []),
            Yii::$app->request->post('year'),
            Yii::$app->request->post('month')
        );
    }

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
                throw new BadRequestHttpException('نوع خروجی نامعتبر است');
        }
    }
}