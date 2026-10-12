import * as yup from "yup";

export default yup.object().shape({
    name: yup.string().required("لطفا نام را وارد کنید"),
    company_id: yup.string().nullable(),
    accounting_data_id: yup.string().required("لطفا حساب را انتخاب کنید"),
});
