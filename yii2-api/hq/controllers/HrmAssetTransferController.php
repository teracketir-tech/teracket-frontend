<?php

namespace frontend\modules\hq\controllers;

use frontend\modules\hq\models\User;
use frontend\modules\hq\models\HrmAssetTransfer;
use yii\rest\ActiveController;
use frontend\components\JwtAuthBehavior;

class HrmAssetTransferController extends ActiveController
{
    public $modelClass = 'frontend\modules\hq\models\HrmAssetTransfer';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        $behaviors['jwtAuth'] = [
            'class' => JwtAuthBehavior::class,
            'actions' => ['index', 'create', 'delete'],
        ];
        return $behaviors;
    }

    public function actions()
    {
        $actions = parent::actions();
        unset($actions['index'], $actions['create'], $actions['delete']);
        return $actions;
    }

    public function actionIndex()
    {
        if(($_GET['viewall'] || false)==true){
            return HrmAssetTransfer::get_all_view();
        }else{
 return HrmAssetTransfer::get_all($_GET['viewall'] || false);
        }
    
       
    }

    public function actionCreate()
    {
        return HrmAssetTransfer::_save();
    }

    public function actionDelete($id)
    {
        return HrmAssetTransfer::_delete($id);
    }
}