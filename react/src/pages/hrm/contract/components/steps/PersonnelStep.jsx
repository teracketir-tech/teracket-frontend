// src/pages/hrm/contract/components/steps/PersonnelStep.jsx

import { useState, useEffect } from "react";
import { api } from "@/lib/axios";
import Select from "@/components/shared/inputs/Select";
import Input from "@/components/shared/inputs";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import FormSection from "../shared/FormSection";
import { User } from "lucide-react";

// ===== گزینه‌های سمت شغلی =====
const JOB_POSITIONS = [
    { value: "14", label: "مدیر منطقه" },
    { value: "15", label: "نماینده" },
    { value: "16", label: "مسئول دفتر" },
    { value: "17", label: "قاصد" },
];

// ===== گزینه‌های ثابت =====
const PERSON_TYPE_OPTIONS = [
    { value: "1", label: "حقیقی" },
    { value: "2", label: "حقوقی" },
];

const GENDER_OPTIONS = [
    { value: "1", label: "مرد" },
    { value: "2", label: "زن" },
];

const MARITAL_STATUS_OPTIONS = [
    { value: "1", label: "مجرد" },
    { value: "2", label: "متاهل" },
    { value: "3", label: "مطلقه" },
];

const CHILD_COUNT_OPTIONS = [
    { value: "0", label: "ندارد" },
    { value: "1", label: "1" },
    { value: "2", label: "2 یا بیشتر" },
];

const COMPANY_TYPE_OPTIONS = [
    { value: "1", label: "شرکت با مسئولیت محدود" },
    { value: "2", label: "شرکت سهامی خاص" },
    { value: "3", label: "شرکت تعاونی" },
    { value: "4", label: "شرکت تضامنی" },
    { value: "5", label: "شرکت سهامی عام" },
    { value: "6", label: "موسسه" },
];

const COMPANY_POSITION_OPTIONS = [
    { value: "1", label: "مدیر عامل" },
    { value: "2", label: "رئیس هیئت مدیره" },
    { value: "3", label: "غیره" },
];

