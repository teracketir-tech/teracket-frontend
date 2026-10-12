<?php

namespace frontend\modules\hq\models;

use Yii;
use frontend\modules\hq\models\HrmProcess;
use frontend\modules\hq\models\HrmProcessCalc;
use frontend\modules\hq\models\HrmContract;
use frontend\modules\hq\models\User;
use frontend\modules\hq\models\Persian;
use frontend\modules\hq\models\HrmBankAccount;
use PhpOffice\PhpSpreadsheet\IOFactory;
use yii\db\Expression;

class HrmProcessService
{
    private static function response($success, $message, $extra = [])
    {
        return array_merge([
            'success' => $success,
            'message' => $message,
        ], $extra);
    }

    private static function normalizeIds($ids)
    {
        if (!is_array($ids)) {
            return [];
        }

        return array_values(array_unique(array_filter(
            array_map('intval', $ids),
            static function ($id) {
                return $id > 0;
            }
        )));
    }

    /**
     * قیمت هر فرآیند از قرارداد پیمانکاری
     */
   /**
 * تعیین فیلد نرخ فرآیند
 */
private static function getUnitPriceField()
{
    $field = HrmSetting::getValue(
        'process.unit_price_field',
        'performance_bonus'
    );

    // فقط فیلدهای مربوط به نرخ فرآیند مجاز هستند.
    return in_array($field, ['performance_bonus', 'other_allowance'], true)
        ? $field
        : 'performance_bonus';
}

/**
 * دریافت نرخ هر فرآیند از قرارداد
 */
private static function getUnitPrice($contract)
{
    $field = self::getUnitPriceField();

    $price = (float) ($contract->$field ?? 0);

    if ($price > 0) {
        return $price;
    }

    // اگر فیلد انتخاب‌شده مقدار نداشت، فیلد دیگر بررسی شود.
    $otherField = $field === 'performance_bonus'
        ? 'other_allowance'
        : 'performance_bonus';

    return max(0, (float) ($contract->$otherField ?? 0));
}
    /**
     * قرارداد پیمانکاری فعال کاربر
     */
    private static function findActiveProjectContract($userId)
    {
        return HrmContract::find()
            ->where([
                'user_id' => $userId,
                'contract_status' => HrmContract::STATUS_ACTIVE,
                'contract_type' => HrmContract::TYPE_PROJECT,
            ])
            ->orderBy(['id' => SORT_DESC])
            ->one();
    }

