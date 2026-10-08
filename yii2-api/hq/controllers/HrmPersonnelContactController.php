<?php

namespace frontend\modules\hq\controllers;

use Yii;
use frontend\modules\hq\models\HrmPersonnelContact;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;
use yii\web\ForbiddenHttpException;
use yii\filters\VerbFilter;

class HrmPersonnelContactController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmPersonnelContact';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        
        $behaviors['jwtAuth'] = [
            'class' => JwtAuthBehavior::class,
            'actions' => ['index', 'view', 'create', 'update', 'delete', 'get-by-user'],
        ];
        
        $behaviors['verbs'] = [
            'class' => VerbFilter::class,
            'actions' => [
                'index' => ['GET'],
                'view' => ['GET'],
                'create' => ['POST'],
                'update' => ['PATCH', 'PUT'],
                'delete' => ['DELETE'],
                'get-by-user' => ['GET'],
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
        return HrmPersonnelContact::get_all();
    }

    public function actionView($id)
    {
        return HrmPersonnelContact::_view($id);
    }

    public function actionCreate()
    {
        return HrmPersonnelContact::_save();
    }

    public function actionUpdate($id)
    {
        return HrmPersonnelContact::_save($id);
    }

    public function actionDelete($id)
    {
        return HrmPersonnelContact::_delete($id);
    }

    public function actionGetByUser()
    {
        $userId = Yii::$app->request->get('userId');
        
        if (!$userId) {
            return ['success' => false, 'message' => 'شناسه کاربر ارسال نشده است'];
        }
        
        return HrmPersonnelContact::getByUser($userId);
    }
}