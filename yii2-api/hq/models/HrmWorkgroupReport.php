<?php

namespace frontend\modules\hq\models;

use Yii;
use yii\db\ActiveRecord;

class HrmWorkgroupReport extends ActiveRecord
{
    public static function tableName()
    {
        return 'hrm_contracts'; // ✅ تغییر به جدول قراردادها
    }

    public static function getReport()
    {
        $params = Yii::$app->request->get();
        $perPage = isset($params['per-page']) ? (int) $params['per-page'] : 10;
        $page = isset($params['page']) ? (int) $params['page'] : 1;

        // ===== کوئری اصلی از جدول قراردادها =====
        $query = self::find()
            ->select([
                'hrm_contracts.id as contract_id',
                'hrm_contracts.user_id',
                'hrm_contracts.contract_type',
                'hrm_contracts.contract_status',
                'hrm_contracts.national_code',
                'hrm_contracts.personnel_code',
                'hrm_contracts.contract_from_date',
                'hrm_contracts.contract_to_date',
                'hrm_contracts.created_at',
                'hrm_contracts.workgroup_id',
                'hrm_contracts.bakhsh_id',
                'hrm_contracts.ghesmat_id',
                'hrm_contracts.onvan_id',
                'user.first_name',
                'user.last_name',
                'user.phone_number',
                'hrm_workgroup.name as workgroup_name',
                'hrm_workgroup_bakhsh.name as bakhsh_name',
                'hrm_workgroup_ghesmat.name as ghesmat_name',
                'hrm_workgroup_onvan.name as onvan_name',
            ])
            ->leftJoin('user', 'user.id = hrm_contracts.user_id')
            ->leftJoin('hrm_workgroup', 'hrm_workgroup.id = hrm_contracts.workgroup_id')
            ->leftJoin('hrm_workgroup_bakhsh', 'hrm_workgroup_bakhsh.id = hrm_contracts.bakhsh_id')
            ->leftJoin('hrm_workgroup_ghesmat', 'hrm_workgroup_ghesmat.id = hrm_contracts.ghesmat_id')
            ->leftJoin('hrm_workgroup_onvan', 'hrm_workgroup_onvan.id = hrm_contracts.onvan_id')
            ->where(['hrm_contracts.contract_status' => HrmContract::STATUS_ACTIVE])
            ->orderBy(['hrm_contracts.id' => SORT_DESC])
            ->groupBy('hrm_contracts.id');

        // ====== فیلترها ======

        // کد پرسنلی
        if (!empty($params['personnel_code'])) {
            $query->andWhere(['like', 'hrm_contracts.personnel_code', $params['personnel_code']]);
        }

        // کاربر (نام کارمند)
        if (!empty($params['user_id'])) {
            $query->andWhere(['hrm_contracts.user_id' => $params['user_id']]);
        }

        // کد ملی
        if (!empty($params['national_code'])) {
            $query->andWhere(['like', 'hrm_contracts.national_code', $params['national_code']]);
        }

        // نوع قرارداد
        if (!empty($params['contract_type'])) {
            $query->andWhere(['hrm_contracts.contract_type' => $params['contract_type']]);
        }

        // گروه کاری
        if (!empty($params['workgroup_id'])) {
            $query->andWhere(['hrm_contracts.workgroup_id' => $params['workgroup_id']]);
        }

        // بخش
        if (!empty($params['bakhsh_id'])) {
            $query->andWhere(['hrm_contracts.bakhsh_id' => $params['bakhsh_id']]);
        }

        // قسمت
        if (!empty($params['ghesmat_id'])) {
            $query->andWhere(['hrm_contracts.ghesmat_id' => $params['ghesmat_id']]);
        }

        // عنوان
        if (!empty($params['onvan_id'])) {
            $query->andWhere(['hrm_contracts.onvan_id' => $params['onvan_id']]);
        }

        // ====== دریافت داده‌ها ======
        $countQuery = clone $query;
        $totalCount = $countQuery->count();

        $models = $query
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->asArray()
            ->all();

        // اضافه کردن اطلاعات تکمیلی برای هر رکورد
        foreach ($models as &$model) {
            // تبدیل تاریخ‌ها
            if (!empty($model['contract_from_date'])) {
                $model['contract_from_date_persian'] = Persian::convert_date_to_fa($model['contract_from_date']);
            }
            if (!empty($model['contract_to_date'])) {
                $model['contract_to_date_persian'] = Persian::convert_date_to_fa($model['contract_to_date']);
            }
            
            // برچسب نوع قرارداد
            $model['contract_type_label'] = (new HrmContract())->getContractLabel( $model['contract_type']);
            
            // اگر گروه کاری انتخاب نشده بود
            if (empty($model['workgroup_name'])) {
                $model['workgroup_name'] = '-';
            }
            if (empty($model['bakhsh_name'])) {
                $model['bakhsh_name'] = '-';
            }
            if (empty($model['ghesmat_name'])) {
                $model['ghesmat_name'] = '-';
            }
            if (empty($model['onvan_name'])) {
                $model['onvan_name'] = '-';
            }
        }

        return [
            'pages' => ceil($totalCount / $perPage),
            'totalCount' => $totalCount,
            'data' => $models,
        ];
    }
}