    /**
     * آپلود اکسل
     * ستون A: کد پرسنلی
     * ستون B: تعداد فرآیند
     */
    public static function upload()
    {
        $params = Yii::$app->request->post();

        if (empty($_FILES['file']['tmp_name'])) {
            return self::response(false, 'فایلی انتخاب نشده است');
        }

        $month = (int)($params['month'] ?? 0);
        $year = (int)($params['year'] ?? 0);
        $dateFrom = trim((string)($params['date_from'] ?? ''));
        $dateTo = trim((string)($params['date_to'] ?? ''));

        if ($month < 1 || $month > 12) {
            return self::response(false, 'ماه انتخاب‌شده معتبر نیست');
        }

        if ($year <= 0) {
            return self::response(false, 'سال را انتخاب کنید');
        }

        if ($dateFrom === '' || $dateTo === '') {
            return self::response(false, 'بازه تاریخ را مشخص کنید');
        }

        try {
            $dateFromEn = Persian::convert_date_to_en($dateFrom);
            $dateToEn = Persian::convert_date_to_en($dateTo);
        } catch (\Throwable $e) {
            return self::response(false, 'فرمت تاریخ صحیح نیست');
        }

        try {
            $spreadsheet = IOFactory::load($_FILES['file']['tmp_name']);
            $rows = $spreadsheet->getActiveSheet()
                ->toArray(null, true, true, true);
        } catch (\Throwable $e) {
            Yii::error($e->getMessage(), 'hrm_process');

            return self::response(false, 'خواندن فایل اکسل ناموفق بود');
        }

        $db = Yii::$app->db;
        $tx = $db->beginTransaction();

        $inserted = 0;
        $errors = [];

        try {
            foreach ($rows as $rowNumber => $row) {
                if ((int)$rowNumber === 1) {
                    continue;
                }

                $personnelCode = trim((string)($row['A'] ?? ''));
                $rawCount = trim((string)($row['B'] ?? ''));

                if ($personnelCode === '' && $rawCount === '') {
                    continue;
                }

                if ($personnelCode === '') {
                    $errors[] = "ردیف {$rowNumber}: کد پرسنلی وارد نشده است";
                    continue;
                }

                if ($rawCount === '' || !is_numeric($rawCount) || (int)$rawCount < 0) {
                    $errors[] = "ردیف {$rowNumber}: تعداد فرآیند معتبر نیست";
                    continue;
                }

                $user = User::find()
                    ->where(['personnel_code' => $personnelCode])
                    ->one();

                if (!$user) {
                    $errors[] = "ردیف {$rowNumber}: کد پرسنلی {$personnelCode} یافت نشد";
                    continue;
                }

                $contract = self::findActiveProjectContract($user->id);

                if (!$contract) {
                    $errors[] = "ردیف {$rowNumber}: قرارداد پیمانکاری فعال یافت نشد";
                    continue;
                }

                $unitPrice = self::getUnitPrice($contract);

                if ($unitPrice <= 0) {
                    $errors[] = "ردیف {$rowNumber}: قیمت واحد فرآیند در قرارداد تنظیم نشده است";
                    continue;
                }

                $process = HrmProcess::find()
                    ->where([
                        'user_id' => $user->id,
                        'year' => $year,
                        'month' => $month,
                    ])
                    ->one();

                if ($process) {
                    $hasCalc = HrmProcessCalc::find()
                        ->where(['process_id' => $process->id])
                        ->exists();

                    if ($hasCalc || (int)$process->status === HrmProcess::STATUS_CALCULATED) {
                        $errors[] = "ردیف {$rowNumber}: برای این پرسنل در این ماه محاسبه ثبت شده است";
                        continue;
                    }
                } else {
                    $process = new HrmProcess();
                    $process->user_id = $user->id;
                    $process->year = $year;
                    $process->month = $month;
                }

                $process->contract_id = $contract->id;
                $process->workgroup_id = $contract->workgroup_id;
                $process->count = (int)$rawCount;
                $process->unit_price = $unitPrice;
                $process->date_from = $dateFromEn;
                $process->date_to = $dateToEn;
                $process->status = HrmProcess::STATUS_UPLOADED;

                if (!$process->save()) {
                    $errors[] = "ردیف {$rowNumber}: " .
                        json_encode($process->errors, JSON_UNESCAPED_UNICODE);
                    continue;
                }

                $inserted++;
            }

            $tx->commit();

            return self::response(
                true,
                "{$inserted} ردیف ثبت شد",
                [
                    'inserted' => $inserted,
                    'errors' => $errors,
                ]
            );
        } catch (\Throwable $e) {
            $tx->rollBack();
            Yii::error($e->getMessage(), 'hrm_process');

            return self::response(false, 'خطا در پردازش فایل');
        }
    }

