import * as yup from "yup";

export default yup.object().shape({
    price: yup.string().required("لطفا مبلغ را وارد کنید"),
    bank_id: yup.string().required("لطفا بانک را انتخاب کنید"),
});
