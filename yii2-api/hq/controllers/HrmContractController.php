<?php

namespace frontend\modules\hq\controllers;

use Yii;
use frontend\modules\hq\models\HrmContract;
use frontend\modules\hq\models\Company;
use frontend\modules\hq\models\State;
use frontend\modules\hq\models\City;
use frontend\modules\hq\models\Group;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;
use yii\web\ForbiddenHttpException;
use yii\filters\VerbFilter;

class HrmContractController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmContract';

    public function behaviors()
    {
        $behaviors = parent::behaviors();

        $behaviors['jwtAuth'] = [
            'class' => JwtAuthBehavior::class,
            'actions' => ['index', 'view', 'create', 'update', 'delete', 'approve', 'renew', 'employers', 'job-positions', 'types', 'states', 'cities','update-work-group'],
        ];

        $behaviors['verbs'] = [
            'class' => VerbFilter::class,
            'actions' => [
                'index' => ['GET'],
                'view' => ['GET'],
                'create' => ['POST'],
                'update' => ['PATCH', 'PUT'],
                'delete' => ['DELETE'],
                'approve' => ['POST'],
                'renew' => ['POST'],
                'employers' => ['GET'],
                'job-positions' => ['GET'],
                'types' => ['GET'],
                'states' => ['GET'],
                'cities' => ['GET'],
                'update-work-group' => ['POST', 'PUT'],
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
        return HrmContract::get_all();
    }

    public function actionView($id)
    {
        return HrmContract::_view($id);
    }

    public function actionCreate()
    {
        return HrmContract::_save();
    }

    public function actionUpdate($id)
    {
        return HrmContract::_save($id);
    }

    public function actionDelete($id)
    {
        return HrmContract::_delete($id);
    }

    public function actionApprove($id)
    {
        return HrmContract::approve($id);
    }

    public function actionRenew($id)
    {
        return HrmContract::renew($id);
    }
    public function actionUpdateWorkGroup($id)
    {
        return HrmContract::updateWorkGroup($id);
    }
    // ============== لیست‌های کمکی برای dropdown ==============

    public function actionEmployers()
    {
        try {
            //Yii::$app->user->checkAccess(702);
        } catch (\Exception $e) {
            throw new ForbiddenHttpException('شما دسترسی لازم را ندارید');
        }

        $employers = Company::find()
            ->select(['id', 'name'])
            ->asArray()
            ->all();

        return ['data' => $employers];
    }

    public function actionJobPositions()
    {
        try {
            //Yii::$app->user->checkAccess(702);
        } catch (\Exception $e) {
            throw new ForbiddenHttpException('شما دسترسی لازم را ندارید');
        }

        $positions = Group::find()
            ->select(['id', 'name'])
            ->asArray()
            ->all();

        return ['data' => $positions];
    }

    public function actionTypes()
    {
        try {
            //Yii::$app->user->checkAccess(702);
        } catch (\Exception $e) {
            throw new ForbiddenHttpException('شما دسترسی لازم را ندارید');
        }

        return [
            'data' => [
                ['id' => HrmContract::TYPE_TEMPORARY, 'name' => 'موقت'],
                ['id' => HrmContract::TYPE_HOURLY, 'name' => 'ساعتی'],
                ['id' => HrmContract::TYPE_PROJECT, 'name' => 'پیمانکاری'],
            ]
        ];
    }

    public function actionModes()
    {
        try {
            //Yii::$app->user->checkAccess(702);
        } catch (\Exception $e) {
            throw new ForbiddenHttpException('شما دسترسی لازم را ندارید');
        }

        return [
            'data' => [
                ['id' => HrmContract::MODE_STAFF, 'name' => 'ستادی'],
                ['id' => HrmContract::MODE_TRANSPORT, 'name' => 'حمل و نقل'],
            ]
        ];
    }

    public function actionStates()
    {
        try {
            //Yii::$app->user->checkAccess(702);
        } catch (\Exception $e) {
            throw new ForbiddenHttpException('شما دسترسی لازم را ندارید');
        }

        $states = State::find()
            ->select(['id', 'name'])
            ->asArray()
            ->all();

        return ['data' => $states];
    }

    public function actionCities($stateId = null)
    {
        try {
            //Yii::$app->user->checkAccess(702);
        } catch (\Exception $e) {
            throw new ForbiddenHttpException('شما دسترسی لازم را ندارید');
        }

        $query = City::find()->select(['id', 'name']);

        if ($stateId) {
            $query->where(['state_id' => $stateId]);
        }

        $cities = $query->asArray()->all();

        return ['data' => $cities];
    }

    public function actionMaritalStatuses()
    {
        try {
            //Yii::$app->user->checkAccess(702);
        } catch (\Exception $e) {
            throw new ForbiddenHttpException('شما دسترسی لازم را ندارید');
        }

        return [
            'data' => [
                ['id' => HrmContract::MARITAL_SINGLE, 'name' => 'مجرد'],
                ['id' => HrmContract::MARITAL_MARRIED, 'name' => 'متاهل'],
                ['id' => HrmContract::MARITAL_DIVORCED, 'name' => 'مطلقه'],
            ]
        ];
    }

    public function actionGenders()
    {
        try {
            //Yii::$app->user->checkAccess(702);
        } catch (\Exception $e) {
            throw new ForbiddenHttpException('شما دسترسی لازم را ندارید');
        }

        return [
            'data' => [
                ['id' => HrmContract::GENDER_MALE, 'name' => 'مرد'],
                ['id' => HrmContract::GENDER_FEMALE, 'name' => 'زن'],
            ]
        ];
    }

    // در HrmContractController

    public function actionExpiring()
    {
        $days = Yii::$app->request->get('days', 30);
        return HrmContract::getExpiringContracts($days);
    }

    public function actionTerminate($id)
    {
        return HrmContract::terminate($id);
    }

    public function actionTerminatedReport()
    {
        return HrmContract::getTerminatedReport();
    }

    public function actionSearchForRenew()
    {
        return HrmContract::searchForRenew();
    }


}