import Button from "@/components/shared/Button";
import Input from "@/components/shared/inputs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormik } from "formik";
import validationSchema from "./validationSchema";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import Textarea from "@/components/shared/inputs/Textarea";
import BankSelect from "@/components/shared/BankSelect";
import CompanySelect from "@/components/shared/CompanySelect";

export default function CreateBank({ editMode = 0 }: { editMode?: number }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            company_id: "",
            bank_name_id: "",
            branch: "",
            name: "",
            account_number: "",
            card_number: "",
            shaba_number: "",
            pos_number: "",
            account_owner_name: "",
            balance: "",
            registered_mobile_number: "",
            payment_switch_number: "",
            payment_terminal_number: "",
            merchant_number: "",
            description: "",
        },
        onSubmit,
        validationSchema,
        validateOnChange: true,
        enableReinitialize: true,
        validateOnMount: true,
    });

    const fetchBank = async () => {
        setLoading(true);
        const res = await api(`bank/${id}`, "GET");

        if (res?.success) formik.setValues(res?.data);

        setLoading(false);
    };

    useEffect(() => {
        if (editMode && id) fetchBank();
    }, [id, editMode]);

    function onSubmit(data: object) {
        setLoading(true);

        api(editMode ? `bank/${id}` : "bank", editMode ? "PATCH" : "POST", data)
            .then((res) => {
                if (res?.success) {
                    toast.success("بانک با موفقیت ثبت شد.");
                    navigate("/bank");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <Card className="w-full">
            <CardHeader className="mb-5">
                <CardTitle>{editMode ? "ویرایش بانک" : "ثبت بانک جدید"}</CardTitle>
                <CardDescription>تکمیل فیلدهایی که با * مشخص شده اند الزامی می باشد</CardDescription>
            </CardHeader>

            <CardContent>
                <form className="w-full grid grid-cols-3 gap-5 mb-5">
                    <CompanySelect formik={formik} />
                    <BankSelect name="bank_name_id" formik={formik} required={true} />
                    <Input type="text" name="branch" title="شعبه" formik={formik} required={false} autoComplete="off" />
                    <Input type="text" name="name" title="نام" formik={formik} autoComplete="off" required={false} />
                    <Input type="text" name="account_number" title="شماره حساب" formik={formik} required={false} autoComplete="off" />
                    <Input type="text" name="card_number" title="شماره کارت" formik={formik} required={false} autoComplete="off" />
                    <Input type="text" name="shaba_number" title="شماره شبا ( بدون IR )" formik={formik} required={false} autoComplete="off" />
                    <Input type="text" name="pos_number" title="شماره POS" formik={formik} required={false} autoComplete="off" />
                    <Input type="text" name="account_owner_name" title="نام صاحب حساب" formik={formik} required={false} autoComplete="off" />
                    <Input type="text" name="balance" title="موجودی" formik={formik} required={false} autoComplete="off" />
                    <Input
                        type="text"
                        name="registered_mobile_number"
                        title="شماره موبایل ثبت شده در اینترنت بانک"
                        formik={formik}
                        required={false}
                        autoComplete="off"
                    />
                    <Input type="text" name="payment_switch_number" title="شماره سوییچ پرداخت" formik={formik} required={false} autoComplete="off" />
                    <Input type="text" name="payment_terminal_number" title="شماره ترمینال پرداخت" formik={formik} required={false} autoComplete="off" />
                    <Input type="text" name="merchant_number" title="شماره پذیرنده فروشگاهی" formik={formik} required={false} autoComplete="off" />

                    <div className="col-span-3">
                        <Textarea name="description" title="توضیحات" formik={formik} required={false} />
                    </div>
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
