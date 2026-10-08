<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;

class HrmMissionType extends ActiveRecord
{
    public static function tableName()
    {
        return 'hrm_mission_types';
    }

    public function rules()
    {
        return [
            [['name'], 'required'],
            [['is_active', 'sort_order'], 'integer'],
            [['name'], 'string', 'max' => 100],
            [['description'], 'string'],
            // این خط رو حذف کن
            // ['unique', 'message' => 'این کد قبلاً ثبت شده است'],
        ];
    }

    public function attributeLabels()
    {
        return [
            'id' => 'شناسه',
            'name' => 'نام نوع ماموریت', 
            'is_active' => 'فعال',
            'description' => 'توضیحات',
            'sort_order' => 'ترتیب نمایش',
            'created_at' => 'تاریخ ثبت',
            'updated_at' => 'تاریخ ویرایش',
        ];
    }

    public static function getActiveTypes()
    {
        return self::find()
            ->where(['is_active' => 1])
            ->orderBy(['sort_order' => SORT_ASC])
            ->all();
    }

    public static function getTypeOptions()
    {
        $types = self::getActiveTypes();
        $options = [];
        foreach ($types as $type) {
            $options[$type->id] = $type->name;
        }
        return $options;
    }
}