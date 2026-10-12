import * as yup from "yup";

/** قاعده‌ی سمت سرور: `name` و `company_id` الزامی‌اند (`models/Unit::rules`) */
export default yup.object().shape({
    name: yup.string().trim().required("لطفا نام را وارد کنید"),
    company_id: yup.string().required("لطفا شرکت را انتخاب کنید"),
});
