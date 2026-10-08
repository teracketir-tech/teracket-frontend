<?php

namespace frontend\modules\hq\services;

use Yii;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use frontend\modules\hq\models\HrmProcess;
use frontend\modules\hq\models\HrmProcessCalc;
use frontend\modules\hq\models\User;
use frontend\modules\hq\models\HrmWorkgroup;
use frontend\modules\hq\models\Persian;

class ProcessExcelService
{
    /**
     * ✅ خروجی اکسل برای سابقه واریز فرآیند (status=1)
     */
    public static function history($ids = [])
    {
        $query = HrmProcessCalc::find()->where(['status' => HrmProcessCalc::STATUS_PAID]);

        if (!empty($ids) && is_array($ids)) {
            $query->andWhere(['id' => $ids]);
        }

        $rows = $query->orderBy(['year' => SORT_DESC, 'month' => SORT_DESC, 'id' => SORT_ASC])->all();

        $headers = [
            'ردیف',
            'کد پرسنلی',
            'نام و نام خانوادگی',
            'گروه کاری',
            'ماه',
            'سال',
            'تعداد',
            'قیمت واحد (ریال)',
            'مبلغ کل (ریال)',
            'شماره حساب',
            'تاریخ واریز',
        ];

        $data = [];
        $i = 1;
        foreach ($rows as $row) {
            $user = $row->user;
            $data[] = [
                $i++,
                $user->personnel_code ?? '-',
                trim(($user->first_name ?? '') . ' ' . ($user->last_name ?? '')),
                $row->workgroup->name ?? '-',
                Persian::get_month_name($row->month),
                $row->year,
                $row->count,
                number_format($row->unit_price),
                number_format($row->total_amount),
                $row->bank_account ?? '-',
                $row->date_paid ?? '-',
            ];
        }

        return self::buildExcel(
            'سابقه واریز فرآیند',
            $headers,
            $data,
            'process_history_' . date('YmdHis') . '.xlsx'
        );
    }

    /**
     * ✅ خروجی اکسل برای محاسبه فرآیند (status=0)
     */
    public static function calculateList($ids = [])
    {
        $query = HrmProcessCalc::find()->where(['status' => HrmProcessCalc::STATUS_PRE]);

        if (!empty($ids) && is_array($ids)) {
            $query->andWhere(['id' => $ids]);
        }

        $rows = $query->orderBy(['year' => SORT_DESC, 'month' => SORT_DESC, 'id' => SORT_ASC])->all();

        $headers = [
            'ردیف',
            'کد پرسنلی',
            'نام و نام خانوادگی',
            'گروه کاری',
            'ماه',
            'سال',
            'تعداد',
            'قیمت واحد (ریال)',
            'مبلغ کل (ریال)',
        ];

        $data = [];
        $i = 1;
        foreach ($rows as $row) {
            $user = $row->user;
            $data[] = [
                $i++,
                $user->personnel_code ?? '-',
                trim(($user->first_name ?? '') . ' ' . ($user->last_name ?? '')),
                $row->workgroup->name ?? '-',
                Persian::get_month_name($row->month),
                $row->year,
                $row->count,
                number_format($row->unit_price),
                number_format($row->total_amount),
            ];
        }

        return self::buildExcel(
            'محاسبه فرآیند',
            $headers,
            $data,
            'process_calculate_' . date('YmdHis') . '.xlsx'
        );
    }

    /**
     * ✅ خروجی اکسل برای لیست پرسنل فرآیندی
     */
    public static function personnelList($userIds = [])
    {
        $query = \frontend\modules\hq\models\HrmContract::find()
            ->alias('c')
            ->joinWith(['user u'])
            ->where([
                'c.contract_status' => \frontend\modules\hq\models\HrmContract::STATUS_ACTIVE,
                'c.contract_type'   => \frontend\modules\hq\models\HrmContract::TYPE_PROJECT,
            ])
            ->andWhere(['>', 'c.contract_amount', 0]);

        if (!empty($userIds) && is_array($userIds)) {
            $query->andWhere(['c.user_id' => $userIds]);
        }

        $rows = $query->orderBy(['u.id' => SORT_ASC])->all();

        $headers = [
            'ردیف',
            'کد پرسنلی',
            'نام و نام خانوادگی',
            'گروه کاری',
            'قیمت واحد (ریال)',
        ];

        $data = [];
        $i = 1;
        foreach ($rows as $row) {
            $user = $row->user;
            $data[] = [
                $i++,
                $user->personnel_code ?? '-',
                trim(($user->first_name ?? '') . ' ' . ($user->last_name ?? '')),
                $row->workgroup->name ?? '-',
                number_format($row->contract_amount),
            ];
        }

        return self::buildExcel(
            'لیست پرسنل فرآیندی',
            $headers,
            $data,
            'process_personnel_' . date('YmdHis') . '.xlsx'
        );
    }

