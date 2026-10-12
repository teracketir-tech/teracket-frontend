import * as yup from "yup";
import { ACTION_OUT, ACTION_TYPE, DELIVERY_TYPE } from "@/lib/report-rules";
import type { LineKind } from "./types";

/**
 * اعتبارسنجی دیالوگ پنج زیرمجموعه — سند فاز ۲ بند ۱۷.
 *
 * قواعد سمت سرور (`models/DailyReport*.php`) منبع حقیقت‌اند؛ اینجا همان‌ها
 * آینه شده‌اند تا خطای ناظر پیش از رفتن به سرور دیده شود:
 *   - شناسه‌ها الزامی‌اند جز `unit_id`، `product_id`، `delivered_from` و
 *     `received_by` که اختیاری‌اند
 *   - شمارنده‌ها و مقدارها منفی نیستند (جز «خروج کالا»)
 *   - «سمت» باید عدد صحیح بزرگ‌تر از صفر باشد (CHECKهای `chk_drm_pos`/`chk_dts_pos`)
 *   - ساعت ورود/خروج `HH:MM` است (`ReportRules::isTime`)
 *
 * ایشوی ۱۰: `task_id` حذف شد — مالکیتِ ردیف را `daily_report_activity_id` می‌گوید
 * و تسک را خودِ فعالیت دارد؛ پس نه فیلد داریم، نه ستون و نه اعتبارسنجیِ آن.
 *
 * ایشوی ۲.۳/۳/۹/۱۰: `quantity` و `contractor_id` از نیرو رفتند (نیرو مالتی و
 * بدونِ تعداد)، پیمانکار از همه‌ی زیرمجموعه‌ها رفت (فقط «مشخصات فعالیت» ماند)،
 * `unit_id` از مصالح و تحویل رفت (واحد از محصول می‌آید) و `item_name` از تحویل
 * حذف شد.
 *
 * `.transform` برای این است که پاک کردنِ یک فیلد عددی به `null` بدل شود و
 * همان `required` پیام درست‌تر را بدهد.
 */
function numberField(label: string) {
    return yup
        .number()
        .typeError(`${label} معتبر نیست`)
        .transform((value, raw) => (raw === "" || raw === null || raw === undefined ? null : value))
        .nullable();
}

const count = (label: string) => numberField(label).min(0, `${label} نمی‌تواند منفی باشد`);

const idField = (label: string) => numberField(label).required(`انتخاب ${label} الزامی است`);

const positionField = () =>
    numberField("سمت").integer("سمت باید عدد صحیح باشد").min(1, "سمت باید حداقل ۱ باشد").required("سمت الزامی است");

const enumField = (label: string, list: Record<number, string>) =>
    numberField(label)
        .oneOf([null, ...Object.keys(list).map(Number)], `${label} نامعتبر است`)
        .required(`انتخاب ${label} الزامی است`);

const optionalId = (label: string) => numberField(label).notRequired();

const textField = (label: string, max?: number) => {
    const field = yup.string().trim().typeError(`${label} معتبر نیست`).nullable().notRequired();
    return max ? field.max(max, `${label} حداکثر ${max} کاراکتر است`) : field;
};

const timeField = (label: string) =>
    yup
        .string()
        .trim()
        // عین `ReportRules::isTime`: HH:MM یا HH:MM:SS و فقط ساعت/دقیقه‌ی معتبر
        .matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, `${label} باید به صورت HH:MM باشد`)
        .nullable()
        .notRequired();

const schemas = {
    // ایشوی ۲.۳: سمت + مالتیِ نیرو؛ تعداد و پیمانکار حذف شدند
    manpower: {
        position_type: positionField(),
        person_ids: yup.string().trim().required("دست‌کم یک نیرو انتخاب کنید"),
    },

    equipment: {
        equipment_type_id: idField("نوع ماشین‌آلات"),
        active_count: count("تعداد فعال"),
        inactive_count: count("تعداد غیرفعال"),
        repair_count: count("تعداد تعمیرات"),
    },

    materials: {
        product_id: idField("مصالح"),
        quantity: count("مقدار").required("مقدار الزامی است"),
    },

    deliveries: {
        action_type: enumField("نوع اقدام", ACTION_TYPE),
        // ایشوی ۱۰: متن آزاد به‌جای کشویی «کالا / تجهیز» (ستون varchar(100))
        item_group: textField("گروه کالا", 100),
        delivery_type: enumField("نوع تحویل", DELIVERY_TYPE),
        product_id: optionalId("کالا"),
        quantity: numberField("مقدار")
            .required("مقدار الزامی است")
            .test(
                "not-negative",
                "مقدار نمی‌تواند منفی باشد مگر نوع اقدام «خروج کالا» انتخاب شده باشد",
                (value, context) =>
                    value === null || value === undefined || value >= 0 || Number(context.parent?.action_type) === ACTION_OUT,
            ),
        delivered_from: optionalId("تحویل‌دهنده"),
        received_by: optionalId("تحویل گیرنده"),
        description: textField("توضیح"),
    },

    /**
     * Issue 1: the timesheet sits on the `users_logs` log, so validation is
     * exactly that table's columns. Position and cooperation type no longer
     * belong here.
     *
     * Feedback 6: "branch" left the fields too, so its validation went with it.
     */
    timesheets: {
        user_id: idField("شخص"),
        checkindate: timeField("ساعت ورود"),
        checkout_date: timeField("ساعت خروج"),
        hour_normal: count("ساعت عادی"),
        hour_extra: count("ساعت اضافه"),
        delay_minutes: count("تاخیر (دقیقه)"),
        extra_minutes: count("اضافه (دقیقه)"),
    },
} satisfies Record<LineKind, unknown>;

/** اسکیمای تبِ زیرمجموعه — همان کلیدهای `LineKind` */
export function lineSchema(kind: LineKind) {
    return yup.object().shape(schemas[kind]);
}
