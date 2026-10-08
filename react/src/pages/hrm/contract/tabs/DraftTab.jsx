// src/pages/hrm/contract/tabs/DraftTab.jsx

import { useState, useEffect } from "react";
import { api } from "@/lib/axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "sonner";
import { FilePlus, RotateCcw } from "lucide-react";
import Button from "@/components/shared/Button";
import BaseInfoStep from "../components/steps/BaseInfoStep";
import PersonnelStep from "../components/steps/PersonnelStep";
import WorkLocationStep from "../components/steps/WorkLocationStep";
import IntroducerOrSubjectStep from "../components/steps/IntroducerOrSubjectStep";
import DurationStep from "../components/steps/DurationStep";
import SalaryStep from "../components/steps/SalaryStep"; 
import RenewTab from "./RenewTab";
import { formatDateToEn } from "@/lib/utils";

// ============== زیر تب‌ها ==============
 

const SUB_TABS = [
    {
        id: "new",
        label: "قرارداد جدید",
        icon: FilePlus,
        description: "ثبت قرارداد جدید برای پرسنل"
    },
    {
        id: "renew",
        label: "همکاری مجدد",
        icon: RotateCcw,
        description: "تمدید یا بازنویسی قرارداد قبلی"
    },
];

// ============== Validation Schema پویا ==============
const getValidationSchema = (contractType) => {
    const baseSchema = {
        user_id: yup.string().nullable(),
        has_user: yup.string().nullable(),
        personnel_code: yup.string().nullable(),
        title: yup.string().nullable(),
        employer_id: yup.string().nullable(),
        contract_type: yup.string().required("نوع قرارداد الزامی است"),
        contract_mode: yup.string().nullable(),
        job_position_ids: yup.array().nullable(),
        person_type: yup.string().nullable(),
        first_name: yup.string().required(" این فیلد الزامی است"),
        last_name: yup.string().required(" این فیلد الزامی است"),
        father_name:yup.string().required(" این فیلد الزامی است"),
        national_code: yup.string().required(" این فیلد الزامی است"),
        shenasname_number:yup.string().required(" این فیلد الزامی است"),
        shenasname_city: yup.string().required(" این فیلد الزامی است"),
        gender: yup.string().nullable(),
        address: yup.string().nullable(),
        phone: yup.string().nullable(),
        mobile:yup.string().required(" این فیلد الزامی است"),
        company_name: yup.string().nullable(),
        company_registration_number: yup.string().nullable(),
        company_type: yup.string().nullable(),
        company_position: yup.string().nullable(),
        child_count: yup.string().nullable(),
        phone_prefix: yup.string().nullable(),
        state_id: yup.string().nullable(),
        city_id: yup.string().nullable(),
        agent_id: yup.string().nullable(),
        has_introducer: yup.string().nullable(),
        introducer_first_name: yup.string().nullable(),
        introducer_last_name: yup.string().nullable(),
        introducer_phone: yup.string().nullable(),
        introducer_phone_prefix: yup.string().nullable(),
        introducer_mobile: yup.string().nullable(),
        introducer_relation: yup.string().nullable(),
        introducer_address: yup.string().nullable(),
        service_subject: yup.string().nullable(),
        contract_duration_months: yup.number().nullable(),
        contract_duration_days: yup.number().nullable(),
        contract_from_date: yup.string().nullable(),
        contract_to_date: yup.string().nullable(),
        contract_unvalid_date: yup.string().nullable(),
        has_trial_period: yup.string().nullable(),
        trial_from_date: yup.string().nullable(),
        trial_to_date: yup.string().nullable(),
        agreement_date: yup.string().nullable(),
        minimum_hours: yup.number().nullable(),
        minimum_hours_unit: yup.string().nullable(),
        minimum_hours_period: yup.string().nullable(),
        base_salary: yup.number().nullable(),
        child_allowance: yup.number().nullable(),
        housing_allowance: yup.number().nullable(),
        welfare_allowance: yup.number().nullable(),
        seniority_allowance: yup.number().nullable(),
        performance_bonus: yup.number().nullable(),
        responsibility_allowance: yup.number().nullable(),
        transportation_allowance: yup.number().nullable(),
        other_allowance: yup.number().nullable(),

        // نوع ساعتی
        hourly_salary: yup.number().nullable(),
        hourly_housing_allowance: yup.number().nullable(),
        hourly_welfare_allowance: yup.number().nullable(),
        hourly_child_allowance: yup.number().nullable(),
        hourly_seniority_allowance: yup.number().nullable(),
        hourly_bonus: yup.number().nullable(),
        hourly_leave_salary: yup.number().nullable(),
        hourly_performance_bonus: yup.number().nullable(),

        // نوع پیمانکاری
        contract_amount: yup.number().nullable(),
        contract_payment_type: yup.string().nullable(),
        
        // توضیحات
        description: yup.string().nullable(),
    };

    // فیلدهای اختصاصی هر نوع قرارداد
    const specificFields = {
        // موقت
        "1": {
            birth_date: yup.string().nullable(),
            marital_status: yup.string().nullable(),
            postal_code: yup.string().nullable(),
        },
        // ساعتی
        "2": {
            marital_status: yup.string().nullable(),
        },
        // پیمانکاری
        "3": {},
    };

    return yup.object({ ...baseSchema, ...(specificFields[contractType] || {}) });
};

