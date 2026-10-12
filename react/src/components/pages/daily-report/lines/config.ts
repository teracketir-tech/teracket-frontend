import { ACTION_TYPE, DELIVERY_TYPE } from "@/lib/report-rules";
import { POSITION } from "@/lib/positions";
import type { LineConfig, LineField, LineKind, LineValues } from "./types";

/**
 * توصیفِ پنج زیرمجموعه — سند فاز ۲ بندهای ۸ تا ۱۲.
 *
 * ترتیب فیلدها و ستون‌ها عین شیت اکسل است. کدِ رندر در `LineTable` و
 * `LineForm` یکی است؛ فقط همین داده بین پنج جدول فرق می‌کند (DRY).
 *
 * نگاشت قرارداد ایشوی ۱: اشخاص → contact، مصالح → product، واحد → unit؛
 * «سمت» حالا از `POSITION` (ایشوی ۲) می‌آید و دیگر عددِ آزاد نیست.
 *
 * ایشوی ۱۰: «کد فعالیت مرتبط» از فیلدها و ستون‌ها حذف شد چون مالکیتِ هر ردیف
 * با `daily_report_activity_id` مشخص است و تسک را خودِ فعالیت می‌دهد؛ ناظر
 * دیگر برای هر ردیف دوباره تسک را انتخاب نمی‌کند و ستون تکراری هم نداریم.
 *
 * ایشوی ۲.۳: «نیروی انسانی» سمت + مالتیِ نیرو می‌شود (بدون تعداد و بدون
 * پیمانکار) و هر انتخاب یک ردیفِ دیتابیس می‌شود. ایشوی ۳: «پیمانکار» از همه‌ی
 * زیرمجموعه‌ها رفت و فقط در «مشخصات فعالیت» ماند. ایشوی ۹ و ۱۰: واحد دیگر در
 * فرم نیست و از خودِ محصول می‌آید.
 */

const ACTION = "action_type";
const GROUP = "item_group";
const DELIVERY = "delivery_type";

const positionField: LineField = { name: "position_type", title: "سمت", kind: "select", list: POSITION, required: true };

const NUMBER = "number" as const;

/**
 * برچسبِ «مقدار (واحد)» — ایشوی ۹.
 *
 * فرم دیگر فیلدِ واحد ندارد و `unit_id` را سرور از روی محصول پر می‌کند؛ پس
 * واحد را از خودِ محصولِ انتخاب‌شده می‌خوانیم و از روی واژه‌نامه برچسب می‌سازیم.
 */
const quantityWithUnit = (
    values: LineValues,
    options: { products: { value: string; label: string; unit_id?: string }[]; units: { value: string; label: string }[] },
) => {
    const product = options.products.find((option) => option.value === String(values.product_id ?? ""));
    const unit = options.units.find((option) => option.value === String(product?.unit_id ?? ""))?.label;
    return `مقدار (${unit ?? "—"})`;
};

