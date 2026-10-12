import type { ActivityRow } from "./activities/types";
import type { LineRow } from "./lines/types";

/**
 * خروجی `GET hq/daily-report/{id}` — سند فاز ۲ بند ۱۴ (دریافت کامل گزارش).
 *
 * سربرگ + فعالیت‌ها + پنج زیرمجموعه در همین یک پاسخ می‌آیند؛ هم «پیش‌نمایش» و
 * هم حالتِ ویرایش (`/daily-report/edit/:id`) از همین نوع می‌خوانند.
 *
 * عمداً `any` نیست: هر ستون با همان نامی تایپ شده که جدول دارد، تا اشتباهِ
 * نامِ ستون در کامپوننت در همان لحظه‌ی کامپایل گیر بیفتد.
 */
export interface ReportData {
    id: number | string;
    /** شرکتِ پروژه — ایشوی ۱: سربرگِ ویرایش باید از همان‌جا فیلتر کند */
    company_id?: number | string | null;
    project_id?: number | string;
    project?: { id?: number | string; name?: string | null } | null;

    report_date?: string | null;
    weather_status?: number | string | null;
    weather_note?: string | null;
    site_status?: number | string | null;
    inactive_reason?: string | null;
    document_no?: string | null;
    revision?: string | null;
    project_manager_id?: number | string | null;
    site_supervisor_id?: number | string | null;
    prepared_by?: number | string | null;
    /** نامِ کاربرِ ثبت‌کننده — ایشوی ۱۸ (سرور از روی `user` می‌سازد) */
    prepared_by_name?: string | null;

    /** 0 = پیش‌نویس، 1 = ثبت نهایی شده (`ReportRules::STATUS_*`) */
    status?: number | string | null;

    activities?: ActivityRow[];
    manpower?: LineRow[];
    equipment?: LineRow[];
    materials?: LineRow[];
    deliveries?: LineRow[];
    timesheets?: LineRow[];
}
