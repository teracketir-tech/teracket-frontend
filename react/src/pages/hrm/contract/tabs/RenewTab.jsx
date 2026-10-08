// src/pages/hrm/contract/tabs/RenewTab.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "sonner";
import Button from "@/components/shared/Button";

import { Search, RotateCcw, FileText, X } from "lucide-react";  // ✅ اضافه کردن Ximport Button from "@/components/shared/Button";
import Input from "@/components/shared/inputs";
import Select from "@/components/shared/inputs/Select";
import Loading from "@/components/shared/Loading";
import BaseInfoStep from "../components/steps/BaseInfoStep";
import PersonnelStep from "../components/steps/PersonnelStep";
import WorkLocationStep from "../components/steps/WorkLocationStep";
import IntroducerOrSubjectStep from "../components/steps/IntroducerOrSubjectStep";
import DurationStep from "../components/steps/DurationStep";
import SalaryStep from "../components/steps/SalaryStep";
import { formatDateToEn } from "@/lib/utils";

// ============== Validation Schema ==============
const searchValidationSchema = yup.object({
    national_code: yup.string().nullable(),
    personnel_code: yup.string().nullable(),
    contract_type: yup.string().nullable(),
    workgroup_id: yup.string().nullable(),
});

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
        first_name: yup.string().nullable(),
        last_name: yup.string().nullable(),
        father_name: yup.string().nullable(),
        national_code: yup.string().nullable(),
        shenasname_number: yup.string().nullable(),
        shenasname_city: yup.string().nullable(),
        gender: yup.string().nullable(),
        address: yup.string().nullable(),
        phone: yup.string().nullable(),
        mobile: yup.string().nullable(),
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
        hourly_salary: yup.number().nullable(),
        hourly_housing_allowance: yup.number().nullable(),
        hourly_welfare_allowance: yup.number().nullable(),
        hourly_child_allowance: yup.number().nullable(),
        hourly_seniority_allowance: yup.number().nullable(),
        hourly_bonus: yup.number().nullable(),
        hourly_leave_salary: yup.number().nullable(),
        hourly_performance_bonus: yup.number().nullable(),
        contract_amount: yup.number().nullable(),
        contract_payment_type: yup.string().nullable(),
        description: yup.string().nullable(),
    };

    const specificFields = {
        "1": {
            birth_date: yup.string().nullable(),
            marital_status: yup.string().nullable(),
            postal_code: yup.string().nullable(),
        },
        "2": {
            marital_status: yup.string().nullable(),
        },
        "3": {},
    };

    return yup.object({ ...baseSchema, ...(specificFields[contractType] || {}) });
};

