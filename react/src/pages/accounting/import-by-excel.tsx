import Button from "@/components/shared/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormik } from "formik";
import { api } from "@/lib/axios";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { DownloadCloudIcon } from "lucide-react";
import Input from "@/components/shared/inputs";

export default function ImportAccountingByExcel() {
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            file: "",
        },
        onSubmit,
        validationSchema: false,
    });

    async function onSubmit(data: object) {
        setLoading(true);

        const res = await api("accounting/import-by-excel", "POST", data, false, "json", "multipart/form-data");

        if (res?.success) toast.success("با موفقیت انجام شد.");
        else toast.error(res?.message || "خطایی رخ داده است");

        setLoading(false);
    }

    return (
        <Card className="w-full">
            <CardHeader className="mb-5">
                <CardTitle>افزودن سند با اکسل</CardTitle>
                <CardDescription>تکمیل فیلدهایی که با * مشخص شده اند الزامی می باشد</CardDescription>
            </CardHeader>

            <CardContent>
                <form className="flex flex-col gap-10">
                    <div className="flex flex-col gap-5">
                        <Link
                            to="/AccountingSample.xlsx"
                            target="_blank"
                            role="link"
                            className="w-32! bg-amber-100 flex items-center py-1 pr-1 rounded gap-2 text-[0.8rem]"
                        >
                            <DownloadCloudIcon size={16} />
                            <span>دانلود نمونه فایل</span>
                        </Link>
                        <Input type="file" name="file" title="آپلود فایل اکسل" formik={formik} />
                    </div>
                </form>
            </CardContent>

            <CardFooter>
                <Button onClick={formik.handleSubmit} className="mt-5" isLoading={loading} disabled={!formik.values.file}>
                    ثبت
                </Button>
            </CardFooter>
        </Card>
    );
}
