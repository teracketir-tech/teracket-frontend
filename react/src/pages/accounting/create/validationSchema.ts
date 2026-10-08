import * as yup from "yup";

export default yup.object().shape({
    date: yup.string().required("لطفا نام را وارد کنید"),
    status: yup.string().required("لطفا وضعیت را انتخاب کنید"),
    description: yup.string().required("لطفا شرح را وارد کنید"),
});
