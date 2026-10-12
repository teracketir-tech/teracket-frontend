import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useFormik } from "formik";
import validationSchema from "./validationSchema";
import Button from "@/components/shared/Button";
import { useState } from "react";
import Input from "@/components/shared/inputs";
import CompanySelect from "./CompanySelect";
import type { LoginCompany } from "./types";

export default function Login() {
    const navigate = useNavigate();
    const { updateToken } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [companies, setCompanies] = useState<LoginCompany[] | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    // The password is typed once, on this first screen. The company list only
    // appears when the phone really holds several accounts this panel admits,
    // and picking one never asks for the password again.
    const isChoosing = companies !== null;
    const hasChoice = selectedUserId !== null;
    const showPassword = !isChoosing;
    const canSubmit = !isChoosing || hasChoice;

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
        // A list with nothing picked has no row to name, so there is nothing
        // to send - Enter inside it must not fire a half finished attempt.
        if (isChoosing && !hasChoice) return;

        setIsLoading(true);

        // The password travels unchanged from the first screen; the choice
        // only adds the row it should be checked against.
        const payload = hasChoice ? { ...data, user_id: selectedUserId } : data;

        api("user/login", "POST", payload)
            .then((res) => {
                if (res?.requires_company_selection && res?.companies?.length > 0) {
                    setCompanies(res.companies);
                    setSelectedUserId(null);
                    return;
                }

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
            // `api` already reports the error; swallowing it here only keeps the
            // rejection from reaching the console on every wrong password.
            .catch(() => {})
            .finally(() => setIsLoading(false));
    }

    function handleSelect(userId: number) {
        if (userId === selectedUserId) return;

        // Only the row changes. The password was proved against the phone
        // itself on the previous screen and travels with whichever company
        // ends up being picked.
        setSelectedUserId(userId);
    }

    function handleBack() {
        setCompanies(null);
        setSelectedUserId(null);
        formik.setFieldValue("password", "");
        formik.setFieldTouched("password", false, false);
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
                    <CardDescription>{isChoosing ? "شرکت مورد نظر را برای ورود انتخاب کنید" : "برای ورود نام کاربری و کلمه عبور را وارد کنید"}</CardDescription>
                </CardHeader>

                <CardContent>
                    <form className="flex flex-col gap-3">
                        <Input name="phone_number" title="نام کاربری (شماره موبایل)" formik={formik} inputMode="numeric" ltrInput disabled={isLoading || isChoosing} />

                        {showPassword && <Input name="password" title="کلمه عبور" formik={formik} type="password" ltrInput disabled={isLoading} />}

                        {isChoosing && <CompanySelect companies={companies} selectedId={selectedUserId} onSelect={handleSelect} onBack={handleBack} />}

                        {!isChoosing && (
                            <div className="flex">
                                <Link to="/auth/forgot-password" role="link" className="underline text-blue-600 text-[0.8rem]">
                                    فراموشی رمز عبور
                                </Link>
                            </div>
                        )}

                        {canSubmit && (
                            <Button onClick={formik.handleSubmit} isLoading={isLoading} className="mt-5">
                                ورود
                            </Button>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
