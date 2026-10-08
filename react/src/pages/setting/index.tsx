import Button from "@/components/shared/Button";
import Input from "@/components/shared/inputs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormik } from "formik";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Select from "@/components/shared/inputs/Select";
import { checkAccess } from "@/lib/utils";
import StateSelect from "@/components/shared/StateSelect";
import AccountingDataSelect from "@/components/shared/AccountingDataSelect";

export default function Setting() {
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            allow_negative_stock: "",
            tax: "",
            company_name: "",
            address: "",
            economical_number: "",
            national_code: "",
            postal_code: "",
            phone: "",
            state_id: "",
            city_id: "",
            accounting_data_id: "",
        },
        onSubmit,
        validationSchema: false,
        validateOnChange: true,
        enableReinitialize: true,
        validateOnMount: true,
    });

    const fetchSetting = async () => {
        setLoading(true);
        const res = await api("setting", "GET");

        if (res?.success) formik.setValues(res?.data);

        setLoading(false);
    };

    useEffect(() => {
        fetchSetting();
    }, []);

    function onSubmit(data: object) {
        setLoading(true);

        api("setting/edit", "POST", data)
            .then((res) => {
                if (res?.success) {
                    toast.success("تنظیمات با موفقیت ثبت شد.");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <Card className="w-full">
            <CardHeader className="mb-5">
                <CardTitle>ویرایش تنظیمات</CardTitle>
                <CardDescription>تکمیل فیلدهایی که با * مشخص شده اند الزامی می باشد</CardDescription>
            </CardHeader>

            <CardContent>
                <form className="w-full grid grid-cols-3 gap-5 mb-5">
                    <Select
                        title="منفی شدن انبار"
                        name="allow_negative_stock"
                        required={false}
                        formik={formik}
                        options={[
                            { label: "بله", value: "1" },
                            { label: "خیر", value: "0" },
                        ]}
                    />
                    <Input type="number" name="tax" title="مالیات (درصد)" required={false} formik={formik} autoComplete="off" />
                    <Input name="company_name" title="نام شرکت" formik={formik} required={false} />
                    <Input name="economical_number" title="شماره اقتصادی" formik={formik} required={false} />
                    <Input name="national_code" title="شماره ثبت / شماره ملی" formik={formik} required={false} />
                    <Input name="phone" title="شماره تلفن" formik={formik} required={false} />
                    <StateSelect formik={formik} />
                    <AccountingDataSelect formik={formik} />
                    <Input name="postal_code" title="کدپستی شرکت" formik={formik} required={false} />
                    <div className="col-span-3">
                        <Input name="address" title="آدرس" formik={formik} required={false} />
                    </div>
                </form>
            </CardContent>

            <CardFooter>
                {checkAccess([501]) && (
                    <Button onClick={formik.handleSubmit} className="mt-5" isLoading={loading} disabled={!formik.isValid}>
                        ثبت
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