export default function DraftTab() {
    const [activeSubTab, setActiveSubTab] = useState("new");
    const [selectedContractType, setSelectedContractType] = useState("");
    const [financialYear, setFinancialYear] = useState(null);
    const [selectedFinancialYear, setSelectedFinancialYear] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cities, setCities] = useState([]);
    // ===== دریافت سال مالی فعال =====
    useEffect(() => {
        const fetchFinancialYear = async () => {
            try {
                const res = await api("hrm-financial-year/active", "GET");
                if (res?.success && res?.data) {
                    setFinancialYear(res.data);
                }
            } catch (error) {
                console.error("Error fetching financial year:", error);
            }
        };
        fetchFinancialYear();
    }, []);

    // ============== فرمیک ==============
    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            employer_id: "",
            contract_type: "",
            contract_mode: "",
            job_position_ids: [],
            person_type: "1",
            first_name: "",
            last_name: "",
            father_name: "",
            national_code: "",
            shenasname_number: "",
            shenasname_city: "",
            birth_date: "",
            marital_status: "",
            gender: "",
            address: "",
            postal_code: "",
            phone: "",
            mobile: "",
            company_name: "",
            company_registration_number: "",
            company_type: "",
            company_position: "",
            child_count: "",
            phone_prefix: "",
            state_id: "",
            city_id: "",
            agent_id: "",
            has_introducer: "0",
            introducer_first_name: "",
            introducer_last_name: "",
            introducer_phone: "",
            introducer_phone_prefix: "",
            introducer_mobile: "",
            introducer_relation: "",
            introducer_address: "",
            service_subject: "",
            contract_duration_months: "",
            contract_duration_days: "",
            contract_from_date: "",
            contract_to_date: "",
            contract_unvalid_date: "",
            has_trial_period: "0",
            trial_from_date: "",
            trial_to_date: "",
            agreement_date: "",
            minimum_hours: "",
            minimum_hours_unit: "",
            minimum_hours_period: "",

            // ===== نوع موقت =====
            base_salary: "",
            child_allowance: "",
            housing_allowance: "",
            welfare_allowance: "",
            seniority_allowance: "",
            performance_bonus: "",
            responsibility_allowance: "",
            transportation_allowance: "",
            other_allowance: "",

            // ===== نوع ساعتی =====
            hourly_salary: "",
            hourly_housing_allowance: "",
            hourly_welfare_allowance: "",
            hourly_child_allowance: "",
            hourly_seniority_allowance: "",
            hourly_bonus: "",
            hourly_leave_salary: "",
            hourly_performance_bonus: "",

            // ===== نوع پیمانکاری =====
            contract_amount: "",
            contract_payment_type: "",
            
            // ===== فیلدهای کاربر =====
            user_id: "",
            has_user: "0",
            personnel_code: "",
        },
        validationSchema: getValidationSchema(selectedContractType),
        onSubmit: handleSubmit,
        validateOnChange: true,
        validateOnMount: true,
        enableReinitialize: true,
    });

    // ===== تابع پر کردن فیلدهای حق‌السعی =====
    const fillSalaryFields = (financialYearData) => {
        if (!financialYearData) return;

        const hasValues =
            formik.values.base_salary ||
            formik.values.housing_allowance ||
            formik.values.welfare_allowance;

        if (hasValues) {
            if (!confirm("آیا می‌خواهید مقادیر فعلی با مقادیر سال مالی جایگزین شوند؟")) {
                return;
            }
        }

        if (selectedContractType === "1") {
            // ===== نوع موقت =====
            formik.setValues({
                ...formik.values,
                base_salary: financialYearData.salary || "",
                child_allowance: financialYearData.child_allowance || "",
                housing_allowance: financialYearData.housing_benefits || "",
                welfare_allowance: financialYearData.welfare_allowance || "",
                seniority_allowance: financialYearData.seniority_allowance || "",
                performance_bonus: financialYearData.performance_bonus || "",
                responsibility_allowance: financialYearData.responsibility_allowance || "",
                transportation_allowance: financialYearData.transportation_allowance || "",
            });
        } else if (selectedContractType === "2") {
            // ===== نوع ساعتی =====
            const monthlySalary = parseFloat(financialYearData.salary) || 0;
            const hourlySalary = Math.round(monthlySalary / 176);

            const hourlyHousing = Math.round((parseFloat(financialYearData.housing_benefits) || 0) / 176);
            const hourlyWelfare = Math.round((parseFloat(financialYearData.welfare_allowance) || 0) / 176);
            const hourlyChild = Math.round((parseFloat(financialYearData.child_allowance) || 0) / 176);
            const hourlySeniority = Math.round((parseFloat(financialYearData.seniority_allowance) || 0) / 176);
            const hourlyBonus = Math.round((parseFloat(financialYearData.performance_bonus) || 0) / 176);
            const hourlyLeave = Math.round((parseFloat(financialYearData.salary) || 0) / 176);
            const hourlyPerformance = 0;

            formik.setValues({
                ...formik.values,
                hourly_salary: hourlySalary,
                hourly_housing_allowance: hourlyHousing,
                hourly_welfare_allowance: hourlyWelfare,
                hourly_child_allowance: hourlyChild,
                hourly_seniority_allowance: hourlySeniority,
                hourly_bonus: hourlyBonus,
                hourly_leave_salary: hourlyLeave,
                hourly_performance_bonus: hourlyPerformance,
                transportation_allowance: financialYearData.transportation_allowance || "",
            });
        }

        toast.success(`مقادیر از سال مالی ${financialYearData.year} با موفقیت پر شد`);
    };

    // ===== دریافت سال مالی بر اساس تاریخ شروع =====
    useEffect(() => {
        const fetchFinancialYearByDate = async () => {
            if (!formik.values.contract_from_date) {
                return;
            }

            const persianDate = formik.values.contract_from_date;
            const year = persianDate.split('/')[0];

            if (!year) return;

            try {
                const res = await api(`hrm-financial-year?year=${year}`, "GET");
                if (res?.data && res.data.length > 0) {
                    const foundYear = res.data.find(item => item.status === 1) || res.data[0];
                    setSelectedFinancialYear(foundYear);

                    if (selectedContractType !== "3" && foundYear) {
                        fillSalaryFields(foundYear);
                    }
                } else {
                    setSelectedFinancialYear(null);
                }
            } catch (error) {
                console.error("Error fetching financial year by date:", error);
                setSelectedFinancialYear(null);
            }
        };

        fetchFinancialYearByDate();
    }, [formik.values.contract_from_date, selectedContractType]);

    // ============== تغییر نوع قرارداد ==============
    const handleContractTypeChange = (value) => {
        setSelectedContractType(value);
        formik.setFieldValue("contract_type", value);
    };
 // ===== تغییر استان =====


     // ===== دریافت شهرها بر اساس استان =====
     const fetchCities = async (stateId) => {
         if (!stateId) {
             setCities([]);
             return;
         }
         try {
             const res = await api(`hrm-contract/cities?stateId=${stateId}`, "GET");
             if (res?.data) {
                 setCities(res.data);
             }
         } catch (error) {
             console.error("Error fetching cities:", error);
             setCities([]);
         }
     };
    const handleStateChange = async (stateId) => {
        formik.setFieldValue("state_id", stateId);
        formik.setFieldValue("city_id", "");
        if (stateId) {
            await fetchCities(stateId);
        } else {
            setCities([]);
        }
    };
    // ============== بررسی کامل بودن اطلاعات پایه ==============
    const isBaseInfoComplete =
        formik.values.employer_id &&
        formik.values.contract_type &&
        formik.values.contract_mode &&
        (formik.values.has_user === "0" || formik.values.user_id);

    // ============== تابع تبدیل تاریخ به میلادی ==============
    const convertDate = (date) => {
        if (!date) return null;
        return formatDateToEn(date);
    };

    // ============== تابع ثبت قرارداد ==============
    async function handleSubmit(values) {
        setLoading(true);

        try {
            // ===== ساخت payload =====
            const payload = {
                // اطلاعات پایه
                title: values.title || null,
                employer_id: values.employer_id ? parseInt(values.employer_id) : null,
                contract_type: parseInt(values.contract_type),
                contract_mode: values.contract_mode ? parseInt(values.contract_mode) : null,
                has_user: parseInt(values.has_user) || 0,
                user_id: values.has_user === "1" ? parseInt(values.user_id) : null,
                personnel_code: values.personnel_code || null,
                description: values.description || null,

                // مشخصات پرسنل
                person_type: parseInt(values.person_type) || 1,
                first_name: values.first_name || null,
                last_name: values.last_name || null,
                father_name: values.father_name || null,
                national_code: values.national_code || null,
                shenasname_number: values.shenasname_number || null,
                shenasname_city: values.shenasname_city || null,
                birth_date: convertDate(values.birth_date),
                marital_status: values.marital_status ? parseInt(values.marital_status) : null,
                gender: values.gender ? parseInt(values.gender) : null,
                address: values.address || null,
                postal_code: values.postal_code || null,
                phone: values.phone || null,
                phone_prefix: values.phone_prefix || null,
                mobile: values.mobile || null,

                // شخص حقوقی
                company_name: values.company_name || null,
                company_registration_number: values.company_registration_number || null,
                company_type: values.company_type ? parseInt(values.company_type) : null,
                company_position: values.company_position ? parseInt(values.company_position) : null,
                child_count: values.child_count ? parseInt(values.child_count) : null,

                // محل انجام کار
                state_id: values.state_id ? parseInt(values.state_id) : null,
                city_id: values.city_id ? parseInt(values.city_id) : null,
                agent_id: values.agent_id ? parseInt(values.agent_id) : null,

                // معرف
                has_introducer: parseInt(values.has_introducer) || 0,
                introducer_first_name: values.introducer_first_name || null,
                introducer_last_name: values.introducer_last_name || null,
                introducer_phone: values.introducer_phone   || null,
                introducer_phone_prefix: values.introducer_phone_prefix || null,
                introducer_mobile: values.introducer_mobile || null,
                introducer_relation: values.introducer_relation || null,
                introducer_address: values.introducer_address || null,

                // موضوع قرارداد
                service_subject: values.service_subject || null,

                // مدت قرارداد
                contract_duration_months: parseInt(values.contract_duration_months) || 0,
                contract_duration_days: parseInt(values.contract_duration_days) || 0,
                contract_from_date: convertDate(values.contract_from_date),
                contract_to_date: convertDate(values.contract_to_date),
                contract_unvalid_date: convertDate(values.contract_unvalid_date),
                has_trial_period: parseInt(values.has_trial_period) || 0,
                trial_from_date: convertDate(values.trial_from_date),
                trial_to_date: convertDate(values.trial_to_date),
                agreement_date: convertDate(values.agreement_date),
                minimum_hours: parseFloat(values.minimum_hours) || 0,
                minimum_hours_unit: values.minimum_hours_unit || null,
                minimum_hours_period: values.minimum_hours_period ? parseInt(values.minimum_hours_period) : null,

                // سمت شغلی (مالتی)
                job_position_ids: values.job_position_ids || [],

                // حق‌السعی
                ...(selectedContractType === "1" && {
                    base_salary: parseFloat(values.base_salary) || 0,
                    child_allowance: parseFloat(values.child_allowance) || 0,
                    housing_allowance: parseFloat(values.housing_allowance) || 0,
                    welfare_allowance: parseFloat(values.welfare_allowance) || 0,
                    seniority_allowance: parseFloat(values.seniority_allowance) || 0,
                    performance_bonus: parseFloat(values.performance_bonus) || 0,
                    responsibility_allowance: parseFloat(values.responsibility_allowance) || 0,
                    transportation_allowance: parseFloat(values.transportation_allowance) || 0,
                    other_allowance: parseFloat(values.other_allowance) || 0,
                }),
                ...(selectedContractType === "2" && {
                    hourly_salary: parseFloat(values.hourly_salary) || 0,
                    hourly_housing_allowance: parseFloat(values.hourly_housing_allowance) || 0,
                    hourly_welfare_allowance: parseFloat(values.hourly_welfare_allowance) || 0,
                    hourly_child_allowance: parseFloat(values.hourly_child_allowance) || 0,
                    hourly_seniority_allowance: parseFloat(values.hourly_seniority_allowance) || 0,
                    hourly_bonus: parseFloat(values.hourly_bonus) || 0,
                    hourly_leave_salary: parseFloat(values.hourly_leave_salary) || 0,
                    hourly_performance_bonus: parseFloat(values.hourly_performance_bonus) || 0,
                    transportation_allowance: parseFloat(values.transportation_allowance) || 0,
                }),
                ...(selectedContractType === "3" && {
                    contract_amount: parseFloat(values.contract_amount) || 0,
                    contract_payment_type: values.contract_payment_type || 'daily',
                    responsibility_allowance: parseFloat(values.responsibility_allowance) || 0,
                    performance_bonus: parseFloat(values.performance_bonus) || 0,
                    transportation_allowance: parseFloat(values.transportation_allowance) || 0,
                }),
            };

            // ===== ارسال به API =====
            const res = await api("hrm-contract", "POST", payload);

            if (res?.success) {
                toast.success("قرارداد با موفقیت ثبت شد");
                // ریست فرم
                formik.resetForm();
                setSelectedContractType("");
                // می‌توانید به صفحه لیست هدایت کنید
                // navigate("/hrm/contract/create");
            } else {
                toast.error(res?.message || "خطا در ثبت قرارداد");
                if (res?.errors) {
                    console.error("Validation errors:", res.errors);
                }
            }
        } catch (error) {
            console.error("Error submitting contract:", error);
            toast.error("خطا در ارتباط با سرور");
        }

        setLoading(false);
    }

    return (
        <div className="space-y-4">
            {/* ===== زیر تب‌ها ===== */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
                {SUB_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeSubTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSubTab(tab.id)}
                            className={`
                                flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                                ${isActive
                                    ? "bg-blue-500 text-white shadow-md"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }
                            `}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* ===== توضیحات زیر تب ===== */}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">
                    {SUB_TABS.find(tab => tab.id === activeSubTab)?.description}
                </p>
            </div>

            {/* ===== فرم ===== */}
            {activeSubTab === "new" && (
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    {/* مرحله 1: اطلاعات پایه */}
                    <BaseInfoStep
                        formik={formik}
                        onContractTypeChange={handleContractTypeChange}
                    />

                    {/* مرحله 2: مشخصات پرسنل - فقط زمانی که هر ۳ فیلد انتخاب شده باشند */}
                    {isBaseInfoComplete && (
                        <>
                            <PersonnelStep
                                formik={formik}
                                contractType={selectedContractType}
                                contractMode={formik.values.contract_mode}
                            />
 
 <WorkLocationStep
                                    formik={formik}
                                    contractMode={formik.values.contract_mode}
                                    cities={cities}
                                    onStateChange={handleStateChange}
                                />
                            <IntroducerOrSubjectStep
                                formik={formik}
                                contractType={selectedContractType}
                            />

                            <DurationStep
                                formik={formik}
                                contractType={selectedContractType}
                            />

                            <SalaryStep
                                formik={formik}
                                contractType={selectedContractType}
                                financialYear={financialYear}
                                selectedFinancialYear={selectedFinancialYear}
                            />
                        </>
                    )}

                    {/* پیام راهنما - زمانی که همه فیلدها انتخاب نشده باشند */}
                    {!isBaseInfoComplete && (
                        <div className="text-center py-6 text-gray-400 text-sm bg-gray-50 rounded-lg border border-dashed">
                            <p>لطفاً کارفرما، نوع و حالت قرارداد را انتخاب کنید تا فیلدهای مربوطه نمایش داده شوند</p>
                        </div>
                    )}

                    {/* دکمه‌ها - فقط زمانی که همه فیلدها پر شده باشند */}
                    <div className="flex justify-end pt-4 border-t">
                        <Button
                            type="submit"
                            isLoading={loading}
                            disabled={!formik.isValid || !isBaseInfoComplete || loading}
                        >
                            ثبت قرارداد
                        </Button>
                    </div>
                </form>
            )}

           {activeSubTab === "renew" && <RenewTab />}
        </div>
    );
}