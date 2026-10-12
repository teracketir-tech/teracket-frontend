import CompanySelect from "@/components/shared/CompanySelect";
import Filters from "@/components/shared/Filters";
import Input from "@/components/shared/inputs";
import Select from "@/components/shared/inputs/Select";
import ProjectSelect from "@/components/shared/ProjectSelect";
import { useProjectTasks } from "@/hooks/use-project-tasks";
import { useAuth } from "@/context/AuthContext";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { durationUnitOptions, toTaskOptions } from "./options";

/** بلاک فیلتر صفحه‌ی «لیست تسک‌ها» */
export default function FilterForm({ loading }: { loading: boolean }) {
    const { auth } = useAuth();
    const [open, setOpen] = useState(false);
    const [searchParams] = useSearchParams();

    const formik = useFormik({
        initialValues: {
            company_id: auth?.company_id || "",
            project_id: "",
            name: "",
            wbs_code: "",
            parent: "",
            duration_unit: "",
        },
        onSubmit,
        validationSchema: false,
    });

    const tasks = useProjectTasks(formik.values.project_id);

    const parentOptions = [{ value: "root", label: "ریشه (بدون والد)" }, ...toTaskOptions(tasks)];

    useEffect(() => {
        if (open) {
            Object.entries(formik.values).forEach(([key]) => {
                if (searchParams.get(key)) formik.setFieldValue(key, searchParams.get(key)?.toString());
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    function onSubmit() {}

    return (
        <Filters open={open} setOpen={setOpen} loading={loading} formik={formik}>
            <form className="w-full grid grid-cols-5 gap-5">
                <CompanySelect formik={formik} required={false} />
                <ProjectSelect formik={formik} />
                <Input name="name" title="نام تسک" formik={formik} required={false} />
                <Input name="wbs_code" title="کد WBS" formik={formik} required={false} />
                <Select name="parent" title="والد" formik={formik} options={parentOptions} required={false} />
                <Select name="duration_unit" title="واحد زمان" formik={formik} options={durationUnitOptions} required={false} />
            </form>
        </Filters>
    );
}
