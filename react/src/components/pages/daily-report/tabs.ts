/**
 * تب‌های فرمِ اصلیِ گزارش روزانه — سند فاز ۲ بخش ۱۵ + ایشوی ۱۰.
 *
 * ایشوی ۱۰ پنج تبِ زیرمجموعه (نیرو / ماشین / مصالح / تحویل / تایم‌شیت) را از
 * اینجا بیرون برد: هر ردیفِ زیرمجموعه به یک فعالیت تعلق دارد و در تب‌هایِ
 * داخلِ دیالوگِ همان فعالیت ثبت می‌شود (`activities/modalTabs.ts`)؛ پس فرمِ
 * اصلی فقط سربرگ، فعالیت‌ها و پیش‌نمایش را نگه می‌دارد.
 *
 * تبِ آخر «پیش‌نمایش» است تا ناظر پیش از ثبت نهایی همه‌ی بخش‌های
 * انتخاب‌شده را یکجا ببیند (درخواست کارفرما).
 */
export interface ReportTab {
    id: string;
    title: string;
    /** برای ارسال نهایی (Submit) باید پر شده باشد */
    required: boolean;
}

export const REPORT_TABS: ReportTab[] = [
    { id: "header", title: "سربرگ", required: true },
    { id: "activities", title: "فعالیت‌ها", required: true },
    { id: "preview", title: "پیش‌نمایش", required: true },
];

export const FIRST_TAB = REPORT_TABS[0].id;
export const LAST_TAB = REPORT_TABS[REPORT_TABS.length - 1].id;

function step(id: string, delta: number): string {
    const index = REPORT_TABS.findIndex((tab) => tab.id === id);
    if (index < 0) return FIRST_TAB;

    return REPORT_TABS[Math.min(Math.max(index + delta, 0), REPORT_TABS.length - 1)].id;
}

/** کلید تبِ بعدی — برای دکمه‌ی «بعدی» */
export function nextTab(id: string): string {
    return step(id, 1);
}

/** کلید تبِ قبلی — برای دکمه‌ی «قبلی» */
export function prevTab(id: string): string {
    return step(id, -1);
}

/** عنوانِ کلید تب — برای سرِ صفحه */
export function tabTitle(id: string): string {
    return REPORT_TABS.find((tab) => tab.id === id)?.title ?? "";
}
