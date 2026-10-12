/**
 * انواع داده‌ی تب «فعالیت‌ها» — سند فاز ۲ بندهای ۴، ۵ و ۱۶.
 *
 * قاعده‌ی مهم سند: در دیتابیس فقط `task_id` می‌نشیند؛ کد WBS، عنوان، مدت و
 * تاریخ‌های برنامه‌ای همگی از snapshot ردیفِ ذخیره‌شده (که Backend می‌سازد)
 * خوانده می‌شوند؛ برای ردیفِ تازه، همان‌ها از `cpm` تسک انتخاب‌شده می‌آید.
 */

/** ستون‌های decimal در JSON گاهی رشته می‌آیند (`"0.00"`)، پس هر دو پذیرفته می‌شود */
export type Num = number | string | null;

/** پاسخ موفق/ناموفق سرویس‌های فاز ۲ — `errors` کلیدِ فیلد و `message` پیام عمومی است */
export interface ApiResponse {
    success?: boolean;
    errors?: Record<string, string[] | string>;
    message?: string;
    /** ایشوی ۱۰: `data.id` فعالیتِ تازه‌ذخیره‌شده، تا تب‌های زیرمجموعه فعال شوند */
    data?: { id?: number | string } & Record<string, unknown>;
}

/** بخش CPMِ یک تسک در پاسخ `reportable-tasks` */
export interface PlannedInfo {
    duration?: Num;
    unit?: Num;
    start_date?: string | null;
    finish_date?: string | null;
    free_float?: Num;
    late_finish_date?: string | null;
}

/** خروجی `GET hq/project/{id}/reportable-tasks` — یک ردیف از `data` */
export interface ReportableTask {
    id: number | string;
    wbs_code?: string | null;
    name?: string | null;
    duration?: Num;
    duration_unit?: Num;
    cpm?: PlannedInfo | null;
}

/** ردیفِ ذخیره‌شده — عین ستون‌های `daily_report_activities` */
export interface ActivityRow {
    id: number | string;
    task_id: number | string;
    wbs_code?: string | null;
    task_name?: string | null;
    duration_value?: Num;
    duration_unit?: Num;
    planned_start?: string | null;
    planned_finish?: string | null;
    free_float?: Num;
    latest_finish?: string | null;
    supervisor_forecast_date?: string | null;
    executor_id?: Num;
    supervisor_id?: Num;
    work_hours?: Num;
    cumulative_progress?: Num;
    daily_progress?: Num;
    quality_percent?: Num;
    status?: Num;
    description?: string | null;
    risks?: string | null;
    /**
     * عوامل انحرافِ انتخاب‌شده در «مشخصات فعالیت» — ایشوی ۴: دیگر تبِ جدا
     * نیست و مالتی است؛ ستونِ رابطه‌ی `daily_report_activity_deviation`.
     */
    deviation_reason_ids?: (number | string)[];
    /** پیمانکارِ همین فعالیت — ایشوی ۳: فقط همین‌جا و فقط یک‌بار ثبت می‌شود */
    contractor_id?: Num;
}

/** مقادیر اولیه‌ی Formik دیالوگ؛ `id` خالی یعنی «افزودن» */
export type ActivityValues = ActivityRow;

/**
 * نگاشتِ مقادیر (`EDITABLE_KEYS`، `pickEditable`، `emptyActivity`، `toValues`)
 * به `values.ts` رفت تا این فایل فقط «نوع» بماند و سقفِ ۱۵۰ خط رعایت شود
 * (ایشوی ۱۲).
 */

/** اطلاعات برنامه‌ایِ خواندنی دیالوگ از روی تسک انتخاب‌شده */
export function plannedOf(task: ReportableTask | undefined): PlannedInfo {
    const cpm = task?.cpm;

    return {
        duration: cpm?.duration ?? task?.duration,
        unit: cpm?.unit ?? task?.duration_unit,
        start_date: cpm?.start_date,
        finish_date: cpm?.finish_date,
        free_float: cpm?.free_float,
        late_finish_date: cpm?.late_finish_date,
    };
}

/**
 * تسک‌های قابل انتخاب: هر تسک فقط یک بار در هر گزارش ثبت می‌شود
 * (سند فاز ۲ بند ۱۷ و `DailyReportActivity::validateTask`)، پس ردیف‌هایِ
 * ثبت‌شده کنار گذاشته می‌شوند — به‌جز خودِ ردیفی که در حال ویرایش است.
 */
export function selectableTasks(tasks: ReportableTask[], rows: ActivityRow[], currentId?: number | string): ReportableTask[] {
    return tasks.filter((task) => !rows.some((row) => row.id !== currentId && row.task_id == task.id));
}
