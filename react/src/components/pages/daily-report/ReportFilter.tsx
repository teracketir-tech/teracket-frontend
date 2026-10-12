import Filters from "@/components/shared/Filters";
import ProjectSelect from "@/components/shared/ProjectSelect";
import DateInput from "@/components/shared/inputs/Date";
import Select from "@/components/shared/inputs/Select";
import { REPORT_STATUS, toOptions } from "@/lib/report-rules";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const STATUS_OPTIONS = toOptions(REPORT_STATUS);

/** بلاک فیلتر صفحه‌ی «لیست گزارش‌ها» — همان الگوی فیلتر صفحه‌ی روابط */
export default function ReportFilter({ loading }: { loading: boolean }) {
    const [open, setOpen] = useState(false);
    const [searchParams] = useSearchParams();

    const formik = useFormik({
        initialValues: { project_id: "", date_from: "", date_to: "", status: "" },
        onSubmit,
        validationSchema: false,
    });

    useEffect(() => {
        if (!open) return;

        Object.entries(formik.values).forEach(([key]) => {
            const value = searchParams.get(key);
            if (value) formik.setFieldValue(key, value);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    function onSubmit() {}

    return (
        <Filters open={open} setOpen={setOpen} loading={loading} formik={formik}>
            <form className="w-full grid grid-cols-1 gap-5 md:grid-cols-4">
                <ProjectSelect formik={formik} required={false} />
                <DateInput name="date_from" title="از تاریخ" formik={formik} required={false} />
                <DateInput name="date_to" title="تا تاریخ" formik={formik} required={false} />
                <Select name="status" title="وضعیت ثبت" formik={formik} options={STATUS_OPTIONS} required={false} />
            </form>
        </Filters>
    );
}
