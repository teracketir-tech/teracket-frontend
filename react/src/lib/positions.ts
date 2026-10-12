import { toOptions } from "./report-rules";

/**
 * Positions and the "type" field of contacts (issue 2).
 *
 * Kept in its own file so `report-rules.ts` only holds header/form enums
 * (the 100-line cap for utilities).
 *
 * Positions: the 21 values of column O on the Data sheet in the same order,
 * plus the two positions that exist only inside the report form (issue 2.2).
 *
 * Contract: a position lives in `contact.position_id`, while `contact.type`
 * always holds 1 (real person) / 2 (legal entity) — never a position, whatever
 * the company. The ids must stay identical to `ReportRules::POSITION` because
 * stored rows reference them.
 */
export const POSITION: Record<number, string> = {
    1: "مهندس",
    2: "کارگر",
    3: "گچکار",
    4: "آهنگر",
    5: "تاسیسات کار",
    6: "سرپرست کارگاه",
    7: "سیمانکار",
    8: "برقکار",
    9: "کانال ساز",
    10: "بنا",
    11: "سرامیک کار",
    12: "کناف کار",
    13: "میکروسمنت کار",
    14: "نقاش",
    15: "ام دی اف کار",
    16: "دکورساز",
    17: "کابینت کار",
    18: "پیمانکار پنجره",
    19: "پیمانکار درب",
    20: "نصاب پارکت",
    21: "نصاب آیینه",
    22: "مسئول اجرای فعالیت",
    23: "مسئول نظارت فعالیت",
};

/** سمتِ «مدیر پروژه» و «تنظیم‌کننده فرم» در سربرگ — مهندس */
export const POSITION_MANAGER = 1;
/** سمتِ «سرپرست کارگاه» در سربرگ */
export const POSITION_SUPERVISOR = 6;
/** سمتِ «مسئول اجرای فعالیت» در تبِ مشخصات فعالیت */
export const POSITION_EXECUTOR = 22;
/** سمتِ «مسئول نظارت فعالیت» در تبِ مشخصات فعالیت */
export const POSITION_SUPERVISOR_ACTIVITY = 23;

/** برچسبِ یک سمتِ عددی — برای ستونِ «سمت» در جدول‌های گزارش */
export function positionLabel(value: string | number | null | undefined): string {
    if (value === null || value === undefined || value === "") return "—";
    return POSITION[Number(value)] ?? String(value);
}

/** «نوع» — always exactly those two values, never company-dependent (issue 2.1) */
export function typeOptions(): { label: string; value: string }[] {
    return [
        { value: "1", label: "حقیقی" },
        { value: "2", label: "حقوقی" },
    ];
}

/**
 * Label of the "type" column in the contact list — searched in the very same
 * list the filter uses, so column and filter can never drift apart (DRY).
 */
export function typeLabel(value: string | number | null | undefined): string {
    if (value === null || value === undefined || value === "") return "—";
    return typeOptions().find((option) => option.value === String(value))?.label ?? String(value);
}

/** Options of the optional "position" field bound to `contact.position_id` (issue 2.2) */
export function positionOptions(): { label: string; value: string }[] {
    return toOptions(POSITION);
}
