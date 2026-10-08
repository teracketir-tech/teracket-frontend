import * as yup from "yup";

export default yup.object().shape({
    fname: yup.string().required("لطفا نام را وارد کنید"),
    lname: yup.string().nullable(),
    alias: yup.string(),
    mobile: yup.string().required("لطفا موبایل را وارد کنید"),
    type: yup.string().required("لطفا نوع را انتخاب کنید"),
    active: yup.string().required("لطفا وضعیت فعالیت را انتخاب کنید"),
});
