<?php

namespace frontend\modules\hq\controllers;

use Yii;
use frontend\modules\hq\models\HrmPersonnelEducation;
use frontend\modules\hq\models\Persian;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;
use yii\web\ForbiddenHttpException;
use yii\filters\VerbFilter;

class HrmPersonnelEducationController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmPersonnelEducation';

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
        return HrmPersonnelEducation::get_all();
    }

    public function actionView($id)
    {
        return HrmPersonnelEducation::_view($id);
    }

    public function actionCreate()
    {
        return HrmPersonnelEducation::_save();
    }

    public function actionUpdate($id)
    {
        return HrmPersonnelEducation::_save($id);
    }

    public function actionDelete($id)
    {
        return HrmPersonnelEducation::_delete($id);
    }

    public function actionGetByUser()
    {
        $userId = Yii::$app->request->get('userId');

        if (!$userId) {
            return ['success' => false, 'message' => 'شناسه کاربر ارسال نشده است'];
        }

        return HrmPersonnelEducation::getByUser($userId);
    }

    // ذخیره همه رکوردها به صورت لیست
    public function actionSaveAll()
    {
        $params = Yii::$app->request->post();

        $userId = $params['user_id'] ?? null;
        $items = $params['items'] ?? [];

        if (!$userId) {
            return ['success' => false, 'message' => 'شناسه کاربر ارسال نشده است'];
        }

        // حذف همه رکوردهای قبلی
        HrmPersonnelEducation::deleteByUser($userId);

        $savedItems = [];
        $errors = [];

        foreach ($items as $index => $item) {
            $model = new HrmPersonnelEducation();
            $item['user_id'] = $userId;
            $item['sort_order'] = $index;

            if (isset($item['start_date'])) {
                $item['start_date'] = Persian::convert_date_to_en($item['start_date']);

            }
            
            if (isset($item['end_date'])) {
                $item['end_date'] = Persian::convert_date_to_en($item['end_date']);

            }

            //Persian::p2e ( ::convert_date_to_fa($params['birth_date']));

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