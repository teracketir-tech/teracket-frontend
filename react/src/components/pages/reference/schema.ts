import * as yup from "yup";

/**
 * الزامِ واقعیِ یک سلکت — `mixed().required()` فقط `null` و `undefined` را رد
 * می‌کند و رشته‌ی خالیِ سلکت (`""`) را نه؛ بدون این تست، دکمه‌ی «ثبت» برای فرمِ
 * خالیِ «گروه/منشاء» باز می‌ماند و خطایش را فقط سرور می‌گیرد. `string` هم نمی
 * شود چون در حالتِ ویرایش مقدار از سرور عددی می‌آید.
 */
const selectRequired = (message: string) =>
    yup
        .mixed()
        .required(message)
        .test({
            name: "not-empty",
            message,
            test: (value) => value !== "" && value !== null && value !== undefined,
        });

/**
 * اعتبارسنجیِ فرمِ لیست‌های مرجع (ایشوی ۱۲، ۱۵ و ۱۶) — سازنده است نه شیءِ ثابت:
 * برچسبِ فیلد بین «نام ماشین‌آلات» و «دلیل انحراف» فرق دارد ولی قاعده‌ی نام
 * یکی است؛ دومین schema از صفر ساخته نمی‌شود (DRY).
 *
 * `max(100)` عین قاعده‌ی `string, max=100` مدل است تا خطای سمت سرور هرگز
 * دیده نشود.
 *
 * برای «ماشین‌آلات» فقط نام الزامی است: ردیف‌های seedشده خالی‌اند و باید
 * بتوان بدون شرکت ذخیره کرد.
 */
export const referenceSchema = (nameLabel: string) =>
    yup.object().shape({
        name: yup
            .string()
            .trim()
            .required(`لطفا ${nameLabel} را وارد کنید`)
            .max(100, `${nameLabel} حداکثر ۱۰۰ کاراکتر است`),
    });

/**
 * فرمِ «عوامل انحراف» — ایشوی ۱۶: به‌جز شرکت همه‌ی فیلدها الزامی‌اند و باید
 * عین قواعدِ مدل (`required` روی گروه / منشاء / اثر غالب) باشند تا خطای
 * سرور هرگز دیده نشود. روی همان سازنده ساخته می‌شود تا قاعده‌ی نام تکرار
 * نشود؛ ترتیبِ فیلدها همان ترتیبِ فرم است.
 */
export const deviationSchema = referenceSchema("دلیل انحراف").shape({
    factor_group_id: selectRequired("لطفا گروه را انتخاب کنید"),
    deviation_source: selectRequired("لطفا منشاء انحراف را انتخاب کنید"),
    effect_ids: yup
        .array()
        .of(yup.mixed())
        .min(1, "لطفا اثر غالب را انتخاب کنید")
        .required("لطفا اثر غالب را انتخاب کنید"),
});
