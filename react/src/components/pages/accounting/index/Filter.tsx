import AccountingDataSelect from "@/components/shared/AccountingDataSelect";
import CompanySelect from "@/components/shared/CompanySelect";
import Filters from "@/components/shared/Filters";
import Input from "@/components/shared/inputs";
import DateInput from "@/components/shared/inputs/Date";
import Select from "@/components/shared/inputs/Select";
import ProjectSelect from "@/components/shared/ProjectSelect";
import UserSelect from "@/components/shared/UserSelect";
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
            date: "",
            created_at: "",
            description: "",
            price: "",
            status: "",
            project_id: "",
            accounting_data_id: null,
            user_id: "",
            user_os: "",
            user_ip: "",
            image: "",
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
                <Input name="id" title="شناسه" formik={formik} required={false} />
                <DateInput name="created_at" title="تاریخ روز" formik={formik} required={false} isRange={true} />
                <DateInput name="date" title="تاریخ سند" formik={formik} required={false} isRange={true} />
                <Input name="description" title="شرح" formik={formik} required={false} />
                <Input name="price" type="number" title="مبلغ" formik={formik} required={false} />
                <Select
                    name="status"
                    title="وضعیت"
                    formik={formik}
                    required={false}
                    options={[
                        { label: "پیش‌ نویس", value: "1" },
                        { label: "تایید شده", value: "2" },
                    ]}
                />
                <AccountingDataSelect formik={formik} isMulti={true} />
                <ProjectSelect formik={formik} />
                <UserSelect title="نام ثبت کننده" formik={formik} />
                <Select
                    name="user_os"
                    title="سیستم عامل"
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
                <Input name="user_ip" title="آی پی" formik={formik} required={false} />
                <Select
                    name="image"
                    title="فایل آپلود شده"
                    formik={formik}
                    required={false}
                    options={[
                        { value: "1", label: "دارد" },
                        { value: "2", label: "ندارد" },
                    ]}
                />
            </form>
        </Filters>
    );
}
