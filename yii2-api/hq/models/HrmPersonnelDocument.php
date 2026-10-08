<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;
use yii\data\ActiveDataProvider;
use yii\web\UploadedFile;

class HrmPersonnelDocument extends ActiveRecord
{
    public $uploaded_files = [];

    public static function tableName()
    {
        return 'hrm_personnel_documents';
    }

    public function rules()
    {
        return [
            [['user_id'], 'required'],
            [['user_id'], 'integer'],
            [['photo', 'signature', 'birth_certificate', 'national_card', 'health_certificate', 'education_document_1', 'education_document_2'], 'string', 'max' => 255],
            [['custom_documents'], 'safe'],
            [['user_id'], 'unique', 'message' => 'این کاربر قبلاً ثبت شده است'],
        ];
    }

    public function attributeLabels()
    {
        return [
            'id' => 'شناسه',
            'user_id' => 'کاربر',
            'photo' => 'عکس پرسنلی',
            'signature' => 'امضای الکترونیکی',
            'birth_certificate' => 'شناسنامه',
            'national_card' => 'کارت ملی',
            'health_certificate' => 'گواهی سلامت',
            'education_document_1' => 'مدرک تحصیلی (پیام نور)',
            'education_document_2' => 'مدرک تحصیلی (علم و صنعت)',
            'custom_documents' => 'مدارک سفارشی',
            'created_at' => 'تاریخ ثبت',
            'updated_at' => 'تاریخ ویرایش',
        ];
    }

    // ============== روابط ==============

    public function getUser()
    {
        return $this->hasOne(User::class, ['id' => 'user_id']);
    }

    // ============== متدهای API ==============

    public static function get_all()
    {
        User::checkAccess(702);

        $params = Yii::$app->request->get();
        $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
        $page = isset($params['page']) ? (int) $params['page'] : 1;

        $query = self::find()
            ->with(['user'])
            ->orderBy(['id' => SORT_DESC]);

        if (!empty($params['user_id'])) {
            $query->andWhere(['user_id' => $params['user_id']]);
        }

        $totalCount = $query->count();
        $models = $query
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->asArray()
            ->all();

        foreach ($models as &$model) {
            $model['user'] = User::find()->where(['id' => $model['user_id']])->asArray()->one();
            $model['custom_documents'] = json_decode($model['custom_documents'], true) ?: [];
        }

        return [
            'pages' => ceil($totalCount / $perPage),
            'totalCount' => $totalCount,
            'data' => $models,
        ];
    }

    public static function _view($id)
    {
        User::checkAccess(702);

        $model = self::find()
            ->with(['user'])
            ->where(['id' => $id])
            ->asArray()
            ->one();

        if (!$model) {
            return ['success' => false, 'message' => 'رکورد یافت نشد'];
        }

        $model['user'] = User::find()->where(['id' => $model['user_id']])->asArray()->one();
        $model['custom_documents'] = json_decode($model['custom_documents'], true) ?: [];

        return ['success' => true, 'data' => $model];
    }

    public static function _save($id = null)
    {
        $params = Yii::$app->request->post();
        $files = UploadedFile::getInstancesByName('files');

        // اگر id ارسال نشده، بر اساس user_id چک کن
        if (!$id && isset($params['user_id'])) {
            $existing = self::find()->where(['user_id' => $params['user_id']])->one();
            if ($existing) {
                $id = $existing->id;
            }
        }

        if (!$id) {
            User::checkAccess(701);
            $model = new self();
        } else {
            User::checkAccess(703);
            $model = self::findOne($id);
            if (!$model) {
                return ['success' => false, 'message' => 'رکورد یافت نشد'];
            }
        }

        // تنظیم فیلدهای استاندارد
        $documentFields = ['photo', 'signature', 'birth_certificate', 'national_card', 'health_certificate', 'education_document_1', 'education_document_2'];
        foreach ($documentFields as $field) {
            if (isset($params[$field])) {
                $model->$field = $params[$field];
            }
        }

        // تنظیم custom_documents
        if (isset($params['custom_documents'])) {
            $model->custom_documents = json_encode($params['custom_documents']);
        }

        if ($model->save()) {
            // دیکود کردن برای پاسخ
            $model->custom_documents = json_decode($model->custom_documents, true) ?: [];
            return ['success' => true, 'data' => $model];
        }

        return ['success' => false, 'errors' => $model->errors];
    }

    public static function _delete($id)
    {
        User::checkAccess(704);

        $model = self::findOne($id);
        if (!$model) {
            return ['success' => false, 'message' => 'رکورد یافت نشد'];
        }

        $model->delete();
        return ['success' => true];
    }

    public static function getByUser($userId)
    {
        $model = self::find()
            ->where(['user_id' => $userId])
            ->asArray()
            ->one();

        if (!$model) {
            return ['success' => false, 'message' => 'اطلاعاتی برای این کاربر یافت نشد'];
        }

        $model['custom_documents'] = json_decode($model['custom_documents'], true) ?: [];

        return ['success' => true, 'data' => $model];
    }

    // آپلود فایل
    public static function uploadFile()
    {
        $params = Yii::$app->request->post();
        $userId = $params['user_id'] ?? null;
        $field = $params['field'] ?? null;
        $file = UploadedFile::getInstanceByName('file');

        if (!$userId || !$field || !$file) {
            return ['success' => false, 'message' => 'اطلاعات کامل نیست'];
        }

        // دریافت یا ایجاد رکورد
        $model = self::find()->where(['user_id' => $userId])->one();
        if (!$model) {
            $model = new self();
            $model->user_id = $userId;
        }

        // آپلود فایل
        $uploadPath = Yii::getAlias('@frontend/web/uploads/personnel/');
        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0777, true);
        }

        $fileName = $userId . '_' . $field . '_' . time() . '.' . $file->extension;
        $filePath = $uploadPath . $fileName;

        if ($file->saveAs($filePath)) {
            // حذف فایل قبلی
            if ($model->$field && file_exists($uploadPath . $model->$field)) {
                unlink($uploadPath . $model->$field);
            }

            $model->$field = $fileName;
            $model->save();

            return [
                'success' => true,
                'data' => [
                    'field' => $field,
                    'file' => $fileName,
                    'url' => '/uploads/personnel/' . $fileName,
                ]
            ];
        }

        return ['success' => false, 'message' => 'خطا در آپلود فایل'];
    }

    // حذف فایل
    public static function deleteFile()
    {
        $params = Yii::$app->request->post();
        $userId = $params['user_id'] ?? null;
        $field = $params['field'] ?? null;

        if (!$userId || !$field) {
            return ['success' => false, 'message' => 'اطلاعات کامل نیست'];
        }

        $model = self::find()->where(['user_id' => $userId])->one();
        if (!$model) {
            return ['success' => false, 'message' => 'رکورد یافت نشد'];
        }

        $uploadPath = Yii::getAlias('@frontend/web/uploads/personnel/');
        if ($model->$field && file_exists($uploadPath . $model->$field)) {
            unlink($uploadPath . $model->$field);
        }

        $model->$field = null;
        $model->save();

        return ['success' => true];
    }
}