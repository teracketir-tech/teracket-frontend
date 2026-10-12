import * as yup from "yup";
import { SITE_INACTIVE } from "@/lib/report-rules";

/**
 * اعتبارسنجی سربرگ — سند فاز ۲ بند ۱۷.
 *
 * تنها قواعد این بخش: «گزارش بدون project_id و report_date قابل ثبت نباشد» و
 * «برای وضعیت کارگاه غیرفعال، دلیل غیرفعالی اجباری شود».
 */
const validationSchema = yup.object({
    project_id: yup.string().trim().required("پروژه را انتخاب کنید"),
    report_date: yup.string().trim().required("تاریخ گزارش را وارد کنید"),
    inactive_reason: yup
        .string()
        .trim()
        .when("site_status", {
            is: (siteStatus: unknown) => Number(siteStatus) === SITE_INACTIVE,
            then: (schema) => schema.required("دلیل غیرفعال بودن کارگاه را وارد کنید"),
            otherwise: (schema) => schema.notRequired(),
        }),
});

export default validationSchema;
