import CompanySelect from "@/components/shared/CompanySelect";
import Filters from "@/components/shared/Filters";
import Input from "@/components/shared/inputs";
import Select from "@/components/shared/inputs/Select";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function FilterForm({ loading }: { loading: boolean }) {
    const [open, setOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const formik = useFormik({
        initialValues: {
            company_id: "",
            id: "",
            first_name: "",
            last_name: "",
            active: "",
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
            <form className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                <CompanySelect formik={formik} />
                <Input name="id" title="شناسه" formik={formik} required={false} />
                <Input name="first_name" title="نام" formik={formik} required={false} />
                <Input name="last_name" title="نام خانوادگی" formik={formik} required={false} />
                <Select
                    name="active"
                    title="وضعیت"
                    formik={formik}
                    required={false}
                    options={[
                        { value: "0", label: "آفلاین" },
                        { value: "1", label: "آنلاین" },
                    ]}
                />
            </form>
        </Filters>
    );
}