export const LINE_CONFIGS: Record<LineKind, LineConfig> = {
    manpower: {
        kind: "manpower",
        title: "نیروی انسانی در حال کار طی روز",
        subtitle: "یک سمت انتخاب کنید و همه‌ی نیروهای آن سمت را یک‌جا ثبت کنید",
        entity: "نیروی انسانی",
        minWidth: "34rem",
        fields: [
            positionField,
            {
                name: "person_ids",
                title: "نیروها",
                kind: "select",
                source: "contacts",
                multi: true,
                /** گزینه‌ها فقط اشخاصِ همان سمت (ایشوی ۲.۱) */
                filterBy: "position_type",
                /** در ویرایش، شناسه‌ی ذخیره‌شده `person_id` تکی است نه مالتی */
                from: "person_id",
                required: true,
                hint: "",
            },
        ],
        columns: [
            { key: "_i", title: "ردیف", w: "2.5rem" },
            { key: "person_id", title: "شخص", w: "minmax(9rem,2fr)", as: "lookup", source: "contacts" },
            { key: "position_type", title: "سمت", w: "minmax(7rem,1.4fr)", as: "enum", list: POSITION },
        ],
    },

    equipment: {
        kind: "equipment",
        title: "ماشین‌آلات و تجهیزات مورد استفاده طی روز",
        subtitle: "شمارنده‌های فعال / غیرفعال / تعمیراتِ هر نوع ماشین",
        entity: "ماشین‌آلات",
        minWidth: "46rem",
        fields: [
            { name: "equipment_type_id", title: "نوع ماشین‌آلات", kind: "select", source: "equipmentTypes", required: true },
            { name: "active_count", title: "فعال", kind: NUMBER },
            { name: "inactive_count", title: "غیرفعال", kind: NUMBER },
            { name: "repair_count", title: "تعمیرات", kind: NUMBER },
        ],
        columns: [
            { key: "_i", title: "ردیف", w: "2.5rem" },
            { key: "equipment_type_id", title: "نوع ماشین‌آلات", w: "minmax(8rem,1.5fr)", as: "lookup", source: "equipmentTypes" },
            { key: "active_count", title: "فعال", w: "3.5rem", as: "number" },
            { key: "inactive_count", title: "غیرفعال", w: "4.5rem", as: "number" },
            { key: "repair_count", title: "تعمیرات", w: "5rem", as: "number" },
        ],
    },

    materials: {
        kind: "materials",
        title: "مواد و مصالح مورد استفاده طی روز",
        subtitle: "مصالح از فهرست کالاها انتخاب و واحدِ همان کالا کنار مقدار می‌آید",
        entity: "مصالح",
        minWidth: "44rem",
        fields: [
            { name: "product_id", title: "نوع مواد و مصالح", kind: "select", source: "products", required: true },
            {
                name: "quantity",
                title: "مقدار",
                kind: NUMBER,
                required: true,
                /** ایشوی ۹: واحدِ فیلدِ جدا نیست؛ از محصول می‌آید و کنار مقدار می‌نشیند */
                titleOf: (values, options) => quantityWithUnit(values, options),
            },
        ],
        columns: [
            { key: "_i", title: "ردیف", w: "2.5rem" },
            { key: "product_id", title: "نوع مواد و مصالح", w: "minmax(9rem,2fr)", as: "lookup", source: "products" },
            { key: "unit_id", title: "واحد", w: "5rem", as: "lookup", source: "units" },
            { key: "quantity", title: "مقدار", w: "4.5rem", as: "number" },
        ],
    },

    deliveries: {
        kind: "deliveries",
        title: "تحویل کالا / تجهیز",
        subtitle: "کالا از فهرست کالاها انتخاب می‌شود و واحدِ همان کالا به‌خودی‌خود می‌نشیند",
        entity: "تحویل کالا",
        minWidth: "58rem",
        fields: [
            { name: ACTION, title: "نوع اقدام", kind: "select", list: ACTION_TYPE, required: true },
            /** ایشوی ۱۰: «گروه کالا» دیگر کشویی کالا/تجهیز نیست و متن آزاد است */
            { name: GROUP, title: "گروه کالا", kind: "text", required: false },
            { name: DELIVERY, title: "نوع تحویل", kind: "select", list: DELIVERY_TYPE, required: true },
            { name: "product_id", title: "نام کالا یا تجهیز", kind: "select", source: "products", required: false },
            /** ایشوی ۱۰: واحدِ جدا در فرم نیست و از خودِ محصولِ انتخاب‌شده می‌آید */
            {
                name: "quantity",
                title: "مقدار",
                kind: NUMBER,
                required: true,
                hint: "",
                titleOf: (values, options) => quantityWithUnit(values, options),
            },
            { name: "delivered_from", title: "تحویل از", kind: "select", source: "contacts", required: false },
            { name: "received_by", title: "تحویل گیرنده", kind: "select", source: "contacts", required: false },
            { name: "description", title: "توضیح", kind: "textarea", required: false },
        ],
        columns: [
            { key: "_i", title: "ردیف", w: "2.5rem" },
            { key: ACTION, title: "نوع اقدام", w: "5.5rem", as: "enum", list: ACTION_TYPE },
            { key: GROUP, title: "گروه کالا", w: "6rem", as: "text" },
            { key: DELIVERY, title: "نوع تحویل", w: "5rem", as: "enum", list: DELIVERY_TYPE },
            { key: "product_id", title: "نام کالا / تجهیز", w: "minmax(9rem,2fr)", as: "deliveryItem", source: "products" },
            { key: "unit_id", title: "واحد", w: "5rem", as: "lookup", source: "units" },
            { key: "quantity", title: "مقدار", w: "4.5rem", as: "number" },
            { key: "delivered_from", title: "تحویل از", w: "minmax(7rem,1.2fr)", as: "lookup", source: "contacts" },
            { key: "received_by", title: "تحویل گیرنده", w: "minmax(7rem,1.2fr)", as: "lookup", source: "contacts" },
            { key: "description", title: "توضیح", w: "minmax(7rem,1.2fr)", as: "text" },
        ],
    },

    timesheets: {
        kind: "timesheets",
        title: "تایم‌شیت اشخاص",
        subtitle: "رکوردهای دستگاه حضور و غیابِ همین تاریخ را انتخاب کنید یا دستی ثبت کنید",
        entity: "تایم‌شیت",
        /** feedback 1: a log row is never deleted, only released from the activity */
        release: true,
        minWidth: "52rem",
        /**
         * Issue 1: this tab no longer owns a table of its own — it sits on the
         * `users_logs` log, so the fields are exactly that table's columns.
         * "Position" and "cooperation type" are gone: position comes from the
         * contact and cooperation type is no longer stored in this table.
         *
         * Feedback 6: "فرد" became "شخص" and "شعبه" was dropped entirely
         * (branch has no use anywhere in this form).
         */
        fields: [
            { name: "user_id", title: "شخص", kind: "select", source: "contacts", required: true },
            /** only the time is captured; the date comes from the report header */
            { name: "checkindate", title: "ساعت ورود", kind: "time", required: false },
            { name: "checkout_date", title: "ساعت خروج", kind: "time", required: false },
            { name: "hour_normal", title: "ساعت عادی", kind: NUMBER, required: false },
            { name: "hour_extra", title: "ساعت اضافه", kind: NUMBER, required: false },
            { name: "delay_minutes", title: "تاخیر (دقیقه)", kind: NUMBER, required: false },
            { name: "extra_minutes", title: "اضافه (دقیقه)", kind: NUMBER, required: false },
        ],
        columns: [
            { key: "_i", title: "ردیف", w: "2.5rem" },
            { key: "user_id", title: "شخص", w: "minmax(9rem,2fr)", as: "lookup", source: "contacts" },
            { key: "checkindate", title: "ساعت ورود", w: "5rem", as: "time" },
            { key: "checkout_date", title: "ساعت خروج", w: "5rem", as: "time" },
            { key: "hour_normal", title: "ساعت عادی", w: "5rem", as: "number" },
            { key: "hour_extra", title: "ساعت اضافه", w: "5rem", as: "number" },
            { key: "delay_minutes", title: "تاخیر", w: "4rem", as: "number" },
            { key: "extra_minutes", title: "اضافه", w: "4rem", as: "number" },
        ],
    },
};

/** ترتیب تب‌ها — عین ترتیب فرم اکسل */
export const LINE_KINDS = Object.keys(LINE_CONFIGS) as LineKind[];
