<?php

namespace frontend\modules\hq\controllers;

use Yii;
use frontend\modules\hq\models\HrmMissionType;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;
use yii\web\ForbiddenHttpException;
use yii\filters\VerbFilter;

class HrmMissionTypeController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmMissionType';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        
        $behaviors['jwtAuth'] = [
            'class' => JwtAuthBehavior::class,
            'actions' => ['index', 'view', 'create', 'edit', 'delete', 'list', 'toggle-status'],
        ];
        
        $behaviors['verbs'] = [
            'class' => VerbFilter::class,
            'actions' => [
                'index' => ['GET'],
                'view' => ['GET'],
                'create' => ['POST'],
                'edit' => ['POST'],
                'delete' => ['DELETE'],
                'list' => ['GET'],
                'toggle-status' => ['POST'],
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
        try {
           // Yii::$app->user->checkAccess(702);
        } catch (\Exception $e) {
           //  throw new ForbiddenHttpException('شما دسترسی لازم را ندارید');
        }

        $params = Yii::$app->request->get();
        $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
        $page = isset($params['page']) ? (int) $params['page'] : 1;

        $query = HrmMissionType::find()
            ->orderBy(['sort_order' => SORT_ASC, 'id' => SORT_DESC]);

        if (isset($params['is_active']) && $params['is_active'] !== '') {
            $query->andWhere(['is_active' => $params['is_active']]);
        }

        if (!empty($params['search'])) {
            $query->andWhere(['or', 
                ['like', 'name', $params['search']] 
            ]);
        }

        $totalCount = $query->count();
        $models = $query
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->asArray()
            ->all();

        return [
            'pages' => ceil($totalCount / $perPage),
            'totalCount' => $totalCount,
            'data' => $models,
        ];
    }

    public function actionView($id)
    {
        try {
           // Yii::$app->user->checkAccess(702);
        } catch (\Exception $e) {
           //  throw new ForbiddenHttpException('شما دسترسی لازم را ندارید');
        }

        $model = HrmMissionType::find()
            ->where(['id' => $id])
            ->asArray()
            ->one();

        if (!$model) {
            return ['success' => false, 'message' => 'نوع ماموریت یافت نشد'];
        }

        return ['success' => true, 'data' => $model];
    }

    public function actionCreate()
    {
        try {
           // Yii::$app->user->checkAccess(701);
        } catch (\Exception $e) {
           //  throw new ForbiddenHttpException('شما دسترسی لازم را ندارید');
        }

        $params = Yii::$app->request->post();
        $model = new HrmMissionType();

        if ($model->load($params, '') && $model->save()) {
            return ['success' => true, 'data' => $model];
        }

        return ['success' => false, 'errors' => $model->errors];
    }

    public function actionUpdate($id)
    {
        try {
           // Yii::$app->user->checkAccess(703);
        } catch (\Exception $e) {
           //  throw new ForbiddenHttpException('شما دسترسی لازم را ندارید');
        }

        $model = HrmMissionType::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'نوع ماموریت یافت نشد'];
        }

        $params = Yii::$app->request->post();
        
        if ($model->load($params, '') && $model->save()) {
            return ['success' => true, 'data' => $model];
        }

        return ['success' => false, 'errors' => $model->errors];
    }

    public function actionDelete($id)
    {
        try {
           // Yii::$app->user->checkAccess(704);
        } catch (\Exception $e) {
           //  throw new ForbiddenHttpException('شما دسترسی لازم را ندارید');
        }

        $model = HrmMissionType::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'نوع ماموریت یافت نشد'];
        }

        $inUse = \frontend\modules\hq\models\HrmMission::find()
            ->where(['mission_type_id' => $id])
            ->exists();

        if ($inUse) {
            return ['success' => false, 'message' => 'این نوع ماموریت در حال استفاده است و قابل حذف نمی‌باشد'];
        }

        $model->delete();
        return ['success' => true];
    }

    public function actionList()
    {
        try {
           // Yii::$app->user->checkAccess(702);
        } catch (\Exception $e) {
           //  throw new ForbiddenHttpException('شما دسترسی لازم را ندارید');
        }

        $types = HrmMissionType::find()
            ->where(['is_active' => 1])
            ->orderBy(['sort_order' => SORT_ASC])
            ->all();
        
        $options = [];
        foreach ($types as $type) {
            $options[$type->id] = $type->name;
        }
        
        return [
            'success' => true,
            'data' => $options,
        ];
    }

    public function actionToggleStatus($id)
    {
        try {
           // Yii::$app->user->checkAccess(703);
        } catch (\Exception $e) {
           //  throw new ForbiddenHttpException('شما دسترسی لازم را ندارید');
        }

        $model = HrmMissionType::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'نوع ماموریت یافت نشد'];
        }

        $model->is_active = $model->is_active ? 0 : 1;
        $model->save();

        return ['success' => true, 'data' => $model];
    }
}