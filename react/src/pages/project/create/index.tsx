import Button from "@/components/shared/Button";
import Input from "@/components/shared/inputs";
import DateInput from "@/components/shared/inputs/Date";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormik } from "formik";
import validationSchema from "./validationSchema";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import CompanySelect from "@/components/shared/CompanySelect";
import { useAuth } from "@/context/AuthContext";

export default function CreateProject({ editMode = 0 }: { editMode?: number }) {
    const { auth } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: "",
            company_id: auth?.company_id || "",
            // لنگرِ زمان‌بندی — انتخاب‌گر شمسی نشان می‌دهد، میلادی ISO می‌فرستد
            start_date: "",
        },
        onSubmit,
        validationSchema,
        validateOnChange: true,
        enableReinitialize: true,
        validateOnMount: true,
    });

    const fetchProject = async () => {
        setLoading(true);
        const res = await api(`project/${id}`, "GET");

        if (res?.success) formik.setValues(res?.data);

        setLoading(false);
    };

    useEffect(() => {
        if (editMode && id) fetchProject();
    }, [id, editMode]);

    function onSubmit(data: object) {
        setLoading(true);

        api(editMode ? `project/${id}` : "project", editMode ? "PATCH" : "POST", data)
            .then((res) => {
                if (res?.success) {
                    toast.success("پروژه با موفقیت ثبت شد.");
                    navigate("/project");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <Card className="w-full">
            <CardHeader className="mb-5">
                <CardTitle>{editMode ? "ویرایش پروژه" : "ثبت پروژه جدید"}</CardTitle>
                <CardDescription>تکمیل فیلدهایی که با * مشخص شده اند الزامی می باشد</CardDescription>
            </CardHeader>

            <CardContent>
                <form className="w-full grid grid-cols-3 gap-5 mb-5">
                    <CompanySelect formik={formik} />
                    <Input type="text" name="name" title="نام" formik={formik} autoComplete="off" />
                    <DateInput name="start_date" title="تاریخ شروع" formik={formik} placeholder="انتخاب کنید" />
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
