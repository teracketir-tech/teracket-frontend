import * as yup from "yup";

export default yup.object().shape({
    first_name: yup.string().required("لطفا نام را وارد کنید"),
    last_name: yup.string().required("لطفا نام خانوادگی را وارد کنید"),
    phone_number: yup
        .string()
        .required("لطفا شماره موبایل را وارد کنید")
        .matches(/^09\d{9}$/, "شماره موبایل معتبر نیست (باید با 09 شروع شود و 11 رقم باشد)"),
    group_id: yup.string().required("لطفا گروه را انتخاب کنید"),
});
