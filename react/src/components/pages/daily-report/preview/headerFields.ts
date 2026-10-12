import { dateLabel } from "@/lib/labels";
import { REPORT_STATUS, SITE_STATUS, WEATHER } from "@/lib/report-rules";
import type { ReportData } from "../report";

/**
 * ستون‌های سربرگ در «پیش‌نمایش» — ترتیب عین فرمِ سربرگ (بخش ۳ سند فاز ۲).
 *
 * `value` یک تابع است نه یک کلید چون بعضی مقادیر باید از enum یا از فهرست
 * اشخاص به برچسب فارسی تبدیль شوند؛ این‌طوری هیچ متنی در کامپوننت تکرار نمی‌شود.
 */
export interface HeaderContext {
    /** شناسه‌ی contact → برچسب «۵۸- نام» */
    contact: (id: string | number | null | undefined) => string;
}

export interface HeaderField {
    title: string;
    value: (report: ReportData, ctx: HeaderContext) => string;
}

const text = (value: unknown) => (value === null || value === undefined || value === "" ? "—" : String(value));

export const HEADER_FIELDS: HeaderField[] = [
    { title: "پروژه", value: (report) => text(report.project?.name) },
    { title: "تاریخ تنظیم فرم", value: (report) => dateLabel(report.report_date) },
    { title: "مدیر پروژه", value: (report, ctx) => ctx.contact(report.project_manager_id) },
    { title: "سرپرست کارگاه", value: (report, ctx) => ctx.contact(report.site_supervisor_id) },
    { title: "تنظیم‌کننده فرم", value: (report) => text(report.prepared_by_name) },
    { title: "وضعیت آب و هوا", value: (report) => WEATHER[Number(report.weather_status)] ?? "—" },
    { title: "توضیح آب و هوا", value: (report) => text(report.weather_note) },
    { title: "وضعیت کارگاه", value: (report) => SITE_STATUS[Number(report.site_status)] ?? "—" },
    { title: "دلیل غیرفعالی کارگاه", value: (report) => text(report.inactive_reason) },
    { title: "شماره مدرک", value: (report) => text(report.document_no) },
    // ایشوی ۱۳: «ویرایش» (revision) از همین‌جا هم حذف شد — ورودی‌اش در فرمِ
    // سربرگ قبلاً بسته شده بود و اینجا فقط یک خانه‌ی همیشه خالی می‌ساخت.
    { title: "وضعیت ثبت", value: (report) => REPORT_STATUS[Number(report.status)] ?? "—" },
];
