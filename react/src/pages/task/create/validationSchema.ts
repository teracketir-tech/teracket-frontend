import * as yup from "yup";

const taskSchema = yup.object().shape({
    /** فقط برایِ فیلترِ پروژه‌هاست (الزامی نیست)؛ بک‌اند company_id را از پروژه برمی‌دارد */
    company_id: yup.string().nullable(),
    project_id: yup.string().required("لطفا پروژه را انتخاب کنید"),
    name: yup.string().trim().required("لطفا نام تسک را وارد کنید"),
    parent_id: yup.string().nullable().notRequired(),
    duration: yup
        .number()
        .typeError("مدت زمان معتبر نیست")
        .min(0, "مدت زمان نمی‌تواند منفی باشد")
        .required("لطفا مدت زمان را وارد کنید"),
    duration_unit: yup.string().required("لطفا واحد زمان را انتخاب کنید"),
    sort_order: yup
        .number()
        .typeError("ترتیب معتبر نیست")
        .min(0, "ترتیب نمی‌تواند منفی باشد")
        .notRequired(),
});

export default taskSchema;
