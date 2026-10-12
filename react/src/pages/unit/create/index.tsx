import Button from "@/components/shared/Button";
import Input from "@/components/shared/inputs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormik } from "formik";
import validationSchema from "./validationSchema";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import CompanySelect from "@/components/shared/CompanySelect";
import { useAuth } from "@/context/AuthContext";

/** مقادیر این فرم — `id` را URL می‌دهد نه فرم */
interface UnitValues {
    name: string;
    company_id: string;
}

/**
 * ثبت/ویرایش «واحد» — ایشوی ۷، کپی از پنل seal با کدِ خودِ این پنل.
 *
 * «واحد» هم‌ردیفِ «کالاها» است و فقط دو فیلد دارد: نام و شرکت. شرکت از
 * `CompanySelect` می‌آید (کاربرِ محدود به شرکت، همانت را از پیش دارد) و
 * مجوزها `911..914`اند که به `group.roles` اضاف شده‌اند.
 *
 * داده‌ی ویرایش در `data` می‌نشیند و از همان‌جا به Formik می‌رسد
 * (`enableReinitialize`)؛ بنابراین افکت setStateِ همزمان ندارد و هوک‌ها
 * وابستگیِ `formik` را هم نمی‌خواهند.
 */
export default function CreateUnit({ editMode = 0 }: { editMode?: number }) {
    const { auth } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<UnitValues | null>(null);

    useEffect(() => {
        if (!editMode || !id) return;

        void (async () => {
            const res = await api(`unit/${id}`, "GET");

            if (res?.success) setData({ name: res?.data?.name ?? "", company_id: res?.data?.company_id ?? "" });
        })();
    }, [id, editMode]);

    const formik = useFormik({
        initialValues: data ?? { name: "", company_id: auth?.company_id || "" },
        onSubmit,
        validationSchema,
        validateOnChange: true,
        enableReinitialize: true,
        validateOnMount: true,
    });

    function onSubmit(data: object) {
        setLoading(true);

        api(editMode ? `unit/${id}` : "unit", editMode ? "PATCH" : "POST", data)
            .then((res) => {
                if (res?.success) {
                    toast.success("واحد با موفقیت ثبت شد.");
                    navigate("/unit");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <Card className="w-full">
            <CardHeader className="mb-5">
                <CardTitle>{editMode ? "ویرایش واحد" : "ثبت واحد جدید"}</CardTitle>
                <CardDescription>تکمیل فیلدهایی که با * مشخص شده اند الزامی می باشد</CardDescription>
            </CardHeader>

            <CardContent>
                <form className="w-full grid grid-cols-3 gap-5 mb-5">
                    <CompanySelect formik={formik} />
                    <Input type="text" name="name" title="نام" formik={formik} autoComplete="off" />
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