    /**
     * ✅ ساخت فایل اکسل (مشترک بین همه)
     * - راست‌به‌چپ
     * - هدر سبز
     * - border
     * - autosize
     */
    private static function buildExcel($title, $headers, $data, $filename)
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // راست‌به‌چپ
        $sheet->setRightToLeft(true);

        // عنوان
        $sheet->setCellValue('A1', $title);
        $sheet->mergeCells('A1:' . self::getColumnLetter(count($headers)) . '1');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
        $sheet->getStyle('A1')->getAlignment()
            ->setHorizontal(Alignment::HORIZONTAL_CENTER)
            ->setVertical(Alignment::VERTICAL_CENTER);
        $sheet->getRowDimension(1)->setRowHeight(30);

        // هدرها در ردیف ۲
        $col = 'A';
        foreach ($headers as $header) {
            $sheet->setCellValue($col . '2', $header);
            $col++;
        }

        // استایل هدر
        $lastCol = self::getColumnLetter(count($headers));
        $headerRange = 'A2:' . $lastCol . '2';
        $sheet->getStyle($headerRange)->getFont()->setBold(true)->getColor()->setRGB('FFFFFF');
        $sheet->getStyle($headerRange)->getFill()
            ->setFillType(Fill::FILL_SOLID)
            ->getStartColor()->setRGB('31B880');
        $sheet->getStyle($headerRange)->getAlignment()
            ->setHorizontal(Alignment::HORIZONTAL_CENTER)
            ->setVertical(Alignment::VERTICAL_CENTER);
        $sheet->getRowDimension(2)->setRowHeight(25);

        // داده‌ها از ردیف ۳
        $rowNum = 3;
        foreach ($data as $row) {
            $col = 'A';
            foreach ($row as $value) {
                $sheet->setCellValueExplicit(
                    $col . $rowNum,
                    (string)$value,
                    \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING
                );
                $col++;
            }
            $rowNum++;
        }

        // border برای همه
        if ($rowNum > 3) {
            $dataRange = 'A2:' . $lastCol . ($rowNum - 1);
            $sheet->getStyle($dataRange)->getBorders()->getAllBorders()
                ->setBorderStyle(Border::BORDER_THIN)
                ->getColor()->setRGB('CCCCCC');
        }

        // وسط‌چین برای همه
        $sheet->getStyle('A2:' . $lastCol . ($rowNum - 1))->getAlignment()
            ->setHorizontal(Alignment::HORIZONTAL_CENTER)
            ->setVertical(Alignment::VERTICAL_CENTER);

        // autosize
        $col = 'A';
        for ($i = 0; $i < count($headers); $i++) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
            $col++;
        }

        // خروجی
        return self::output($spreadsheet, $filename);
    }

    /**
     * تبدیل شماره ستون به حرف (1→A, 27→AA)
     */
    private static function getColumnLetter($num)
    {
        $letter = '';
        while ($num > 0) {
            $mod = ($num - 1) % 26;
            $letter = chr(65 + $mod) . $letter;
            $num = (int)(($num - $mod) / 26);
        }
        return $letter;
    }

    /**
     * ارسال فایل به مرورگر
     */
    private static function output($spreadsheet, $filename)
    {
        // پاک کردن بافرهای قبلی
        if (ob_get_length()) {
            ob_end_clean();
        }

        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Cache-Control: max-age=0');
        header('Pragma: public');

        $writer = new Xlsx($spreadsheet);
        $writer->save('php://output');
        exit;
    }
}