    /**
     * پیش‌ثبت فرآیندهای انتخاب‌شده
     */
    /**
 * پیش‌ثبت محاسبات فرآیند
 *
 * وضعیت فرآیند:
 * 0 = آماده محاسبه
 * 1 = محاسبه شده
 *
 * وضعیت محاسبه:
 * 0 = پیش‌ثبت
 * 1 = ثبت نهایی
 */
public static function pre_submit($ids)
{
    $ids = array_values(array_unique(array_filter(
        array_map('intval', (array) $ids),
        function ($id) {
            return $id > 0;
        }
    )));

    if (empty($ids)) {
        return [
            'success' => false,
            'message' => 'هیچ فرآیندی انتخاب نشده است',
        ];
    }

    $db = Yii::$app->db;
    $tx = $db->beginTransaction();

    try {
        $rows = HrmProcess::find()
            ->where(['id' => $ids])
            ->orderBy(['id' => SORT_ASC])
            ->all();

        if (count($rows) !== count($ids)) {
            throw new \RuntimeException(
                'بعضی از فرآیندهای انتخاب‌شده پیدا نشدند'
            );
        }

        // قبل از هر تغییری، وضعیت تمام ردیف‌ها بررسی شود.
        foreach ($rows as $row) {
            if ((int) $row->status !== HrmProcess::STATUS_UPLOADED) {
                throw new \RuntimeException(
                    "فرآیند شماره {$row->id} قبلاً محاسبه شده است"
                );
            }

            if ((int) $row->count < 0 || (float) $row->unit_price < 0) {
                throw new \RuntimeException(
                    "تعداد یا نرخ فرآیند شماره {$row->id} معتبر نیست"
                );
            }

            // جلوگیری از ثبت تکراری برای یک فرآیند.
            $existingCalc = HrmProcessCalc::find()
                ->where([
                    'process_id' => $row->id,
                ])
                ->exists();

            if ($existingCalc) {
                throw new \RuntimeException(
                    "برای فرآیند شماره {$row->id} قبلاً محاسبه ثبت شده است"
                );
            }

            // جلوگیری از ایجاد محاسبه دوم برای همان پرسنل و دوره.
            $existingPeriod = HrmProcessCalc::find()
                ->where([
                    'user_id' => $row->user_id,
                    'year' => $row->year,
                    'month' => $row->month,
                ])
                ->exists();

            if ($existingPeriod) {
                throw new \RuntimeException(
                    "برای پرسنل شماره {$row->user_id} در ماه {$row->month} سال {$row->year} قبلاً محاسبه ثبت شده است"
                );
            }
        }

        foreach ($rows as $row) {
            $bankInfo = \frontend\modules\hq\models\HrmBankAccount::find()
                ->where([
                    'user_id' => $row->user_id,
                    'status' => 1,
                ])
                ->orderBy(['id' => SORT_DESC])
                ->one();

            $calc = new HrmProcessCalc();

            $calc->process_id = $row->id;
            $calc->user_id = $row->user_id;
            $calc->contract_id = $row->contract_id;
            $calc->workgroup_id = $row->workgroup_id;
            $calc->year = $row->year;
            $calc->month = $row->month;
            $calc->count = $row->count;
            $calc->unit_price = $row->unit_price;

            // مبلغ ناخالص فرآیند
            $calc->total_amount =
                (float) $row->count * (float) $row->unit_price;

            $calc->status = HrmProcessCalc::STATUS_PRE;

            if ($bankInfo) {
                $calc->bank_account = $bankInfo->account_number;
                $calc->bank_name = $bankInfo->bank_name ?? null;
            }

            if (!$calc->save()) {
                throw new \RuntimeException(
                    'خطا در ثبت محاسبه: ' .
                    json_encode(
                        $calc->errors,
                        JSON_UNESCAPED_UNICODE
                    )
                );
            }

            $row->status = HrmProcess::STATUS_CALCULATED;

            if (!$row->save(false)) {
                throw new \RuntimeException(
                    "تغییر وضعیت فرآیند شماره {$row->id} انجام نشد"
                );
            }
        }

        $tx->commit();

        return [
            'success' => true,
            'message' => count($rows) . ' فرآیند با موفقیت پیش‌ثبت شد',
        ];
    } catch (\Throwable $e) {
        if ($tx->isActive) {
            $tx->rollBack();
        }

        Yii::error($e->getMessage(), 'hrm_process');

        return [
            'success' => false,
            'message' => $e->getMessage(),
        ];
    }
}

    /**
     * ثبت نهایی فقط برای پیش‌ثبت‌ها
     */
    /**
 * ثبت نهایی محاسبات
 * فقط پیش‌ثبت‌های انتخاب‌شده نهایی می‌شوند.
 */
public static function final_submit($ids)
{
    $ids = array_values(array_unique(array_filter(
        array_map('intval', (array) $ids),
        function ($id) {
            return $id > 0;
        }
    )));

    if (empty($ids)) {
        return [
            'success' => false,
            'message' => 'هیچ محاسبه‌ای انتخاب نشده است',
        ];
    }

    $db = Yii::$app->db;
    $tx = $db->beginTransaction();

    try {
        $calcs = HrmProcessCalc::find()
            ->where(['id' => $ids])
            ->orderBy(['id' => SORT_ASC])
            ->all();

        if (count($calcs) !== count($ids)) {
            throw new \RuntimeException(
                'بعضی از محاسبات انتخاب‌شده پیدا نشدند'
            );
        }

        foreach ($calcs as $calc) {
            if ((int) $calc->status !== HrmProcessCalc::STATUS_PRE) {
                throw new \RuntimeException(
                    "محاسبه شماره {$calc->id} قبلاً ثبت نهایی شده یا وضعیت معتبری ندارد"
                );
            }

            // مبلغ نهایی مجدداً از تعداد و نرخ محاسبه می‌شود.
            $calc->total_amount =
                (float) $calc->count * (float) $calc->unit_price;

            $calc->status = HrmProcessCalc::STATUS_PAID;
            $calc->date_paid = date('Y-m-d');

            if (!$calc->save()) {
                throw new \RuntimeException(
                    'خطا در ثبت نهایی: ' .
                    json_encode(
                        $calc->errors,
                        JSON_UNESCAPED_UNICODE
                    )
                );
            }
        }

        $tx->commit();

        return [
            'success' => true,
            'message' => count($calcs) . ' محاسبه با موفقیت ثبت نهایی شد',
        ];
    } catch (\Throwable $e) {
        if ($tx->isActive) {
            $tx->rollBack();
        }

        Yii::error($e->getMessage(), 'hrm_process');

        return [
            'success' => false,
            'message' => $e->getMessage(),
        ];
    }
}

