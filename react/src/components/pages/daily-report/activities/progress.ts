import type { Num, ReportableTask } from "./types";

/**
 * ریاضیاتِ «درصد پیشرفت» — ایشوی ۱۱.
 *
 * قرارداد: `daily_progress` پیشرفتِ همان گزارش است (بند ۲۱۰ سند فاز ۲) و
 * `cumulative_progress` را Backend جمع می‌زند؛ پس نوار باید **از ادامه‌ی
 * سابقه بیاید**: اول پیشرفتِ قبلیِ همین تسک در همین پروژه، بعد پیشرفتِ
 * همین گزارش. سابقه از `GET hq/daily-report/{id}/task-progress` می‌آید که
 * عیناً همان `base` محاسبه‌ی تجمعی سرور است (تست `TaskProgressTest`).
 */

/** تسکِ قابل گزارش + پیشرفتِ قبلی‌اش در این پروژه */
export type ProgressTask = ReportableTask & { previous_progress?: Num };

/** درصدِ امن — مقدار خامِ فرم رشته است و ممکن است خالی/نامعتبر باشد */
export function percentOf(value: Num | undefined): number {
    const n = Number(value ?? 0);

    if (!Number.isFinite(n)) return 0;

    return Math.min(100, Math.max(0, n));
}

/** پیشرفتِ قبلیِ همین تسک؛ نبودِ سابقه یعنی نوار از صفر شروع می‌شود */
export function baseOf(task: ProgressTask | undefined): number {
    return percentOf(task?.previous_progress);
}

/**
 * عرضِ دو بخشِ نوار طوری که هیچ‌وقت از ۱۰۰ رد نشود — سرریزِ بصری نباید
 * دیده شود چون جلویِ خطای واقعیِ سرور («بیش از ۱۰۰ درصد») را می‌گیرد.
 */
export function segmentsOf(base: number, value: number): { base: number; value: number } {
    const total = Math.min(100, percentOf(base) + percentOf(value));
    const before = Math.min(percentOf(base), total);

    return { base: before, value: total - before };
}

/** افزودنِ سابقه به لیستِ تسک‌ها — خروجیِ دو endpoint در همین یک جا ادغام می‌شود */
export function withPrevious(tasks: ReportableTask[], previous: Record<string, number | string>): ProgressTask[] {
    return tasks.map((task) => ({ ...task, previous_progress: previous[String(task.id)] ?? 0 }));
}
