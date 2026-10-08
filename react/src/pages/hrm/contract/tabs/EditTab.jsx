// src/pages/hrm/contract/tabs/EditTab.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import Button from "@/components/shared/Button";
import Loading from "@/components/shared/Loading";
import BaseInfoStep from "../components/steps/BaseInfoStep";
import PersonnelStep from "../components/steps/PersonnelStep";
import WorkLocationStep from "../components/steps/WorkLocationStep";
import IntroducerOrSubjectStep from "../components/steps/IntroducerOrSubjectStep";
import DurationStep from "../components/steps/DurationStep";
import SalaryStep from "../components/steps/SalaryStep";
import { formatDateToEn } from "@/lib/utils";

// ============== وضعیت‌های قرارداد ==============
const STATUS = {
    DRAFT: 0,
    ACTIVE: 1,
    EXPIRED: 2,
    CANCELLED: 3,
};

// ============== Validation Schema ==============
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

export default function EditTab() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [contract, setContract] = useState(null);
    const [selectedContractType, setSelectedContractType] = useState("");
    const [financialYear, setFinancialYear] = useState(null);
    const [selectedFinancialYear, setSelectedFinancialYear] = useState(null);
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

    // ===== دریافت اطلاعات قرارداد =====
    useEffect(() => {
        const fetchContract = async () => {
            try {
                setLoadingData(true);
                const res = await api(`hrm-contract/${id}`, "GET");
                if (res?.success && res?.data) {
                    setContract(res.data);
                    setSelectedContractType(String(res.data.contract_type));
                    
                    if (res.data.state_id) {
                        await fetchCities(res.data.state_id);
                    }
                } else {
                    toast.error("قرارداد یافت نشد");
                    navigate("/hrm/contract/create");
                }
            } catch (error) {
                console.error("Error fetching contract:", error);
                toast.error("خطا در دریافت اطلاعات");
                navigate("/hrm/contract/create");
            } finally {
                setLoadingData(false);
            }
        };
        if (id) {
            fetchContract();
        }
    }, [id]);

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
        onSubmit: handleUpdate,
        validateOnChange: true,
        validateOnMount: true,
        enableReinitialize: true,
    });

    // ===== پر کردن فرم با داده‌های قرارداد =====
    useEffect(() => {
        if (contract) {
            const data = contract;
            
            let jobPositionIds = [];
            if (data.job_position_ids) {
                if (Array.isArray(data.job_position_ids)) {
                    jobPositionIds = data.job_position_ids;
                } else if (typeof data.job_position_ids === 'string') {
                    try {
                        jobPositionIds = JSON.parse(data.job_position_ids);
                    } catch {
                        jobPositionIds = [];
                    }
                }
            }

            // مقداردهی formik با داده‌های قرارداد
            formik.setValues({
                title: data.title || "",
                description: data.description || "",
                employer_id: data.employer_id || "",
                contract_type: String(data.contract_type || ""),
                contract_mode: data.contract_mode || "",
                job_position_ids: jobPositionIds,
                person_type: data.person_type || "1",
                first_name: data.first_name || "",
                last_name: data.last_name || "",
                father_name: data.father_name || "",
                national_code: data.national_code || "",
                shenasname_number: data.shenasname_number || "",
                shenasname_city: data.shenasname_city || "",
                birth_date: data.birth_date_persian || "",
                marital_status: data.marital_status || "",
                gender: data.gender || "",
                address: data.address || "",
                postal_code: data.postal_code || "",
                phone: data.phone || "",
                mobile: data.mobile || "",
                company_name: data.company_name || "",
                company_registration_number: data.company_registration_number || "",
                company_type: data.company_type || "",
                company_position: data.company_position || "",
                child_count: data.child_count || "",
                phone_prefix: data.phone_prefix || "",
                state_id: data.state_id || "",
                city_id: data.city_id || "",
                agent_id: data.agent_id || "",
                has_introducer: data.has_introducer !== undefined && data.has_introducer !== null ? String(data.has_introducer) : "0",
                introducer_first_name: data.introducer_first_name || "",
                introducer_last_name: data.introducer_last_name || "",
                introducer_phone: data.introducer_phone || "",
                introducer_phone_prefix: data.introducer_phone_prefix || "",
                introducer_mobile: data.introducer_mobile || "",
                introducer_relation: data.introducer_relation || "",
                introducer_address: data.introducer_address || "",
                service_subject: data.service_subject || "",
                contract_duration_months: data.contract_duration_months || "",
                contract_duration_days: data.contract_duration_days || "",
                contract_from_date: data.contract_from_date_persian || "",
                contract_to_date: data.contract_to_date_persian || "",
                contract_unvalid_date: data.contract_unvalid_date_persian || "",
                has_trial_period: data.has_trial_period !== undefined && data.has_trial_period !== null ? String(data.has_trial_period) : "0",
                trial_from_date: data.trial_from_date_persian || "",
                trial_to_date: data.trial_to_date_persian || "",
                agreement_date: data.agreement_date_persian || "",
                minimum_hours: data.minimum_hours || "",
                minimum_hours_unit: data.minimum_hours_unit || "",
                minimum_hours_period: data.minimum_hours_period || "",
                base_salary: data.base_salary || "",
                child_allowance: data.child_allowance || "",
                housing_allowance: data.housing_allowance || "",
                welfare_allowance: data.welfare_allowance || "",
                seniority_allowance: data.seniority_allowance || "",
                performance_bonus: data.performance_bonus || "",
                responsibility_allowance: data.responsibility_allowance || "",
                transportation_allowance: data.transportation_allowance || "",
                other_allowance: data.other_allowance || "",
                hourly_salary: data.hourly_salary || "",
                hourly_housing_allowance: data.hourly_housing_allowance || "",
                hourly_welfare_allowance: data.hourly_welfare_allowance || "",
                hourly_child_allowance: data.hourly_child_allowance || "",
                hourly_seniority_allowance: data.hourly_seniority_allowance || "",
                hourly_bonus: data.hourly_bonus || "",
                hourly_leave_salary: data.hourly_leave_salary || "",
                hourly_performance_bonus: data.hourly_performance_bonus || "",
                contract_amount: data.contract_amount || "",
                contract_payment_type: data.contract_payment_type || "",
                user_id: data.user_id || "",
                has_user: data.has_user !== undefined && data.has_user !== null ? String(data.has_user) : "0",
                personnel_code: data.personnel_code || "",
            });

            if (data.contract_from_date_persian) {
                const year = data.contract_from_date_persian.split('/')[0];
                if (year) {
                    fetchFinancialYearByYear(year);
                }
            }
        }
    }, [contract]);

    // ===== دریافت سال مالی بر اساس سال =====
    const fetchFinancialYearByYear = async (year) => {
        try {
            const res = await api(`hrm-financial-year?year=${year}`, "GET");
            if (res?.data && res.data.length > 0) {
                const foundYear = res.data.find(item => item.status === 1) || res.data[0];
                setSelectedFinancialYear(foundYear);
            }
        } catch (error) {
            console.error("Error fetching financial year:", error);
        }
    };

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

    // ===== تابع تبدیل تاریخ به میلادی =====
    const convertDate = (date) => {
        if (!date) return null;
        return formatDateToEn(date);
    };

    // ===== تابع ویرایش قرارداد =====
    async function handleUpdate(values) {
        if (contract?.contract_status !== STATUS.DRAFT) {
            toast.warning("این قرارداد تایید شده است و قابل ویرایش نمی‌باشد");
            return;
        }

        setLoading(true);

        try {
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
                phone: values.phone || null,
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

            if (parseInt(values.contract_type) === 1) {
                payload.base_salary = parseFloat(values.base_salary) || 0;
                payload.child_allowance = parseFloat(values.child_allowance) || 0;
                payload.housing_allowance = parseFloat(values.housing_allowance) || 0;
                payload.welfare_allowance = parseFloat(values.welfare_allowance) || 0;
                payload.seniority_allowance = parseFloat(values.seniority_allowance) || 0;
                payload.performance_bonus = parseFloat(values.performance_bonus) || 0;
                payload.responsibility_allowance = parseFloat(values.responsibility_allowance) || 0;
                payload.transportation_allowance = parseFloat(values.transportation_allowance) || 0;
                payload.other_allowance = parseFloat(values.other_allowance) || 0;
            } else if (parseInt(values.contract_type) === 2) {
                payload.hourly_salary = parseFloat(values.hourly_salary) || 0;
                payload.hourly_housing_allowance = parseFloat(values.hourly_housing_allowance) || 0;
                payload.hourly_welfare_allowance = parseFloat(values.hourly_welfare_allowance) || 0;
                payload.hourly_child_allowance = parseFloat(values.hourly_child_allowance) || 0;
                payload.hourly_seniority_allowance = parseFloat(values.hourly_seniority_allowance) || 0;
                payload.hourly_bonus = parseFloat(values.hourly_bonus) || 0;
                payload.hourly_leave_salary = parseFloat(values.hourly_leave_salary) || 0;
                payload.hourly_performance_bonus = parseFloat(values.hourly_performance_bonus) || 0;
                payload.transportation_allowance = parseFloat(values.transportation_allowance) || 0;
            } else if (parseInt(values.contract_type) === 3) {
                payload.contract_amount = parseFloat(values.contract_amount) || 0;
                payload.contract_payment_type = values.contract_payment_type || 'daily';
                payload.responsibility_allowance = parseFloat(values.responsibility_allowance) || 0;
                payload.performance_bonus = parseFloat(values.performance_bonus) || 0;
                payload.transportation_allowance = parseFloat(values.transportation_allowance) || 0;
            }

            const res = await api(`hrm-contract/${id}`, "PATCH", payload);

            if (res?.success) {
                toast.success("قرارداد با موفقیت ویرایش شد");
                navigate("/hrm/contract/create");
            } else {
                toast.error(res?.message || "خطا در ویرایش قرارداد");
                if (res?.errors) {
                    console.error("Validation errors:", res.errors);
                }
            }
        } catch (error) {
            console.error("Error updating contract:", error);
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

    if (loadingData) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loading />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* هدر */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        onClick={() => navigate("/hrm/contract/create")}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        بازگشت
                    </Button>
                    <h2 className="text-lg font-semibold">ویرایش قرارداد</h2>
                    {contract && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${contract.contract_status === STATUS.DRAFT ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                            {contract.contract_status === STATUS.DRAFT ? 'پیش‌نویس' : 'تایید شده'}
                        </span>
                    )}
                </div>
                <span className="text-sm text-gray-500">شماره قرارداد: {id}</span>
            </div>

            {/* فرم ویرایش */}
            <form onSubmit={formik.handleSubmit} className="space-y-6">
                {/* مرحله 1: اطلاعات پایه */}
                <BaseInfoStep
                    formik={formik}
                    onContractTypeChange={handleContractTypeChange}
                />

                {/* مراحل بعدی - فقط در صورت کامل بودن اطلاعات پایه */}
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

                {/* پیام راهنما */}
                {!isBaseInfoComplete && (
                    <div className="text-center py-6 text-gray-400 text-sm bg-gray-50 rounded-lg border border-dashed">
                        <p>لطفاً کارفرما، نوع و حالت قرارداد را انتخاب کنید تا فیلدهای مربوطه نمایش داده شوند</p>
                    </div>
                )}

                {/* دکمه‌ها */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate("/hrm/contract")}
                    >
                        انصراف
                    </Button>
                    <Button
                        type="submit"
                        isLoading={loading}
                        disabled={!formik.isValid || !isBaseInfoComplete || loading || contract?.contract_status !== STATUS.DRAFT}
                        className="flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        بروزرسانی
                    </Button>
                </div>
            </form>
        </div>
    );
}