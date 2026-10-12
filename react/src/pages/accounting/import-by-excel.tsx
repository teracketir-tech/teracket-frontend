import Button from "@/components/shared/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormik } from "formik";
import { api } from "@/lib/axios";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { DownloadCloudIcon, Eye, EyeOff } from "lucide-react";
import Input from "@/components/shared/inputs";
import { formatNumber } from "@/lib/utils";

export default function ImportAccountingByExcel() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>({});
    const [showResult, setShowResult] = useState(false);
    const [showItemLog, setShowItemLog] = useState(false);
    const [showAccountingLog, setShowAccountingLog] = useState(false);

    const formik = useFormik({
        initialValues: {
            file: "",
        },
        onSubmit,
        validationSchema: false,
    });

    async function onSubmit(data: object) {
        setLoading(true);
        setShowResult(false);

        const res = await api("accounting/import-by-excel", "POST", data, false, "json", "multipart/form-data");

        if (res?.success) toast.success("با موفقیت انجام شد.");
        else toast.error(res?.message || "خطایی رخ داده است");

        setResult(res?.result || {});

        setLoading(false);
        setShowResult(true);
    }

    return (
        <>
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

            <Card className="w-full mt-5">
                <CardHeader>
                    <CardTitle>نتیجه ثبت</CardTitle>
                    <CardDescription>{loading ? "در حال ثبت..." : showResult ? "جزییات ثبت انجام شده" : "ثبت جدیدی انجام نشده است"}</CardDescription>
                </CardHeader>

                <CardContent>
                    {showResult && (
                        <div className="text-[0.8rem]!">
                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="flex flex-col gap-2 bg-gray-50 rounded-md p-3">
                                    <p className="flex items-center gap-1 py-1 px-3">
                                        <span>تعداد کل سندها</span>
                                        <span>:</span>
                                        <span>{formatNumber((result?.failed_accounting?.length || 0) + (result?.success_accounting?.length || 0))}</span>
                                    </p>
                                    <p className="flex items-center gap-1 py-1 px-3 rounded-md bg-green-100">
                                        <span>سندهای ثبت شده</span>
                                        <span>:</span>
                                        <span>{formatNumber(result?.success_accounting?.length || 0)}</span>
                                    </p>
                                    <p className="relative flex items-center gap-1 py-1 px-3 rounded-md bg-red-100">
                                        <span>سندهای ثبت نشده</span>
                                        <span>:</span>
                                        <span className="flex items-center justify-between">
                                            <span>{formatNumber(result?.failed_accounting?.length || 0)}</span>
                                            {Number(result?.failed_accounting?.length || 0) > 0 && (
                                                <button
                                                    className="absolute left-2 cursor-pointer flex items-center gap-1"
                                                    onClick={() => setShowAccountingLog((prev: boolean) => !prev)}
                                                >
                                                    <span>{showAccountingLog ? <EyeOff size={15} /> : <Eye size={15} />}</span>
                                                    <span>مشاهده لاگ</span>
                                                </button>
                                            )}
                                        </span>
                                    </p>

                                    {showAccountingLog && (
                                        <div className="w-full max-h-80 overflow-y-auto">
                                            <pre className="w-full h-56 overflow-y-auto border rounded-md p-2 whitespace-pre-wrap" style={{ direction: "ltr" }}>
                                                {JSON.stringify(result?.failed_accounting, null, 4)}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 bg-gray-50 rounded-md p-3">
                                    <p className="flex items-center gap-1 py-1 px-3">
                                        <span>تعداد کل آیتم ها</span>
                                        <span>:</span>
                                        <span>
                                            {formatNumber((result?.failed_accounting_item?.length || 0) + (result?.success_accounting_item?.length || 0))}
                                        </span>
                                    </p>
                                    <p className="flex items-center gap-1 py-1 px-3 rounded-md bg-green-100">
                                        <span>آیتم های ثبت شده</span>
                                        <span>:</span>
                                        <span>{formatNumber(result?.success_accounting_item?.length || 0)}</span>
                                    </p>
                                    <p className="relative flex items-center gap-1 py-1 px-3 rounded-md bg-red-100">
                                        <span>آیتم های ثبت نشده</span>
                                        <span>:</span>
                                        <span className="flex items-center justify-between">
                                            <span>{formatNumber(result?.failed_accounting_item?.length || 0)}</span>
                                            {Number(result?.failed_accounting_item?.length || 0) > 0 && (
                                                <button
                                                    className="absolute left-2 cursor-pointer flex items-center gap-1"
                                                    onClick={() => setShowItemLog((prev: boolean) => !prev)}
                                                >
                                                    <span>{showItemLog ? <EyeOff size={15} /> : <Eye size={15} />}</span>
                                                    <span>مشاهده لاگ</span>
                                                </button>
                                            )}
                                        </span>
                                    </p>

                                    {showItemLog && (
                                        <pre className="w-full h-56 overflow-y-auto border rounded-md p-2 whitespace-pre-wrap" style={{ direction: "ltr" }}>
                                            {JSON.stringify(result?.failed_accounting_item, null, 4)}
                                        </pre>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
