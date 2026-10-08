<?php

namespace frontend\modules\hq\controllers;

use Yii;  
use frontend\modules\hq\models\HrmVacationType;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;
use yii\web\ForbiddenHttpException;
use yii\filters\VerbFilter;

class HrmVacationTypeController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmVacationType';

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

    /**
     * لیست انواع مرخصی
     * GET /hrm-vacation-type
     */
    public function actionIndex()
    {
         

        $params = Yii::$app->request->get();
        $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
        $page = isset($params['page']) ? (int) $params['page'] : 1;

        $query = HrmVacationType::find()
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

    /**
     * نمایش یک نوع مرخصی
     * GET /hrm-vacation-type/<id>
     */
    public function actionView($id)
    {
        

        $model = HrmVacationType::find()
            ->where(['id' => $id])
            ->asArray()
            ->one();

        if (!$model) {
            return ['success' => false, 'message' => 'نوع مرخصی یافت نشد'];
        }

        return ['success' => true, 'data' => $model];
    }

    /**
     * ایجاد نوع مرخصی جدید
     * POST /hrm-vacation-type
     */
    public function actionCreate()
    {
       

        $params = Yii::$app->request->post();
        $model = new HrmVacationType();

        if ($model->load($params, '') && $model->save()) {
            return ['success' => true, 'data' => $model];
        }

        return ['success' => false, 'errors' => $model->errors];
    }

    /**
     * ویرایش نوع مرخصی
     * POST /hrm-vacation-type/edit/<id>
     */
    public function actionUpdate($id)
    {
        

        $model = HrmVacationType::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'نوع مرخصی یافت نشد'];
        }

        $params = Yii::$app->request->post();
        
        if ($model->load($params, '') && $model->save()) {
            return ['success' => true, 'data' => $model];
        }

        return ['success' => false, 'errors' => $model->errors];
    }

    /**
     * حذف نوع مرخصی
     * DELETE /hrm-vacation-type/<id>
     */
    public function actionDelete($id)
    {
        

        $model = HrmVacationType::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'نوع مرخصی یافت نشد'];
        }

        $inUse = \frontend\modules\hq\models\HrmVacation::find()
            ->where(['vacation_type_id' => $id])
            ->exists();

        if ($inUse) {
            return ['success' => false, 'message' => 'این نوع مرخصی در حال استفاده است و قابل حذف نمی‌باشد'];
        }

        $model->delete();
        return ['success' => true];
    }

    /**
     * دریافت لیست انواع مرخصی برای استفاده در dropdown
     * GET /hrm-vacation-type/list
     */
    public function actionList()
    {
         

        $types = HrmVacationType::find()
            ->where(['is_active' => 1])
            ->orderBy(['sort_order' => SORT_ASC])
            ->all();
        
        $options = [];
        foreach ($types as $type) {
            $options[$type->id] = $type->name . ($type->max_days > 0 ? " (حداکثر {$type->max_days} روز)" : '');
        }
        
        return [
            'success' => true,
            'data' => $options,
        ];
    }

    /**
     * فعال/غیرفعال کردن نوع مرخصی
     * POST /hrm-vacation-type/toggle-status/<id>
     */
    public function actionToggleStatus($id)
    {
        

        $model = HrmVacationType::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'نوع مرخصی یافت نشد'];
        }

        $model->is_active = $model->is_active ? 0 : 1;
        $model->save();

        return ['success' => true, 'data' => $model];
    }
}