import Button from "@/components/shared/Button";
import Input from "@/components/shared/inputs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormik } from "formik";
import validationSchema from "./validationSchema";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import Select from "@/components/shared/inputs/Select";
import StateSelect from "@/components/shared/StateSelect";
import CompanySelect from "@/components/shared/CompanySelect";

export default function CreateContact({ editMode = 0 }: { editMode?: number }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            company_id: "",
            type: "",
            active: "",
            state: "",
            city: "",
            fname: "",
            lname: "",
            mobile: "",
            email: "",
            nationalId: "",
            bankAccounts: "",
            postal_code: "",
            address: "",
            phone1: "",
            phone2: "",
            fax: "",
            website: "",
        },
        onSubmit,
        validationSchema,
        validateOnChange: true,
        enableReinitialize: true,
        validateOnMount: true,
    });

    const fetchContact = async () => {
        setLoading(true);
        const res = await api(`contact/${id}`);

        if (res?.data) formik.setValues(res?.data);

        setLoading(false);
    };

    useEffect(() => {
        if (editMode && id) fetchContact();
    }, [id, editMode]);

    function onSubmit(data: any) {
        setLoading(true);

        api(editMode ? `contact/${id}` : "contact", editMode ? "PATCH" : "POST", { ...data, alias: `${data.fname || ""} ${data.lname || ""}` })
            .then((res) => {
                if (res?.success) {
                    toast.success("شخص با موفقیت ثبت شد.");
                    navigate("/contact");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <Card className="w-full">
            <CardHeader className="mb-5">
                <CardTitle>{editMode ? "ویرایش شخص" : "ثبت شخص جدید"}</CardTitle>
                <CardDescription>تکمیل فیلدهایی که با * مشخص شده اند الزامی می باشد</CardDescription>
            </CardHeader>

            <CardContent>
                <form className="w-full grid grid-cols-3 gap-5 mb-5">
                    <CompanySelect formik={formik} />
                    <Input type="text" name="fname" title="نام" formik={formik} autoComplete="off" />
                    <Input type="text" name="lname" title="نام خانوادگی" formik={formik} required={false} autoComplete="off" />
                    <Input type="text" name="mobile" title="موبایل" formik={formik} autoComplete="off" />
                    <Input type="text" name="email" title="ایمیل" formik={formik} required={false} autoComplete="off" />
                    <Input type="text" name="nationalId" title="کد ملی" formik={formik} required={false} autoComplete="off" />
                    <Input type="text" name="bankAccounts" title="شماره حساب یا شبا" formik={formik} required={false} autoComplete="off" />
                    <Select
                        name="type"
                        title="نوع"
                        formik={formik}
                        options={[
                            { label: "حقیقی", value: "1" },
                            { label: "حقوقی", value: "2" },
                        ]}
                    />
                    <Select
                        name="active"
                        title="وضعیت فعالیت"
                        formik={formik}
                        options={[
                            { label: "فعال", value: "1" },
                            { label: "غیر فعال", value: "0" },
                        ]}
                    />
                    <StateSelect name="state" cityName="city" formik={formik} required={false} />
                    <Input type="text" name="postal_code" title="کد پستی" formik={formik} required={false} autoComplete="off" />
                    <Input type="text" name="address" title="آدرس" formik={formik} required={false} autoComplete="off" />
                    <Input type="text" name="phone1" title="تلفن" formik={formik} required={false} autoComplete="off" />
                    <Input type="text" name="phone2" title="تلفن معرف / مواقع ضروری" formik={formik} required={false} autoComplete="off" />
                    <Input type="text" name="fax" title="فکس" formik={formik} required={false} autoComplete="off" />
                    <Input type="text" name="website" title="آدرس سایت" formik={formik} required={false} autoComplete="off" />
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
