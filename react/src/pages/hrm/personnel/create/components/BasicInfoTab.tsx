// src/pages/hrm/personnel/create/components/BasicInfoTab.jsx

import { useFormik } from "formik";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/inputs";
import Select from "@/components/shared/inputs/Select";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { formatDateToEn, formatDateToFa } from "@/lib/utils";

// ============== Validation Schema ==============
const validationSchema = yup.object({
    first_name: yup.string().nullable(),
    last_name: yup.string().nullable(),
    father_name: yup.string().nullable(),
    national_code: yup.string().nullable().min(10, "کد ملی باید ۱۰ رقم باشد").max(10, "کد ملی باید ۱۰ رقم باشد"),
    personnel_code: yup.string().nullable(),
    shenasname_number: yup.string().nullable(),
    shenasname_serial1: yup.string().nullable(),
    shenasname_serial2: yup.string().nullable(), 
    shenasname_letter: yup.string().nullable(),
    birth_date: yup.string().nullable(),
    birth_place: yup.string().nullable(),
    shenasname_city: yup.string().nullable(),
    nationality: yup.string().nullable(),
    gender: yup.string().nullable(),
    blood_type: yup.string().nullable(),
    religion: yup.string().nullable(),
    religion_detail: yup.string().nullable(),
    marital_status: yup.string().nullable(),
});

// ============== گزینه‌های Select ==============
const GENDER_OPTIONS = [
    { value: "1", label: "مرد" },
    { value: "2", label: "زن" },
];

const BLOOD_TYPE_OPTIONS = [
    { value: "1", label: "A" },
    { value: "2", label: "A+" },
    { value: "3", label: "A-" },
    { value: "4", label: "AB" },
    { value: "5", label: "B" },
    { value: "6", label: "B+" },
    { value: "7", label: "B-" },
    { value: "8", label: "O" },
    { value: "9", label: "O+" },
    { value: "10", label: "O-" },
];

const RELIGION_OPTIONS = [
    { value: "1", label: "اسلام" },
    { value: "2", label: "مسیحی" },
    { value: "3", label: "زرتشتی" },
    { value: "4", label: "کلیمی" },
];

const NATIONALITY_OPTIONS = [
    { value: "1", label: "ایرانی" },
    { value: "2", label: "غیرایرانی" },
];

const MARITAL_STATUS_OPTIONS = [
    { value: "1", label: "مجرد" },
    { value: "2", label: "متاهل" },
    { value: "3", label: "مطلقه" },
];

const SHENASNAME_LETTER_OPTIONS = [
    { value: "الف", label: "الف" },
    { value: "ب", label: "ب" },
    { value: "ل", label: "ل" },
    { value: "د", label: "د" },
    { value: "ر", label: "ر" },
    { value: "1", label: "۱" },
    { value: "2", label: "۲" },
    { value: "3", label: "۳" },
    { value: "4", label: "۴" },
    { value: "9", label: "۹" },
    { value: "10", label: "۱۰" },
    { value: "11", label: "۱۱" },
];

