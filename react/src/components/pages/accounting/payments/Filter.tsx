import CompanySelect from "@/components/shared/CompanySelect";
import ContactSelect from "@/components/shared/ContactSelect";
import Filters from "@/components/shared/Filters";
import Input from "@/components/shared/inputs";
import DateInput from "@/components/shared/inputs/Date";
import Select from "@/components/shared/inputs/Select";
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
            id: "",
            accounting_id: "",
            project_id: "",
            date: "",
            created_at: "",
            description: "",
            credit: "",
            status: "",
            paid_or_received: "",
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
                <Input name="id" title="شناسه" formik={formik} required={false} />
                <Input name="accounting_id" title="شناسه سند" formik={formik} required={false} />
                <DateInput name="created_at" title="تاریخ روز" formik={formik} required={false} isRange={true} />
                <DateInput name="date" title="تاریخ سند" formik={formik} required={false} isRange={true} />
                <Input name="description" title="شرح" formik={formik} required={false} />
                <Input name="credit" type="number" title="مبلغ سند" formik={formik} required={false} />
                <ContactSelect formik={formik} />
                <ProjectSelect formik={formik} />
                <Select
                    name="paid_or_received"
                    title="وضعیت"
                    formik={formik}
                    required={false}
                    options={[
                        { label: "پرداخت نشده", value: "0" },
                        { label: "پرداخت شده", value: "1" },
                    ]}
                />
            </form>
        </Filters>
    );
}
