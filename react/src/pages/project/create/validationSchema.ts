import * as yup from "yup";

export default yup.object().shape({
    name: yup.string().required("لطفا نام را وارد کنید"),
    company_id: yup.string().nullable(),
    // میلادی ISO (YYYY-MM-DD)؛ انتخاب‌گر شمسی نشان می‌دهد و قبل از ارسال تبدیل می‌کند.
    // الزامی است چون تنها لنگرِ زمان‌بندی است؛ بدون آن هیچ تاریخِ برنامه‌ریزی‌شده‌ای ساخته نمی‌شود.
    start_date: yup
        .string()
        .required("تاریخ شروع پروژه را وارد کنید")
        .matches(/^\d{4}-\d{2}-\d{2}$/, "تاریخ شروع معتبر نیست"),
});
