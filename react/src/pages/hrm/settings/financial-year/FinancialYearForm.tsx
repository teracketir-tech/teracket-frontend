// src/pages/hrm/settings/financial-year/FinancialYearForm.jsx

import { useFormik } from "formik";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/inputs";
import Select from "@/components/shared/inputs/Select";

const validationSchema = yup.object({
    year: yup.number().required("سال مالی الزامی است"),
    salary: yup.number().required("مزد ماهانه الزامی است").min(0, "مقدار باید مثبت باشد"),
    coupon: yup.number().required("بن خواربار الزامی است").min(0, "مقدار باید مثبت باشد"),
    housing_benefits: yup.number().required("کمک هزینه مسکن الزامی است").min(0, "مقدار باید مثبت باشد"),
    child_allowance: yup.number().min(0, "مقدار باید مثبت باشد"),
    welfare_allowance: yup.number().min(0, "مقدار باید مثبت باشد"),
    seniority_allowance: yup.number().min(0, "مقدار باید مثبت باشد"),
    performance_bonus: yup.number().min(0, "مقدار باید مثبت باشد"),
    responsibility_allowance: yup.number().min(0, "مقدار باید مثبت باشد"),
    transportation_allowance: yup.number().min(0, "مقدار باید مثبت باشد"),
 });

export default function FinancialYearForm({ editData, onCancel, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [yearOptions, setYearOptions] = useState({});

    useEffect(() => {
        api("hrm-financial-year/year-options", "GET").then((res) => {
            if (res?.success) setYearOptions(res.data);
        });
    }, []);

    const formik = useFormik({
        initialValues: {
            year: "",
            salary: "",
            coupon: "",
            housing_benefits: "",
            child_allowance: "",
            welfare_allowance: "",
            seniority_allowance: "",
            performance_bonus: "",
            responsibility_allowance: "",
            transportation_allowance: "",
            status:0,
        },
        validationSchema,
        onSubmit: handleSubmit,
        enableReinitialize: true,
    });

    useEffect(() => {
        if (editData) {
            formik.setValues({
                year: editData.year || "",
                salary: editData.salary || "",
                coupon: editData.coupon || "",
                housing_benefits: editData.housing_benefits || "",
                child_allowance: editData.child_allowance || "",
                welfare_allowance: editData.welfare_allowance || "",
                seniority_allowance: editData.seniority_allowance || "",
                performance_bonus: editData.performance_bonus || "",
                responsibility_allowance: editData.responsibility_allowance || "",
                transportation_allowance: editData.transportation_allowance || "",
                 status: editData.status,

            });
        } else {
            formik.resetForm();
        }
    }, [editData]);

    async function handleSubmit(values) {
        setLoading(true);

        const url = editData
            ? `hrm-financial-year/${editData.id}`
            : "hrm-financial-year";

        const res = await api(url,editData ? "PATCH"  :"POST", {
            ...values,
            year: parseInt(values.year),
            salary: parseFloat(values.salary) || 0,
            coupon: parseFloat(values.coupon) || 0,
            housing_benefits: parseFloat(values.housing_benefits) || 0,
            child_allowance: parseFloat(values.child_allowance) || 0,
            welfare_allowance: parseFloat(values.welfare_allowance) || 0,
            seniority_allowance: parseFloat(values.seniority_allowance) || 0,
            performance_bonus: parseFloat(values.performance_bonus) || 0,
            responsibility_allowance: parseFloat(values.responsibility_allowance) || 0,
            transportation_allowance: parseFloat(values.transportation_allowance) || 0,
            status: editData?  parseInt(values.status) : 0,
        });

        setLoading(false);

        if (res?.success) {
            toast.success(editData ? "سال مالی با موفقیت ویرایش شد" : "سال مالی با موفقیت ثبت شد");
            onSuccess();
        } else {
            toast.error(res?.message || "خطا در ثبت اطلاعات");
        }
    }

    const yearOptionsArray = Object.entries(yearOptions).map(([key, value]) => ({
        value: key,
        label: String(value),
    }));
 const statusOptionsArray = [
    { key: 0, value: 'غیرفعال' },
    { key: 1, value: 'فعال' }
].map(item => ({
    value: item.key,
    label: item.value
}));

    // فرمت‌کننده اعداد
    const formatNumber = (num) => {
        if (!num) return "";
        return new Intl.NumberFormat("fa-IR").format(num);
    };

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* ردیف اول: سال مالی */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select
                    name="year"
                    title="سال مالی"
                    formik={formik}
                    options={yearOptionsArray}
                    placeholder="انتخاب سال"
                />

           

                <Input
                    type="number"
                    name="salary"
                    title="مزد ماهانه (ریال)"
                    formik={formik}
                    placeholder="مثال: ۲۵۰,۰۰۰,۰۰۰"
                />

                <Input
                    type="number"
                    name="coupon"
                    title="بن خواربار (ریال)"
                    formik={formik}
                    placeholder="مثال: ۵,۰۰۰,۰۰۰"
                />

                <Input
                    type="number"
                    name="housing_benefits"
                    title="کمک هزینه مسکن (ریال)"
                    formik={formik}
                    placeholder="مثال: ۱۰,۰۰۰,۰۰۰"
                />
            </div>

            {/* ردیف دوم: حق اولاد و مزایای رفاهی */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                    type="number"
                    name="child_allowance"
                    title="حق اولاد (ریال)"
                    formik={formik}
                    placeholder="مثال: ۵,۰۰۰,۰۰۰"
                />

                <Input
                    type="number"
                    name="welfare_allowance"
                    title="مزایای رفاهی و انگیزشی (ریال)"
                    formik={formik}
                    placeholder="مثال: ۲,۰۰۰,۰۰۰"
                />

                <Input
                    type="number"
                    name="seniority_allowance"
                    title="حق سنوات (ریال)"
                    formik={formik}
                    placeholder="مثال: ۱۰,۰۰۰,۰۰۰"
                />

                <Input
                    type="number"
                    name="performance_bonus"
                    title="پاداش عملکرد (ریال)"
                    formik={formik}
                    placeholder="مثال: ۳,۰۰۰,۰۰۰"
                />
            </div>

            {/* ردیف سوم: حق مسئولیت و ایاب و ذهاب */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                    type="number"
                    name="responsibility_allowance"
                    title="حق مسئولیت (ریال)"
                    formik={formik}
                    placeholder="مثال: ۲,۰۰۰,۰۰۰"
                />

                <Input
                    type="number"
                    name="transportation_allowance"
                    title="کمک ایاب و ذهاب (ریال)"
                    formik={formik}
                    placeholder="مثال: ۱,۵۰۰,۰۰۰"
                />
            </div>

            {/* دکمه‌ها */}
            <div className="flex items-end gap-2">
                <Button
                    type="submit"
                    isLoading={loading}
                    disabled={!formik.isValid || loading}
                >
                    {editData ? "ویرایش" : "ثبت"}
                </Button>

                {editData && (
                    <Button type="button" variant="secondary" onClick={onCancel}>
                        انصراف
                    </Button>
                )}
            </div>
        </form>
    );
}