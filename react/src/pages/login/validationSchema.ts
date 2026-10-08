import * as yup from "yup";

export default yup.object().shape({
    phone_number: yup
        .string()
        .required("لطفا شماره موبایل را وارد کنید")
        .matches(/^09\d{9}$/, "شماره موبایل معتبر نیست (باید با 09 شروع شود و 11 رقم باشد)"),

    password: yup.string().required("لطفا رمز عبور را وارد کنید"),
});
