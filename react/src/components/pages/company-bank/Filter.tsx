import CompanySelect from "@/components/shared/CompanySelect";
import Filters from "@/components/shared/Filters";
import Input from "@/components/shared/inputs";
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
            id: "",
            name: "",
            company_id: "",
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
                {!auth?.company_id && <CompanySelect formik={formik} required={false} />}
                <Input name="id" title="شناسه" formik={formik} required={false} />
                <Input name="name" title="نام" formik={formik} required={false} />
            </form>
        </Filters>
    );
}
