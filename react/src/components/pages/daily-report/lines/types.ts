import type { ApiResponse, Num } from "../activities/types";
import type { DictOption } from "@/components/shared/dictionaries";

/**
 * انواع داده‌ی تب‌های زیرمجموعه‌ی گزارش روزانه — سند فاز ۲ بندهای ۸ تا ۱۲.
 *
 * پنج جدول (نیروی انسانی / ماشین‌آلات / مصالح / تحویل کالا / تایم‌شیت) فقط در
 * ستون‌ها فرق دارند؛ ستون‌ها و فیلدها «توصیفِ داده»‌اند و رندر (جدول و دیالوگ)
 * یکی است. بنابراین افزودن یک ستون یعنی یک خط در `config.ts`، نه یک جدول جدید.
 *
 * `Num` و `ApiResponse` همان‌هایی‌اند که تب «فعالیت‌ها» می‌سازد؛ نسخه‌ی دوم
 * ساخته نمی‌شود (DRY).
 */

export type { ApiResponse, Num };

/** پنج زیرمجموعه — نام دقیقاً همان چیزی است که URL و کلید پاسخ view می‌شناسد */
export type LineKind = "manpower" | "equipment" | "materials" | "deliveries" | "timesheets";

/** منبع گزینه‌های یک سلکت */
export type OptionSource = "tasks" | "contacts" | "products" | "units" | "equipmentTypes" | "deviationReasons";

export type FieldKind = "number" | "text" | "time" | "textarea" | "select";

/** توصیف یک فیلد دیالوگ افزودن/ویرایش */
export interface LineField {
    name: string;
    title: string;
    kind: FieldKind;
    /** برای `select`: لیست enum سمت سرور (کلیدها از `lib/report-rules`) */
    list?: Record<number, string>;
    /** برای `select` بدون `list`: کلید واژه‌نامه یا تسک‌ها/اشخاص */
    source?: OptionSource;
    required?: boolean;
    hint?: string;
    /** چندانتخابی — مقدار رشته‌ی جداشده با کاما می‌ماند (پشتیبانیِ سرور) */
    multi?: boolean;
    /** گزینه‌ها بر اساس مقدارِ همین فیلد فیلتر شوند (سمتِ اشخاص — ایشوی ۲.۱) */
    filterBy?: string;
    /** در ویرایش، مقدارِ اولیه از این ستونِ ردیف خوانده شود (نیروی تکی → مالتی) */
    from?: string;
    /** برچسبِ دینامیک از روی مقادیر فرم (ایشوی ۹: «مقدار (واحد)») */
    titleOf?: (values: LineValues, options: Record<OptionSource, DictOption[]>) => string;
}

export type CellKind = "text" | "number" | "time" | "lookup" | "enum" | "deliveryItem";

/** توصیف یک ستون جدول */
export interface LineColumn {
    key: string;
    title: string;
    /** عرضِ ردیفِ grid — هر مقدارِ معتبرِ `grid-template-columns` */
    w: string;
    as?: CellKind;
    source?: OptionSource;
    list?: Record<number, string>;
}

export interface LineConfig {
    kind: LineKind;
    /** عنوان تب و سرِ جدول */
    title: string;
    subtitle: string;
    /** متن حالت خالی + پیام toastها */
    entity: string;
    /**
     * Feedback 1: the timesheet sits on the shared log, so "deleting" it may
     * only drop the stamps. The server behaves the same way; this flag simply
     * translates the button, the dialog and the toast into "release".
     */
    release?: boolean;
    /** حداقل عرض جدول برای اسکرول افقی در پنجره‌های کوچک */
    minWidth: string;
    fields: LineField[];
    columns: LineColumn[];
}

/** ردیف خوانده‌شده از سرور — عین ستون‌های همان جدول (اعداد گاهی رشته می‌آیند) */
export type LineRow = Record<string, string | number | null> & { id: number | string };

/** مقادیر فورم دیالوگ — همه رشته‌اند (ورودی‌ها همیشه رشته می‌دهند)؛ `id` خالی یعنی «افزودن» */
export type LineValues = Record<string, string>;

/**
 * ردیف خالیِ دیالوگِ «افزودن».
 *
 * صفرهای عددی عمداً صریح‌اند چون `Input type="number"` نمایشِ خالی ندارد و
 * `formatNumber("")` همان «۰» را نشان می‌دهد (همان قرارداد تب فعالیت‌ها).
 */
export function emptyValues(fields: LineField[]): LineValues {
    const values: LineValues = { id: "" };

    fields.forEach((field) => {
        values[field.name] = field.kind === "number" ? "0" : "";
    });

    return values;
}

/** ردیف خوانده‌شده از سرور → مقادیر دیالوگ (فقط فیلدهای همین پیکربندی) */
export function toValues(fields: LineField[], row: LineRow): LineValues {
    const values = emptyValues(fields);

    fields.forEach((field) => {
        // `from`: نیرویِ تکیِ ذخیره‌شده باید در سلکتِ مالتی دیده شود (ایشوی ۲.۳)
        const value = row[field.from ?? field.name];
        values[field.name] = value === null || value === undefined ? (field.kind === "number" ? "0" : "") : String(value);
    });

    values.id = String(row.id);

    return values;
}

/** فقط فیلدهای توصیف‌شده به سرور می‌روند (شناسه و ستون‌های محاسباتی کنار) */
export function pickEditable(fields: LineField[], values: LineValues): Record<string, string> {
    const payload: Record<string, string> = {};

    fields.forEach((field) => {
        payload[field.name] = values[field.name] ?? "";
    });

    // ایشوی ۲.۳: مالتیِ نیروها هم برای ساختِ چند ردیف (`person_ids`) و هم
    // برای ویرایشِ ردیفِ تکی (`person_id`) فرستاده می‌شود؛ سرور هر کدام را
    // در جای خودش می‌خواند و در ساخت، `person_id` را با همان انتخاب می‌پوشاند.
    if ("person_ids" in payload) {
        const first = String(payload.person_ids).split(",")[0].trim();

        if (first) payload.person_id = first;
    }

    return payload;
}
