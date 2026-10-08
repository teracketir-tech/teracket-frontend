import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useFormik } from "formik";
import validationSchema from "./validationSchema";
import Button from "@/components/shared/Button";
import { useState } from "react";
import Input from "@/components/shared/inputs";

export default function Login() {
    const navigate = useNavigate();
    const { updateToken } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            phone_number: "",
            password: "",
        },
        onSubmit,
        validationSchema,
        validateOnChange: true,
        enableReinitialize: true,
        validateOnMount: true,
    });

    function onSubmit(data: object) {
        setIsLoading(true);
        api("user/login", "POST", { ...data })
            .then((res) => {
                if (res?.success) {
                    localStorage.setItem("token", res.token);
                    localStorage.setItem("auth", JSON.stringify(res.user));
                    updateToken();

                    toast.success("شما با موفقیت وارد شدید");
                    navigate("/");
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
                        <p className="text-2xl">ورود</p>
                    </CardTitle>
                    <CardDescription>برای ورود نام کاربری و کلمه عبور را وارد کنید</CardDescription>
                </CardHeader>

                <CardContent>
                    <form className="flex flex-col gap-6">
                        <Input name="phone_number" title="نام کاربری (شماره موبایل)" formik={formik} inputMode="numeric" ltrInput disabled={isLoading} />
                        <Input name="password" title="کلمه عبور" formik={formik} type="password" ltrInput disabled={isLoading} />

                        <Button onClick={formik.handleSubmit} isLoading={isLoading} className="mt-5">
                            ورود
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
