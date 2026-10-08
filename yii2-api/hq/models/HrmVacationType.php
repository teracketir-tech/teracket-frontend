<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;

class HrmVacationType extends ActiveRecord
{
    public static function tableName()
    {
        return 'hrm_vacation_types';
    }

    public function rules()
    {
        return [
           
            [['name'], 'required'],
            [['max_days', 'is_paid', 'is_annual', 'is_active', 'sort_order'], 'integer'],
            [['name'], 'string', 'max' => 100],
            [['description'], 'string'],
        ];
    } 

    public function attributeLabels()
    {
        return [
            'id' => 'شناسه',
            'name' => 'نام نوع مرخصی', 
            'max_days' => 'حداکثر روز مجاز',
            'is_paid' => 'با حقوق',
            'is_annual' => 'مرخصی سالانه',
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
            $options[$type->id] = $type->name . ($type->max_days > 0 ? " (حداکثر {$type->max_days} روز)" : '');
        }
        return $options;
    }
}