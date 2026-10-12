import type { LineColumn, LineRow, OptionSource } from "./types";

/** برچسب‌سازِ یک شناسه — از `useLookups` می‌آید */
export type Labeler = (source: OptionSource, id?: string | number | null) => string;

const blank = (value: unknown) => value === null || value === undefined || value === "";

const count = (value: unknown) => (blank(value) ? "—" : Number(value).toLocaleString());

/**
 * متن یک سلول از روی ردیفِ ذخیره‌شده.
 *
 * شناسه‌ها (پیمانکار، مصالح، واحد، تسک…) در دیتابیس عدد می‌مانند؛ اینجا با
 * همان mapهای `useLookups` به برچسب تبدیل می‌شوند تا جدول برای ناظر خوانا باشد.
 */
export function cellText(column: LineColumn, row: LineRow, label: Labeler, index: number): string {
    if (column.key === "_i") return String(index + 1);

    const value = row[column.key];

    switch (column.as ?? "text") {
        case "number":
            return count(value);

        // `check_in` used to be a bare `time`; the timesheet tab now reads
        // `users_logs`, whose stamps are full datetimes. Both must show HH:MM.
        case "time":
            if (blank(value)) return "—";
            {
                const text = String(value);
                const time = text.includes(" ") ? text.slice(text.indexOf(" ") + 1) : text;
                return time.slice(0, 5);
            }

        case "lookup":
            return label(column.source as OptionSource, value);

        case "enum":
            return (column.list && column.list[Number(value)]) || "—";

        // تحویل کالا: یا از فهرست کالاها انتخاب شده یا نام آزاد نوشته شده است
        case "deliveryItem":
            if (row.product_id) return label("products", row.product_id);
            return row.item_name ? String(row.item_name) : "—";

        default:
            return blank(value) ? "—" : String(value);
    }
}
