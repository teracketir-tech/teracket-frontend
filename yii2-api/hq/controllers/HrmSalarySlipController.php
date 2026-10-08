<?php

namespace frontend\modules\hq\controllers;

use Yii;
use frontend\modules\hq\models\HrmSalarySlip;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;
use yii\web\ForbiddenHttpException;
use yii\filters\VerbFilter;

class HrmSalarySlipController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmSalarySlip';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        
        $behaviors['jwtAuth'] = [
            'class' => JwtAuthBehavior::class,
            'actions' => ['index', 'view', 'create', 'update', 'delete', 'calculate', 'approve', 'pay'],
        ];
        
        $behaviors['verbs'] = [
            'class' => VerbFilter::class,
            'actions' => [
                'index' => ['GET'],
                'view' => ['GET'],
                'create' => ['POST'],
                'update' => ['PATCH', 'PUT'],
                'delete' => ['DELETE'],
                'calculate' => ['POST'],
                'approve' => ['POST'],
                'pay' => ['POST'],
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
        return HrmSalarySlip::get_all();
    }

    public function actionView($id)
    {
        return HrmSalarySlip::_view($id);
    }

    public function actionCalculate()
    {
        $params = Yii::$app->request->post();
        return HrmSalarySlip::calculate($params['user_id'], $params['year'], $params['month']);
    }

    public function actionApprove($id)
    {
        return HrmSalarySlip::approve($id);
    }

    public function actionPay($id)
    {
        return HrmSalarySlip::pay($id);
    }

    public function actionDelete($id)
    {
        return HrmSalarySlip::_delete($id);
    }
    // frontend/modules/hq/controllers/HrmSalarySlipController.php

public function actionLastReview()
{
    return HrmSalarySlip::getLastReview();
}

public function actionHistory()
{
    return HrmSalarySlip::getHistory();
}

public function actionCalculateList()
{
    return HrmSalarySlip::getCalculateList();
}

public function actionCheckWork()
{
    return HrmSalarySlip::getCheckWork();
}

public function actionBatchDelete()
{
    $ids = Yii::$app->request->post('ids');
    return HrmSalarySlip::batchDelete($ids);
}

public function actionBatchRecalculate()
{
    $ids = Yii::$app->request->post('ids');
    return HrmSalarySlip::batchRecalculate($ids);
}

public function actionBatchFinalize()
{
    $ids = Yii::$app->request->post('ids');
    return HrmSalarySlip::batchFinalize($ids);
}

public function actionBatchPreSubmit()
{
    $ids = Yii::$app->request->post('ids');
    return HrmSalarySlip::batchPreSubmit($ids);
}

public function actionBatchClearWork()
{
    $ids = Yii::$app->request->post('ids');
    return HrmSalarySlip::batchClearWork($ids);
}
}