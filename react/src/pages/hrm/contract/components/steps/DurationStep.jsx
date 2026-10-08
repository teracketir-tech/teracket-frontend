// src/pages/hrm/contract/components/steps/DurationStep.jsx

import { useState } from "react";
import Input from "@/components/shared/inputs";
import Select from "@/components/shared/inputs/Select";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import FormSection from "../shared/FormSection";
import { Calendar, Clock } from "lucide-react";

// ===== گزینه‌های دوره آزمایشی =====
const TRIAL_PERIOD_OPTIONS = [
    { value: "0", label: "ندارد" },
    { value: "1", label: "دارد" },
];

// ===== گزینه‌های حداقل کارکرد =====
const MIN_WORK_UNIT_OPTIONS = [
    { value: "hour", label: "ساعت" },
    { value: "day", label: "روز" },
];

const MIN_WORK_PERIOD_OPTIONS = [
    { value: "week", label: "هفته" },
    { value: "month", label: "ماه" },
];

export default function DurationStep({ formik, contractType }) {
    const [hasTrialPeriod, setHasTrialPeriod] = useState(
        formik.values.has_trial_period === "1" || formik.values.has_trial_period === 1
    );

    const isTemporary = contractType === "1";
    const isHourly = contractType === "2";
    const isProject = contractType === "3";

    // ===== تغییر وضعیت دوره آزمایشی =====
    const handleTrialPeriodChange = (selectedOption) => {
        const value = selectedOption || "0";
        formik.setFieldValue("has_trial_period", value);
        setHasTrialPeriod(value === "1");
        
        if (value !== "1") {
            formik.setFieldValue("trial_from_date", "");
            formik.setFieldValue("trial_to_date", "");
        }
    };

    // ===== برچسب نوع قرارداد =====
    const getContractTypeLabel = () => {
        if (isTemporary) return "موقت";
        if (isHourly) return "ساعتی";
        if (isProject) return "پیمانکاری";
        return "";
    };

    // ===== عنوان بخش =====
    const getSectionTitle = () => {
        if (isTemporary) return "نوع و مدت قرارداد (موقت)";
        if (isHourly) return "نوع و مدت قرارداد (ساعتی)";
        if (isProject) return "نوع و مدت قرارداد (پیمانکاری)";
        return "نوع و مدت قرارداد";
    };

    return (
        <FormSection title={getSectionTitle()} icon={Calendar}>
            <div className="space-y-4">
                {/* ===== نوع قرارداد (نمایشی) ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            نوع قرارداد
                        </label>
                        <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-medium">
                            {getContractTypeLabel()}
                        </div>
                    </div>

                    {/* ===== مدت قرارداد (ماه و روز) ===== */}
                    <div className="flex items-end gap-2">
                        <div className="flex-1">
                            <Input
                                type="number"
                                name="contract_duration_months"
                                title="مدت (ماه)"
                                formik={formik}
                                placeholder="ماه"
                                min={0}
                            />
                        </div>
                        <div className="flex-1">
                            <Input
                                type="number"
                                name="contract_duration_days"
                                title="مدت (روز)"
                                formik={formik}
                                placeholder="روز"
                                min={0}
                            />
                        </div>
                    </div>
                </div>

                {/* ===== تاریخ شروع و پایان ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            تاریخ شروع
                        </label>
                        <DatePicker
                            calendar={persian}
                            locale={persian_fa}
                            value={formik.values.contract_from_date}
                            onChange={(date) => formik.setFieldValue("contract_from_date", date?.format() || "")}
                            format="YYYY/MM/DD"
                            className="w-full"
                            inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                            placeholder="انتخاب تاریخ"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            تاریخ پایان
                        </label>
                        <DatePicker
                            calendar={persian}
                            locale={persian_fa}
                            value={formik.values.contract_to_date}
                            onChange={(date) => formik.setFieldValue("contract_to_date", date?.format() || "")}
                            format="YYYY/MM/DD"
                            className="w-full"
                            inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                            placeholder="انتخاب تاریخ"
                        />
                    </div>
                </div>

                {/* ===== فیلدهای اختصاصی نوع موقت ===== */}
                {isTemporary && (
                    <>
                        {/* تاریخ عدم اعتبار */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    تاریخ عدم اعتبار
                                </label>
                                <DatePicker
                                    calendar={persian}
                                    locale={persian_fa}
                                    value={formik.values.contract_unvalid_date}
                                    onChange={(date) => formik.setFieldValue("contract_unvalid_date", date?.format() || "")}
                                    format="YYYY/MM/DD"
                                    className="w-full"
                                    inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                    placeholder="انتخاب تاریخ"
                                />
                            </div>

                            {/* دوره آزمایشی */}
                            <Select
    name="has_trial_period"
    title="دوره آزمایشی"
    formik={formik}
    options={TRIAL_PERIOD_OPTIONS}
    placeholder="انتخاب دوره آزمایشی"
    value={formik.values.has_trial_period || "0"}
    onChange={handleTrialPeriodChange}
/>
                        </div>

                        {/* تاریخ دوره آزمایشی (در صورت "دارد") */}
                        {hasTrialPeriod && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        دوره آزمایشی از
                                    </label>
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        value={formik.values.trial_from_date}
                                        onChange={(date) => formik.setFieldValue("trial_from_date", date?.format() || "")}
                                        format="YYYY/MM/DD"
                                        className="w-full"
                                        inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                        placeholder="انتخاب تاریخ"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        دوره آزمایشی تا
                                    </label>
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        value={formik.values.trial_to_date}
                                        onChange={(date) => formik.setFieldValue("trial_to_date", date?.format() || "")}
                                        format="YYYY/MM/DD"
                                        className="w-full"
                                        inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                        placeholder="انتخاب تاریخ"
                                    />
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* ===== فیلدهای اختصاصی نوع ساعتی و پیمانکاری ===== */}
                {(isHourly || isProject) && (
                    <>
                        {/* تاریخ توافق */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    تاریخ توافق
                                </label>
                                <DatePicker
                                    calendar={persian}
                                    locale={persian_fa}
                                    value={formik.values.agreement_date}
                                    onChange={(date) => formik.setFieldValue("agreement_date", date?.format() || "")}
                                    format="YYYY/MM/DD"
                                    className="w-full"
                                    inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                    placeholder="انتخاب تاریخ"
                                />
                            </div>

                            {/* حداقل کارکرد - مقدار */}
                            <Input
                                type="number"
                                name="minimum_hours"
                                title="حداقل کارکرد"
                                formik={formik}
                                placeholder="مقدار"
                                min={0}
                            />
                        </div>

                        {/* حداقل کارکرد - واحد و دوره */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select
                                name="minimum_hours_unit"
                                title="واحد"
                                formik={formik}
                                options={MIN_WORK_UNIT_OPTIONS}
                                placeholder="انتخاب واحد"
                                value={MIN_WORK_UNIT_OPTIONS.find(
                                    opt => opt.value === formik.values.minimum_hours_unit
                                )}
                            />

                            <Select
                                name="minimum_hours_period"
                                title="در"
                                formik={formik}
                                options={MIN_WORK_PERIOD_OPTIONS}
                                placeholder="انتخاب دوره"
                                value={MIN_WORK_PERIOD_OPTIONS.find(
                                    opt => opt.value === formik.values.minimum_hours_period
                                )}
                            />
                        </div>
                    </>
                )}
            </div>
        </FormSection>
    );
}