// src/pages/hrm/contract/tabs/draft/components/BaseInfoStep.jsx

import { useState, useEffect } from "react";
import { api } from "@/lib/axios";
import Select from "@/components/shared/inputs/Select";

export default function BaseInfoStep({ formik, onContractTypeChange }) {
    const [employers, setEmployers] = useState([]);
    const [contractTypes, setContractTypes] = useState([]);
    const [contractModes, setContractModes] = useState([]);
    const [loading, setLoading] = useState(true);

    // ============== دریافت داده‌ها ==============
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                setLoading(true);
                const [employersRes, typesRes, modesRes] = await Promise.all([
                    api("hrm-contract/employers", "GET"),
                    api("hrm-contract/types", "GET"),
                    api("hrm-contract/modes", "GET"),
                ]);

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

    // ============== گزینه‌ها ==============
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

    return (
        <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-sm font-bold text-blue-700 mb-3">
                    اطلاعات پایه قرارداد
                </h3>
                <p className="text-xs text-blue-600 mb-4">
                    ابتدا کارفرما، نوع و حالت قرارداد را انتخاب کنید تا فیلدهای مربوطه نمایش داده شوند.
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
                            formik.setFieldValue("employer_id", selectedOption?.value || "");
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
                            const value = selectedOption?.value || "";
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
                        onChange={(selectedOption) => {
                            formik.setFieldValue("contract_mode", selectedOption?.value || "");
                        }}
                    />
                </div>

                {/* نمایش انتخاب‌ها به صورت برچسب */}
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
                </div>
            </div>

            {/* پیام راهنما */}
            {!formik.values.contract_type && (
                <div className="text-center py-4 text-gray-400 text-sm">
                    <p>لطفاً نوع قرارداد را انتخاب کنید تا فیلدهای مربوطه نمایش داده شوند</p>
                </div>
            )}
        </div>
    );
}