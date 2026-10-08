import Filters from "@/components/shared/Filters";
import DateInput from "@/components/shared/inputs/Date";
import Select from "@/components/shared/inputs/Select";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function FilterForm({ loading }: { loading: boolean }) {
    const [open, setOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const formik = useFormik({
        initialValues: {
            os: "",
            created_at: "",
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
                <Select
                    name="os"
                    title="دستگاه"
                    formik={formik}
                    required={false}
                    options={[
                        { value: "Windows", label: "Windows" },
                        { value: "macOS", label: "macOS" },
                        { value: "Linux", label: "Linux" },
                        { value: "Android", label: "Android" },
                        { value: "iOS", label: "iOS" },
                    ]}
                />
                <DateInput name="created_at" title="زمان" formik={formik} required={false} />
            </form>
        </Filters>
    );
}
