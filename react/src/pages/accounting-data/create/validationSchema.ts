import * as yup from "yup";

export default yup.object().shape({
    title: yup.string().required("لطفا نام را وارد کنید"),
    parent_id: yup.string().required("لطفا حساب را انتخاب کنید"),
    detail_name: yup.string(),
});
