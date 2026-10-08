import * as yup from "yup";

export default yup.object().shape({
    name: yup.string().nullable(),
    company_id: yup.string().nullable(),
    bank_name_id: yup.string().required("لطفا بانک را انتخاب کنید"),
});
