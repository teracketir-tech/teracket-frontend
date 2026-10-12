import CompanySelect from "@/components/shared/CompanySelect";
import Filters from "@/components/shared/Filters";
import Input from "@/components/shared/inputs";
import { useAuth } from "@/context/AuthContext";
import { useFormik } from "formik";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * فیلترِ فهرست «واحد» — همان الگوی `product/Filter`.
 *
 * مقادیر از روی خودِ URL ساخته می‌شوند و با `enableReinitialize` همیشه با
 * آدرس هم‌جا می‌مانند؛ به همین دلیل افکتِ هم‌سان‌سازی لازم نیست (و در نتیجه
 * نه setStateِ همزمان در افکت داریم نه هوکِ وابستگیِ جامانده).
 *
 * شرکت به‌صورت پیش‌فرض همان شرکتِ کاربر است مگر در URL مقدار داشته باشد؛
 * شناسه/نام در سمت سرور `like` می‌شوند (`Unit::get_all`).
 */
export default function FilterForm({ loading }: { loading: boolean }) {
    const { auth } = useAuth();
    const [open, setOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const formik = useFormik({
        initialValues: {
            id: searchParams.get("id") ?? "",
            name: searchParams.get("name") ?? "",
            company_id: searchParams.get("company_id") ?? auth?.company_id ?? "",
        },
        onSubmit,
        validationSchema: false,
        enableReinitialize: true,
    });

    function onSubmit(data: object) {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(data).forEach(([key, value]) => {
            if (value) params.set(key, value.toString());
            else params.delete(key);
        });

        setSearchParams(params);
    }

    return (
        <Filters open={open} setOpen={setOpen} loading={loading} formik={formik}>
            <form className="w-full grid grid-cols-4 gap-5">
                <CompanySelect formik={formik} required={false} />
                <Input name="id" title="شناسه" formik={formik} required={false} />
                <Input name="name" title="نام" formik={formik} required={false} />
            </form>
        </Filters>
    );
}