    /**
 * محاسبه مجدد پیش‌ثبت‌ها
 *
 * پیش‌ثبت قبلی حذف می‌شود و با نرخ فعلی قرارداد
 * و تعداد فعلی فرآیند، محاسبه جدید ساخته می‌شود.
 */
public static function recalculate($ids)
{
    $ids = array_values(array_unique(array_filter(
        array_map('intval', (array) $ids),
        function ($id) {
            return $id > 0;
        }
    )));

    if (empty($ids)) {
        return [
            'success' => false,
            'message' => 'هیچ محاسبه‌ای انتخاب نشده است',
        ];
    }

    $db = Yii::$app->db;
    $tx = $db->beginTransaction();

    try {
        $calcs = HrmProcessCalc::find()
            ->where([
                'id' => $ids,
                'status' => HrmProcessCalc::STATUS_PRE,
            ])
            ->all();

        if (count($calcs) !== count($ids)) {
            throw new \RuntimeException(
                'برخی از موارد انتخاب‌شده ثبت نهایی شده‌اند یا وجود ندارند'
            );
        }

        foreach ($calcs as $oldCalc) {
            $process = HrmProcess::findOne($oldCalc->process_id);

            if (!$process) {
                throw new \RuntimeException(
                    "فرآیند مربوط به محاسبه شماره {$oldCalc->id} پیدا نشد"
                );
            }

            $contract = self::findActiveProjectContract($process->user_id);

            if (!$contract) {
                throw new \RuntimeException(
                    "قرارداد پیمانکاری فعال برای پرسنل {$process->user_id} پیدا نشد"
                );
            }

            $unitPrice = self::getUnitPrice($contract);

            if ($unitPrice <= 0) {
                throw new \RuntimeException(
                    "نرخ فرآیند برای پرسنل {$process->user_id} معتبر نیست"
                );
            }

            $bankInfo = \frontend\modules\hq\models\HrmBankAccount::find()
                ->where([
                    'user_id' => $process->user_id,
                    'status' => 1,
                ])
                ->orderBy(['id' => SORT_DESC])
                ->one();

            // به‌روزرسانی اطلاعات فرآیند اصلی
            $process->contract_id = $contract->id;
            $process->workgroup_id = $contract->workgroup_id;
            $process->unit_price = $unitPrice;
            $process->status = HrmProcess::STATUS_CALCULATED;

            if (!$process->save(false)) {
                throw new \RuntimeException(
                    "به‌روزرسانی فرآیند شماره {$process->id} انجام نشد"
                );
            }

            // حذف پیش‌ثبت قدیمی
            if (!$oldCalc->delete()) {
                throw new \RuntimeException(
                    "حذف محاسبه قبلی شماره {$oldCalc->id} انجام نشد"
                );
            }

            // ایجاد محاسبه جدید
            $newCalc = new HrmProcessCalc();

            $newCalc->process_id = $process->id;
            $newCalc->user_id = $process->user_id;
            $newCalc->contract_id = $contract->id;
            $newCalc->workgroup_id = $contract->workgroup_id;
            $newCalc->year = $process->year;
            $newCalc->month = $process->month;
            $newCalc->count = $process->count;
            $newCalc->unit_price = $unitPrice;
            $newCalc->total_amount =
                (float) $process->count * $unitPrice;

            $newCalc->status = HrmProcessCalc::STATUS_PRE;

            if ($bankInfo) {
                $newCalc->bank_account = $bankInfo->account_number;
                $newCalc->bank_name = $bankInfo->bank_name ?? null;
            }

            if (!$newCalc->save()) {
                throw new \RuntimeException(
                    'ثبت محاسبه جدید انجام نشد: ' .
                    json_encode(
                        $newCalc->errors,
                        JSON_UNESCAPED_UNICODE
                    )
                );
            }
        }

        $tx->commit();

        return [
            'success' => true,
            'message' => count($calcs) . ' محاسبه با نرخ فعلی قرارداد مجدداً محاسبه شد',
        ];
    } catch (\Throwable $e) {
        if ($tx->isActive) {
            $tx->rollBack();
        }

        Yii::error($e->getMessage(), 'hrm_process');

        return [
            'success' => false,
            'message' => $e->getMessage(),
        ];
    }
}

