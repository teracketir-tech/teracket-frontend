<?php

namespace frontend\modules\hq\controllers;

use Yii;
use frontend\modules\hq\models\HrmPersonnelDocument;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;
use yii\web\ForbiddenHttpException;
use yii\filters\VerbFilter;

class HrmPersonnelDocumentController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmPersonnelDocument';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        
        $behaviors['jwtAuth'] = [
            'class' => JwtAuthBehavior::class,
            'actions' => ['index', 'view', 'create', 'update', 'delete', 'get-by-user', 'upload', 'delete-file'],
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
                'upload' => ['POST'],
                'delete-file' => ['POST'],
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
        return HrmPersonnelDocument::get_all();
    }

    public function actionView($id)
    {
        return HrmPersonnelDocument::_view($id);
    }

    public function actionCreate()
    {
        return HrmPersonnelDocument::_save();
    }

    public function actionUpdate($id)
    {
        return HrmPersonnelDocument::_save($id);
    }

    public function actionDelete($id)
    {
        return HrmPersonnelDocument::_delete($id);
    }

    public function actionGetByUser()
    {
        $userId = Yii::$app->request->get('userId');
        
        if (!$userId) {
            return ['success' => false, 'message' => 'شناسه کاربر ارسال نشده است'];
        }
        
        return HrmPersonnelDocument::getByUser($userId);
    }

    public function actionUpload()
    {
        return HrmPersonnelDocument::uploadFile();
    }

    public function actionDeleteFile()
    {
        return HrmPersonnelDocument::deleteFile();
    }
}