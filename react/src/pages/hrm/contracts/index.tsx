// src/pages/hrm/contracts/index.jsx

import { useFormik } from "formik";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/inputs";
import Select from "@/components/shared/inputs/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/shared/Loading";
import Empty from "@/components/shared/Empty";
import Pagination from "@/components/shared/Pagination";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PenBox, Trash2Icon, CheckCircle, Search, X, FileText, CalendarSync, Eye, Printer, RotateCcw } from "lucide-react";
import Confirm from "@/components/ui/confirm";
import { checkAccess, formatDateToFa, formatDateToEn } from "@/lib/utils";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import { useNavigate } from 'react-router-dom';
// ============== وضعیت‌های قرارداد ==============
const CONTRACT_STATUS = {
    DRAFT: 0,
    ACTIVE: 1,
    EXPIRED: 2,
    CANCELLED: 3,
};

const STATUS_LABELS = {
    0: 'پیش‌نویس',
    1: 'تایید شده',
    2: 'منقضی',
    3: 'لغو شده',
};

const STATUS_COLORS = {
    0: 'bg-yellow-100 text-yellow-700',
    1: 'bg-green-100 text-green-700',
    2: 'bg-red-100 text-red-700',
    3: 'bg-gray-100 text-gray-700',
};

const CONTRACT_TYPES = {
    TEMPORARY: 1,
    HOURLY: 2,
    PROJECT: 3,
};

// ============== Validation Schema ==============
const contractValidationSchema = yup.object({
    title: yup.string().nullable(),
    contract_type: yup.string().required("نوع قرارداد الزامی است"),
    contract_mode: yup.string().nullable(),
    employer_id: yup.string().nullable(),
    user_id: yup.string().required("انتخاب پرسنل الزامی است"),
    person_type: yup.string().nullable(),
    first_name: yup.string().nullable(),
    last_name: yup.string().nullable(),
    father_name: yup.string().nullable(),
    national_code: yup.string().nullable(),
    shenasname_number: yup.string().nullable(),
    shenasname_city: yup.string().nullable(),
    birth_date: yup.string().nullable(),
    marital_status: yup.string().nullable(),
    gender: yup.string().nullable(),
    address: yup.string().nullable(),
    postal_code: yup.string().nullable(),
    phone: yup.string().nullable(),
    mobile: yup.string().nullable(),
    state_id: yup.string().nullable(),
    city_id: yup.string().nullable(),
    has_introducer: yup.boolean().default(false),
    introducer_first_name: yup.string().nullable(),
    introducer_last_name: yup.string().nullable(),
    introducer_phone: yup.string().nullable(),
    introducer_mobile: yup.string().nullable(),
    introducer_relation: yup.string().nullable(),
    introducer_address: yup.string().nullable(),
    contract_duration_months: yup.number().nullable(),
    contract_duration_days: yup.number().nullable(),
    contract_from_date: yup.string().nullable(),
    contract_to_date: yup.string().nullable(),
    contract_unvalid_date: yup.string().nullable(),
    has_trial_period: yup.boolean().default(false),
    trial_from_date: yup.string().nullable(),
    trial_to_date: yup.string().nullable(),
    job_position_id: yup.string().nullable(),
    description: yup.string().nullable(),
    // فیلدهای نوع موقت
    base_salary: yup.number().nullable(),
    child_allowance: yup.number().nullable(),
    housing_allowance: yup.number().nullable(),
    welfare_allowance: yup.number().nullable(),
    seniority_allowance: yup.number().nullable(),
    performance_bonus: yup.number().nullable(),
    responsibility_allowance: yup.number().nullable(),
    transportation_allowance: yup.number().nullable(),
    other_allowance: yup.number().nullable(),
    // فیلدهای نوع ساعتی
    hourly_salary: yup.number().nullable(),
    hourly_housing_allowance: yup.number().nullable(),
    hourly_welfare_allowance: yup.number().nullable(),
    hourly_child_allowance: yup.number().nullable(),
    hourly_seniority_allowance: yup.number().nullable(),
    hourly_bonus: yup.number().nullable(),
    hourly_leave_salary: yup.number().nullable(),
    hourly_performance_bonus: yup.number().nullable(),
    minimum_hours: yup.number().nullable(),
    minimum_hours_period: yup.number().nullable(),
    service_subject: yup.string().nullable(),
    agreement_date: yup.string().nullable(),
    // فیلدهای نوع پیمانکاری
    contract_amount: yup.number().nullable(),
    contract_payment_type: yup.string().nullable(),
});

