// src/pages/hrm/contract/components/steps/BaseInfoStep.jsx

import { useState, useEffect } from "react";
import { api } from "@/lib/axios";
import Select from "@/components/shared/inputs/Select";
import FormSection from "../shared/FormSection";
import { Building2, FileText, Layers, User, UserCheck } from "lucide-react";

export default function BaseInfoStep({ formik, onContractTypeChange }) {
    const [employers, setEmployers] = useState([]);
    const [contractTypes, setContractTypes] = useState([]);
    const [contractModes, setContractModes] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // ===== دریافت داده‌ها =====
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                setLoading(true);
                const [usersRes, employersRes, typesRes, modesRes] = await Promise.all([
                    api("user?per-page=100", "GET"),  // ✅ دریافت لیست کاربران
                    api("hrm-contract/employers", "GET"),
                    api("hrm-contract/types", "GET"),
                    api("hrm-contract/modes", "GET"),
                ]);

                if (usersRes?.data) setUsers(usersRes.data);
                if (employersRes?.data) setEmployers(employersRes.data);
                if (typesRes?.data) setContractTypes(typesRes.data);
                if (modesRes?.data) setContractModes(modesRes.data);
            } catch (error) {
                console.error("Error fetching options:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOptions();
    }, []);

    // ===== گزینه‌ها =====
    const userOptions = users.map((item) => ({
        value: String(item.id),
        label: `${item.first_name || ""} ${item.last_name || ""}`.trim() || item.phone_number || `کاربر ${item.id}`,
    }));

    const employerOptions = employers.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    const contractTypeOptions = contractTypes.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    const contractModeOptions = contractModes.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    // ===== گزینه‌های اختصاص کاربر =====
    const HAS_USER_OPTIONS = [
        { value: "0", label: "خیر" },
        { value: "1", label: "بله" },
    ];

    // ===== تغییر وضعیت اختصاص کاربر =====
    const handleHasUserChange = (selectedOption) => {
        const value = selectedOption || "0";
        formik.setFieldValue("has_user", value);


        if (value === "0") {
            formik.setFieldValue("user_id", "");
        }

    };

    return (
        <FormSection title="اطلاعات پایه قرارداد" icon={Building2}>
            <p className="text-xs text-gray-500 mb-4">
                ابتدا کارفرما، نوع و حالت قرارداد را انتخاب کنید.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* کارفرما */}
                <Select
                    name="employer_id"
                    title="کارفرما"
                    formik={formik}
                    options={employerOptions}
                    placeholder="انتخاب کارفرما"
                    onChange={(selectedOption) => {
                        formik.setFieldValue("employer_id", selectedOption || "");
                    }}
                />

                {/* نوع قرارداد */}
                <Select
                    name="contract_type"
                    title="نوع قرارداد"
                    formik={formik}
                    options={contractTypeOptions}
                    placeholder="انتخاب نوع قرارداد"
                    required
                    onChange={(selectedOption) => {
                        const value = selectedOption || "";
                        formik.setFieldValue("contract_type", value);
                        onContractTypeChange(value);
                    }}
                />
                {/* حالت قراردادی */}
                <Select
                    name="contract_mode"
                    title="حالت قراردادی"
                    formik={formik}
                    options={contractModeOptions}
                    placeholder="انتخاب حالت قراردادی"
                    value={contractModeOptions.find(opt => opt.value === formik.values.contract_mode) || null}
                    onChange={(selectedOption) => {
                        formik.setFieldValue("contract_mode", selectedOption || "");
                    }}
                />
            </div>

            {/* ===== اختصاص کاربر ===== */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        name="has_user"
                        title="اختصاص کاربر"
                        formik={formik}
                        options={HAS_USER_OPTIONS}
                        placeholder="آیا قرارداد برای کاربر ثبت می‌شود؟"
                        value={formik.values.has_user ?? "0"}
                        onChange={handleHasUserChange}
                    />

                    {/* انتخاب کاربر - فقط در صورت "بله" */}
                    {formik.values.has_user === "1" && (
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                انتخاب کاربر <span className="text-red-500">*</span>
                            </label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                value={formik.values.user_id || ""}
                                onChange={(e) => {
                                    formik.setFieldValue("user_id", e.target.value);

                                    const selectedUser = users.find(f => f.id.toString() === e.target.value);
                                    formik.setFieldValue("personnel_code", selectedUser?.personnel_code || "");

                                    formik.setFieldValue("first_name", selectedUser?.first_name || "");
                                    formik.setFieldValue("last_name", selectedUser?.last_name || "");
                                    formik.setFieldValue("national_code", selectedUser?.national_id || "");

                                }}
                            >
                                <option value="">انتخاب کاربر...</option>
                                {userOptions.map((user) => (
                                    <option key={user.value} value={user.value}>
                                        {user.label}
                                    </option>
                                ))}
                            </select>
                            {formik.touched.user_id && formik.errors.user_id && (
                                <div className="text-xs text-red-500 mt-1">{formik.errors.user_id}</div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* نمایش انتخاب‌ها */}
            <div className="mt-4 flex flex-wrap gap-2">
                {formik.values.employer_id && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-md text-xs border border-blue-200">
                        <span className="text-gray-500">کارفرما:</span>
                        <span className="font-medium">
                            {employerOptions.find(opt => opt.value === formik.values.employer_id)?.label || "..."}
                        </span>
                    </span>
                )}
                {formik.values.contract_type && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-md text-xs border border-blue-200">
                        <span className="text-gray-500">نوع:</span>
                        <span className="font-medium">
                            {contractTypeOptions.find(opt => opt.value === formik.values.contract_type)?.label || "..."}
                        </span>
                    </span>
                )}
                {formik.values.contract_mode && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-md text-xs border border-blue-200">
                        <span className="text-gray-500">حالت:</span>
                        <span className="font-medium">
                            {contractModeOptions.find(opt => opt.value === formik.values.contract_mode)?.label || "..."}
                        </span>
                    </span>
                )}
                {formik.values.has_user === "1" && formik.values.user_id && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 rounded-md text-xs border border-green-200">
                        <span className="text-gray-500">کاربر اختصاص یافته:</span>
                        <span className="font-medium text-green-700">
                            {userOptions.find(opt => opt.value === formik.values.user_id)?.label || "..."}
                        </span>
                    </span>
                )}
                {formik.values.has_user === "0" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-md text-xs border border-gray-200">
                        <span className="text-gray-500">کاربر اختصاص داده نشده</span>
                    </span>
                )}
            </div>
        </FormSection>
    );
}