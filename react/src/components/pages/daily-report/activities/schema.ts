import * as yup from "yup";
import { ACTIVITY_STATUS } from "@/lib/report-rules";

/**
 * اعتبارسنجی دیالوگ فعالیت — سند فاز ۲ بند ۱۷:
 *   «daily_progress و quality_percent بین 0 تا 100 باشند»،
 *   «work_hours منفی نباشد»، و «task_id باید متعلق به همان project_id باشد»
 *   که آن یکی را Backend می‌سنجد (اینجا فقط الزام انتخاب دیده می‌شود).
 *
 * `.transform` برای این است که پاک کردنِ یک فیلد عددی به `""` تبدیل نشود و
 * خطای «معتبر نیست» ندهد؛ آنگاه `required` پیام درست‌تر را می‌دهد.
 */
function numberField(label: string) {
    return yup
        .number()
        .typeError(`${label} معتبر نیست`)
        .transform((value, raw) => (raw === "" ? null : value))
        .nullable();
}

const percentField = (label: string) =>
    numberField(label).min(0, `${label} نمی‌تواند منفی باشد`).max(100, `${label} حداکثر ۱۰۰ است`);

export const activitySchema = yup.object().shape({
    task_id: numberField("تسک").required("انتخاب تسک الزامی است"),

    daily_progress: percentField("درصد پیشرفت").required("درصد پیشرفت الزامی است"),
    quality_percent: percentField("کیفیت انجام"),
    work_hours: numberField("ساعت واردشده").min(0, "ساعت نمی‌تواند منفی باشد"),

    status: yup
        .number()
        .typeError("وضعیت نامعتبر است")
        .transform((value, raw) => (raw === "" ? null : value))
        .nullable()
        .oneOf([null, ...Object.keys(ACTIVITY_STATUS).map(Number)], "وضعیت نامعتبر است"),

    supervisor_forecast_date: yup.string().nullable().notRequired(),
    executor_id: yup.string().nullable().notRequired(),
    supervisor_id: yup.string().nullable().notRequired(),
    description: yup.string().nullable().notRequired(),
    risks: yup.string().nullable().notRequired(),

    /** تبِ «عوامل انحراف» (ایشوی ۴) — مالتی، داخلِ «مشخصات فعالیت»؛ ناشناخته بودن را Backend با قاعدهی `exist` رد می‌کند */
    deviation_reason_ids: yup.array().of(numberField("عامل انحراف")).nullable().notRequired(),

    /** ایشوی ۳: پیمانکار فقط همین‌جا و فقط یک‌بار — اختیاری */
    contractor_id: numberField("پیمانکار"),
});

export type ActivitySchema = yup.InferType<typeof activitySchema>;
