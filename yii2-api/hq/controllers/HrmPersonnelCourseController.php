<?php

namespace frontend\modules\hq\controllers;

use Yii;
use frontend\modules\hq\models\HrmPersonnelCourse;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;
use yii\web\ForbiddenHttpException;
use yii\filters\VerbFilter;

class HrmPersonnelCourseController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmPersonnelCourse';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        
        $behaviors['jwtAuth'] = [
            'class' => JwtAuthBehavior::class,
            'actions' => ['index', 'view', 'create', 'update', 'delete', 'get-by-user', 'save-all'],
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
                'save-all' => ['POST'],
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
        return HrmPersonnelCourse::get_all();
    }

    public function actionView($id)
    {
        return HrmPersonnelCourse::_view($id);
    }

    public function actionCreate()
    {
        return HrmPersonnelCourse::_save();
    }

    public function actionUpdate($id)
    {
        return HrmPersonnelCourse::_save($id);
    }

    public function actionDelete($id)
    {
        return HrmPersonnelCourse::_delete($id);
    }

    public function actionGetByUser()
    {
        $userId = Yii::$app->request->get('userId');
        
        if (!$userId) {
            return ['success' => false, 'message' => 'شناسه کاربر ارسال نشده است'];
        }
        
        return HrmPersonnelCourse::getByUser($userId);
    }

    public function actionSaveAll()
    {
        $params = Yii::$app->request->post();
        
        $userId = $params['user_id'] ?? null;
        $items = $params['items'] ?? [];
        
        if (!$userId) {
            return ['success' => false, 'message' => 'شناسه کاربر ارسال نشده است'];
        }
        
        HrmPersonnelCourse::deleteByUser($userId);
        
        $savedItems = [];
        $errors = [];
        
        foreach ($items as $index => $item) {
            $model = new HrmPersonnelCourse();
            $item['user_id'] = $userId;
            $item['sort_order'] = $index;
            
            if ($model->load($item, '') && $model->save()) {
                $savedItems[] = $model;
            } else {
                $errors[] = $model->errors;
            }
        }
        
        return [
            'success' => empty($errors),
            'data' => $savedItems,
            'errors' => $errors,
            'count' => count($savedItems),
        ];
    }
}