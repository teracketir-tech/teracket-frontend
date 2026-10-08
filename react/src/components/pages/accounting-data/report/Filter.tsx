import AccountingDataSelect from "@/components/shared/AccountingDataSelect";
import BankSelect from "@/components/shared/BankSelect";
import CompanySelect from "@/components/shared/CompanySelect";
import ContactSelect from "@/components/shared/ContactSelect";
import Filters from "@/components/shared/Filters";
import DateInput from "@/components/shared/inputs/Date";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function FilterForm({ loading }: { loading: boolean }) {
    const [open, setOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const formik = useFormik({
        initialValues: {
            company_id: "",
            accounting_data_id: null,
            contact_id: "",
            bank_id: "",
            date: "",
        },
        onSubmit,
        validationSchema: false,
    });

    function onSubmit(data: object) {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(data).forEach(([key, value]) => {
            if (value) params.set(key, value.toString());
            else params.delete(key);
        });

        setSearchParams(params);
    }

    useEffect(() => {
        if (open) {
            Object.entries(formik.values).forEach(([key]) => {
                if (searchParams.get(key)) formik.setFieldValue(key, searchParams.get(key)?.toString());
            });
        }
    }, [open]);

    return (
        <Filters
            open={open}
            setOpen={setOpen}
            loading={loading}
            onReset={() => {
                setOpen(false);
                formik.resetForm();
                setSearchParams({}, { replace: true });
            }}
            onOk={() => formik.submitForm()}
        >
            <form className="w-full grid grid-cols-5 gap-5">
                <CompanySelect formik={formik} />
                <AccountingDataSelect formik={formik} isMulti={true} />
                <ContactSelect formik={formik} />
                <BankSelect formik={formik} />
                <DateInput name="date" title="تاریخ" formik={formik} required={false} isRange={true} />
            </form>
        </Filters>
    );
}
