<?php

namespace frontend\modules\hq\services;

use Yii;
use frontend\modules\hq\models\HrmProcess;
use frontend\modules\hq\models\HrmProcessCalc;
use frontend\modules\hq\models\HrmContract;
use frontend\modules\hq\models\HrmSetting;
use frontend\modules\hq\models\User;
use frontend\modules\hq\models\Persian;
use PhpOffice\PhpSpreadsheet\IOFactory;

class HrmProcessService
{
    /**
     * فیلد قابل تنظیم قیمت واحد فرآیند
     * اگه کارفرما گفت فیلد دیگه، توی hrm_settings با کلید process.unit_price_field
     * مقدار جدید رو بذار (مثلاً other_allowance یا contract_amount)
     */
    private static function getUnitPriceField()
    {
        return HrmSetting::getValue('process.unit_price_field', 'performance_bonus');
    }

    /**
     * محاسبه قیمت واحد از قرارداد
     */
    private static function getUnitPrice($contract)
    {
        $field = self::getUnitPriceField();
        $amount = (int)($contract->$field ?? 0);

        if ($amount <= 0) {
            $amount = (int)$contract->performance_bonus
                   ?: (int)$contract->other_allowance
                   ?: (int)$contract->contract_amount
                   ?: 0;
        }

        return $amount;
    }

    /**
     * پیدا کردن قرارداد پیمانکاری فعال یه کاربر
     */
    private static function findActiveProjectContract($userId)
    {
        return HrmContract::find()
            ->where([
                'user_id'         => $userId,
                'contract_status' => HrmContract::STATUS_ACTIVE,
                'contract_type'   => HrmContract::TYPE_PROJECT,
            ])
            ->orderBy(['id' => SORT_DESC])
            ->one();
    }

