import AccountingDataSelect from "@/components/shared/AccountingDataSelect";
import BankSelect from "@/components/shared/CompanyBankSelect";
import CompanySelect from "@/components/shared/CompanySelect";
import ContactSelect from "@/components/shared/ContactSelect";
import Filters from "@/components/shared/Filters";
import DateInput from "@/components/shared/inputs/Date";
import ProjectSelect from "@/components/shared/ProjectSelect";
import { useAuth } from "@/context/AuthContext";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function FilterForm({ loading }: { loading: boolean }) {
    const { auth } = useAuth();
    const [open, setOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const formik = useFormik({
        initialValues: {
            company_id: auth?.company_id || "",
            accounting_data_id: null,
            contact_id: "",
            project_id: "",
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
        <Filters open={open} setOpen={setOpen} loading={loading} formik={formik}>
            <form className="w-full grid grid-cols-5 gap-5">
                <CompanySelect formik={formik} />
                <AccountingDataSelect formik={formik} isMulti={true} />
                <ContactSelect formik={formik} />
                <BankSelect formik={formik} />
                <ProjectSelect formik={formik} />
                <DateInput name="date" title="تاریخ" formik={formik} required={false} isRange={true} />
            </form>
        </Filters>
    );
}
