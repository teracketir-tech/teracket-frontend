import { formatDateToFa } from "@/lib/utils";

/**
 * برچسب‌های مشترکِ نمایشِ زمان‌بندی — از `components/pages/scheduling` آمده تا
 * هر بخشی که داده‌ی CPM نشان می‌دهد (زمان‌بندی و گزارش روزانه) همین توابع را
 * داشته باشد و نسخه‌ی دومی از آنها ساخته نشود.
 *
 * همه‌ی تاریخ‌ها ISO میلادی (`Y-m-d`) و همه‌ی شناوری‌ها در واحد پایه‌ی CPM می‌آیند.
 */

/** هر شکلِ ممکنِ مقدارِ خام از API (رشته/عدد/خالی) */
type Raw = string | number | null | undefined;

/** واحد پایه‌ی CPM در پاسخ API (`day`/`hour`) یا کد واحد ردیف (1/2) → برچسب فارسی */
export const unitLabel = (unit: Raw) => (unit === "hour" || Number(unit) === 2 ? "ساعت" : "روز");

/** مدت یک ردیف + واحدش: برگ واحد خودش را دارد، ردیف والد واحد پایه را */
export const durationLabel = (duration: Raw, unit: Raw) => `${Number(duration || 0).toLocaleString()} ${unitLabel(unit)}`;

/** شناوری کل/آزاد همیشه در واحد پایه‌ی CPM است */
export const slackLabel = (value: Raw, unit: Raw) => `${Number(value || 0).toLocaleString()} ${unitLabel(unit)}`;

/** تاریخ ISO → شمسی؛ نبودِ تاریخ (مثلاً پروژه بدون شروع) → «—» */
export const dateLabel = (value?: string | null) => (value ? formatDateToFa(value) : "—");

/**
 * درصد پیشرفت (ستون «درصد پیشرفت» لیست تسک‌ها): صفر هم مقدار است و«۰٪» نشان
 * داده می‌شود؛ فقط نبودِ کلید (ردیف بدون داده‌ی CPM)«—» می‌شود.
 */
export const percentLabel = (value?: Raw) =>
    value === null || value === undefined || value === "" ? "—" : `${Number(value).toLocaleString()}٪`;

/**
 * چسباندنِ برچسبِ چند شناسه با «،» — ستونِ «عوامل انحراف» (ایشوی ۴) که دیگر
 * تکی نیست. `labelOf` همان نگاشتِ `id → برچسب`ِ همان بخش است تا نسخه‌ی دومی
 * از پیداکردنِ برچسب ساخته نشود (DRY).
 */
export function joinedLabels(ids: readonly (string | number)[] | null | undefined, labelOf: (id: string | number) => string): string {
    if (!ids || ids.length === 0) return "—";

    return ids.map((id) => labelOf(id)).join("، ");
}