export default function RenewTab() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [foundContract, setFoundContract] = useState(null);
    const [foundUser, setFoundUser] = useState(null);
    const [selectedContractType, setSelectedContractType] = useState("");
    const [financialYear, setFinancialYear] = useState(null);
    const [selectedFinancialYear, setSelectedFinancialYear] = useState(null);
    const [cities, setCities] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [workgroups, setWorkgroups] = useState([]);
    const [contractTypes, setContractTypes] = useState([]);

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

    // ===== دریافت لیست‌های کمکی =====
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [typesRes, workgroupsRes] = await Promise.all([
                    api("hrm-contract/types", "GET"),
                    api("hrm-workgroup/items", "GET"),
                ]);
                if (typesRes?.data) setContractTypes(typesRes.data);
                if (workgroupsRes?.success) setWorkgroups(workgroupsRes.data);
            } catch (error) {
                console.error("Error fetching options:", error);
            }
        };
        fetchOptions();
    }, []);

    // ===== فرم جستجو =====
    const searchFormik = useFormik({
        initialValues: {
            national_code: "",
            personnel_code: "",
            contract_type: "",
            workgroup_id: "",
        },
        validationSchema: searchValidationSchema,
        onSubmit: handleSearch,
    });

    // ===== جستجوی قرارداد =====
    async function handleSearch(values) {
        setLoadingSearch(true);
        setFoundContract(null);
        setFoundUser(null);
        setShowForm(false);

        try {
            const params = new URLSearchParams();
            if (values.national_code) params.set("national_code", values.national_code);
            if (values.personnel_code) params.set("personnel_code", values.personnel_code);
            if (values.contract_type) params.set("contract_type", values.contract_type);
            if (values.workgroup_id) params.set("workgroup_id", values.workgroup_id);
            params.set("per-page", "1");

        const res = await api(`hrm-contract/search-for-renew?${params.toString()}`, "GET");
            if (res?.data && res.data.length > 0) {
                const contract = res.data[0];
                setFoundContract(contract);
                
                // دریافت اطلاعات کاربر
                if (contract.user_id) {
                    const userRes = await api(`user/${contract.user_id}`, "GET");
                    if (userRes?.success && userRes?.data) {
                        setFoundUser(userRes.data);
                    }
                }
                
                toast.success("قرارداد پیدا شد");
                // نمایش فرم
                setShowForm(true);
                fillFormWithContractData(contract);
            } else {
                setFoundContract(null);
                setFoundUser(null);
                toast.warning("هیچ قراردادی با این مشخصات پیدا نشد");
            }
        } catch (error) {
            console.error("Error searching contract:", error);
            toast.error("خطا در جستجوی قرارداد");
        }
        setLoadingSearch(false);
    }

    // ===== پر کردن فرم با داده‌های قرارداد =====
    const fillFormWithContractData = (contract) => {
        if (!contract) return;

        let jobPositionIds = [];
        if (contract.job_position_ids) {
            if (Array.isArray(contract.job_position_ids)) {
                jobPositionIds = contract.job_position_ids;
            } else if (typeof contract.job_position_ids === 'string') {
                try {
                    jobPositionIds = JSON.parse(contract.job_position_ids);
                } catch {
                    jobPositionIds = [];
                }
            }
        }

        setSelectedContractType(String(contract.contract_type || ""));

        formik.setValues({
            title: contract.title || `تمدید قرارداد ${contract.id}`,
            description: contract.description || "",
            employer_id: contract.employer_id || "",
            
            contract_type: String(contract.contract_type || ""),
            contract_mode: contract.contract_mode || "",
            job_position_ids: jobPositionIds,
            person_type: contract.person_type || "1",
            first_name: contract.first_name || "",
            last_name: contract.last_name || "",
            father_name: contract.father_name || "",
            national_code: contract.national_code || "",
            shenasname_number: contract.shenasname_number || "",
            shenasname_city: contract.shenasname_city || "",
            birth_date: contract.birth_date_persian || "",
            marital_status: contract.marital_status || "",
            gender: contract.gender || "",
            address: contract.address || "",
            postal_code: contract.postal_code || "",
            phone: contract.phone || "",
            mobile: contract.mobile || "",
            company_name: contract.company_name || "",
            company_registration_number: contract.company_registration_number || "",
            company_type: contract.company_type || "",
            company_position: contract.company_position || "",
            child_count: contract.child_count || "",
            phone_prefix: contract.phone_prefix || "",
            state_id: contract.state_id || "",
            city_id: contract.city_id || "",
            agent_id: contract.agent_id || "",
            has_introducer: contract.has_introducer !== undefined && contract.has_introducer !== null ? String(contract.has_introducer) : "0",
            introducer_first_name: contract.introducer_first_name || "",
            introducer_last_name: contract.introducer_last_name || "",
            introducer_phone: contract.introducer_phone || "",
            introducer_phone_prefix: contract.introducer_phone_prefix || "",
            introducer_mobile: contract.introducer_mobile || "",
            introducer_relation: contract.introducer_relation || "",
            introducer_address: contract.introducer_address || "",
            service_subject: contract.service_subject || "",
            contract_duration_months: contract.contract_duration_months || "",
            contract_duration_days: contract.contract_duration_days || "",
            contract_from_date: contract.contract_from_date_persian || "",
            contract_to_date: contract.contract_to_date_persian || "",
            contract_unvalid_date: contract.contract_unvalid_date_persian || "",
            has_trial_period: contract.has_trial_period !== undefined && contract.has_trial_period !== null ? String(contract.has_trial_period) : "0",
            trial_from_date: contract.trial_from_date_persian || "",
            trial_to_date: contract.trial_to_date_persian || "",
            agreement_date: contract.agreement_date_persian || "",
            minimum_hours: contract.minimum_hours || "",
            minimum_hours_unit: contract.minimum_hours_unit || "",
            minimum_hours_period: contract.minimum_hours_period || "",
            base_salary: contract.base_salary || "",
            child_allowance: contract.child_allowance || "",
            housing_allowance: contract.housing_allowance || "",
            welfare_allowance: contract.welfare_allowance || "",
            seniority_allowance: contract.seniority_allowance || "",
            performance_bonus: contract.performance_bonus || "",
            responsibility_allowance: contract.responsibility_allowance || "",
            transportation_allowance: contract.transportation_allowance || "",
            other_allowance: contract.other_allowance || "",
            hourly_salary: contract.hourly_salary || "",
            hourly_housing_allowance: contract.hourly_housing_allowance || "",
            hourly_welfare_allowance: contract.hourly_welfare_allowance || "",
            hourly_child_allowance: contract.hourly_child_allowance || "",
            hourly_seniority_allowance: contract.hourly_seniority_allowance || "",
            hourly_bonus: contract.hourly_bonus || "",
            hourly_leave_salary: contract.hourly_leave_salary || "",
            hourly_performance_bonus: contract.hourly_performance_bonus || "",
            contract_amount: contract.contract_amount || "",
            contract_payment_type: contract.contract_payment_type || "",
            user_id: contract.user_id || "",
            has_user: contract.has_user !== undefined && contract.has_user !== null ? String(contract.has_user) : "0",
            personnel_code: contract.personnel_code || "",
        });

        if (contract.state_id) {
            fetchCities(contract.state_id);
        }
    };

    // ===== دریافت شهرها =====
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

    // ============== فرمیک برای ثبت قرارداد جدید ==============
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
            base_salary: "",
            child_allowance: "",
            housing_allowance: "",
            welfare_allowance: "",
            seniority_allowance: "",
            performance_bonus: "",
            responsibility_allowance: "",
            transportation_allowance: "",
            other_allowance: "",
            hourly_salary: "",
            hourly_housing_allowance: "",
            hourly_welfare_allowance: "",
            hourly_child_allowance: "",
            hourly_seniority_allowance: "",
            hourly_bonus: "",
            hourly_leave_salary: "",
            hourly_performance_bonus: "",
            contract_amount: "",
            contract_payment_type: "",
            user_id: "",
            has_user: "0",
            personnel_code: "",
        },
        validationSchema: getValidationSchema(selectedContractType),
        onSubmit: handleSubmitRenew,
        validateOnChange: true,
        validateOnMount: true,
        enableReinitialize: true,
    });

    // ===== گزینه‌ها =====
    const contractTypeOptions = contractTypes.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    const workgroupOptions = workgroups.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    // ===== تغییر نوع قرارداد =====
    const handleContractTypeChange = (value) => {
        setSelectedContractType(value);
        formik.setFieldValue("contract_type", value);
    };

    // ===== تغییر استان =====
    const handleStateChange = async (stateId) => {
        formik.setFieldValue("state_id", stateId);
        formik.setFieldValue("city_id", "");
        if (stateId) {
            await fetchCities(stateId);
        } else {
            setCities([]);
        }
    };

    // ===== تبدیل تاریخ به میلادی =====
    const convertDate = (date) => {
        if (!date) return null;
        return formatDateToEn(date);
    };

    // ===== ثبت قرارداد جدید (تمدید) =====
    async function handleSubmitRenew(values) {
        setLoading(true);

        try {
            const parentId = foundContract?.id;

            const payload = {
                title: values.title || null,
                employer_id: values.employer_id ? parseInt(values.employer_id) : null,
                contract_type: parseInt(values.contract_type),
                contract_mode: values.contract_mode ? parseInt(values.contract_mode) : null,
                has_user: parseInt(values.has_user) || 0,
                user_id: values.has_user === "1" ? parseInt(values.user_id) : null,
                personnel_code: values.personnel_code || null,
                description: values.description || null,
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
                phone: values.phone  || null,
                phone_prefix: values.phone_prefix || null,
                mobile: values.mobile || null,
                company_name: values.company_name || null,
                company_registration_number: values.company_registration_number || null,
                company_type: values.company_type ? parseInt(values.company_type) : null,
                company_position: values.company_position ? parseInt(values.company_position) : null,
                child_count: values.child_count ? parseInt(values.child_count) : null,
                state_id: values.state_id ? parseInt(values.state_id) : null,
                city_id: values.city_id ? parseInt(values.city_id) : null,
                agent_id: values.agent_id ? parseInt(values.agent_id) : null,
                has_introducer: parseInt(values.has_introducer) || 0,
                introducer_first_name: values.introducer_first_name || null,
                introducer_last_name: values.introducer_last_name || null,
                introducer_phone: values.introducer_phone   || null,
                introducer_phone_prefix: values.introducer_phone_prefix || null,
                introducer_mobile: values.introducer_mobile || null,
                introducer_relation: values.introducer_relation || null,
                introducer_address: values.introducer_address || null,
                service_subject: values.service_subject || null,
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
                job_position_ids: values.job_position_ids || [],
            };

            const contractType = parseInt(values.contract_type);
            if (contractType === 1) {
                payload.base_salary = parseFloat(values.base_salary) || 0;
                payload.child_allowance = parseFloat(values.child_allowance) || 0;
                payload.housing_allowance = parseFloat(values.housing_allowance) || 0;
                payload.welfare_allowance = parseFloat(values.welfare_allowance) || 0;
                payload.seniority_allowance = parseFloat(values.seniority_allowance) || 0;
                payload.performance_bonus = parseFloat(values.performance_bonus) || 0;
                payload.responsibility_allowance = parseFloat(values.responsibility_allowance) || 0;
                payload.transportation_allowance = parseFloat(values.transportation_allowance) || 0;
                payload.other_allowance = parseFloat(values.other_allowance) || 0;
            } else if (contractType === 2) {
                payload.hourly_salary = parseFloat(values.hourly_salary) || 0;
                payload.hourly_housing_allowance = parseFloat(values.hourly_housing_allowance) || 0;
                payload.hourly_welfare_allowance = parseFloat(values.hourly_welfare_allowance) || 0;
                payload.hourly_child_allowance = parseFloat(values.hourly_child_allowance) || 0;
                payload.hourly_seniority_allowance = parseFloat(values.hourly_seniority_allowance) || 0;
                payload.hourly_bonus = parseFloat(values.hourly_bonus) || 0;
                payload.hourly_leave_salary = parseFloat(values.hourly_leave_salary) || 0;
                payload.hourly_performance_bonus = parseFloat(values.hourly_performance_bonus) || 0;
                payload.transportation_allowance = parseFloat(values.transportation_allowance) || 0;
            } else if (contractType === 3) {
                payload.contract_amount = parseFloat(values.contract_amount) || 0;
                payload.contract_payment_type = values.contract_payment_type || 'daily';
                payload.responsibility_allowance = parseFloat(values.responsibility_allowance) || 0;
                payload.performance_bonus = parseFloat(values.performance_bonus) || 0;
                payload.transportation_allowance = parseFloat(values.transportation_allowance) || 0;
            }

            const res = await api(`hrm-contract/${parentId}/renew`, "POST", payload);

            if (res?.success) {
                toast.success("قرارداد با موفقیت تمدید شد");
                setShowForm(false);
                setFoundContract(null);
                setFoundUser(null);
                searchFormik.resetForm();
                navigate("/hrm/contract/create");
            } else {
                toast.error(res?.message || "خطا در تمدید قرارداد");
            }
        } catch (error) {
            console.error("Error renewing contract:", error);
            toast.error("خطا در ارتباط با سرور");
        }

        setLoading(false);
    }

    // ===== بررسی کامل بودن اطلاعات پایه =====
    const isBaseInfoComplete =
        formik.values.employer_id &&
        formik.values.contract_type &&
        formik.values.contract_mode &&
        (formik.values.has_user === "0" || formik.values.user_id);

    return (
        <div className="space-y-6">
            {/* ===== بخش جستجو ===== */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    جستجوی قرارداد قبلی
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                    برای تمدید قرارداد، اطلاعات زیر را وارد کنید
                </p>

                <form onSubmit={searchFormik.handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {/* کد ملی */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">کد ملی</label>
                            <input
                                type="text"
                                name="national_code"
                                value={searchFormik.values.national_code || ""}
                                onChange={searchFormik.handleChange}
                                placeholder="کد ملی"
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>

                        {/* کد پرسنلی */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">کد پرسنلی</label>
                            <input
                                type="text"
                                name="personnel_code"
                                value={searchFormik.values.personnel_code || ""}
                                onChange={searchFormik.handleChange}
                                placeholder="کد پرسنلی"
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>

                        {/* نوع قرارداد */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">نوع قرارداد</label>
                            <Select
                                name="contract_type"
                                value={contractTypeOptions.find((opt) => opt.value === searchFormik.values.contract_type) || null}
                                onChange={(selectedOption) => {
                                    searchFormik.setFieldValue("contract_type", selectedOption?.value || "");
                                }}
                                options={contractTypeOptions}
                                placeholder="همه انواع"
                                isClearable
                            />
                        </div>

                        {/* گروه کاری */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">گروه کاری</label>
                            <Select
                                name="workgroup_id"
                                value={workgroupOptions.find((opt) => opt.value === searchFormik.values.workgroup_id) || null}
                                onChange={(selectedOption) => {
                                    searchFormik.setFieldValue("workgroup_id", selectedOption?.value || "");
                                }}
                                options={workgroupOptions}
                                placeholder="همه گروه‌ها"
                                isClearable
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-3">
                        <Button
                            type="submit"
                            isLoading={loadingSearch}
                            disabled={loadingSearch}
                            className="flex items-center gap-2 text-sm px-3 py-1.5"
                        >
                            <Search className="w-4 h-4" />
                            جستجو
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                searchFormik.resetForm();
                                setFoundContract(null);
                                setFoundUser(null);
                                setShowForm(false);
                            }}
                            className="text-sm px-3 py-1.5"
                        >
                            <X className="w-4 h-4" />
                            پاک کردن
                        </Button>
                    </div>
                </form>

                {/* ===== نتیجه جستجو ===== */}
                {foundContract && !loadingSearch && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 text-sm text-green-700">
                            <FileText className="w-4 h-4" />
                            <span className="font-medium">قرارداد پیدا شد</span>
                            <span className="text-gray-500 mr-auto">
                                شماره: {foundContract.id}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                            <div>
                                <span className="text-gray-500">پرسنل:</span>
                                <span className="font-medium mr-1">
                                    {foundContract.first_name || ""} {foundContract.last_name || ""}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500">کد ملی:</span>
                                <span className="font-medium mr-1">{foundContract.national_code || "-"}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">کد پرسنلی:</span>
                                <span className="font-medium mr-1">{foundContract.personnel_code || "-"}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">نوع قرارداد:</span>
                                <span className="font-medium mr-1">
                                    {contractTypeOptions.find(opt => opt.value === String(foundContract.contract_type))?.label || "-"}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {!foundContract && !loadingSearch && searchFormik.submitCount > 0 && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-yellow-700 text-sm">
                        <p>هیچ قراردادی با این مشخصات پیدا نشد</p>
                    </div>
                )}
            </div>

            {/* ===== فرم تمدید قرارداد ===== */}
            {showForm && foundContract && (
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50/30">
                    <div className="flex items-center gap-2 mb-4">
                        <RotateCcw className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-semibold text-blue-700">تمدید قرارداد</h3>
                        <span className="text-sm text-gray-500 mr-auto">
                            قرارداد والد: #{foundContract.id}
                        </span>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        {/* اطلاعات پایه */}
                        <BaseInfoStep
                            formik={formik}
                            onContractTypeChange={handleContractTypeChange}
                        />

                        {/* مراحل بعدی */}
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

                        {!isBaseInfoComplete && (
                            <div className="text-center py-6 text-gray-400 text-sm bg-gray-50 rounded-lg border border-dashed">
                                <p>لطفاً کارفرما، نوع و حالت قرارداد را انتخاب کنید</p>
                            </div>
                        )}

                        {/* دکمه‌ها */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    setShowForm(false);
                                    setFoundContract(null);
                                    setFoundUser(null);
                                    searchFormik.resetForm();
                                }}
                            >
                                انصراف
                            </Button>
                            <Button
                                type="submit"
                                isLoading={loading}
                                disabled={!formik.isValid || !isBaseInfoComplete || loading}
                                className="flex items-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                تمدید قرارداد
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}