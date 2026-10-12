import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useFormik } from "formik";
import { one, two } from "./validationSchema";
import Button from "@/components/shared/Button";
import { useState } from "react";
import Input from "@/components/shared/inputs";
import ToolTip from "@/components/shared/ToolTip";
import { PenBox } from "lucide-react";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            phone_number: "",
            password: "",
            otp: "",
        },
        onSubmit,
        validationSchema: step === 1 ? one : two,
        validateOnChange: true,
        enableReinitialize: true,
        validateOnMount: true,
    });

    function onSubmit(data: object) {
        setIsLoading(true);

        api("user/forgot-password", "POST", { ...data })
            .then((res) => {
                if (res?.success) {
                    if (step === 1) {
                        setStep(2);
                        toast.success("کد با موفقیت ارسال شد");

                        //
                    } else {
                        toast.success("رمز شما با موففیت تغییر کرد. میتوانید وارد شوید");
                        navigate("/auth/login");
                    }
                } else {
                    toast.error(res?.message || "خطایی رخ داده است. مجدد تلاش کنید");
                }
            })
            .finally(() => setIsLoading(false));
    }

    return (
        <div className="w-full h-[80svh] flex items-center justify-center">
            <Card className="w-full max-w-lg">
                <CardHeader className="mb-5">
                    <CardTitle className="flex flex-col gap-2">
                        <div className="flex flex-col items-center justify-center gap-1 border-b border-gray-100 pb-4">
                            <img src="/logo.png" className="size-12" />
                            <p className="text-sm">پایگان گروپ ( حسابداری )</p>
                        </div>
                        <p className="text-2xl">فراموشی رمز عبور</p>
                    </CardTitle>
                    <CardDescription>برای بازیابی، نام کاربری را وارد کنید</CardDescription>
                </CardHeader>

                <CardContent>
                    <form className="flex flex-col gap-3">
                        <Input
                            name="phone_number"
                            title={
                                <div className="flex items-center gap-2">
                                    <p>نام کاربری (شماره موبایل)</p>
                                    {step === 2 && (
                                        <ToolTip
                                            triger={
                                                <button type="button" className="mt-1" onClick={() => setStep(1)}>
                                                    <PenBox size={15} />
                                                </button>
                                            }
                                            text="ویرایش شماره موبایل"
                                        />
                                    )}
                                </div>
                            }
                            formik={formik}
                            inputMode="numeric"
                            ltrInput
                            disabled={isLoading || step === 2}
                        />

                        {step === 2 && (
                            <>
                                <Input name="otp" title="کد پیامک شده" formik={formik} ltrInput disabled={isLoading} />
                                <Input name="password" type="password" title="کلمه عبور جدید" formik={formik} ltrInput disabled={isLoading} />
                            </>
                        )}

                        <div className="flex">
                            <Link to="/auth/login" role="link" className="underline text-blue-600 text-[0.8rem]">
                                ورود به حساب
                            </Link>
                        </div>

                        <Button onClick={formik.handleSubmit} isLoading={isLoading} className="mt-5">
                            {step === 1 ? "ارسال کد" : "ثبت"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
