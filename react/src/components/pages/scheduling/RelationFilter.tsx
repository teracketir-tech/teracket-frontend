import CompanySelect from "@/components/shared/CompanySelect";
import Filters from "@/components/shared/Filters";
import ProjectSelect from "@/components/shared/ProjectSelect";
import Select from "@/components/shared/inputs/Select";
import { useProjectTasks } from "@/hooks/use-project-tasks";
import { useAuth } from "@/context/AuthContext";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { relationTypeOptions, toTaskOptions } from "./options";

/** بلاک فیلتر صفحه‌ی «لیست روابط» — انتخاب‌گرهای تسک فقط با انتخاب پروژه پر می‌شوند */
export default function RelationFilter({ loading }: { loading: boolean }) {
    const { auth } = useAuth();
    const [open, setOpen] = useState(false);
    const [searchParams] = useSearchParams();

    const formik = useFormik({
        initialValues: {
            company_id: auth?.company_id || "",
            project_id: "",
            predecessor_task_id: "",
            successor_task_id: "",
            relation_type: "",
        },
        onSubmit,
        validationSchema: false,
    });

    const taskOptions = toTaskOptions(useProjectTasks(formik.values.project_id));

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
                <Select name="predecessor_task_id" title="تسک مقدم" formik={formik} options={taskOptions} required={false} />
                <Select name="successor_task_id" title="تسک وابسته" formik={formik} options={taskOptions} required={false} />
                <Select name="relation_type" title="نوع رابطه" formik={formik} options={relationTypeOptions} required={false} />
            </form>
        </Filters>
    );
}