    /**
     * ✅ ۱. آپلود اکسل فرآیند
     * ستون‌ها: A = personelcode | B = FaraiandCount
     */
    public static function upload()
    {
        $params = Yii::$app->request->post();

        if (empty($_FILES['file']['tmp_name'])) {
            return ['success' => false, 'message' => 'فایلی انتخاب نشده است'];
        }

        if (empty($params['month'])) {
            return ['success' => false, 'message' => 'ماه را انتخاب کنید'];
        }

        $year     = !empty($params['year']) ? (int)$params['year'] : (int)date('Y');
        $month    = (int)$params['month'];
        $dateFrom = $params['date_from'] ?? null;
        $dateTo   = $params['date_to']   ?? null;

        if (!$dateFrom || !$dateTo) {
            return ['success' => false, 'message' => 'بازه تاریخ را مشخص کنید'];
        }

        // تبدیل تاریخ شمسی به میلادی برای ذخیره در دیتابیس
        try {
            $dateFromEn = Persian::convert_date_to_en($dateFrom);
            $dateToEn   = Persian::convert_date_to_en($dateTo);
        } catch (\Throwable $e) {
            return ['success' => false, 'message' => 'فرمت تاریخ صحیح نیست'];
        }

        try {
            $spreadsheet = IOFactory::load($_FILES['file']['tmp_name']);
            $sheet       = $spreadsheet->getActiveSheet();
            $rows        = $sheet->toArray(null, true, true, true);

            $insertedCount = 0;
            $errors        = [];

            $db = Yii::$app->db;
            $tx = $db->beginTransaction();

            try {
                foreach ($rows as $i => $row) {
                    if ($i === 1) continue; // هدر

                    $personnelCode = trim((string)($row['A'] ?? ''));
                    $count         = (int)($row['B'] ?? 0);

                    if ($personnelCode === '') continue;

                    // پیدا کردن کاربر
                    $foundUser = User::find()
                        ->where(['personnel_code' => $personnelCode])
                        ->one();

                    if (!$foundUser) {
                        $errors[] = "ردیف {$i}: کد پرسنلی {$personnelCode} یافت نشد";
                        continue;
                    }

                    // قرارداد پیمانکاری فعال
                    $contract = self::findActiveProjectContract($foundUser->id);

                    if (!$contract) {
                        $errors[] = "ردیف {$i}: قرارداد پیمانکاری فعال یافت نشد";
                        continue;
                    }

                    $unitPrice = self::getUnitPrice($contract);

                    if ($unitPrice <= 0) {
                        $errors[] = "ردیف {$i}: قیمت واحد فرآیند تنظیم نشده است";
                        continue;
                    }

                    // upsert
                    $existing = HrmProcess::find()
                        ->where([
                            'user_id' => $foundUser->id,
                            'year'    => $year,
                            'month'   => $month,
                        ])
                        ->one();

                    if ($existing) {
                        if ($existing->status === HrmProcess::STATUS_CALCULATED) {
                            $errors[] = "ردیف {$i}: قبلاً برای این ماه محاسبه شده است";
                            continue;
                        }
                        $existing->count        = $count;
                        $existing->contract_id  = $contract->id;
                        $existing->workgroup_id = $contract->workgroup_id;
                        $existing->unit_price   = $unitPrice;
                        $existing->date_from    = $dateFromEn;
                        $existing->date_to      = $dateToEn;
                        $existing->save(false);
                    } else {
                        $model = new HrmProcess();
                        $model->user_id       = $foundUser->id;
                        $model->contract_id   = $contract->id;
                        $model->workgroup_id  = $contract->workgroup_id;
                        $model->year          = $year;
                        $model->month         = $month;
                        $model->count         = $count;
                        $model->unit_price    = $unitPrice;
                        $model->date_from     = $dateFromEn;
                        $model->date_to       = $dateToEn;
                        $model->status        = HrmProcess::STATUS_UPLOADED;
                        $model->save(false);
                    }

                    $insertedCount++;
                }

                $tx->commit();

                return [
                    'success' => true,
                    'message' => "{$insertedCount} ردیف با موفقیت ثبت شد",
                    'errors'  => $errors,
                ];

            } catch (\Throwable $e) {
                $tx->rollBack();
                throw $e;
            }

        } catch (\Throwable $e) {
            Yii::error($e->getMessage(), 'hrm_process');
            return [
                'success' => false,
                'message' => 'خطا در پردازش فایل: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * ✅ ۲. پیش‌ثبت (hrm_process → hrm_process_calc با status=0)
     */
    public static function pre_submit($ids)
    {
        if (empty($ids) || !is_array($ids)) {
            return ['success' => false, 'message' => 'آیتمی انتخاب نشده است'];
        }

        $db = Yii::$app->db;
        $tx = $db->beginTransaction();

        try {
            $count = 0;

            $rows = HrmProcess::find()
                ->where(['id' => $ids])
                ->andWhere(['status' => HrmProcess::STATUS_UPLOADED])
                ->all();

            foreach ($rows as $row) {
                // حذف پیش‌ثبت قبلی برای همین ماه
                HrmProcessCalc::deleteAll([
                    'user_id' => $row->user_id,
                    'year'    => $row->year,
                    'month'   => $row->month,
                    'status'  => HrmProcessCalc::STATUS_PRE,
                ]);

                // اطلاعات بانکی کاربر
                $bankInfo = \frontend\modules\hq\models\HrmBankAccount::find()
                    ->where(['user_id' => $row->user_id, 'status' => 1])
                    ->orderBy(['id' => SORT_DESC])
                    ->one();

                $calc = new HrmProcessCalc();
                $calc->process_id   = $row->id;
                $calc->user_id      = $row->user_id;
                $calc->contract_id  = $row->contract_id;
                $calc->workgroup_id = $row->workgroup_id;
                $calc->year         = $row->year;
                $calc->month        = $row->month;
                $calc->count        = $row->count;
                $calc->unit_price   = $row->unit_price;
                $calc->total_amount = $row->count * $row->unit_price;
                $calc->status       = HrmProcessCalc::STATUS_PRE;

                if ($bankInfo) {
                    $calc->bank_account = $bankInfo->account_number;
                }

                $calc->save(false);

                // علامت‌گذاری فرآیند به محاسبه‌شده
                $row->status = HrmProcess::STATUS_CALCULATED;
                $row->save(false);

                $count++;
            }

            $tx->commit();
            return ['success' => true, 'message' => "{$count} مورد پیش‌ثبت شد"];

        } catch (\Throwable $e) {
            $tx->rollBack();
            Yii::error($e->getMessage(), 'hrm_process');
            return ['success' => false, 'message' => 'خطا در پیش‌ثبت: ' . $e->getMessage()];
        }
    }

    /**
     * ✅ ۳. ثبت نهایی (status: 0 → 1)
     */
    public static function final_submit($ids)
    {
        if (empty($ids) || !is_array($ids)) {
            return ['success' => false, 'message' => 'آیتمی انتخاب نشده است'];
        }

        $count = HrmProcessCalc::updateAll(
            [
                'status'     => HrmProcessCalc::STATUS_PAID,
                'date_paid'  => date('Y-m-d'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id'     => $ids,
                'status' => HrmProcessCalc::STATUS_PRE,
            ]
        );

        return ['success' => true, 'message' => "{$count} مورد ثبت نهایی شد"];
    }

    /**
     * ✅ ۴. محاسبه مجدد (حذف calc + برگرداندن status فرآیند)
     */
    public static function recalculate($ids)
    {
        if (empty($ids) || !is_array($ids)) {
            return ['success' => false, 'message' => 'آیتمی انتخاب نشده است'];
        }

        $db = Yii::$app->db;
        $tx = $db->beginTransaction();

        try {
            $calcs = HrmProcessCalc::find()
                ->where(['id' => $ids, 'status' => HrmProcessCalc::STATUS_PRE])
                ->all();

            foreach ($calcs as $c) {
                if ($c->process_id) {
                    $p = HrmProcess::findOne($c->process_id);
                    if ($p && $p->status === HrmProcess::STATUS_CALCULATED) {
                        $p->status = HrmProcess::STATUS_UPLOADED;
                        $p->save(false);
                    }
                }
                $c->delete();
            }

            $tx->commit();
            return [
                'success' => true,
                'message' => 'محاسبه مجدد انجام شد، دوباره پیش‌ثبت کنید',
            ];

        } catch (\Throwable $e) {
            $tx->rollBack();
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * ✅ ۵. حذف calc (فقط پیش‌ثبت‌ها)
     */
    public static function delete_calcs($ids)
    {
        if (empty($ids) || !is_array($ids)) {
            return ['success' => false, 'message' => 'آیتمی انتخاب نشده است'];
        }

        $deleted = HrmProcessCalc::deleteAll([
            'id'     => $ids,
            'status' => HrmProcessCalc::STATUS_PRE,
        ]);

        return ['success' => true, 'message' => "{$deleted} مورد حذف شد"];
    }

    /**
     * ✅ ۶. حذف فرآیند اصلی (از لیست محاسبه فرآیند)
     */
    public static function delete_processes($ids)
    {
        if (empty($ids) || !is_array($ids)) {
            return ['success' => false, 'message' => 'آیتمی انتخاب نشده است'];
        }

        $db = Yii::$app->db;
        $tx = $db->beginTransaction();

        try {
            // چک کنیم که پیش‌ثبت نشده باشن
            $blocked = HrmProcessCalc::find()
                ->where(['process_id' => $ids])
                ->exists();

            if ($blocked) {
                return [
                    'success' => false,
                    'message' => 'بعضی از موارد انتخاب‌شده پیش‌ثبت شده‌اند. اول محاسبه رو حذف کنید',
                ];
            }

            $deleted = HrmProcess::deleteAll(['id' => $ids]);

            $tx->commit();
            return ['success' => true, 'message' => "{$deleted} مورد حذف شد"];

        } catch (\Throwable $e) {
            $tx->rollBack();
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * ✅ ۷. کارکرد صفر شود (لیست پرسنل فرآیندی)
     * ورودی: user_ids + year + month
     */
    public static function clear_work($userIds, $year = null, $month = null)
    {
        if (empty($userIds) || !is_array($userIds)) {
            return ['success' => false, 'message' => 'پرسنلی انتخاب نشده است'];
        }

        if (!$year || !$month) {
            return ['success' => false, 'message' => 'سال و ماه را مشخص کنید'];
        }

        $count = HrmProcess::updateAll(
            [
                'count'      => 0,
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'user_id' => $userIds,
                'year'    => $year,
                'month'   => $month,
            ]
        );

        return ['success' => true, 'message' => "کارکرد {$count} مورد صفر شد"];
    }
}