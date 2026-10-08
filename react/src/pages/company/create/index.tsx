import Button from "@/components/shared/Button";
import Input from "@/components/shared/inputs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormik } from "formik";
import validationSchema from "./validationSchema";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateCompany({ editMode = 0 }: { editMode?: number }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: "",
        },
        onSubmit,
        validationSchema,
        validateOnChange: true,
        enableReinitialize: true,
        validateOnMount: true,
    });

    const fetchCompany = async () => {
        setLoading(true);
        const res = await api(`company/${id}`, "GET");

        if (res?.success) formik.setValues(res?.data);

        setLoading(false);
    };

    useEffect(() => {
        if (editMode && id) fetchCompany();
    }, [id, editMode]);

    function onSubmit(data: object) {
        setLoading(true);

        api(editMode ? `company/${id}` : "company", editMode ? "PATCH" : "POST", data)
            .then((res) => {
                if (res?.success) {
                    toast.success("شرکت با موفقیت ثبت شد.");
                    navigate("/company");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <Card className="w-full">
            <CardHeader className="mb-5">
                <CardTitle>{editMode ? "ویرایش شرکت" : "ثبت شرکت جدید"}</CardTitle>
                <CardDescription>تکمیل فیلدهایی که با * مشخص شده اند الزامی می باشد</CardDescription>
            </CardHeader>

            <CardContent>
                <form className="w-full grid grid-cols-3 gap-5 mb-5">
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
