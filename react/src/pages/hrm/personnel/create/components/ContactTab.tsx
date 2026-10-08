// src/pages/hrm/personnel/create/components/ContactTab.jsx

import { useFormik } from "formik";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/inputs";
import Select from "@/components/shared/inputs/Select";
import { formatDateToEn, formatDateToFa } from "@/lib/utils";

// ============== Validation Schema ==============
const validationSchema = yup.object({
    state_id: yup.string().nullable(),
    city_id: yup.string().nullable(),
    address: yup.string().nullable(),
    postal_code: yup.string().nullable(),
    housing_status: yup.string().nullable(),
    phone_prefix: yup.string().nullable(),
    phone_number: yup.string().nullable(),
    mobile: yup.string().nullable(),
    emergency_phone: yup.string().nullable(),
    email: yup.string().email("فرمت ایمیل صحیح نیست").nullable(),
});

// ============== گزینه‌های Select ==============
const HOUSING_STATUS_OPTIONS = [
    { value: "1", label: "مالک" },
    { value: "2", label: "مستاجر" },
    { value: "3", label: "سایر" },
];

// ============== کامپوننت اصلی ==============
export default function ContactTab({ user, onNext, onPrev, isFirst, isLast }) {
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const formik = useFormik({
        initialValues: {
            state_id: "",
            city_id: "",
            address: "",
            postal_code: "",
            housing_status: "",
            phone_prefix: "",
            phone_number: "",
            mobile: "",
            emergency_phone: "",
            email: "",
        },
        validationSchema,
        onSubmit: handleSubmit,
        validateOnChange: true,
        validateOnMount: true,
    });

    // ============== دریافت لیست استان‌ها ==============
    useEffect(() => {
        fetchStates();
    }, []);

    const fetchStates = async () => {
        try {
            const res = await api("state", "GET");
            if (res?.data) {
                setStates(res.data);
            }
        } catch (error) {
            console.error("Error fetching states:", error);
        }
    };

    // ============== دریافت شهرها بر اساس استان ==============
    const fetchCities = async (stateId) => {
        if (!stateId) {
            setCities([]);
            return;
        }
        try {
            const res = await api(`state/${stateId}/cities`, "GET");
            if (res?.data) {
                setCities(res.data);
            }
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    };

    // ============== بارگذاری اطلاعات کاربر ==============
    useEffect(() => {
        if (user?.id) {
            loadUserData(user.id);
        } else {
            formik.resetForm();
            setCities([]);
        }
    }, [user]);

    const loadUserData = async (userId) => {
        setLoadingData(true);
        try {
            const res = await api(`hrm-personnel-contact/get-by-user?userId=${userId}`, "GET");
            
            if (res?.success && res?.data) {
                const data = res.data;
                
                formik.setValues({
                    state_id: data.state_id || "",
                    city_id: data.city_id || "",
                    address: data.address || "",
                    postal_code: data.postal_code || "",
                    housing_status: data.housing_status || "",
                    phone_prefix: data.phone_prefix || "",
                    phone_number: data.phone_number || "",
                    mobile: data.mobile || "",
                    emergency_phone: data.emergency_phone || "",
                    email: data.email || "",
                });

                // اگر استان انتخاب شده بود، شهرهای مربوطه رو بارگذاری کن
                if (data.state_id) {
                    await fetchCities(data.state_id);
                }
            } else {
                formik.resetForm();
                setCities([]);
            }
        } catch (error) {
            console.error("Error loading user data:", error);
            formik.resetForm();
            setCities([]);
        }
        setLoadingData(false);
    };

    // ============== تغییر استان ==============
    const handleStateChange = (selectedOption) => {
        const stateId = selectedOption || "";
        formik.setFieldValue("state_id", stateId);
        formik.setFieldValue("city_id", "");
        if (stateId) {
            fetchCities(stateId);
        } else {
            setCities([]);
        }
    };

    async function handleSubmit(values) {
        setLoading(true);
        
        try {
            // چک کردن وجود رکورد
            const checkRes = await api(`hrm-personnel-contact/get-by-user?userId=${user?.id}`, "GET");
            
            let url = "hrm-personnel-contact";
            let method = "POST";
            
            if (checkRes?.success && checkRes?.data?.id) {
                url = `hrm-personnel-contact/${checkRes.data.id}`;
                method = "PATCH";
            }
            
            const payload = {
                ...values,
                user_id: user?.id,
                state_id: values.state_id || null,
                city_id: values.city_id || null,
            };
            
            const res = await api(url, method, payload);
            
            if (res?.success) {
                toast.success("اطلاعات تماس و سکونت با موفقیت ذخیره شد");
                onNext();
            } else {
                toast.error(res?.message || "خطا در ذخیره اطلاعات");
            }
        } catch (error) {
            console.error("Error saving:", error);
            toast.error("خطا در ذخیره اطلاعات");
        }
        
        setLoading(false);
    }

    // ============== تبدیل داده‌ها ==============
    const stateOptions = states.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    const cityOptions = cities.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    if (loadingData) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-500">در حال بارگذاری اطلاعات...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <form onSubmit={formik.handleSubmit} className="w-full space-y-4">
                {/* استان و شهر */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        name="state_id"
                        title="استان"
                        formik={formik}
                        options={stateOptions}
                        value={stateOptions.find(opt => opt.value === formik.values.state_id) || null}
                        onChange={handleStateChange}
                        placeholder="انتخاب استان"
                    />
                    <Select
                        name="city_id"
                        title="شهر"
                        formik={formik}
                        options={cityOptions}
                        value={cityOptions.find(opt => opt.value === formik.values.city_id) || null}
                        onChange={(selectedOption) => {
                            formik.setFieldValue("city_id", selectedOption || "");
                        }}
                        placeholder="انتخاب شهر"
                    />
                </div>

                {/* آدرس محل زندگی */}
                <div className="grid grid-cols-1 gap-4">
                    <Input
                        type="textarea"
                        name="address"
                        title="آدرس محل زندگی"
                        formik={formik}
                        placeholder="آدرس کامل محل زندگی"
                        rows={3}
                    />
                </div>

                {/* وضعیت مسکن و کد پستی */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        name="housing_status"
                        title="وضعیت مسکن"
                        formik={formik}
                        options={HOUSING_STATUS_OPTIONS}
                        placeholder="انتخاب وضعیت مسکن"
                    />
                    <Input
                        type="text"
                        name="postal_code"
                        title="کد پستی"
                        formik={formik}
                        placeholder="کد پستی ۱۰ رقمی"
                        maxLength={10}
                    />
                </div>

                {/* تلفن ثابت با پیش شماره */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        type="text"
                        name="phone_prefix"
                        title="پیش شماره"
                        formik={formik}
                        placeholder="مثال: 021"
                        maxLength={4}
                    />
                    <Input
                        type="text"
                        name="phone_number"
                        title="تلفن ثابت"
                        formik={formik}
                        placeholder="شماره تلفن"
                        maxLength={15}
                    />
                    <div className="flex items-end pb-1">
                        <span className="text-sm text-gray-500 mr-2">مثال: ۰۲۱-۱۲۳۴۵۶۷۸</span>
                    </div>
                </div>

                {/* موبایل و تلفن ضروری */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        type="text"
                        name="mobile"
                        title="موبایل"
                        formik={formik}
                        placeholder="مثال: 09121234567"
                        maxLength={11}
                    />
                    <Input
                        type="text"
                        name="emergency_phone"
                        title="تلفن ضروری"
                        formik={formik}
                        placeholder="تلفن ضروری"
                        maxLength={15}
                    />
                </div>

                {/* ایمیل */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        type="email"
                        name="email"
                        title="ایمیل"
                        formik={formik}
                        placeholder="example@email.com"
                    />
                </div>

                {/* دکمه‌ها */}
                <div className="flex justify-between items-center pt-4 border-t">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onPrev}
                        disabled={isFirst}
                        className="flex items-center gap-2"
                    >
                        قبلی
                    </Button>

                    <Button
                        type="submit"
                        isLoading={loading}
                        disabled={!formik.isValid || loading}
                        className="flex items-center gap-2"
                    >
                        {isLast ? "ثبت نهایی" : "ذخیره و ادامه"}
                    </Button>
                </div>
            </form>
        </div>
    );
}