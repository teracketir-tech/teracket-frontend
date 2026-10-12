import Button from "@/components/shared/Button";
import CompanySelect from "@/components/shared/CompanySelect";
import Input from "@/components/shared/inputs";
import Select from "@/components/shared/inputs/Select";
import ProjectSelect from "@/components/shared/ProjectSelect";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { durationUnitOptions, excludedSubtree, nextSortOrder, toTaskOptions } from "@/components/pages/scheduling/options";
import { useAuth } from "@/context/AuthContext";
import { useProjectTasks } from "@/hooks/use-project-tasks";
import { applyApiErrors } from "@/lib/apiErrors";
import { api } from "@/lib/axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import taskSchema from "./validationSchema";

export default function CreateTask({ editMode = 0 }: { editMode?: number }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const { auth } = useAuth();

    const formik = useFormik({
        initialValues: {
            // شرکت فقط برایِ فیلترِ پروژه‌هاست؛ بک‌اند company_id تسک را از روی پروژه برمی‌دارد
            company_id: auth?.company_id || "",
            project_id: searchParams.get("project_id") || "",
            name: "",
            parent_id: searchParams.get("parent_id") || "",
            duration: "0",
            duration_unit: "1",
            sort_order: "1",
        },
        validationSchema: taskSchema,
        onSubmit,
        validateOnChange: true,
        enableReinitialize: true,
        validateOnMount: true,
    });

    const tasks = useProjectTasks(formik.values.project_id);

    useEffect(() => {
        if (!editMode || !id) return;

        setLoading(true);
        api(`task/${id}?expand=project`, "GET")
            .then((res: any) => {
                if (!res?.success) return;

                setEditing(res.data);
                formik.setValues({
                    // company_id تسک‌ها خالی است؛ اول از خودِ تسک، بعد از پروژه‌اش و در نهایت از کاربر
                    company_id: String(res.data.company_id ?? res.data.project?.company_id ?? auth?.company_id ?? ""),
                    project_id: String(res.data.project_id ?? ""),
                    name: res.data.name ?? "",
                    parent_id: res.data.parent_id ? String(res.data.parent_id) : "",
                    duration: res.data.duration != null ? String(res.data.duration) : "0",
                    duration_unit: res.data.duration_unit ? String(res.data.duration_unit) : "1",
                    sort_order: res.data.sort_order != null ? String(res.data.sort_order) : "1",
                });
            })
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, editMode]);

    // تسکِ تازه باید بعد از خواهر و برادرهایش قرار بگیرد
    useEffect(() => {
        if (editMode || !tasks.length) return;
        formik.setFieldValue("sort_order", String(nextSortOrder(tasks, formik.values.parent_id || null)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tasks, formik.values.parent_id, editMode]);

    const excluded = excludedSubtree(editing, tasks);
    const parentOptions = toTaskOptions(tasks.filter((t: any) => !excluded.has(String(t.id))));

    // مدتِ ردیف والد از rollup زیرمجموعه‌ها می‌آید، پس فیلدهای مدت/واحد برایش قفل می‌شوند
    const hasChildren = editMode ? tasks.some((t: any) => String(t.parent_id ?? "") === String(id)) : false;

    async function onSubmit(values: any) {
        setLoading(true);

        try {
            const payload = { ...values, parent_id: values.parent_id || null };
            // company_id فقط برایِ فیلترِ پروژه‌هاست؛ سرور آن را نادیده می‌گیرد و از رویِ پروژه برمی‌دارد
            delete payload.company_id;
            const res = editMode ? await api(`task/${id}`, "PUT", payload) : await api("task", "POST", payload);

            if (applyApiErrors(res, formik)) return;

            if (res?.success) {
                toast.success(editMode ? "تسک با موفقیت ویرایش شد." : "تسک با موفقیت اضافه شد.");
                navigate("/task");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="w-full">
            <CardHeader className="mb-5">
                <CardTitle>{editMode ? "ویرایش تسک" : "ثبت تسک جدید"}</CardTitle>
                <CardDescription>تکمیل فیلدهایی که با * مشخص شده اند الزامی می باشد</CardDescription>
            </CardHeader>

            <CardContent>
                <form className="w-full grid grid-cols-3 gap-5 mb-5">
                    <CompanySelect
                        formik={formik}
                        onChange={(v) => {
                            // پروژه و والد به شرکت وابسته‌اند؛ با انتخاب شرکتِ دیگر باید دوباره انتخاب شوند
                            if (!v) return;
                            formik.setFieldValue("project_id", "");
                            formik.setFieldValue("parent_id", "");
                        }}
                    />
                    <ProjectSelect formik={formik} />
                    <Input type="text" name="name" title="نام تسک" formik={formik} autoComplete="off" />
                    <Select name="parent_id" title="والد (برای ردیف اصلی خالی بگذارید)" formik={formik} options={parentOptions} required={false} />

                    <Input type="number" name="duration" title="مدت زمان" formik={formik} disabled={hasChildren} />
                    <Select name="duration_unit" title="واحد زمان" formik={formik} options={durationUnitOptions} disabled={hasChildren} />
                    <Input type="number" name="sort_order" title="ترتیب نمایش" formik={formik} required={false} />

                    {hasChildren && (
                        <p className="col-span-3 text-xs text-[#777777]">این تسک زیرمجموعه دارد؛ مدت و واحد آن از روی زیرمجموعه‌ها محاسبه می‌شود و قابل ویرایش نیست.</p>
                    )}
                </form>
            </CardContent>

            <CardFooter>
                <Button onClick={formik.handleSubmit} className="mt-5" isLoading={loading} disabled={!formik.isValid}>
                    ثبت
                </Button>
            </CardFooter>
        </Card>
    );
}
