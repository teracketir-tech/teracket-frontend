import * as yup from "yup";

export default yup.object().shape({
    accounting_data_id: yup.string().required("لطفا حساب را انتخاب کنید"),
    price: yup.string().required("لطفا مبلغ را وارد کنید"),
    date: yup.string().required("لطفا تاریخ را وارد کنید"),
});
