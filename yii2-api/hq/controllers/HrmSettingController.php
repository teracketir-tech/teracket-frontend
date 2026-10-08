<?php

namespace frontend\modules\hq\controllers;

use Yii;
use frontend\modules\hq\models\HrmSetting;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;
use yii\web\ForbiddenHttpException;
use yii\filters\VerbFilter;

class HrmSettingController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmSetting';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        
        $behaviors['jwtAuth'] = [
            'class' => JwtAuthBehavior::class,
            'actions' => ['index', 'view', 'create', 'update', 'delete', 'by-group', 'get'],
        ];
        
        $behaviors['verbs'] = [
            'class' => VerbFilter::class,
            'actions' => [
                'index' => ['GET'],
                'view' => ['GET'],
                'create' => ['POST'],
                'update' => ['PATCH', 'PUT'],
                'delete' => ['DELETE'],
                'by-group' => ['GET'],
                'get' => ['GET'],
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
        return HrmSetting::get_all();
    }

    public function actionView($id)
    {
        $model = HrmSetting::find()->where(['id' => $id])->asArray()->one();
        if (!$model) {
            return ['success' => false, 'message' => 'تنظیمات یافت نشد'];
        }
        return ['success' => true, 'data' => $model];
    }

    public function actionCreate()
    {
        return HrmSetting::_save();
    }

    public function actionUpdate($id)
    {
        return HrmSetting::_save($id);
    }

    public function actionDelete($id)
    {
        return HrmSetting::_delete($id);
    }

    public function actionByGroup($group)
    {
        try {
            //Yii::$app->user->checkAccess(702);
        } catch (\Exception $e) {
            throw new ForbiddenHttpException('شما دسترسی لازم را ندارید');
        }

        $settings = HrmSetting::getByGroup($group);
        return ['success' => true, 'data' => $settings];
    }

    public function actionGet($key)
    {
        try {
            //Yii::$app->user->checkAccess(702);
        } catch (\Exception $e) {
            throw new ForbiddenHttpException('شما دسترسی لازم را ندارید');
        }

        $value = HrmSetting::getValue($key);
        return ['success' => true, 'data' => ['key' => $key, 'value' => $value]];
    }
}