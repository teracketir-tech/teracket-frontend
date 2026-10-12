/**
 * آینه‌ی فرانتِ `frontend\modules\hq\services\ReportRules.php`.
 *
 * enumهای فاز ۲ عمداً در بک‌اند نگه داشته شده‌اند (تصمیم فاز ۲)؛ اینجا فقط
 * برای رندر کردن Selectها تکرار شده‌اند. اگر آنجا تغییر کرد، اینجا هم باید
 * تغییر کند — ترتیب عین ترتیب شیت اکسل است.
 */

export const WEATHER: Record<number, string> = { 1: "آفتابی", 2: "ابری", 3: "بارانی", 4: "برفی", 5: "باد شدید" };

export const SITE_STATUS: Record<number, string> = { 1: "فعال", 2: "غیرفعال" };

export const REPORT_STATUS: Record<number, string> = { 0: "پیش‌نویس", 1: "ثبت نهایی" };

export const ACTIVITY_STATUS: Record<number, string> = { 1: "شروع", 2: "در حال اجرا", 3: "اتمام", 4: "شروع و اتمام", 5: "متوقف", 6: "شروع نشده" };

export const ACTION_TYPE: Record<number, string> = { 1: "ورود کالا", 2: "خروج کالا" };

export const ITEM_GROUP: Record<number, string> = { 1: "کالا", 2: "تجهیز" };

export const DELIVERY_TYPE: Record<number, string> = { 1: "قطعی", 2: "امانی" };

export const EMPLOYMENT_TYPE: Record<number, string> = { 1: "تمام وقت", 2: "روز مزد" };

export const SITE_ACTIVE = 1;
export const SITE_INACTIVE = 2;

/** «خروج کالا» — تنها حالتی که مقدار منفی در «تحویل کالا» مجاز است (بند ۱۷) */
export const ACTION_OUT = 2;

/** `{value,label}` آماده‌ی کامپوننت `Select` */
export function toOptions(map: Record<number, string>): { label: string; value: string }[] {
    return Object.entries(map).map(([value, label]) => ({ value, label }));
}