export default function PersonnelStep({ formik, contractType, contractMode }) {
    const [maritalStatuses, setMaritalStatuses] = useState([]);
    const [genders, setGenders] = useState([]);

    // ===== دریافت داده‌ها از API =====
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [maritalRes, genderRes] = await Promise.all([
                    api("hrm-contract/marital-statuses", "GET"),
                    api("hrm-contract/genders", "GET"),
                ]);
                if (maritalRes?.data) setMaritalStatuses(maritalRes.data);
                if (genderRes?.data) setGenders(genderRes.data);
            } catch (error) {
                console.error("Error fetching options:", error);
            }
        };
        fetchOptions();
    }, []);

    // ===== گزینه‌ها =====
    const maritalOptions = maritalStatuses.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    const genderOptions = genders.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    // ===== تشخیص نوع‌ها =====
    const isTemporary = contractType === "1";
    const isHourly = contractType === "2";
    const isProject = contractType === "3";
    const isTransport = contractMode === "2";
    const isTemporaryTransport = isTemporary && isTransport;
    const isProjectTransport = isProject && isTransport;
    const showJobPosition = isTemporaryTransport || isProjectTransport;

    // ===== تشخیص شخصیت حقوقی =====
    const isCorporate = formik.values.person_type === "2";
    const isMarried = formik.values.marital_status === "2";

    return (
        <FormSection title="مشخصات کارگر" icon={User}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ===== سمت شغلی (فقط برای موقت+حمل و نقل یا پیمانکاری+حمل و نقل) - تمام عرض ===== */}
                {showJobPosition && (
                    <div className="col-span-full">
                        <Select
                            name="job_position_ids"
                            title="سمت شغلی"
                            formik={formik}
                            options={JOB_POSITIONS}
                            befplaceholder="انتخاب سمت شغلی"
                            isMulti
                            onChange={(selectedOptions) => {
                                const values = selectedOptions || [];
                                formik.setFieldValue("job_position_ids", values);
                            }}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            می‌توانید چندین سمت شغلی انتخاب کنید
                        </p>
                    </div>
                )}

                {/* ===== ستون راست ===== */}
                {/* شخصیت */}
                <Select
                    name="person_type"
                    title="شخصیت"
                    formik={formik}
                    options={PERSON_TYPE_OPTIONS}
                    befplaceholder="انتخاب شخصیت"
                />

                {/* نام */}
                <Input
                    type="text"
                    name="first_name"
                    title="نام"
                    formik={formik}
                    befplaceholder="نام"
                />

                {/* نام خانوادگی */}
                <Input
                    type="text"
                    name="last_name"
                    title="نام خانوادگی"
                    formik={formik}
                    befplaceholder="نام خانوادگی"
                />

                {/* نام پدر */}
                <Input
                    type="text"
                    name="father_name"
                    title="نام پدر"
                    formik={formik}
                    befplaceholder="نام پدر"
                />

                {/* کد ملی */}
                <Input
                    type="text"
                    name="national_code"
                    title="کد ملی"
                    formik={formik}
                    befplaceholder="کد ملی"
                    maxLength={10}
                />
                <Input
                    type="text"
                    name="personnel_code"
                    title="کد پرسنلی"
                    formik={formik}
                    befplaceholder="کد پرسنلی"
                />
                {/* شماره شناسنامه */}
                <Input
                    type="text"
                    name="shenasname_number"
                    title="شماره شناسنامه"
                    formik={formik}
                    befplaceholder="شماره شناسنامه"
                />

                {/* محل صدور */}
                <Input
                    type="text"
                    name="shenasname_city"
                    title="محل صدور"
                    formik={formik}
                    befplaceholder="محل صدور"
                />

                {/* ===== فیلدهای شخص حقوقی ===== */}
                {isCorporate && (
                    <>
                        <Input
                            type="text"
                            name="company_name"
                            title="نام شخص حقوقی"
                            formik={formik}
                            befplaceholder="نام شخص حقوقی"
                        />

                        <Input
                            type="text"
                            name="company_registration_number"
                            title="شماره ثبت"
                            formik={formik}
                            befplaceholder="شماره ثبت"
                        />

                        <Select
                            name="company_type"
                            title="نوع شخص حقوقی"
                            formik={formik}
                            options={COMPANY_TYPE_OPTIONS}
                            befplaceholder="انتخاب نوع شخص حقوقی"
                        />

                        <Select
                            name="company_position"
                            title="سمت طرف قرارداد"
                            formik={formik}
                            options={COMPANY_POSITION_OPTIONS}
                            befplaceholder="انتخاب سمت طرف قرارداد"
                        />
                    </>
                )}

                {/* ===== تاریخ تولد (فقط موقت) ===== */}
                {isTemporary && (
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">تاریخ تولد</label>
                        <DatePicker
                            calendar={persian}
                            locale={persian_fa}
                            value={formik.values.birth_date}
                            onChange={(date) => formik.setFieldValue("birth_date", date?.format() || "")}
                            format="YYYY/MM/DD"
                            className="w-full"
                            inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                            befplaceholder="انتخاب تاریخ"
                        />
                    </div>
                )}

                {/* ===== وضعیت تاهل (موقت و ساعتی) ===== */}
                {(isTemporary || isHourly) && (
                    <Select
                        name="marital_status"
                        title="وضعیت تاهل"
                        formik={formik}
                        options={maritalOptions}
                        befplaceholder="انتخاب وضعیت تاهل"
                    />
                )}

                {/* ===== تعداد فرزند (در صورت متاهل بودن) ===== */}
                {isMarried && (
                    <Select
                        name="child_count"
                        title="تعداد فرزند"
                        formik={formik}
                        options={CHILD_COUNT_OPTIONS}
                        befplaceholder="انتخاب تعداد فرزند"
                    />
                )}

                {/* ===== جنسیت ===== */}
                <Select
                    name="gender"
                    title="جنسیت"
                    formik={formik}
                    options={genderOptions}
                    befplaceholder="انتخاب جنسیت"
                />

                {/* ===== آدرس کامل پستی (تمام عرض) ===== */}
                <div className="col-span-full">
                    <Input
                        type="text"
                        name="address"
                        title="آدرس کامل پستی"
                        formik={formik}
                        befplaceholder="آدرس کامل"
                    />
                </div>

                {/* ===== کد پستی (فقط موقت) ===== */}
                {isTemporary && (
                    <Input
                        type="text"
                        name="postal_code"
                        title="کد پستی"
                        formik={formik}
                        befplaceholder="کد پستی"
                        maxLength={10}
                    />
                )}

                {/* ===== تلفن ثابت (پیش‌شماره + شماره) ===== */}
                <div className="flex items-end gap-2">
                    <div className="flex-1">
                        <Input
                            type="text"
                            name="phone_prefix"
                            title="پیش‌شماره"
                            formik={formik}
                            befplaceholder="مثال: 021"
                            maxLength={4}
                        />
                    </div>
                    <div className="flex-1">
                        <Input
                            type="text"
                            name="phone"
                            title="تلفن ثابت"
                            formik={formik}
                            befplaceholder="شماره تلفن"
                        />
                    </div>
                </div>

                {/* ===== موبایل ===== */}
                <Input
                    type="text"
                    name="mobile"
                    title="موبایل"
                    formik={formik}
                    befplaceholder="مثال: 09121234567"
                />
            </div>
        </FormSection>
    );
}