// ============== کامپوننت اصلی ==============
export default function BasicInfoTab({ user, onNext, onPrev, isFirst, isLast }) {
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [acceptUserData,setAcceptUserData]=useState(false);

    const formik = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            father_name: "",
            national_code: "",
            personnel_code: "",
            shenasname_number: "",
            shenasname_serial1: "",
            shenasname_serial2: "",
            shenasname_letter: "",
            birth_date: "",
            birth_place: "",
            shenasname_city: "",
            nationality: "",
            gender: "",
            blood_type: "",
            religion: "",
            religion_detail: "",
            marital_status: "",
        },
        validationSchema,
        onSubmit: handleSubmit,
        validateOnChange: true,
        validateOnMount: true,
    });

    // ============== بارگذاری اطلاعات کاربر ==============
    useEffect(() => {
        if (user?.id) {
            loadUserData(user.id);
        } else {
            // اگر کاربر انتخاب نشده، فرم رو ریست کن
            formik.resetForm();
        }
    }, [user]);

    // ============== تابع بارگذاری اطلاعات ==============
    const loadUserData = async (userId) => {
            setAcceptUserData(false);
        setLoadingData(true);
        try {
            const res = await api(`hrm-personnel-basic/get-by-user?userId=${userId}`, "GET");
            
            if (res?.success && res?.data) {
                const data = res.data;
                setAcceptUserData(res?.data?.status==1);
                // مقداردهی فیلدها با اطلاعات موجود
                formik.setValues({
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    father_name: data.father_name || "",
                    national_code: data.national_code || "",
                    personnel_code: data.personnel_code || "",
                    shenasname_number: data.shenasname_number || "",
                    shenasname_serial1: data.shenasname_serial1 || "",
                    shenasname_serial2: data.shenasname_serial2 || "",
                    shenasname_letter: data.shenasname_letter || "",
                    birth_date: data.birth_date_persian || "",
                    birth_place: data.birth_place || "",
                    shenasname_city: data.shenasname_city || "",
                    nationality: data.nationality || "",
                    gender: data.gender || "",
                    blood_type: data.blood_type || "",
                    religion: data.religion || "",
                    religion_detail: data.religion_detail || "",
                    marital_status: data.marital_status || "",
                });
                
                toast.info("اطلاعات کاربر با موفقیت بارگذاری شد");
            } else {
                // اگر اطلاعاتی وجود نداشت، فرم خالی میمونه
                formik.resetForm();
            }
        } catch (error) {
            console.error("Error loading user data:", error);
            // اگر خطا داشت، فرم رو خالی کن
            formik.resetForm();
        }
        setLoadingData(false);
    };

    async function handleSubmit(values) {
        setLoading(true);
        
        try {
            const payload = {
                ...values,
                user_id: user?.id,
                birth_date: values.birth_date ? formatDateToEn(values.birth_date) : null,
            };
            
            const res = await api("hrm-personnel-basic", "POST", payload);
            
            if (res?.success) {
                toast.success("اطلاعات پایه با موفقیت ذخیره شد");
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
            {acceptUserData}
            {acceptUserData == true  && (
                <>
                 <div className="text-center mt-3 p-3 bg-green-50 rounded-md text-sm">
اطلاعات این کاربر قبلا وارد و تایید شده است.
            </div><br/>
            </>
            )}
           
            <form onSubmit={formik.handleSubmit} className="w-full space-y-4">
                {/* ردیف ۱: نام و نام خانوادگی */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        type="text"
                        name="first_name"
                        title="نام"
                        formik={formik}
                        placeholder="نام"
                    />
                    <Input
                        type="text"
                        name="last_name"
                        title="نام خانوادگی"
                        formik={formik}
                        placeholder="نام خانوادگی"
                    />
                </div>

                {/* ردیف ۲: نام پدر و کد ملی */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        type="text"
                        name="father_name"
                        title="نام پدر"
                        formik={formik}
                        placeholder="نام پدر"
                    />
                    <Input
                        type="text"
                        name="national_code"
                        title="کد ملی"
                        formik={formik}
                        placeholder="کد ملی"
                        maxLength={10}
                    />
                     <Input
                        type="text"
                        name="personnel_code"
                        title="کد پرسنلی"
                        formik={formik}
                        placeholder="کد پرسنلی"
                        maxLength={32}
                    />
                    
                </div>

                {/* ردیف ۳: شماره شناسنامه و سریال */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input
                        type="text"
                        name="shenasname_number"
                        title="شماره شناسنامه"
                        formik={formik}
                        placeholder="شماره شناسنامه"
                    />
                    <Input
                        type="text"
                        name="shenasname_serial2"
                        title="سریال شناسنامه"
                        formik={formik}
                        placeholder="سریال"
                        maxLength={6}
                    />
                    <div className="flex items-end gap-2">
                        <div className="flex-1">
                            <Input
                                type="text"
                                name="shenasname_serial1"
                                title="سری"
                                formik={formik}
                                placeholder="سری"
                                maxLength={2}
                            />
                        </div>
                        <span className="text-gray-400 text-lg pb-1">/</span>
                        <div className="flex-1">
                            <Select
                                name="shenasname_letter"
                                title="حرف"
                                formik={formik}
                                options={SHENASNAME_LETTER_OPTIONS}
                                placeholder="حرف"
                            />
                        </div>
                    </div>
                </div>

                {/* ردیف ۴: تاریخ تولد و محل تولد */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">تاریخ تولد</label>
                        <DatePicker
                            calendar={persian}
                            locale={persian_fa}
                            value={formik.values.birth_date}
                            onChange={(date) => {
                                formik.setFieldValue("birth_date", date?.format() || "");
                            }}
                            format="YYYY/MM/DD"
                            className="w-full"
                            inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                            placeholder="انتخاب تاریخ"
                        />
                    </div>
                    <Input
                        type="text"
                        name="birth_place"
                        title="محل تولد"
                        formik={formik}
                        placeholder="محل تولد"
                    />
                </div>

                {/* ردیف ۵: محل صدور و ملیت */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        type="text"
                        name="shenasname_city"
                        title="محل صدور"
                        formik={formik}
                        placeholder="محل صدور"
                    />
                    <Select
                        name="nationality"
                        title="ملیت"
                        formik={formik}
                        options={NATIONALITY_OPTIONS}
                        placeholder="انتخاب ملیت"
                    />
                </div>

                {/* ردیف ۶: جنسیت و گروه خونی */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        name="gender"
                        title="جنسیت"
                        formik={formik}
                        options={GENDER_OPTIONS}
                        placeholder="انتخاب جنسیت"
                    />
                    <Select
                        name="blood_type"
                        title="گروه خونی"
                        formik={formik}
                        options={BLOOD_TYPE_OPTIONS}
                        placeholder="انتخاب گروه خونی"
                    />
                </div>

                {/* ردیف ۷: دین و مذهب */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        name="religion"
                        title="دین"
                        formik={formik}
                        options={RELIGION_OPTIONS}
                        placeholder="انتخاب دین"
                    />
                    <Input
                        type="text"
                        name="religion_detail"
                        title="مذهب"
                        formik={formik}
                        placeholder="مذهب"
                    />
                </div>

                {/* ردیف ۸: وضعیت تاهل */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        name="marital_status"
                        title="وضعیت تاهل"
                        formik={formik}
                        options={MARITAL_STATUS_OPTIONS}
                        placeholder="انتخاب وضعیت تاهل"
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