    /**
 * حذف پیش‌ثبت و بازگرداندن فرآیند به حالت آماده محاسبه
 */
public static function delete_calcs($ids)
{
    $ids = array_values(array_unique(array_filter(
        array_map('intval', (array) $ids),
        function ($id) {
            return $id > 0;
        }
    )));

    if (empty($ids)) {
        return [
            'success' => false,
            'message' => 'هیچ محاسبه‌ای انتخاب نشده است',
        ];
    }

    $db = Yii::$app->db;
    $tx = $db->beginTransaction();

    try {
        $calcs = HrmProcessCalc::find()
            ->where([
                'id' => $ids,
                'status' => HrmProcessCalc::STATUS_PRE,
            ])
            ->all();

        if (count($calcs) !== count($ids)) {
            throw new \RuntimeException(
                'برخی از موارد انتخاب‌شده ثبت نهایی شده‌اند یا وجود ندارند؛ حذف انجام نشد'
            );
        }

        foreach ($calcs as $calc) {
            if ($calc->process_id) {
                $process = HrmProcess::findOne($calc->process_id);

                if ($process) {
                    $process->status = HrmProcess::STATUS_UPLOADED;

                    if (!$process->save(false)) {
                        throw new \RuntimeException(
                            "بازگرداندن وضعیت فرآیند شماره {$process->id} انجام نشد"
                        );
                    }
                }
            }

            if (!$calc->delete()) {
                throw new \RuntimeException(
                    "حذف محاسبه شماره {$calc->id} انجام نشد"
                );
            }
        }

        $tx->commit();

        return [
            'success' => true,
            'message' => count($calcs) . ' پیش‌ثبت حذف و وضعیت فرآیندها بازگردانده شد',
        ];
    } catch (\Throwable $e) {
        if ($tx->isActive) {
            $tx->rollBack();
        }

        Yii::error($e->getMessage(), 'hrm_process');

        return [
            'success' => false,
            'message' => $e->getMessage(),
        ];
    }
}

    /**
     * حذف فرآیندهای اصلی که هیچ محاسبه‌ای ندارند
     */
    public static function delete_processes($ids)
    {
        $ids = self::normalizeIds($ids);

        if (!$ids) {
            return self::response(false, 'آیتمی انتخاب نشده است');
        }

        $tx = Yii::$app->db->beginTransaction();

        try {
            $hasCalc = HrmProcessCalc::find()
                ->where(['process_id' => $ids])
                ->exists();

            if ($hasCalc) {
                $tx->rollBack();

                return self::response(
                    false,
                    'بعضی از فرآیندها محاسبه دارند؛ ابتدا پیش‌ثبت را حذف کنید'
                );
            }

            $deleted = HrmProcess::deleteAll(['id' => $ids]);

            $tx->commit();

            return self::response(true, "{$deleted} فرآیند حذف شد");
        } catch (\Throwable $e) {
            $tx->rollBack();
            Yii::error($e->getMessage(), 'hrm_process');

            return self::response(false, 'خطا در حذف فرآیندها');
        }
    }

    /**
 * صفر کردن کارکرد فرآیندهای محاسبه‌نشده
 */
public static function clear_work($userIds, $year = null, $month = null)
{
    $userIds = array_values(array_unique(array_filter(
        array_map('intval', (array) $userIds),
        function ($id) {
            return $id > 0;
        }
    )));

    $year = (int) $year;
    $month = (int) $month;

    if (empty($userIds)) {
        return [
            'success' => false,
            'message' => 'پرسنلی انتخاب نشده است',
        ];
    }

    if ($year <= 0 || $month < 1 || $month > 12) {
        return [
            'success' => false,
            'message' => 'سال یا ماه معتبر نیست',
        ];
    }

    $db = Yii::$app->db;
    $tx = $db->beginTransaction();

    try {
        $processes = HrmProcess::find()
            ->where([
                'user_id' => $userIds,
                'year' => $year,
                'month' => $month,
                'status' => HrmProcess::STATUS_UPLOADED,
            ])
            ->all();

        $updated = 0;

        foreach ($processes as $process) {
            // اگر برای این فرآیند محاسبه‌ای وجود دارد، دست نزن.
            $hasCalc = HrmProcessCalc::find()
                ->where(['process_id' => $process->id])
                ->exists();

            if ($hasCalc) {
                continue;
            }

            $process->count = 0;

            if (!$process->save(false)) {
                throw new \RuntimeException(
                    "صفر کردن کارکرد فرآیند شماره {$process->id} انجام نشد"
                );
            }

            $updated++;
        }

        $tx->commit();

        return [
            'success' => true,
            'message' => "کارکرد {$updated} فرآیند صفر شد",
        ];
    } catch (\Throwable $e) {
        if ($tx->isActive) {
            $tx->rollBack();
        }

        Yii::error($e->getMessage(), 'hrm_process');

        return [
            'success' => false,
            'message' => $e->getMessage(),
        ];
    }
}
}