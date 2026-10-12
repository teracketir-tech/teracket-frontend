import type { FormikProps } from "formik";

/**
 * کمک‌هایِ سلکت‌های «عوامل انحراف» — ایشوی ۱۶ (جایگزین `constants.ts`).
 *
 * برچسب‌ها اینجا تعریف نمی‌شوند: سرور همان «عنوان و مقدار» را در `form_data`
 * پاسخِ فهرست و در واژه‌نامه برای فرم می‌دهد (قاعده‌ی کلیِ ایشوی ۱۶ و الگوی
 * جدول `order` در ماژول seal)؛ اینجا فقط خواندنِشان است. پس اگر اکسل عوض شود
 * فقط سرور دست می‌خورد نه دو جای این فرانت (DRY).
 */

/** یک گزینه‌ی کشویی از API — `factor_group` فقط منشاء انحراف دارد */
export interface Option {
    value: string | number;
    label: string;
    factor_group?: string | number;
}

/** گزینه‌های `form_data` پاسخِ فهرست، به ترتیبِ کلیدهای سرور */
export type FormData = Record<string, Option[] | undefined>;

/** لیستِ پایدارِ خالی، تا پیش از رسیدنِ پاسخ هوک‌ها بی‌جهت بازمحاسبه نشوند */
export const EMPTY_FORM_DATA: FormData = {};

/** برچسبِ یک مقدار در فهرست — خالی یا ناشناخته → «—» */
export const optionLabel = (options: Option[], value: unknown): string => {
    if (value === null || value === undefined || value === "") return "—";

    return options.find((option) => String(option.value) === String(value))?.label ?? "—";
};

/** برچسبِ چند مقدار (سلکتِ مالتی) با « / » — خالی یا ناشناخته → «—» */
export const optionsLabel = (options: Option[], values: unknown): string => {
    const labels = (Array.isArray(values) ? values : [])
        .map((value) => optionLabel(options, value))
        .filter((label) => label !== "—");

    return labels.length ? labels.join(" / ") : "—";
};

/**
 * گزینه‌هایِ منشاءِ همان گروه — اتصالِ سلکتِ «منشاء» به سلکتِ «گروه».
 * ایشوی ۱۸: گروهِ خالی یعنی هنوز انتخاب نشده و آن‌وقت هیچ منشاءای
 * نمایش داده نمی‌شود (لیستِ خالی) تا گزینه‌ای بی‌ربط انتخاب نشود.
 */
export const byGroup = (options: Option[], group: unknown): Option[] => {
    if (group === "" || group === null || group === undefined) return [];

    return options.filter((option) => String(option.factor_group) === String(group));
};

/**
 * با عوض‌شدنِ گروه، منشاءِ خارج از آن گروه پاک می‌شود — وگرنه فرم با خطای
 * سرور («منشاء به گروه انتخاب‌شده تعلق ندارد») رد می‌شود. ایشوی ۱۸: پاک
 * شدنِ خودِ گروه هم منشاءِ انتخاب‌شده را برمی‌دارد چون لیست خالی می‌شود.
 */
export const clearStaleSource = (
    formik: FormikProps<Record<string, unknown>>,
    group: unknown,
    sources: Option[],
): void => {
    const current = formik.values.deviation_source;

    if (current === "" || current === null || current === undefined) return;

    if (group === "" || group === null || group === undefined) {
        formik.setFieldValue("deviation_source", "");
        return;
    }

    const valid = sources.some(
        (source) => String(source.factor_group) === String(group) && String(source.value) === String(current),
    );

    if (!valid) {
        formik.setFieldValue("deviation_source", "");
    }
};