export default function Contracts() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [viewingItem, setViewingItem] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [data, setData] = useState({ data: [], pages: 0, totalCount: 0 });
    const [financialYear, setFinancialYear] = useState(null);

    const [users, setUsers] = useState([]);
    const [employers, setEmployers] = useState([]);
    const [jobPositions, setJobPositions] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [contractTypes, setContractTypes] = useState([]);
    const [contractModes, setContractModes] = useState([]);
    const [maritalStatuses, setMaritalStatuses] = useState([]);
    const [genders, setGenders] = useState([]);

    const [selectedContractType, setSelectedContractType] = useState('');
    const [showIntroducer, setShowIntroducer] = useState(false);
    const [showTrialPeriod, setShowTrialPeriod] = useState(false);

    const [filters, setFilters] = useState({
        user_id: searchParams.get("user_id") || "",
        contract_type: searchParams.get("contract_type") || "",
        contract_status: searchParams.get("contract_status") !== null ? searchParams.get("contract_status") : "",
        national_code: searchParams.get("national_code") || "",
        first_name: searchParams.get("first_name") || "",
        last_name: searchParams.get("last_name") || "",
    });

    // ============== دریافت سال مالی فعال ==============
    const fetchActiveFinancialYear = async () => {
        try {
            const res = await api("hrm-financial-year/active", "GET");
            if (res?.success && res?.data) {
                setFinancialYear(res.data);
                return res.data;
            }
            return null;
        } catch (error) {
            console.error("Error fetching financial year:", error);
            return null;
        }
    };

    // ============== دریافت اطلاعات ==============
    const fetchData = async () => {
        const params = new URLSearchParams();

        if (filters.user_id) params.set("user_id", filters.user_id);
        if (filters.contract_type) params.set("contract_type", filters.contract_type);
        if (filters.contract_status !== "") params.set("contract_status", filters.contract_status);
        if (filters.national_code) params.set("national_code", filters.national_code);
        if (filters.first_name) params.set("first_name", filters.first_name);
        if (filters.last_name) params.set("last_name", filters.last_name);

        const page = searchParams.get("page");
        const perPage = searchParams.get("per-page");
        if (page) params.set("page", page);
        if (perPage) params.set("per-page", perPage);

        const query = params.toString();

        setListLoading(true);
        try {
            const res = await api(`hrm-contract?${query}`, "GET");
            setData(res || { data: [], pages: 0, totalCount: 0 });
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("خطا در دریافت اطلاعات");
        }
        setListLoading(false);
    };

    // ============== دریافت لیست‌های کمکی ==============
    const fetchOptions = async () => {
        try {
            const [usersRes, employersRes, positionsRes, statesRes, typesRes, modesRes, maritalRes, gendersRes] = await Promise.all([
                api("user?per-page=100", "GET"),
                api("hrm-contract/employers", "GET"),
                api("hrm-contract/job-positions", "GET"),
                api("hrm-contract/states", "GET"),
                api("hrm-contract/types", "GET"),
                api("hrm-contract/modes", "GET"),
                api("hrm-contract/marital-statuses", "GET"),
                api("hrm-contract/genders", "GET"),
            ]);

            if (usersRes?.data) setUsers(usersRes.data);
            if (employersRes?.data) setEmployers(employersRes.data);
            if (positionsRes?.data) setJobPositions(positionsRes.data);
            if (statesRes?.data) setStates(statesRes.data);
            if (typesRes?.data) setContractTypes(typesRes.data);
            if (modesRes?.data) setContractModes(modesRes.data);
            if (maritalRes?.data) setMaritalStatuses(maritalRes.data);
            if (gendersRes?.data) setGenders(gendersRes.data);
        } catch (error) {
            console.error("Error fetching options:", error);
            toast.error("خطا در دریافت اطلاعات");
        }
    };

    // ============== دریافت شهرها بر اساس استان ==============
    const fetchCities = async (stateId) => {
        if (!stateId) {
            setCities([]);
            return;
        }
        try {
            const res = await api(`hrm-contract/cities?stateId=${stateId}`, "GET");
            if (res?.data) setCities(res.data);
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    };

    // ============== فیلترها ==============
    const handleFilterSelectChange = (name, selectedOption) => {
        const value = selectedOption?.value || "";
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => fetchData();

    const handleClearFilters = () => {
        setFilters({
            user_id: "",
            contract_type: "",
            contract_status: "",
            national_code: "",
            first_name: "",
            last_name: "",
        });
        setSearchParams({});
        setTimeout(() => fetchData(), 100);
    };

    useEffect(() => {
        const timer = setTimeout(() => fetchData(), 300);
        return () => clearTimeout(timer);
    }, [filters]);

    useEffect(() => {
        fetchData();
        fetchOptions();
        fetchActiveFinancialYear();
    }, []);

    // ============== فرم ==============
    const getInitialValues = () => {
        const base = {
            title: "",
            contract_type: "",
            contract_mode: "",
            employer_id: "",
            user_id: "",
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
            state_id: "",
            city_id: "",
            has_introducer: false,
            introducer_first_name: "",
            introducer_last_name: "",
            introducer_phone: "",
            introducer_mobile: "",
            introducer_relation: "",
            introducer_address: "",
            contract_duration_months: "",
            contract_duration_days: "",
            contract_from_date: "",
            contract_to_date: "",
            contract_unvalid_date: "",
            has_trial_period: false,
            trial_from_date: "",
            trial_to_date: "",
            job_position_id: "",
            description: "",
            // نوع موقت
            base_salary: financialYear?.salary || "",
            child_allowance: financialYear?.child_allowance || "",
            housing_allowance: financialYear?.housing_benefits || "",
            welfare_allowance: financialYear?.welfare_allowance || "",
            seniority_allowance: "",
            performance_bonus: "",
            responsibility_allowance: "",
            transportation_allowance: "",
            other_allowance: "",
            // نوع ساعتی
            hourly_salary: "",
            hourly_housing_allowance: "",
            hourly_welfare_allowance: "",
            hourly_child_allowance: "",
            hourly_seniority_allowance: "",
            hourly_bonus: "",
            hourly_leave_salary: "",
            hourly_performance_bonus: "",
            minimum_hours: "",
            minimum_hours_period: "",
            service_subject: "",
            agreement_date: "",
            // نوع پیمانکاری
            contract_amount: "",
            contract_payment_type: "daily",
        };

        return base;
    };

    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: contractValidationSchema,
        onSubmit: handleSubmit,
        validateOnChange: true,
        validateOnMount: true,
        enableReinitialize: true,
    });

    // ============== پر کردن از سال مالی ==============
    const fillFromFinancialYear = async () => {
        const fy = financialYear || await fetchActiveFinancialYear();
        if (!fy) {
            toast.warning("هیچ سال مالی فعالی یافت نشد");
            return;
        }

        const hasValues = formik.values.base_salary > 0 ||
            formik.values.housing_allowance > 0 ||
            formik.values.welfare_allowance > 0;

        if (hasValues) {
            if (!confirm("آیا می‌خواهید مقادیر فعلی با مقادیر سال مالی جایگزین شوند؟")) {
                return;
            }
        }

        formik.setValues({
            ...formik.values,
            base_salary: fy.salary || 0,
            child_allowance: fy.child_allowance || 0,
            housing_allowance: fy.housing_benefits || 0,
            welfare_allowance: fy.welfare_allowance || 0,
        });

        toast.success("مقادیر از سال مالی با موفقیت پر شد");
    };

    // ============== تغییر نوع قرارداد ==============
    const handleContractTypeChange = (selectedOption) => {
        const value = selectedOption?.value || "";
        setSelectedContractType(value);
        formik.setFieldValue("contract_type", value);
    };

    // ============== ویرایش ==============
    const handleEdit = async (item) => {
        if (item.contract_status !== CONTRACT_STATUS.DRAFT) {
            toast.warning("این قرارداد تایید شده است و قابل ویرایش نمی‌باشد");
            return;
        }

        setEditingItem(item);
        setSelectedContractType(String(item.contract_type));
        setShowIntroducer(item.has_introducer === 1);
        setShowTrialPeriod(item.has_trial_period === 1);

        const fy = financialYear || await fetchActiveFinancialYear();

        const formatDate = (date) => date || "";

        const values = {
            title: item.title || "",
            contract_type: String(item.contract_type || ""),
            contract_mode: item.contract_mode || "",
            employer_id: item.employer_id || "",
            user_id: item.user_id || "",
            person_type: item.person_type || "1",
            first_name: item.first_name || "",
            last_name: item.last_name || "",
            father_name: item.father_name || "",
            national_code: item.national_code || "",
            shenasname_number: item.shenasname_number || "",
            shenasname_city: item.shenasname_city || "",
            birth_date: formatDate(item.birth_date_persian),
            marital_status: item.marital_status || "",
            gender: item.gender || "",
            address: item.address || "",
            postal_code: item.postal_code || "",
            phone: item.phone || "",
            mobile: item.mobile || "",
            state_id: item.state_id || "",
            city_id: item.city_id || "",
            has_introducer: item.has_introducer === 1,
            introducer_first_name: item.introducer_first_name || "",
            introducer_last_name: item.introducer_last_name || "",
            introducer_phone: item.introducer_phone || "",
            introducer_mobile: item.introducer_mobile || "",
            introducer_relation: item.introducer_relation || "",
            introducer_address: item.introducer_address || "",
            contract_duration_months: item.contract_duration_months || "",
            contract_duration_days: item.contract_duration_days || "",
            contract_from_date: formatDate(item.contract_from_date_persian),
            contract_to_date: formatDate(item.contract_to_date_persian),
            contract_unvalid_date: formatDate(item.contract_unvalid_date_persian),
            has_trial_period: item.has_trial_period === 1,
            trial_from_date: formatDate(item.trial_from_date_persian),
            trial_to_date: formatDate(item.trial_to_date_persian),
            job_position_id: item.job_position_id || "",
            description: item.description || "",
            // نوع موقت
            base_salary: item.base_salary || fy?.salary || "",
            child_allowance: item.child_allowance || fy?.child_allowance || "",
            housing_allowance: item.housing_allowance || fy?.housing_benefits || "",
            welfare_allowance: item.welfare_allowance || fy?.welfare_allowance || "",
            seniority_allowance: item.seniority_allowance || "",
            performance_bonus: item.performance_bonus || "",
            responsibility_allowance: item.responsibility_allowance || "",
            transportation_allowance: item.transportation_allowance || "",
            other_allowance: item.other_allowance || "",
            // نوع ساعتی
            hourly_salary: item.hourly_salary || "",
            hourly_housing_allowance: item.hourly_housing_allowance || "",
            hourly_welfare_allowance: item.hourly_welfare_allowance || "",
            hourly_child_allowance: item.hourly_child_allowance || "",
            hourly_seniority_allowance: item.hourly_seniority_allowance || "",
            hourly_bonus: item.hourly_bonus || "",
            hourly_leave_salary: item.hourly_leave_salary || "",
            hourly_performance_bonus: item.hourly_performance_bonus || "",
            minimum_hours: item.minimum_hours || "",
            minimum_hours_period: item.minimum_hours_period || "",
            service_subject: item.service_subject || "",
            agreement_date: formatDate(item.agreement_date_persian),
            // نوع پیمانکاری
            contract_amount: item.contract_amount || "",
            contract_payment_type: item.contract_payment_type || "daily",
        };

        formik.setValues(values);

        if (item.state_id) {
            fetchCities(item.state_id);
        }
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        setSelectedContractType('');
        setShowIntroducer(false);
        setShowTrialPeriod(false);
        formik.resetForm();
        setCities([]);
    };

    // ============== مشاهده جزئیات ==============
    const handleView = (item) => {
        setViewingItem(item);
        setShowViewModal(true);
    };
    const navigate = useNavigate();
    const handleCloseViewModal = () => {
        setShowViewModal(false);
        setViewingItem(null);
    };

    // ============== محاسبات ==============
    const calculateTotalSalary = (values) => {
        const fields = [
            'base_salary', 'child_allowance', 'housing_allowance', 'welfare_allowance',
            'seniority_allowance', 'performance_bonus', 'responsibility_allowance',
            'transportation_allowance', 'other_allowance'
        ];
        return fields.reduce((total, field) => total + (parseFloat(values[field]) || 0), 0);
    };

    const calculateHourlyTotal = (values) => {
        const fields = [
            'hourly_salary', 'hourly_housing_allowance', 'hourly_welfare_allowance',
            'hourly_child_allowance', 'hourly_seniority_allowance', 'hourly_bonus',
            'hourly_leave_salary', 'hourly_performance_bonus'
        ];
        return fields.reduce((total, field) => total + (parseFloat(values[field]) || 0), 0);
    };

    // ============== ثبت ==============
    async function handleSubmit(values) {
        setLoading(true);

        const url = editingItem
            ? `hrm-contract/${editingItem.id}`
            : "hrm-contract";

        const payload = {
            title: values.title || null,
            contract_type: parseInt(values.contract_type),
            contract_mode: values.contract_mode ? parseInt(values.contract_mode) : null,
            employer_id: values.employer_id ? parseInt(values.employer_id) : null,
            user_id: parseInt(values.user_id),
            person_type: parseInt(values.person_type),
            first_name: values.first_name || null,
            last_name: values.last_name || null,
            father_name: values.father_name || null,
            national_code: values.national_code || null,
            shenasname_number: values.shenasname_number || null,
            shenasname_city: values.shenasname_city || null,
            birth_date: values.birth_date ? formatDateToEn(values.birth_date) : null,
            marital_status: values.marital_status ? parseInt(values.marital_status) : null,
            gender: values.gender ? parseInt(values.gender) : null,
            address: values.address || null,
            postal_code: values.postal_code || null,
            phone: values.phone || null,
            mobile: values.mobile || null,
            state_id: values.state_id ? parseInt(values.state_id) : null,
            city_id: values.city_id ? parseInt(values.city_id) : null,
            has_introducer: values.has_introducer ? 1 : 0,
            introducer_first_name: values.introducer_first_name || null,
            introducer_last_name: values.introducer_last_name || null,
            introducer_phone: values.introducer_phone || null,
            introducer_mobile: values.introducer_mobile || null,
            introducer_relation: values.introducer_relation || null,
            introducer_address: values.introducer_address || null,
            contract_duration_months: parseInt(values.contract_duration_months) || 0,
            contract_duration_days: parseInt(values.contract_duration_days) || 0,
            contract_from_date: values.contract_from_date ? formatDateToEn(values.contract_from_date) : null,
            contract_to_date: values.contract_to_date ? formatDateToEn(values.contract_to_date) : null,
            contract_unvalid_date: values.contract_unvalid_date ? formatDateToEn(values.contract_unvalid_date) : null,
            has_trial_period: values.has_trial_period ? 1 : 0,
            trial_from_date: values.trial_from_date ? formatDateToEn(values.trial_from_date) : null,
            trial_to_date: values.trial_to_date ? formatDateToEn(values.trial_to_date) : null,
            job_position_id: values.job_position_id ? parseInt(values.job_position_id) : null,
            description: values.description || null,
            contract_status: CONTRACT_STATUS.DRAFT,
        };

        const contractType = parseInt(values.contract_type);

        // فیلدهای اختصاصی بر اساس نوع قرارداد
        if (contractType === CONTRACT_TYPES.TEMPORARY) {
            payload.base_salary = parseFloat(values.base_salary) || 0;
            payload.child_allowance = parseFloat(values.child_allowance) || 0;
            payload.housing_allowance = parseFloat(values.housing_allowance) || 0;
            payload.welfare_allowance = parseFloat(values.welfare_allowance) || 0;
            payload.seniority_allowance = parseFloat(values.seniority_allowance) || 0;
            payload.performance_bonus = parseFloat(values.performance_bonus) || 0;
            payload.responsibility_allowance = parseFloat(values.responsibility_allowance) || 0;
            payload.transportation_allowance = parseFloat(values.transportation_allowance) || 0;
            payload.other_allowance = parseFloat(values.other_allowance) || 0;
            payload.total_salary = calculateTotalSalary(values);
        } else if (contractType === CONTRACT_TYPES.HOURLY) {
            payload.hourly_salary = parseFloat(values.hourly_salary) || 0;
            payload.hourly_housing_allowance = parseFloat(values.hourly_housing_allowance) || 0;
            payload.hourly_welfare_allowance = parseFloat(values.hourly_welfare_allowance) || 0;
            payload.hourly_child_allowance = parseFloat(values.hourly_child_allowance) || 0;
            payload.hourly_seniority_allowance = parseFloat(values.hourly_seniority_allowance) || 0;
            payload.hourly_bonus = parseFloat(values.hourly_bonus) || 0;
            payload.hourly_leave_salary = parseFloat(values.hourly_leave_salary) || 0;
            payload.hourly_performance_bonus = parseFloat(values.hourly_performance_bonus) || 0;
            payload.transportation_allowance = parseFloat(values.transportation_allowance) || 0;
            payload.minimum_hours = parseInt(values.minimum_hours) || 0;
            payload.minimum_hours_period = parseInt(values.minimum_hours_period) || 0;
            payload.service_subject = values.service_subject || null;
            payload.agreement_date = values.agreement_date ? formatDateToEn(values.agreement_date) : null;
            payload.total_salary = calculateHourlyTotal(values);
        } else if (contractType === CONTRACT_TYPES.PROJECT) {
            payload.contract_amount = parseFloat(values.contract_amount) || 0;
            payload.contract_payment_type = values.contract_payment_type || 'daily';
            payload.responsibility_allowance = parseFloat(values.responsibility_allowance) || 0;
            payload.performance_bonus = parseFloat(values.performance_bonus) || 0;
            payload.transportation_allowance = parseFloat(values.transportation_allowance) || 0;
            payload.minimum_hours = parseInt(values.minimum_hours) || 0;
            payload.minimum_hours_period = parseInt(values.minimum_hours_period) || 0;
            payload.service_subject = values.service_subject || null;
            payload.agreement_date = values.agreement_date ? formatDateToEn(values.agreement_date) : null;
            payload.total_salary = parseFloat(values.contract_amount) || 0;
        }

        const res = await api(url, editingItem ? "PATCH" : "POST", payload);

        setLoading(false);

        if (res?.success) {
            toast.success(editingItem ? "قرارداد با موفقیت ویرایش شد" : "قرارداد با موفقیت ثبت شد");
            setEditingItem(null);
            setSelectedContractType('');
            setShowIntroducer(false);
            setShowTrialPeriod(false);
            formik.resetForm();
            setCities([]);
            fetchData();
        } else {
            toast.error(res?.message || "خطا در ثبت اطلاعات");
        }
    }

    // ============== حذف ==============
    const handleDelete = async (id) => {
        const res = await api(`hrm-contract/${id}`, "DELETE");
        if (res?.success) {
            toast.success("قرارداد با موفقیت حذف شد");
            fetchData();
        } else {
            toast.error(res?.message || "خطا در حذف");
        }
    };

    // ============== تایید ==============
    const handleApprove = async (id) => {
        if (!confirm('آیا از تایید این قرارداد اطمینان دارید؟ پس از تایید، قرارداد قابل ویرایش نخواهد بود.')) {
            return;
        }

        setLoading(true);
        try {
            const res = await api(`hrm-contract/${id}/approve`, "POST");
            if (res?.success) {
                toast.success("قرارداد با موفقیت تایید شد");
                fetchData();
                setEditingItem(null);
            } else {
                toast.error(res?.message || "خطا در تایید");
            }
        } catch (error) {
            toast.error("خطا در ارتباط با سرور");
        }
        setLoading(false);
    };

    // ============== تبدیل داده‌ها برای Select ==============
    const mapToOptions = (data, labelKey = 'name') =>
        data?.map(item => ({ value: String(item.id), label: item[labelKey] || item.name })) || [];

    const userOptions = users.map((item) => ({
        value: String(item.id),
        label: `${item.first_name || ''} ${item.last_name || ''}`.trim() || item.phone_number || item.email || `کاربر ${item.id}`,
    }));

    const employerOptions = mapToOptions(employers);
    const jobPositionOptions = mapToOptions(jobPositions);
    const stateOptions = mapToOptions(states);
    const cityOptions = mapToOptions(cities);
    const contractTypeOptions = mapToOptions(contractTypes);
    const contractModeOptions = mapToOptions(contractModes);
    const maritalStatusOptions = mapToOptions(maritalStatuses);
    const genderOptions = mapToOptions(genders);

    const contractStatusOptions = [
        { value: "", label: "همه وضعیت‌ها" },
        { value: "0", label: "پیش‌نویس" },
        { value: "1", label: "تایید شده" },
        { value: "2", label: "منقضی" },
        { value: "3", label: "لغو شده" },
    ];

    const personTypeOptions = [
        { value: "1", label: "حقیقی" },
        { value: "2", label: "حقوقی" },
    ];

    const contractPaymentTypeOptions = [
        { value: "daily", label: "هر روز" },
        { value: "weekly", label: "هر هفته" },
        { value: "monthly", label: "هر ماه" },
    ];

    // ============== فرمت‌کننده اعداد ==============
    const formatNumber = (num) => {
        if (!num) return "۰";
        return new Intl.NumberFormat("fa-IR").format(num);
    };

    // ============== رندر فیلدهای اختصاصی ==============
    const renderSpecificFields = () => {
        const contractType = parseInt(formik.values.contract_type);

        if (contractType === CONTRACT_TYPES.TEMPORARY) {
            return (
                <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-bold text-gray-700">حق‌السعی</h3>
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={fillFromFinancialYear}
                                className="text-xs flex items-center gap-1"
                            >
                                <CalendarSync className="w-3 h-3" />
                                پر کردن از سال مالی
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Input type="number" name="base_salary" title="مزد ماهانه (ریال)" formik={formik} placeholder="مثال: ۸,۱۲۱,۶۴۵" />
                            <Input type="number" name="child_allowance" title="حق اولاد (ریال)" formik={formik} placeholder="حق اولاد" />
                            <Input type="number" name="housing_allowance" title="کمک هزینه مسکن (ریال)" formik={formik} placeholder="کمک هزینه مسکن" />
                            <Input type="number" name="welfare_allowance" title="مزایای رفاهی و انگیزشی (ریال)" formik={formik} placeholder="مزایای رفاهی" />
                            <Input type="number" name="seniority_allowance" title="حق سنوات (ریال)" formik={formik} placeholder="حق سنوات" />
                            <Input type="number" name="performance_bonus" title="پاداش عملکرد (ریال)" formik={formik} placeholder="پاداش عملکرد" />
                            <Input type="number" name="responsibility_allowance" title="حق مسئولیت (ریال)" formik={formik} placeholder="حق مسئولیت" />
                            <Input type="number" name="transportation_allowance" title="کمک ایاب و ذهاب (ریال)" formik={formik} placeholder="کمک ایاب و ذهاب" />
                            <Input type="number" name="other_allowance" title="سایر (ریال)" formik={formik} placeholder="سایر" />
                        </div>
                        <div className="mt-3 p-3 bg-blue-100 rounded-md">
                            <span className="text-sm font-medium text-blue-700">
                                مجموع حق‌السعی: {formatNumber(calculateTotalSalary(formik.values))} ریال
                            </span>
                        </div>
                    </div>
                </div>
            );
        }

        if (contractType === CONTRACT_TYPES.HOURLY) {
            return (
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-bold text-gray-700 mb-3">موضوع قرارداد</h3>
                        <Input type="text" name="service_subject" title="خدمات" formik={formik} placeholder="موضوع خدمات" />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-bold text-gray-700 mb-3">نوع و مدت قرارداد</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">تاریخ توافق قرارداد</label>
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
                            <div className="flex items-end gap-2">
                                <div className="flex-1">
                                    <Input type="number" name="minimum_hours" title="حداقل کارکرد (ساعت)" formik={formik} placeholder="ساعت" min={0} />
                                </div>
                                <div className="flex-1">
                                    <Input type="number" name="minimum_hours_period" title="در هفته" formik={formik} placeholder="هفته" min={0} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-sm font-bold text-gray-700 mb-3">حق‌السعی</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Input type="number" name="hourly_salary" title="مزد ساعتی با احتساب تعطیلات هفتگی" formik={formik} placeholder="ریال به ازای هر ساعت" />
                            <Input type="number" name="hourly_housing_allowance" title="کمک هزینه مسکن" formik={formik} placeholder="ریال به ازای هر ساعت" />
                            <Input type="number" name="hourly_welfare_allowance" title="مزایای رفاهی و انگیزشی" formik={formik} placeholder="ریال به ازای هر ساعت" />
                            <Input type="number" name="hourly_child_allowance" title="حق اولاد" formik={formik} placeholder="ریال به ازای هر ساعت" />
                            <Input type="number" name="hourly_seniority_allowance" title="حق سنوات" formik={formik} placeholder="ریال به ازای هر ساعت" />
                            <Input type="number" name="hourly_bonus" title="حق عیدی و پاداش" formik={formik} placeholder="ریال به ازای هر ساعت" />
                            <Input type="number" name="hourly_leave_salary" title="مزد مرخصی بابت هر یک ساعت کار" formik={formik} placeholder="ریال به ازای هر ساعت" />
                            <Input type="number" name="hourly_performance_bonus" title="پاداش عملکرد" formik={formik} placeholder="ریال به ازای هر ساعت" />
                            <Input type="number" name="transportation_allowance" title="کمک ایاب و ذهاب" formik={formik} placeholder="ریال" />
                        </div>
                        <div className="mt-3 p-3 bg-blue-100 rounded-md">
                            <span className="text-sm font-medium text-blue-700">
                                مجموع حق‌السعی: {formatNumber(calculateHourlyTotal(formik.values))} ریال به ازای هر ساعت
                            </span>
                        </div>
                    </div>
                </div>
            );
        }

        if (contractType === CONTRACT_TYPES.PROJECT) {
            return (
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-bold text-gray-700 mb-3">موضوع قرارداد</h3>
                        <Input type="text" name="service_subject" title="خدمات" formik={formik} placeholder="موضوع خدمات" />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-bold text-gray-700 mb-3">نوع و مدت قرارداد</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">تاریخ توافق قرارداد</label>
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
                            <div className="flex items-end gap-2">
                                <div className="flex-1">
                                    <Input type="number" name="minimum_hours" title="حداقل کارکرد (ساعت)" formik={formik} placeholder="ساعت" min={0} />
                                </div>
                                <div className="flex-1">
                                    <Input type="number" name="minimum_hours_period" title="در هفته" formik={formik} placeholder="هفته" min={0} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-sm font-bold text-gray-700 mb-3">حق‌السعی</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Input type="number" name="contract_amount" title="مبلغ قرارداد" formik={formik} placeholder="ریال" />
                            <Select
                                name="contract_payment_type"
                                title="دوره پرداخت"
                                formik={formik}
                                options={contractPaymentTypeOptions}
                                placeholder="انتخاب دوره"
                                value={contractPaymentTypeOptions.find(opt => opt.value === formik.values.contract_payment_type)}
                                onChange={(selectedOption) => {
                                    formik.setFieldValue("contract_payment_type", selectedOption?.value || "daily");
                                }}
                            />
                            <Input type="number" name="responsibility_allowance" title="حق مسئولیت" formik={formik} placeholder="ریال" />
                            <Input type="number" name="performance_bonus" title="پاداش عملکرد" formik={formik} placeholder="ریال" />
                            <Input type="number" name="transportation_allowance" title="کمک ایاب و ذهاب" formik={formik} placeholder="ریال" />
                        </div>
                        <div className="mt-3 p-3 bg-blue-100 rounded-md">
                            <span className="text-sm font-medium text-blue-700">
                                مبلغ قرارداد: {formatNumber(formik.values.contract_amount)} ریال
                            </span>
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    };

    // ============== ستون‌های لیست ==============
    const columns = ["ردیف", "عنوان", "پرسنل", "نوع قرارداد", "وضعیت", "تاریخ شروع", "تاریخ پایان", "مبلغ", "عملیات"];

    // ============== رندر ==============
    return (
        <div className="w-full space-y-4">
            {/* ========== فرم ثبت/ویرایش ========== */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            {editingItem ? "ویرایش قرارداد" : "ثبت قرارداد جدید"}
                        </div>
                        {editingItem && (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[editingItem.contract_status] || 'bg-gray-100'}`}>
                                {STATUS_LABELS[editingItem.contract_status] || 'نامشخص'}
                            </span>
                        )}
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form className="w-full space-y-6" onSubmit={formik.handleSubmit}>
                        {/* ===== اطلاعات پایه ===== */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-bold text-gray-700 mb-3">اطلاعات پایه</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Input type="text" name="title" title="عنوان قرارداد" formik={formik} placeholder="مثال: قرارداد شماره ۱" />
                                <Select
                                    name="contract_type"
                                    title="نوع قرارداد"
                                    formik={formik}
                                    options={contractTypeOptions}
                                    placeholder="انتخاب نوع قرارداد"
                                    required
                                    value={contractTypeOptions.find(opt => opt.value === formik.values.contract_type)}
                                    onChange={handleContractTypeChange}
                                    disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT}
                                />
                                <Select
                                    name="contract_mode"
                                    title="حالت قراردادی"
                                    formik={formik}
                                    options={contractModeOptions}
                                    placeholder="انتخاب حالت قراردادی"
                                    onChange={(selectedOption) => {
                                        formik.setFieldValue("contract_mode", selectedOption?.value || "");
                                    }}
                                    disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT}
                                />
                                <Select
                                    name="employer_id"
                                    title="کارفرما"
                                    formik={formik}
                                    options={employerOptions}
                                    placeholder="انتخاب کارفرما"
                                    onChange={(selectedOption) => {
                                        formik.setFieldValue("employer_id", selectedOption?.value || "");
                                    }}
                                    disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT}
                                />
                            </div>
                        </div>

                        {/* ===== مشخصات پرسنل ===== */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-bold text-gray-700 mb-3">مشخصات پرسنل</h3>

                            {(() => {
                                const contractType = parseInt(formik.values.contract_type);

                                // فیلدهای مشترک بین همه نوع‌ها
                                const commonFields = (
                                    <>
                                        <Select
                                            name="person_type"
                                            title="شخصیت"
                                            formik={formik}
                                            options={personTypeOptions}
                                            placeholder="انتخاب شخصیت"
                                            onChange={(selectedOption) => {
                                                formik.setFieldValue("person_type", selectedOption?.value || "");
                                            }}
                                            disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT}
                                        />
                                        <Input type="text" name="first_name" title="نام" formik={formik} placeholder="نام" disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                                        <Input type="text" name="last_name" title="نام خانوادگی" formik={formik} placeholder="نام خانوادگی" disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                                        <Input type="text" name="father_name" title="نام پدر" formik={formik} placeholder="نام پدر" disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                                        <Input type="text" name="national_code" title="کد ملی" formik={formik} placeholder="کد ملی" disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                                        <Input type="text" name="shenasname_number" title="شماره شناسنامه" formik={formik} placeholder="شماره شناسنامه" disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                                        <Input type="text" name="shenasname_city" title="محل صدور" formik={formik} placeholder="محل صدور" disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                                    </>
                                );

                                // ===== نوع موقت =====
                                if (contractType === CONTRACT_TYPES.TEMPORARY) {
                                    return (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {commonFields}

                                            {/* فیلدهای اختصاصی نوع موقت */}
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
                                                    placeholder="انتخاب تاریخ"
                                                    disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT}
                                                />
                                            </div>

                                            <Select
                                                name="marital_status"
                                                title="وضعیت تاهل"
                                                formik={formik}
                                                options={maritalStatusOptions}
                                                placeholder="انتخاب وضعیت تاهل"
                                                onChange={(selectedOption) => {
                                                    formik.setFieldValue("marital_status", selectedOption?.value || "");
                                                }}
                                                disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT}
                                            />
                                            <Select
                                                name="gender"
                                                title="جنسیت"
                                                formik={formik}
                                                options={genderOptions}
                                                placeholder="انتخاب جنسیت"
                                                onChange={(selectedOption) => {
                                                    formik.setFieldValue("gender", selectedOption?.value || "");
                                                }}
                                                disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT}
                                            />
                                            <Input type="text" name="address" title="آدرس کامل پستی" formik={formik} placeholder="آدرس کامل" disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                                            <Input type="text" name="postal_code" title="کد پستی" formik={formik} placeholder="کد پستی" disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                                            <Input type="text" name="phone" title="تلفن ثابت" formik={formik} placeholder="تلفن ثابت" disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                                            <Input type="text" name="mobile" title="موبایل" formik={formik} placeholder="موبایل" disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                                        </div>
                                    );
                                }

                                // ===== نوع ساعتی =====
                                if (contractType === CONTRACT_TYPES.HOURLY) {
                                    return (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {commonFields}

                                            {/* فیلدهای اختصاصی نوع ساعتی */}
                                            <Input type="text" name="address" title="آدرس کامل پستی" formik={formik} placeholder="آدرس کامل" disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                                            <Input type="text" name="phone" title="تلفن ثابت" formik={formik} placeholder="تلفن ثابت" disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                                            <Input type="text" name="mobile" title="موبایل" formik={formik} placeholder="موبایل" disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                                            <Select
                                                name="gender"
                                                title="جنسیت"
                                                formik={formik}
                                                options={genderOptions}
                                                placeholder="انتخاب جنسیت"
                                                onChange={(selectedOption) => {
                                                    formik.setFieldValue("gender", selectedOption?.value || "");
                                                }}
                                                disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT}
                                            />
                                            <Select
                                                name="marital_status"
                                                title="وضعیت تاهل"
                                                formik={formik}
                                                options={maritalStatusOptions}
                                                placeholder="انتخاب وضعیت تاهل"
                                                onChange={(selectedOption) => {
                                                    formik.setFieldValue("marital_status", selectedOption?.value || "");
                                                }}
                                                disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT}
                                            />
                                        </div>
                                    );
                                }

                                // ===== نوع پیمانکاری =====
                                if (contractType === CONTRACT_TYPES.PROJECT) {
                                    return (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {commonFields}

                                            {/* فیلدهای اختصاصی نوع پیمانکاری */}
                                            <Input type="text" name="address" title="آدرس کامل پستی" formik={formik} placeholder="آدرس کامل" disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                                            <Input type="text" name="phone" title="تلفن ثابت" formik={formik} placeholder="تلفن ثابت" disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                                            <Input type="text" name="mobile" title="موبایل" formik={formik} placeholder="موبایل" disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                                            <Select
                                                name="gender"
                                                title="جنسیت"
                                                formik={formik}
                                                options={genderOptions}
                                                placeholder="انتخاب جنسیت"
                                                onChange={(selectedOption) => {
                                                    formik.setFieldValue("gender", selectedOption?.value || "");
                                                }}
                                                disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT}
                                            />
                                            {/* وضعیت تاهل در نوع پیمانکاری وجود ندارد */}
                                        </div>
                                    );
                                }

                                // حالت پیش‌فرض (هیچ نوعی انتخاب نشده)
                                return (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {commonFields}
                                        <Input type="text" name="address" title="آدرس کامل پستی" formik={formik} placeholder="آدرس کامل" disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                                        <Input type="text" name="phone" title="تلفن ثابت" formik={formik} placeholder="تلفن ثابت" disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                                        <Input type="text" name="mobile" title="موبایل" formik={formik} placeholder="موبایل" disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                                    </div>
                                );
                            })()}
                        </div>
                        {/* ===== محل انجام کار ===== */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-bold text-gray-700 mb-3">محل انجام کار</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Select
                                    name="state_id"
                                    title="استان"
                                    formik={formik}
                                    options={stateOptions}
                                    placeholder="انتخاب استان"
                                    onChange={(selectedOption) => {
                                        const value = selectedOption?.value || "";
                                        formik.setFieldValue("state_id", value);
                                        if (value) {
                                            fetchCities(value);
                                        } else {
                                            setCities([]);
                                            formik.setFieldValue("city_id", "");
                                        }
                                    }}
                                    disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT}
                                />
                                <Select
                                    name="city_id"
                                    title="شهر"
                                    formik={formik}
                                    options={cityOptions}
                                    placeholder="انتخاب شهر"
                                    onChange={(selectedOption) => {
                                        formik.setFieldValue("city_id", selectedOption?.value || "");
                                    }}
                                    disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT}
                                />
                            </div>
                        </div>

                        {/* ===== معرف طرف قرارداد ===== */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-bold text-gray-700 mb-3">معرف طرف قرارداد</h3>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="has_introducer"
                                    checked={showIntroducer}
                                    onChange={(e) => {
                                        setShowIntroducer(e.target.checked);
                                        formik.setFieldValue("has_introducer", e.target.checked);
                                    }}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT}
                                />
                                <label htmlFor="has_introducer" className="text-sm font-medium text-gray-700">
                                    دارای معرف
                                </label>
                            </div>
                            {showIntroducer && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                                    <Input type="text" name="introducer_first_name" title="نام معرف" formik={formik} placeholder="نام" disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                                    <Input type="text" name="introducer_last_name" title="نام خانوادگی معرف" formik={formik} placeholder="نام خانوادگی" disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                                    <Input type="text" name="introducer_phone" title="تلفن معرف" formik={formik} placeholder="تلفن" disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                                    <Input type="text" name="introducer_mobile" title="موبایل معرف" formik={formik} placeholder="موبایل" disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                                    <Input type="text" name="introducer_relation" title="نسبت معرف" formik={formik} placeholder="نسبت" disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                                    <Input type="text" name="introducer_address" title="آدرس معرف" formik={formik} placeholder="آدرس" disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                                </div>
                            )}
                        </div>

                        {/* ===== نوع و مدت قرارداد ===== */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-bold text-gray-700 mb-3">نوع و مدت قرارداد</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Select
                                    name="job_position_id"
                                    title="سمت شغلی"
                                    formik={formik}
                                    options={jobPositionOptions}
                                    placeholder="انتخاب سمت شغلی"
                                    onChange={(selectedOption) => {
                                        formik.setFieldValue("job_position_id", selectedOption?.value || "");
                                    }}
                                    disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT}
                                />
                                <div className="flex items-end gap-2">
                                    <div className="flex-1">
                                        <Input type="number" name="contract_duration_months" title="مدت (ماه)" formik={formik} placeholder="ماه" min={0} disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                                    </div>
                                    <div className="flex-1">
                                        <Input type="number" name="contract_duration_days" title="مدت (روز)" formik={formik} placeholder="روز" min={0} disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">تاریخ شروع</label>
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        value={formik.values.contract_from_date}
                                        onChange={(date) => formik.setFieldValue("contract_from_date", date?.format() || "")}
                                        format="YYYY/MM/DD"
                                        className="w-full"
                                        inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                        placeholder="انتخاب تاریخ"
                                        disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">تاریخ پایان</label>
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        value={formik.values.contract_to_date}
                                        onChange={(date) => formik.setFieldValue("contract_to_date", date?.format() || "")}
                                        format="YYYY/MM/DD"
                                        className="w-full"
                                        inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                        placeholder="انتخاب تاریخ"
                                        disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT}
                                    />
                                </div>
                                {parseInt(formik.values.contract_type) === CONTRACT_TYPES.TEMPORARY && (
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-1">تاریخ عدم اعتبار</label>
                                        <DatePicker
                                            calendar={persian}
                                            locale={persian_fa}
                                            value={formik.values.contract_unvalid_date}
                                            onChange={(date) => formik.setFieldValue("contract_unvalid_date", date?.format() || "")}
                                            format="YYYY/MM/DD"
                                            className="w-full"
                                            inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                            placeholder="انتخاب تاریخ"
                                            disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT}
                                        />
                                    </div>
                                )}
                                {parseInt(formik.values.contract_type) === CONTRACT_TYPES.TEMPORARY && (
                                    <>
                                        <div className="flex items-center gap-3 pt-6">
                                            <input
                                                type="checkbox"
                                                id="has_trial_period"
                                                checked={showTrialPeriod}
                                                onChange={(e) => {
                                                    setShowTrialPeriod(e.target.checked);
                                                    formik.setFieldValue("has_trial_period", e.target.checked);
                                                }}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT}
                                            />
                                            <label htmlFor="has_trial_period" className="text-sm font-medium text-gray-700">
                                                دوره آزمایشی
                                            </label>
                                        </div>
                                        {showTrialPeriod && (
                                            <>
                                                <div className="flex flex-col">
                                                    <label className="text-sm font-medium text-gray-700 mb-1">دوره آزمایشی از</label>
                                                    <DatePicker
                                                        calendar={persian}
                                                        locale={persian_fa}
                                                        value={formik.values.trial_from_date}
                                                        onChange={(date) => formik.setFieldValue("trial_from_date", date?.format() || "")}
                                                        format="YYYY/MM/DD"
                                                        className="w-full"
                                                        inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                                        placeholder="انتخاب تاریخ"
                                                        disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT}
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <label className="text-sm font-medium text-gray-700 mb-1">دوره آزمایشی تا</label>
                                                    <DatePicker
                                                        calendar={persian}
                                                        locale={persian_fa}
                                                        value={formik.values.trial_to_date}
                                                        onChange={(date) => formik.setFieldValue("trial_to_date", date?.format() || "")}
                                                        format="YYYY/MM/DD"
                                                        className="w-full"
                                                        inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                                        placeholder="انتخاب تاریخ"
                                                        disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* ===== فیلدهای اختصاصی ===== */}
                        {formik.values.contract_type && renderSpecificFields()}

                        {/* ===== توضیحات ===== */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <Input type="textarea" name="description" title="توضیحات" formik={formik} placeholder="توضیحات (اختیاری)" rows={3} disabled={editingItem && editingItem.contract_status !== CONTRACT_STATUS.DRAFT} />
                        </div>

                        {/* ===== دکمه‌ها ===== */}
                        {(!editingItem || editingItem.contract_status === CONTRACT_STATUS.DRAFT) && (
                            <div className="flex gap-3">
                                <Button type="submit" isLoading={loading} disabled={!formik.isValid || loading}>
                                    {editingItem ? "ویرایش" : "ثبت"}
                                </Button>
                                {editingItem && (
                                    <Button type="button" variant="secondary" onClick={handleCancelEdit}>
                                        انصراف
                                    </Button>
                                )}
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>

            {/* ========== فیلترها ========== */}
            <Card className="w-full">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">جستجو در قراردادها</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        <Select
                            name="user_id"
                            title="پرسنل"
                            value={userOptions.find(opt => opt.value === filters.user_id) || null}
                            onChange={(selectedOption) => handleFilterSelectChange("user_id", selectedOption)}
                            options={userOptions}
                            placeholder="همه پرسنل"
                            isClearable
                        />
                        <Select
                            name="contract_type"
                            title="نوع قرارداد"
                            value={contractTypeOptions.find(opt => opt.value === filters.contract_type) || null}
                            onChange={(selectedOption) => handleFilterSelectChange("contract_type", selectedOption)}
                            options={contractTypeOptions}
                            placeholder="همه انواع"
                            isClearable
                        />
                        <Select
                            name="contract_status"
                            title="وضعیت"
                            value={contractStatusOptions.find(opt => opt.value === filters.contract_status) || null}
                            onChange={(selectedOption) => handleFilterSelectChange("contract_status", selectedOption)}
                            options={contractStatusOptions}
                            placeholder="همه وضعیت‌ها"
                            isClearable
                        />
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">کد ملی</label>
                            <input
                                type="text"
                                name="national_code"
                                value={filters.national_code || ""}
                                onChange={handleFilterChange}
                                placeholder="کد ملی"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">نام</label>
                            <input
                                type="text"
                                name="first_name"
                                value={filters.first_name || ""}
                                onChange={handleFilterChange}
                                placeholder="نام"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">نام خانوادگی</label>
                            <input
                                type="text"
                                name="last_name"
                                value={filters.last_name || ""}
                                onChange={handleFilterChange}
                                placeholder="نام خانوادگی"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <Button onClick={handleSearch} className="flex items-center gap-2">
                            <Search className="w-4 h-4" />
                            جستجو
                        </Button>
                        <Button variant="secondary" onClick={handleClearFilters} className="flex items-center gap-2">
                            <X className="w-4 h-4" />
                            پاک کردن
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* ========== لیست ========== */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>لیست قراردادها</CardTitle>
                </CardHeader>

                <CardContent>
                    {listLoading ? (
                        <div className="flex justify-center py-10">
                            <Loading />
                        </div>
                    ) : data?.data?.length === 0 ? (
                        <Empty />
                    ) : (
                        <>
                            <div className="w-full overflow-x-auto">
                                <div className="min-w-[1000px]">
                                    <div className="w-full grid grid-cols-9 gap-3 p-3 bg-gray-100 rounded-t-md">
                                        {columns.map((col, i) => (
                                            <div key={i} className="flex items-center justify-center">
                                                <span className="text-xs font-bold text-gray-600">{col}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col border-x border-b rounded-b-md">
                                        {data.data.map((item, index) => (
                                            <div
                                                key={item.id}
                                                className="w-full grid grid-cols-9 gap-3 px-3 py-3 hover:bg-gray-50 border-b last:border-b-0"
                                            >
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs">{index + 1}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs">{item.title || "-"}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs text-center">
                                                        {item?.user?.first_name || ""} {item?.user?.last_name || ""}
                                                        <br />
                                                        <span className="text-gray-400 text-[10px]">({item?.user?.phone_number})</span>
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs">{item.contract_type_label || "-"}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[item.contract_status] || 'bg-gray-100'}`}>
                                                        {STATUS_LABELS[item.contract_status] || "-"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs">{item.contract_from_date_persian || "-"}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs">{item.contract_to_date_persian || "-"}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs">{formatNumber(item.total_salary)}</span>
                                                </div>
                                                <div className="flex items-center justify-center gap-1">
                                                    {/* مشاهده */}
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button className="cursor-pointer hover:text-blue-600" onClick={() => handleView(item)}>
                                                                <Eye className="w-3.5 h-3.5" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>مشاهده</TooltipContent>
                                                    </Tooltip>

                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                className="cursor-pointer hover:text-purple-600"
                                                                onClick={() => navigate(`/hrm/contracts/print/${item.id}`)}
                                                            >
                                                                <Printer className="w-3.5 h-3.5" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>پرینت قرارداد</TooltipContent>
                                                    </Tooltip>
                                                    {/* تایید - فقط پیش‌نویس */}
                                                    {item.contract_status === CONTRACT_STATUS.DRAFT && checkAccess([703]) && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <button className="cursor-pointer hover:text-green-600" onClick={() => handleApprove(item.id)}>
                                                                    <CheckCircle className="w-3.5 h-3.5 text-yellow-500" />
                                                                </button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>تایید قرارداد</TooltipContent>
                                                        </Tooltip>
                                                    )}

                                                    {/* تمدید - فقط تایید شده */}
                                                    {item.contract_status === CONTRACT_STATUS.ACTIVE && checkAccess([701]) && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <button className="cursor-pointer hover:text-blue-600" onClick={() => {
                                                                    if (confirm('آیا از تمدید این قرارداد اطمینان دارید؟')) {
                                                                        api(`hrm-contract/${item.id}/renew`, "POST", {
                                                                            contract_from_date: item.contract_to_date,
                                                                            contract_to_date: item.contract_to_date,
                                                                            contract_duration_months: item.contract_duration_months || 0,
                                                                            contract_duration_days: item.contract_duration_days || 0,
                                                                        }).then(res => {
                                                                            if (res?.success) {
                                                                                toast.success("قرارداد با موفقیت تمدید شد");
                                                                                fetchData();
                                                                            } else {
                                                                                toast.error(res?.message || "خطا در تمدید");
                                                                            }
                                                                        });
                                                                    }
                                                                }}>
                                                                    <RotateCcw className="w-3.5 h-3.5" />
                                                                </button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>تمدید قرارداد</TooltipContent>
                                                        </Tooltip>
                                                    )}

                                                    {/* ویرایش - فقط پیش‌نویس */}
                                                    {item.contract_status === CONTRACT_STATUS.DRAFT && checkAccess([703]) && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <button className="cursor-pointer hover:text-blue-600" onClick={() => handleEdit(item)}>
                                                                    <PenBox className="w-3.5 h-3.5" />
                                                                </button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>ویرایش</TooltipContent>
                                                        </Tooltip>
                                                    )}

                                                    {/* حذف - فقط پیش‌نویس */}
                                                    {item.contract_status === CONTRACT_STATUS.DRAFT && checkAccess([704]) && (
                                                        <Confirm title="حذف قرارداد" onConfirm={() => handleDelete(item.id)}>
                                                            <button className="cursor-pointer hover:text-red-600">
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Trash2Icon className="w-3.5 h-3.5 text-red-500" />
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>حذف</TooltipContent>
                                                                </Tooltip>
                                                            </button>
                                                        </Confirm>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <Pagination totalPage={data.pages} />
                        </>
                    )}
                </CardContent>
            </Card>

            {/* ========== مودال نمایش جزئیات ========== */}
            {showViewModal && viewingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">جزئیات قرارداد</h3>
                            <button onClick={handleCloseViewModal} className="text-gray-500 hover:text-gray-700">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* اطلاعات پایه */}
                            <div className="p-3 bg-gray-50 rounded-md">
                                <span className="text-sm text-gray-600">عنوان قرارداد</span>
                                <p className="font-medium">{viewingItem.title || "-"}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md">
                                <span className="text-sm text-gray-600">نوع قرارداد</span>
                                <p className="font-medium">{viewingItem.contract_type_label || "-"}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md">
                                <span className="text-sm text-gray-600">وضعیت</span>
                                <p className={`font-medium ${STATUS_COLORS[viewingItem.contract_status] || ''}`}>
                                    {STATUS_LABELS[viewingItem.contract_status] || "-"}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md">
                                <span className="text-sm text-gray-600">کارفرما</span>
                                <p className="font-medium">{viewingItem?.employer?.name || "-"}</p>
                            </div>

                            {/* مشخصات پرسنل */}
                            <div className="col-span-full">
                                <h4 className="font-semibold text-sm text-gray-700 border-b pb-2 mb-3">مشخصات پرسنل</h4>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md">
                                <span className="text-sm text-gray-600">نام و نام خانوادگی</span>
                                <p className="font-medium">{viewingItem.first_name || ""} {viewingItem.last_name || ""}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md">
                                <span className="text-sm text-gray-600">کد ملی</span>
                                <p className="font-medium">{viewingItem.national_code || "-"}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md">
                                <span className="text-sm text-gray-600">نام پدر</span>
                                <p className="font-medium">{viewingItem.father_name || "-"}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md">
                                <span className="text-sm text-gray-600">تاریخ تولد</span>
                                <p className="font-medium">{viewingItem.birth_date_persian || "-"}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md">
                                <span className="text-sm text-gray-600">وضعیت تاهل</span>
                                <p className="font-medium">{viewingItem.marital_status_label || "-"}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md">
                                <span className="text-sm text-gray-600">جنسیت</span>
                                <p className="font-medium">{viewingItem.gender_label || "-"}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md">
                                <span className="text-sm text-gray-600">موبایل</span>
                                <p className="font-medium">{viewingItem.mobile || "-"}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md">
                                <span className="text-sm text-gray-600">تلفن ثابت</span>
                                <p className="font-medium">{viewingItem.phone || "-"}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md">
                                <span className="text-sm text-gray-600">آدرس</span>
                                <p className="font-medium">{viewingItem.address || "-"}</p>
                            </div>

                            {/* محل انجام کار */}
                            <div className="col-span-full">
                                <h4 className="font-semibold text-sm text-gray-700 border-b pb-2 mb-3 mt-2">محل انجام کار</h4>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md">
                                <span className="text-sm text-gray-600">استان</span>
                                <p className="font-medium">{viewingItem?.state?.name || "-"}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md">
                                <span className="text-sm text-gray-600">شهر</span>
                                <p className="font-medium">{viewingItem?.city?.name || "-"}</p>
                            </div>

                            {/* مدت قرارداد */}
                            <div className="col-span-full">
                                <h4 className="font-semibold text-sm text-gray-700 border-b pb-2 mb-3 mt-2">مدت قرارداد</h4>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md">
                                <span className="text-sm text-gray-600">تاریخ شروع</span>
                                <p className="font-medium">{viewingItem.contract_from_date_persian || "-"}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md">
                                <span className="text-sm text-gray-600">تاریخ پایان</span>
                                <p className="font-medium">{viewingItem.contract_to_date_persian || "-"}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md">
                                <span className="text-sm text-gray-600">مدت (ماه/روز)</span>
                                <p className="font-medium">{viewingItem.contract_duration_months || 0} ماه / {viewingItem.contract_duration_days || 0} روز</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md">
                                <span className="text-sm text-gray-600">دوره آزمایشی</span>
                                <p className="font-medium">{viewingItem.has_trial_period ? "دارد" : "ندارد"}</p>
                            </div>

                            {/* حق‌السعی */}
                            <div className="col-span-full">
                                <h4 className="font-semibold text-sm text-gray-700 border-b pb-2 mb-3 mt-2">حق‌السعی</h4>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-md col-span-2">
                                <span className="text-sm text-gray-600">مجموع حق‌السعی</span>
                                <p className="text-lg font-bold text-blue-700">{formatNumber(viewingItem.total_salary)} ریال</p>
                            </div>

                            {viewingItem.contract_type === CONTRACT_TYPES.TEMPORARY && (
                                <>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <span className="text-sm text-gray-600">مزد ماهانه</span>
                                        <p className="font-medium">{formatNumber(viewingItem.base_salary)}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <span className="text-sm text-gray-600">حق اولاد</span>
                                        <p className="font-medium">{formatNumber(viewingItem.child_allowance)}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <span className="text-sm text-gray-600">کمک هزینه مسکن</span>
                                        <p className="font-medium">{formatNumber(viewingItem.housing_allowance)}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <span className="text-sm text-gray-600">مزایای رفاهی</span>
                                        <p className="font-medium">{formatNumber(viewingItem.welfare_allowance)}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <span className="text-sm text-gray-600">حق سنوات</span>
                                        <p className="font-medium">{formatNumber(viewingItem.seniority_allowance)}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <span className="text-sm text-gray-600">پاداش عملکرد</span>
                                        <p className="font-medium">{formatNumber(viewingItem.performance_bonus)}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <span className="text-sm text-gray-600">حق مسئولیت</span>
                                        <p className="font-medium">{formatNumber(viewingItem.responsibility_allowance)}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <span className="text-sm text-gray-600">کمک ایاب و ذهاب</span>
                                        <p className="font-medium">{formatNumber(viewingItem.transportation_allowance)}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <span className="text-sm text-gray-600">سایر</span>
                                        <p className="font-medium">{formatNumber(viewingItem.other_allowance)}</p>
                                    </div>
                                </>
                            )}

                            {viewingItem.contract_type === CONTRACT_TYPES.HOURLY && (
                                <>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <span className="text-sm text-gray-600">مزد ساعتی</span>
                                        <p className="font-medium">{formatNumber(viewingItem.hourly_salary)}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <span className="text-sm text-gray-600">کمک هزینه مسکن ساعتی</span>
                                        <p className="font-medium">{formatNumber(viewingItem.hourly_housing_allowance)}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <span className="text-sm text-gray-600">مزایای رفاهی ساعتی</span>
                                        <p className="font-medium">{formatNumber(viewingItem.hourly_welfare_allowance)}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <span className="text-sm text-gray-600">حق اولاد ساعتی</span>
                                        <p className="font-medium">{formatNumber(viewingItem.hourly_child_allowance)}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <span className="text-sm text-gray-600">حق سنوات ساعتی</span>
                                        <p className="font-medium">{formatNumber(viewingItem.hourly_seniority_allowance)}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <span className="text-sm text-gray-600">حق عیدی</span>
                                        <p className="font-medium">{formatNumber(viewingItem.hourly_bonus)}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <span className="text-sm text-gray-600">مزد مرخصی</span>
                                        <p className="font-medium">{formatNumber(viewingItem.hourly_leave_salary)}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <span className="text-sm text-gray-600">پاداش عملکرد ساعتی</span>
                                        <p className="font-medium">{formatNumber(viewingItem.hourly_performance_bonus)}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <span className="text-sm text-gray-600">کمک ایاب و ذهاب</span>
                                        <p className="font-medium">{formatNumber(viewingItem.transportation_allowance)}</p>
                                    </div>
                                </>
                            )}

                            {viewingItem.contract_type === CONTRACT_TYPES.PROJECT && (
                                <>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <span className="text-sm text-gray-600">مبلغ قرارداد</span>
                                        <p className="font-medium">{formatNumber(viewingItem.contract_amount)}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <span className="text-sm text-gray-600">نحوه پرداخت</span>
                                        <p className="font-medium">{viewingItem.contract_payment_type === 'daily' ? 'هر روز' : viewingItem.contract_payment_type === 'weekly' ? 'هر هفته' : 'هر ماه'}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <span className="text-sm text-gray-600">حق مسئولیت</span>
                                        <p className="font-medium">{formatNumber(viewingItem.responsibility_allowance)}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <span className="text-sm text-gray-600">پاداش عملکرد</span>
                                        <p className="font-medium">{formatNumber(viewingItem.performance_bonus)}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <span className="text-sm text-gray-600">کمک ایاب و ذهاب</span>
                                        <p className="font-medium">{formatNumber(viewingItem.transportation_allowance)}</p>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end gap-3 border-t pt-4">
                            <Button variant="secondary" onClick={handleCloseViewModal}>
                                بستن
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}