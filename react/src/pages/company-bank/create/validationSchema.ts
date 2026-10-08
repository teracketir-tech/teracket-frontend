import * as yup from "yup";

export default yup.object().shape({
    name: yup.string().required("لطفا نام را وارد کنید"),
    company_id: yup.string().required("لطفا شرکت را انتخاب کنید"),
    bank_id: yup.string().required("لطفا بانک را انتخاب کنید"),
});
