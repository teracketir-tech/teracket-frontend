// src/pages/hrm/contract/components/steps/IntroducerOrSubjectStep.jsx

import { useState } from "react";
import Input from "@/components/shared/inputs";
import Select from "@/components/shared/inputs/Select";
import FormSection from "../shared/FormSection";
import { UserPlus, FileText } from "lucide-react";

// ===== گزینه‌های معرف =====
const INTRODUCER_OPTIONS = [
    { value: "0", label: "ندارد" },
    { value: "1", label: "دارد" },
];

export default function IntroducerOrSubjectStep({ formik, contractType }) {
    const [hasIntroducer, setHasIntroducer] = useState(
        formik.values.has_introducer === "1" || formik.values.has_introducer === 1
    );

    const isTemporary = contractType === "1";
    const isHourly = contractType === "2";
    const isProject = contractType === "3";

    // ===== تغییر وضعیت معرف =====
    const handleIntroducerChange = (selectedOption) => {
        const value = selectedOption || "0";
        formik.setFieldValue("has_introducer", value);
        setHasIntroducer(value === "1");
        
        if (value !== "1") {
            formik.setFieldValue("introducer_first_name", "");
            formik.setFieldValue("introducer_last_name", "");
            formik.setFieldValue("introducer_phone", "");
            formik.setFieldValue("introducer_phone_prefix", "");
            formik.setFieldValue("introducer_mobile", "");
            formik.setFieldValue("introducer_relation", "");
            formik.setFieldValue("introducer_address", "");
        }
    };

    // ===== رندر موضوع قرارداد (برای ساعتی و پیمانکاری) =====
    if (isHourly || isProject) {
        return (
            <FormSection title="موضوع قرارداد" icon={FileText}>
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            خدمات
                        </label>
                        <textarea
                            name="service_subject"
                            value={formik.values.service_subject || ""}
                            onChange={(e) => formik.setFieldValue("service_subject", e.target.value)}
                            onBlur={formik.handleBlur}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="شرح خدمات قرارداد را وارد کنید..."
                        />
                        {formik.touched.service_subject && formik.errors.service_subject && (
                            <div className="text-xs text-red-500 mt-1">{formik.errors.service_subject}</div>
                        )}
                    </div>
                </div>
            </FormSection>
        );
    }

    // ===== رندر معرف طرف قرارداد (برای نوع موقت) =====
    if (isTemporary) {
        return (
            <FormSection title="معرف طرف قرارداد" icon={UserPlus}>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <Select
    name="has_introducer"
    title="معرف"
    formik={formik}
    options={INTRODUCER_OPTIONS}
    placeholder="انتخاب وضعیت معرف"
     value={formik.values.has_introducer}
     
    onChange={handleIntroducerChange}
/>
                    </div>

                    {hasIntroducer && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                type="text"
                                name="introducer_first_name"
                                title="نام معرف"
                                formik={formik}
                                placeholder="نام معرف"
                            />

                            <Input
                                type="text"
                                name="introducer_last_name"
                                title="نام خانوادگی معرف"
                                formik={formik}
                                placeholder="نام خانوادگی معرف"
                            />

                            <div className="flex items-end gap-2">
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        name="introducer_phone_prefix"
                                        title="پیش‌شماره"
                                        formik={formik}
                                        placeholder="مثال: 021"
                                        maxLength={4}
                                    />
                                </div>
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        name="introducer_phone"
                                        title="تلفن ثابت"
                                        formik={formik}
                                        placeholder="شماره تلفن"
                                    />
                                </div>
                            </div>

                            <Input
                                type="text"
                                name="introducer_mobile"
                                title="تلفن همراه"
                                formik={formik}
                                placeholder="مثال: 09121234567"
                            />

                            <Input
                                type="text"
                                name="introducer_relation"
                                title="نسبت معرف"
                                formik={formik}
                                placeholder="نسبت معرف"
                            />

                            <div className="col-span-full">
                                <Input
                                    type="text"
                                    name="introducer_address"
                                    title="آدرس معرف"
                                    formik={formik}
                                    placeholder="آدرس کامل معرف"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </FormSection>
        );
    }

    return null;
}