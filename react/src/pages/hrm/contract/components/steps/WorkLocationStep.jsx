// src/pages/hrm/contract/components/steps/WorkLocationStep.jsx

import { useState, useEffect } from "react";
import { api } from "@/lib/axios";
import Select from "@/components/shared/inputs/Select";
import FormSection from "../shared/FormSection";
import { MapPin } from "lucide-react";

// ===== گزینه‌های نمایندگی (موقت) =====
const AGENT_OPTIONS = [
    { value: "1", label: "نمایندگی ۱" },
    { value: "2", label: "نمایندگی ۲" },
    { value: "3", label: "نمایندگی ۳" },
];

export default function WorkLocationStep({ 
    formik, 
    contractMode, 
    cities = [],           
    onStateChange = null   
}) {
    const [states, setStates] = useState([]);
    const [loadingCities, setLoadingCities] = useState(false);

    const isTransport = contractMode === "2";

    // ===== دریافت لیست استان‌ها =====
    useEffect(() => {
        const fetchStates = async () => {
            try {
                const res = await api("hrm-contract/states", "GET");
                if (res?.data) setStates(res.data);
            } catch (error) {
                console.error("Error fetching states:", error);
            }
        };
        fetchStates();
    }, []);

    // ===== گزینه‌ها =====
    const stateOptions = states.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    const cityOptions = cities.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    // ===== تغییر استان =====
    const handleStateChange = (selectedOption) => {
        const value = selectedOption || "";
        
        if (onStateChange) {
            onStateChange(value);
        } else {
            // اگر تابع از والد ارسال نشده، خودش مدیریت کند
            formik.setFieldValue("state_id", value);
            formik.setFieldValue("city_id", "");
        }
    };

    return (
        <FormSection title="محل انجام کار" icon={MapPin}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* استان */}
                <Select
                    name="state_id"
                    title="استان"
                    formik={formik}
                    options={stateOptions}
                    placeholder="انتخاب استان"
                    value={stateOptions.find(opt => opt.value === formik.values.state_id) || null}
                    onChange={handleStateChange}
                />

                {/* شهر */}
                <Select
                    name="city_id"
                    title="شهر"
                    formik={formik}
                    options={cityOptions}
                    placeholder="انتخاب شهر"
                    value={cityOptions.find(opt => opt.value === formik.values.city_id) || null}
                    onChange={(selectedOption) => {
                        formik.setFieldValue("city_id", selectedOption || "");
                    }}
                    isLoading={loadingCities}
                    disabled={!formik.values.state_id}
                />

                {/* ===== نمایندگی (فقط در حالت حمل و نقل) ===== */}
                {isTransport && (
                    <div className="col-span-full md:col-span-1">
                        <Select
                            name="agent_id"
                            title="نمایندگی"
                            formik={formik}
                            options={AGENT_OPTIONS}
                            placeholder="انتخاب نمایندگی"
                            onChange={(selectedOption) => {
                                formik.setFieldValue("agent_id", selectedOption || "");
                            }}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            انتخاب نمایندگی برای حالت حمل و نقل
                        </p>
                    </div>
                )}
            </div>
        </FormSection>
    );
}