<?php

use common\helpers\Route;

return [
    Route::crud('hq/group'),

    Route::crud('hq/company'),

    Route::crud('hq/project'),

    Route::crud('hq/bank'),

    Route::crud('hq/bank-name'),

    Route::crud('hq/contact'),

    Route::crud('hq/product'),

    Route::crud('hq/exchange-data', [
        'POST import-by-excel' => 'import-by-excel'
    ]),

    Route::crud('hq/user', [
        'GET roles' => 'roles',
        'GET is-login' => 'is-login',
        'POST login' => 'login',
        'POST forgot-password' => 'forgot-password',
    ]),

    Route::crud('hq/user-login-log', [
        'GET user/{id}' => 'user-logs',
        'POST logout/{id}' => 'logout',
        'POST logout-all' => 'logout-all',
    ]),

    Route::crud('hq/accounting', [
        'GET get-related-banks' => 'get-related-banks',
        'POST import-by-excel' => 'import-by-excel',
        'POST {id}/approve' => 'approve',
    ]),

    Route::crud('hq/accounting-item', [
        'GET calendar' => 'calendar',
        'GET calendar-today-report' => 'calendar-today-report',
        'POST pay' => 'pay',
        'POST receive' => 'receive',
    ]),

    Route::crud('hq/accounting-data', [
        'GET report' => 'report',
    ]),

    Route::crud('hq/state', [
        'GET {id}/cities' => 'cities',
    ]),

    Route::crud('hq/material'),

    // ============== تنظیمات مالی (سال مالی و روزهای کاری) ==============
    Route::crud('hq/hrm-financial-year', [
        'POST set-active' => 'set-active',
        'GET active' => 'active',
        'GET year-options' => 'year-options',
    ]),

    // ============== مدیریت اموال ==============
    Route::crud('hq/hrm-asset'),

    // تخصیص اموال
    Route::crud('hq/hrm-asset-assignment', [
        'GET personnel-assets/' => 'personnel-assets',
    ]),
    Route::crud('hq/hrm-asset-assignment', [
        'GET personnel-assets/' => 'personnel-assets',
        'GET draft-assets/' => 'draft-assets',
        'POST confirm-draft/' => 'confirm-draft',
        'DELETE delete-draft/' => 'delete-draft',
    ]),
    // انتقال اموال
    Route::crud('hq/hrm-asset-transfer'),

    // ============== اطلاعات مالی / بیمه ==============
    Route::crud('hq/hrm-bank-account'),
    Route::crud('hq/hrm-insurance'),
    Route::crud('hq/hrm-insurance-payment'),

    // ============== مساعده ==============
    Route::crud('hq/hrm-advance', [
        'POST {id}/settle' => 'settle',
    ]),

    // ============== وام ==============
    Route::crud('hq/hrm-loan', [
        'POST {id}/pay-installment' => 'pay-installment',
        'POST {id}/settle' => 'settle',
    ]),

    // ============== اضافه/کسر از حقوق ==============
    Route::crud('hq/hrm-adjustment', [
        'POST {id}/settle' => 'settle',
    ]),

    // ============== کارکرد روزانه ==============
    Route::crud('hq/hrm-daily-attendance', [
        'POST save-range' => 'save-range',
        'POST bulk-edit-range' => 'bulk-edit-range',
        'POST bulk-edit-monthly' => 'bulk-edit-monthly',
    ]),

    // ============== مرخصی ==============
    Route::crud('hq/hrm-vacation', [
        'POST {id}/approve' => 'approve',
        'POST {id}/reject' => 'reject',
        'GET vacations-list' => 'vacations-list',
        'GET daily-report' => 'daily-report',
        'GET monthly-report' => 'monthly-report',
    ]),

    // انواع مرخصی
    Route::crud('hq/hrm-vacation-type', [
        'GET list' => 'list',
        'POST {id}/toggle-status' => 'toggle-status',
    ]),

    // ============== ماموریت ==============
    Route::crud('hq/hrm-mission', [
        'POST {id}/approve' => 'approve',
        'POST {id}/reject' => 'reject',
    ]),

    // انواع ماموریت
    Route::crud('hq/hrm-mission-type', [
        'GET list' => 'list',
        'POST {id}/toggle-status' => 'toggle-status',
    ]),


    //   امور قراردادها  
    Route::crud('hq/hrm-contract', [
        'POST {id}/approve' => 'approve',
        'POST {id}/renew' => 'renew',
        'GET employers' => 'employers',
        'GET job-positions' => 'job-positions',
        'GET types' => 'types',
        'GET modes' => 'modes',
        'GET states' => 'states',
        'GET cities' => 'cities',
        'GET marital-statuses' => 'marital-statuses',
        'GET genders' => 'genders',
        'GET expiring' => 'expiring',
        'POST {id}/terminate' => 'terminate',
        'GET terminated-report' => 'terminated-report',
        'GET search-for-renew' => 'search-for-renew',
        'POST {id}/update-work-group' => 'update-work-group'
    ]),

    // ============== عملکرد ماهانه ==============
    Route::crud('hq/hrm-monthly-summary', [
        'POST calculate' => 'calculate',
        'POST {id}/finalize' => 'finalize',
    ]),
    // ============== تسویه حساب عیدی ==============
    Route::crud('hq/hrm-bonus-settlement', [
        'POST calculate' => 'calculate',
        'POST {id}/approve' => 'approve',
        'POST {id}/pay' => 'pay',
    ]),

    // ============== بازخرید مانده مرخصی ==============
    Route::crud('hq/hrm-vacation-buyback', [
        'POST calculate' => 'calculate',
        'POST {id}/approve' => 'approve',
        'POST {id}/pay' => 'pay',
    ]),
    // ============== تنظیمات سیستم ==============
    Route::crud('hq/hrm-setting', [
        'GET by-group/{group}' => 'by-group',
        'GET get/{key}' => 'get',
    ]),

    // ============== صورت حساب حقوق و دستمزد ==============
    Route::crud('hq/hrm-salary-slip', [
        'POST calculate' => 'calculate',
        'POST {id}/approve' => 'approve',
        'POST {id}/pay' => 'pay',
        'GET last-review' => 'last-review',
        'GET history' => 'history',
        'GET calculate-list' => 'calculate-list',
        'GET check-work' => 'check-work',
        'POST batch-delete' => 'batch-delete',
        'POST batch-recalculate' => 'batch-recalculate',
        'POST batch-finalize' => 'batch-finalize',
        'POST batch-pre-submit' => 'batch-pre-submit',
        'POST batch-clear-work' => 'batch-clear-work',
    ]),
    Route::crud('hq/hrm-personnel-basic', [
        'GET get-by-user' => 'get-by-user',
        'POST accept-person' => 'accept-person',
    ]),

    // ============== اطلاعات پرسنل - تماس و سکونت ==============
    Route::crud('hq/hrm-personnel-contact', [
        'GET get-by-user' => 'get-by-user',
    ]),

    // ============== اطلاعات پرسنل - سوابق تحصیلی ==============
    Route::crud('hq/hrm-personnel-education', [
        'GET get-by-user' => 'get-by-user',
        'POST save-all' => 'save-all',
    ]),
    // ============== اطلاعات پرسنل - دوره‌های آموزشی ==============
    Route::crud('hq/hrm-personnel-course', [
        'GET get-by-user' => 'get-by-user',
        'POST save-all' => 'save-all',
    ]),

    // ============== اطلاعات پرسنل - تسلط بر زبان خارجی ==============
    Route::crud('hq/hrm-personnel-language', [
        'GET get-by-user' => 'get-by-user',
        'POST save-all' => 'save-all',
    ]),
    // ============== اطلاعات پرسنل - توانایی و مهارت ==============
    Route::crud('hq/hrm-personnel-skill', [
        'GET get-by-user' => 'get-by-user',
        'POST save-all' => 'save-all',
    ]),
    // ============== اطلاعات پرسنل - سوابق کار ==============
    Route::crud('hq/hrm-personnel-work-experience', [
        'GET get-by-user' => 'get-by-user',
        'POST save-all' => 'save-all',
    ]),
    // ============== اطلاعات پرسنل - بارگزاری مدارک ==============
    Route::crud('hq/hrm-personnel-document', [
        'GET get-by-user' => 'get-by-user',
        'POST upload' => 'upload',
        'POST delete-file' => 'delete-file',
    ]),
    // گروه کاری (سطح 1)
    Route::crud('hq/hrm-workgroup', [
        'GET items' => 'items',
    ]),

    // بخش گروه کاری (سطح 2)
    Route::crud('hq/hrm-workgroup-bakhsh', [
        'GET items' => 'items',
    ]),

    // قسمت گروه کاری (سطح 3)
    Route::crud('hq/hrm-workgroup-ghesmat', [
        'GET items' => 'items',
    ]),

    // عنوان گروه کاری - سمت شغلی (سطح 4)
    Route::crud('hq/hrm-workgroup-onvan', [
        'GET items' => 'items',
    ]),

    // اختصاص گروه کاری به پرسنل
    Route::crud('hq/hrm-workgroup-personel', [
        'GET by-user' => 'by-user',
    ]),
    // در فایل routes.php

    // ============== گزارش گروه کاری ==============
    Route::crud('hq/hrm-workgroup-report', [
        'GET index' => 'index',
    ]),

    Route::crud('hq/app', [
        'GET last-version' => 'last-version',
    ]),
    // ============== فرآیند پرسنل ==============
    Route::crud('hq/hrm-process', [
        'GET history' => 'history',
        'GET calculate-list' => 'calculate-list',
        'GET personnel-list' => 'personnel-list',
        'POST upload' => 'upload',
        'POST pre-submit' => 'pre-submit',
        'POST final-submit' => 'final-submit',
        'POST recalculate' => 'recalculate',
        'POST delete-calcs' => 'delete-calcs',
        'POST delete-processes' => 'delete-processes',
        'POST clear-work' => 'clear-work',
         'POST export-excel' => 'export-excel', 
    ]),
];