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
import { 
    Calculator, Search, X, CheckCircle, CreditCard, 
    Eye, FileSpreadsheet, Printer, Download, XCircle, User, Users, Calendar, FileText, 
    RefreshCw, Save, Trash2, CheckSquare, Square
} from "lucide-react";
import Confirm from "@/components/ui/confirm";
import { checkAccess, formatDateToFa, formatDateToEn } from "@/lib/utils";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

// ============== توابع کمکی ==============
const getCurrentPersianYear = () => {
    const today = new Date();
    const persianDate = formatDateToFa(today);
    return persianDate.split('/')[0];
};

const getCurrentPersianMonth = () => {
    const today = new Date();
    const persianDate = formatDateToFa(today);
    return parseInt(persianDate.split('/')[1]);
};



// ============== گزینه‌های نوع قرارداد ==============
const CONTRACT_TYPE_OPTIONS = [
    { value: "", label: "همه انواع" },
    { value: "1", label: "موقت" },
    { value: "2", label: "ساعتی" },
    { value: "3", label: "پیمانکاری" },
];

// ============== کامپوننت اصلی ==============
export default function SalarySlip() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [allWorkgroups, setAllWorkgroups] = useState([]);
    const [allBakhshs, setAllBakhshs] = useState([]);
    const [data, setData] = useState({ data: [], pages: 0, totalCount: 0 });
    const [showResult, setShowResult] = useState(false);
    const [calculatedData, setCalculatedData] = useState(null);
    const [selectedSlip, setSelectedSlip] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [activeButton, setActiveButton] = useState("view"); // view, history, calculate, check
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(true);
    const [onlyWork, setOnlyWork] = useState(false);
    const [financialYears, setFinancialYears] = useState<any[]>([]);
    const [activeFinancialYear, setActiveFinancialYear] = useState("");
    const [financialYearLoaded, setFinancialYearLoaded] = useState(false);

    const currentYear = getCurrentPersianYear();
    const currentMonth = getCurrentPersianMonth();
    const yearOptions = financialYears.map((item: any) => ({
        value: String(item.year),
        label: String(item.year),
    }));

    // فیلترها
    const [filters, setFilters] = useState({
        user_id: searchParams.get("user_id") || "",
        personnel_code: searchParams.get("personnel_code") || "",
        national_code: searchParams.get("national_code") || "",
        workgroup_ids: searchParams.get("workgroup_ids") ? searchParams.get("workgroup_ids").split(',') : [],
        month: searchParams.get("month") || "",
        year: searchParams.get("year") || "",
        contract_type: searchParams.get("contract_type") || "",
    });

    // ============== دریافت لیست ==============
    const fetchData = async () => {
        const params = new URLSearchParams();
        
        if (filters.user_id) params.set("user_id", filters.user_id);
        if (filters.personnel_code) params.set("personnel_code", filters.personnel_code);
        if (filters.national_code) params.set("national_code", filters.national_code);
        if (filters.workgroup_ids && filters.workgroup_ids.length > 0) {
            params.set("workgroup_ids", filters.workgroup_ids.join(','));
        }
        if (filters.month) params.set("month", filters.month);
        if (filters.year) params.set("year", filters.year);
        if (filters.contract_type) params.set("contract_type", filters.contract_type);
        
        const page = searchParams.get("page");
        const perPage = searchParams.get("per-page");
        if (page) params.set("page", page);
        if (perPage) params.set("per-page", perPage);
        
        const query = params.toString();

        setListLoading(true);
        try {
            let url = "";
            switch (activeButton) {
                case "view":
                    url = `hrm-salary-slip/last-review?${query}`;
                    break;
                case "history":
                    url = `hrm-salary-slip/history?${query}`;
                    break;
                case "calculate":
                    url = `hrm-salary-slip/calculate-list?${query}`;
                    break;
                case "check":
                    url = `hrm-salary-slip/check-work?${query}`;
                    break;
                default:
                    url = `hrm-salary-slip?${query}`;
            }
            const res = await api(url, "GET");
            setData(res || { data: [], pages: 0 });
            // انتخاب همه به صورت پیش‌فرض
            if (res?.data) {
                setSelectedItems(res.data.map(item => item.id));
                setSelectAll(true);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setListLoading(false);
    };

    // ============== دریافت سال‌های مالی ==============
    const fetchFinancialYears = async () => {
        try {
            const res = await api("hrm-financial-year?per-page=100", "GET");
            const items = Array.isArray(res?.data) ? res.data : [];
            setFinancialYears(items);

            const activeYear = items.find((item: any) => Number(item.status) === 1);
            const activeYearValue = activeYear ? String(activeYear.year) : "";

            setActiveFinancialYear(activeYearValue);
            setFilters((prev: any) => ({
                ...prev,
                year: prev.year || activeYearValue,
            }));
        } catch (error) {
            console.error("Error fetching financial years:", error);
            toast.error("خطا در دریافت سال‌های مالی");
        } finally {
            setFinancialYearLoaded(true);
        }
    };

    // ============== دریافت لیست کاربران ==============
    const fetchUsers = async () => {
        try {
            const usersRes = await api("user?per-page=100", "GET");
            if (usersRes?.data) {
                setUsers(usersRes.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("خطا در دریافت اطلاعات");
        }
    };

    // ============== دریافت گروه‌های کاری ==============
    const fetchWorkgroups = async () => {
        try {
            const res = await api("hrm-workgroup/items", "GET");
            if (res?.success) {
                const options = res.data.map(item => ({
                    value: String(item.id),
                    label: item.name
                }));
                setAllWorkgroups(options);
            }
        } catch (error) {
            console.error("Error fetching workgroups:", error);
        }
    };

    // ============== useEffect ==============
    useEffect(() => {
        if (!financialYearLoaded) return;
        const timer = setTimeout(() => {
            fetchData();
        }, 300);
        return () => clearTimeout(timer);
    }, [filters, activeButton, financialYearLoaded]);

    useEffect(() => {
        fetchFinancialYears();
        fetchUsers();
        fetchWorkgroups();
    }, []);

    // ============== مدیریت انتخاب ==============
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
            setSelectAll(false);
        } else {
            setSelectedItems(data.data.map(item => item.id));
            setSelectAll(true);
        }
    };

    const handleSelectItem = (id) => {
        setSelectedItems(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    // ============== مدیریت فیلترها ==============
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleFilterSelectChange = (name, selectedOption) => {
        setFilters(prev => ({ ...prev, [name]: selectedOption || "" }));
    };

    const handleFilterMultiSelectChange = (name, selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
        setFilters(prev => ({ ...prev, [name]: values }));
    };

    const handleSearch = () => {
        fetchData();
    };

    const handleClearFilters = () => {
        setFilters({
            user_id: "",
            personnel_code: "",
            national_code: "",
            workgroup_ids: [],
            month: "",
            year: activeFinancialYear,
            contract_type: "",
        });
        setSearchParams({});
    };

    // ============== دکمه‌های عملیاتی ==============
    const handleCalculateSalary = () => {
        // محاسبه حقوق برای آیتم‌های انتخاب شده
        toast.info("در حال محاسبه حقوق...");
    };

    const handleDeleteSalary = () => {
        if (selectedItems.length === 0) {
            toast.warning("هیچ آیتمی انتخاب نشده است");
            return;
        }
        toast.info(`حذف ${selectedItems.length} آیتم...`);
    };

    const handleRecalculate = () => {
        if (selectedItems.length === 0) {
            toast.warning("هیچ آیتمی انتخاب نشده است");
            return;
        }
        toast.info(`محاسبه مجدد ${selectedItems.length} آیتم...`);
    };

    const handlePrint = () => {
        if (selectedItems.length === 0) {
            toast.warning("هیچ آیتمی انتخاب نشده است");
            return;
        }
        toast.info(`پرینت ${selectedItems.length} آیتم...`);
    };

    const handleExportExcel = () => {
        if (selectedItems.length === 0) {
            toast.warning("هیچ آیتمی انتخاب نشده است");
            return;
        }
        toast.info(`خروجی اکسل ${selectedItems.length} آیتم...`);
    };

    const handleFinalSubmit = () => {
        if (selectedItems.length === 0) {
            toast.warning("هیچ آیتمی انتخاب نشده است");
            return;
        }
        toast.info(`ثبت نهایی ${selectedItems.length} آیتم...`);
    };

    const handlePreSubmit = () => {
        if (selectedItems.length === 0) {
            toast.warning("هیچ آیتمی انتخاب نشده است");
            return;
        }
        toast.info(`پیش ثبت ${selectedItems.length} آیتم...`);
    };

    const handlePrintSlip = () => {
        if (selectedItems.length === 0) {
            toast.warning("هیچ آیتمی انتخاب نشده است");
            return;
        }
        toast.info(`پرینت فیش حقوقی ${selectedItems.length} آیتم...`);
    };

    const handleClearWork = () => {
        if (selectedItems.length === 0) {
            toast.warning("هیچ آیتمی انتخاب نشده است");
            return;
        }
        toast.info(`کارکرد ${selectedItems.length} آیتم صفر شد...`);
    };

    // ============== تبدیل داده‌ها ==============
    const userOptions = users.map((item) => ({
        value: String(item.id),
        label: `${item.first_name || ""} ${item.last_name || ""} (${item.personnel_code || item.phone_number || ""})`,
    }));

    const userFilterOptions = users.map((item) => ({
        value: String(item.id),
        label: `${item.first_name || ""} ${item.last_name || ""} (${item.personnel_code || item.phone_number || ""})`,
    }));

    const monthOptions = [
        { value: "1", label: "فروردین" },
        { value: "2", label: "اردیبهشت" },
        { value: "3", label: "خرداد" },
        { value: "4", label: "تیر" },
        { value: "5", label: "مرداد" },
        { value: "6", label: "شهریور" },
        { value: "7", label: "مهر" },
        { value: "8", label: "آبان" },
        { value: "9", label: "آذر" },
        { value: "10", label: "دی" },
        { value: "11", label: "بهمن" },
        { value: "12", label: "اسفند" },
    ];

    const statusOptions = [
        { value: "", label: "همه وضعیت‌ها" },
        { value: "0", label: "پیش‌نویس" },
        { value: "1", label: "نهایی" },
        { value: "2", label: "پرداخت شده" },
    ];

    const getStatusLabel = (status) => {
        const labels = {
            0: { label: "پیش‌نویس", color: "text-yellow-600" },
            1: { label: "نهایی", color: "text-blue-600" },
            2: { label: "پرداخت شده", color: "text-green-600" },
        };
        return labels[status] || { label: "نامشخص", color: "text-gray-400" };
    };

    const getMonthName = (month) => {
        const months = {
            1: "فروردین", 2: "اردیبهشت", 3: "خرداد",
            4: "تیر", 5: "مرداد", 6: "شهریور",
            7: "مهر", 8: "آبان", 9: "آذر",
            10: "دی", 11: "بهمن", 12: "اسفند"
        };
        return months[month] || "نامشخص";
    };

    const formatNumber = (num) => {
        if (!num) return "۰";
        return new Intl.NumberFormat("fa-IR").format(num);
    };

    const workgroupOptions = allWorkgroups;

    // ============== ستون‌های مختلف ==============
    const getColumns = () => {
        switch (activeButton) {
            case "view":
                return ["ردیف", "سال", "ماه", "کد پرسنلی", "نام و نام خانوادگی", "گروه کاری", "تعداد فرزند", "تعداد روز کارکرد", "ساعات اضافه کار", "ساعات اضافه کار ویژه", "ساعات اضافه کار در ماموریت", "حقوق ثابت", "حق مسکن", "بن و خوار و بار", "حقوق پایه مشمول بیمه", "خالص حقوق مانده از ماه قبل", "پرداختی اضافه کار", "پرداختی اضافه کار ویژه", "پرداختی اضافه کار در ماموریت", "پرداختی جمعه کار", "پرداختی تعطیل کار", "کمک ایاب و ذهاب", "حق مسئولیت", "هزینه های جاری ماه", "پورسانت توزیع", "پورسانت خارج محدوده", "پورسانت معادلی", "حق اولاد", "ماموریت", "پاداش ارزیابی عملکرد", "پاداش", "جبران کارکرد ماه 31 روزه", "معوقه", "عیدی", "بازخرید مرخصی", "حق سنوات", "حقوق پایه مشمول و غیر مشمول", "بیمه سهم کارمند", "بیمه تکمیلی", "مالیات حقوق", "قسط وام ها", "مساعده", "تاخیر", "تعجیل", "غیبت", "جریمه", "خروج غیرمجاز", "مرخصی دانشجویی", "مرخصی بدون حقوق", "جریمه تاخیر بیش از 8 ساعت", "خرید از شرکت", "کسر کارکرد ماه 29 روزه", "کسور متفرقه", "مجموع کسور", "خالص پرداختی", "نام بانک", "شماره حساب"];
            case "history":
                return ["ردیف", "سال", "ماه", "تاریخ ثبت نهایی", "کد پرسنلی", "نام و نام خانوادگی", "گروه کاری", "تعداد فرزند", "تعداد روز کارکرد", "ساعات اضافه کار", "ساعات اضافه کار ویژه", "ساعات اضافه کار در ماموریت", "حقوق ثابت", "حق مسکن", "بن و خوار و بار", "حقوق پایه مشمول بیمه", "خالص حقوق مانده از ماه قبل", "پرداختی اضافه کار", "پرداختی اضافه کار ویژه", "پرداختی اضافه کار در ماموریت", "پرداختی جمعه کار", "پرداختی تعطیل کار", "کمک ایاب و ذهاب", "حق مسئولیت", "هزینه های جاری ماه", "پورسانت توزیع", "پورسانت خارج محدوده", "پورسانت معادلی", "حق اولاد", "ماموریت", "پاداش ارزیابی عملکرد", "پاداش", "جبران کارکرد ماه 31 روزه", "معوقه", "عیدی", "بازخرید مرخصی", "حق سنوات", "حقوق پایه مشمول و غیر مشمول", "بیمه سهم کارمند", "بیمه تکمیلی", "مالیات حقوق", "قسط وام ها", "مساعده", "تاخیر", "تعجیل", "غیبت", "جریمه", "خروج غیرمجاز", "مرخصی دانشجویی", "مرخصی بدون حقوق", "جریمه تاخیر بیش از 8 ساعت", "خرید از شرکت", "کسر کارکرد ماه 29 روزه", "کسور متفرقه", "مجموع کسور", "خالص پرداختی", "نام بانک", "شماره حساب", "وضعیت"];
            case "calculate":
                return ["ردیف", "کد پرسنلی", "نام و نام خانوادگی", "گروه کاری", "تعداد فرزند", "تعداد روز کارکرد", "ساعات اضافه کار", "ساعات اضافه کار ویژه", "ساعات اضافه کار در ماموریت", "حقوق ثابت", "حق مسکن", "بن و خوار و بار", "حقوق پایه مشمول بیمه", "خالص حقوق مانده از ماه قبل", "پرداختی اضافه کار", "پرداختی اضافه کار ویژه", "پرداختی اضافه کار در ماموریت", "پرداختی جمعه کار", "پرداختی تعطیل کار", "کمک ایاب و ذهاب", "حق مسئولیت", "هزینه های جاری ماه", "پورسانت توزیع", "پورسانت خارج محدوده", "پورسانت معادلی", "حق اولاد", "ماموریت", "پاداش ارزیابی عملکرد", "پاداش", "جبران کارکرد ماه 31 روزه", "معوقه", "عیدی", "بازخرید مرخصی", "حق سنوات", "حقوق پایه مشمول و غیر مشمول", "بیمه سهم کارمند", "بیمه تکمیلی", "مالیات حقوق", "قسط وام ها", "مساعده", "تاخیر", "تعجیل", "غیبت", "جریمه", "خروج غیرمجاز", "مرخصی دانشجویی", "مرخصی بدون حقوق", "جریمه تاخیر بیش از 8 ساعت", "خرید از شرکت", "کسر کارکرد ماه 29 روزه", "کسور متفرقه", "مجموع کسور", "خالص پرداختی", "نام بانک", "شماره حساب"];
            case "check":
                return ["ردیف", "کد پرسنلی", "نام و نام خانوادگی", "گروه کاری"];
            default:
                return ["ردیف", "پرسنل", "سال", "ماه", "ساعت کارکرد", "اضافه کار", "قابل پرداخت", "وضعیت", "عملیات"];
        }
    };

    // ============== رندر ==============
    return (
        <div className="w-full space-y-4">
            {/* ========== عنوان ========== */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FileSpreadsheet className="w-6 h-6" />
                    صورت حساب کلی حقوق و دستمزد
                </h2>
            </div>

            {/* ========== فیلترها ========== */}
<Card className="w-full">
    <CardHeader className="pb-3">
        <CardTitle className="text-base">فیلترهای جستجو</CardTitle>
    </CardHeader>
    <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                    نام پرسنل
                </label>
                <Select
                    name="user_id"
                    value={userFilterOptions.find(opt => opt.value === filters.user_id) || null}
                    onChange={(opt) => handleFilterSelectChange("user_id", opt)}
                    options={userFilterOptions}
                    placeholder="همه پرسنل"
                    isClearable
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                    کد پرسنلی
                </label>
                <input
                    type="text"
                    name="personnel_code"
                    value={filters.personnel_code || ""}
                    onChange={handleFilterChange}
                    placeholder="کد پرسنلی"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                    کد ملی
                </label>
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
                <label className="text-sm font-medium text-gray-700 mb-1">
                    گروه کاری
                </label>
                <Select
                    name="workgroup_ids"
                    value={workgroupOptions.filter(opt => filters.workgroup_ids.includes(opt.value))}
                    onChange={(opt) => handleFilterMultiSelectChange("workgroup_ids", opt)}
                    options={workgroupOptions}
                    placeholder="همه گروه‌ها"
                    isMulti
                    isClearable
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                    ماه
                </label>
                <Select
                    name="month"
                    value={monthOptions.find(opt => opt.value === filters.month) || null}
                    onChange={(opt) => handleFilterSelectChange("month", opt)}
                    options={monthOptions}
                    placeholder="همه ماه‌ها"
                    isClearable
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                    سال
                </label>
                <Select
                    name="year"
                    value={yearOptions.find(opt => opt.value === filters.year) || null}
                    onChange={(opt) => handleFilterSelectChange("year", opt)}
                    options={yearOptions}
                    placeholder="همه سال‌ها"
                    isClearable
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                    نوع قرارداد
                </label>
                <Select
                    name="contract_type"
                    value={CONTRACT_TYPE_OPTIONS.find(opt => opt.value === filters.contract_type) || null}
                    onChange={(opt) => handleFilterSelectChange("contract_type", opt)}
                    options={CONTRACT_TYPE_OPTIONS}
                    placeholder="همه انواع"
                    isClearable
                />
            </div>
        </div>

        {/* دکمه‌ها و چک باکس - به صورت افقی */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
            {/* دکمه‌های اصلی */}
            <Button 
                variant={activeButton === "view" ? "primary" : "secondary"} 
                onClick={() => setActiveButton("view")}
                className="flex items-center gap-2 whitespace-nowrap !w-auto"
                size="sm"
            >
                <Eye className="w-4 h-4" />
                مشاهده آخرین بررسی
            </Button>
            <Button 
                variant={activeButton === "history" ? "primary" : "secondary"} 
                onClick={() => setActiveButton("history")}
                className="flex items-center gap-2 whitespace-nowrap !w-auto"
                size="sm"
            >
                <FileText className="w-4 h-4" />
                سابقه واریز حقوق
            </Button>
             {/* چک باکس */}
            <div className="flex items-center gap-2 mx-2">
                <input
                    type="checkbox"
                    id="only_work"
                    checked={onlyWork}
                    onChange={(e) => setOnlyWork(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="only_work" className="text-sm text-gray-700 whitespace-nowrap">
                    فقط کارکرد محاسبه شود
                </label>
            </div>
            <Button 
                variant={activeButton === "calculate" ? "primary" : "secondary"} 
                onClick={() => setActiveButton("calculate")}
                className="flex items-center gap-2 whitespace-nowrap !w-auto"
                size="sm"
            >
                <Calculator className="w-4 h-4" />
                محاسبه حقوق
            </Button>
            <Button 
                variant={activeButton === "check" ? "primary" : "secondary"} 
                onClick={() => setActiveButton("check")}
                className="flex items-center gap-2 whitespace-nowrap !w-auto"
                size="sm"
            >
                <CheckCircle className="w-4 h-4" />
                چک کردن کارکرد
            </Button>
            
           

            {/* فضای خالی برای کشیدن دکمه‌های جستجو به راست */}
            <div className="flex-1"></div>
            
            
        </div>
    </CardContent>
</Card>

           {/* ========== لیست ========== */}
<Card className="w-full">
    <CardHeader>
        <CardTitle>
            {activeButton === "view" && "مشاهده آخرین بررسی"}
            {activeButton === "history" && "سابقه واریز حقوق"}
            {activeButton === "calculate" && "محاسبه حقوق"}
            {activeButton === "check" && "چک کردن کارکرد"}
            {data.totalCount > 0 && (
                <span className="text-sm font-normal text-gray-500 mr-2">
                    (کل: {data.totalCount} رکورد)
                </span>
            )}
        </CardTitle>
    </CardHeader>

    <CardContent>
        {listLoading ? (
            <div className="flex justify-center py-10">
                <Loading />
            </div>
        ) : data?.data?.length === 0 ? (
            <Empty message="هیچ داده‌ای یافت نشد" />
        ) : (
            <>
                {/* ===== کانتینر با اسکرول افقی ===== */}
                <div className="w-full overflow-x-auto overflow-y-visible">
                    <table className="w-full border-collapse text-xs min-w-[2000px]">
                        {/* ===== هدر ===== */}
                        <thead className="bg-gray-100">
                            <tr>
                                {/* چک‌باکس */}
                                <th className="px-2 py-2 text-center border-b whitespace-nowrap sticky left-0 bg-gray-100 z-10">
                                    <button onClick={handleSelectAll} className="cursor-pointer">
                                        {selectAll ? (
                                            <CheckSquare className="w-4 h-4 text-blue-600" />
                                        ) : (
                                            <Square className="w-4 h-4 text-gray-400" />
                                        )}
                                    </button>
                                </th>
                                
                                {/* ردیف */}
                                <th className="px-2 py-2 text-center border-b whitespace-nowrap">ردیف</th>

                                {/* ===== تب مشاهده آخرین بررسی ===== */}
                                {activeButton === "view" && (
                                    <>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">سال</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">ماه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">کد پرسنلی</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">نام و نام خانوادگی</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">گروه کاری</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">تعداد فرزند</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">تعداد روز کارکرد</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">ساعات اضافه کار</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">ساعات اضافه کار ویژه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">ساعات اضافه کار در ماموریت</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">حقوق ثابت</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">حق مسکن</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">بن و خوار و بار</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">حقوق پایه مشمول بیمه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">خالص حقوق مانده از ماه قبل</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پرداختی اضافه کار</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پرداختی اضافه کار ویژه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پرداختی اضافه کار در ماموریت</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پرداختی جمعه کار</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پرداختی تعطیل کار</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">کمک ایاب و ذهاب</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">حق مسئولیت</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">هزینه های جاری ماه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پورسانت توزیع</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پورسانت خارج محدوده</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پورسانت معادلی</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">حق اولاد</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">ماموریت</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پاداش ارزیابی عملکرد</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پاداش</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">جبران کارکرد ماه 31 روزه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">معوقه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">عیدی</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">بازخرید مرخصی</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">حق سنوات</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">حقوق پایه مشمول و غیر مشمول</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">بیمه سهم کارمند</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">بیمه تکمیلی</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">مالیات حقوق</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">قسط وام ها</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">مساعده</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">تاخیر</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">تعجیل</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">غیبت</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">جریمه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">خروج غیرمجاز</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">مرخصی دانشجویی</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">مرخصی بدون حقوق</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">جریمه تاخیر بیش از 8 ساعت</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">خرید از شرکت</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">کسر کارکرد ماه 29 روزه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">کسور متفرقه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">مجموع کسور</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">خالص پرداختی</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">نام بانک</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">شماره حساب</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">عملیات</th>
                                    </>
                                )}

                                {/* ===== تب سابقه واریز حقوق ===== */}
                                {activeButton === "history" && (
                                    <>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">سال</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">ماه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">تاریخ ثبت نهایی</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">کد پرسنلی</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">نام و نام خانوادگی</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">گروه کاری</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">تعداد فرزند</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">تعداد روز کارکرد</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">ساعات اضافه کار</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">ساعات اضافه کار ویژه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">ساعات اضافه کار در ماموریت</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">حقوق ثابت</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">حق مسکن</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">بن و خوار و بار</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">حقوق پایه مشمول بیمه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">خالص حقوق مانده از ماه قبل</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پرداختی اضافه کار</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پرداختی اضافه کار ویژه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پرداختی اضافه کار در ماموریت</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پرداختی جمعه کار</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پرداختی تعطیل کار</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">کمک ایاب و ذهاب</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">حق مسئولیت</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">هزینه های جاری ماه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پورسانت توزیع</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پورسانت خارج محدوده</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پورسانت معادلی</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">حق اولاد</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">ماموریت</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پاداش ارزیابی عملکرد</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پاداش</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">جبران کارکرد ماه 31 روزه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">معوقه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">عیدی</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">بازخرید مرخصی</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">حق سنوات</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">حقوق پایه مشمول و غیر مشمول</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">بیمه سهم کارمند</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">بیمه تکمیلی</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">مالیات حقوق</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">قسط وام ها</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">مساعده</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">تاخیر</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">تعجیل</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">غیبت</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">جریمه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">خروج غیرمجاز</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">مرخصی دانشجویی</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">مرخصی بدون حقوق</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">جریمه تاخیر بیش از 8 ساعت</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">خرید از شرکت</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">کسر کارکرد ماه 29 روزه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">کسور متفرقه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">مجموع کسور</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">خالص پرداختی</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">نام بانک</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">شماره حساب</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">وضعیت</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">عملیات</th>
                                    </>
                                )}

                                {/* ===== تب محاسبه حقوق ===== */}
                                {activeButton === "calculate" && (
                                    <>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">کد پرسنلی</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">نام و نام خانوادگی</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">گروه کاری</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">تعداد فرزند</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">تعداد روز کارکرد</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">ساعات اضافه کار</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">ساعات اضافه کار ویژه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">ساعات اضافه کار در ماموریت</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">حقوق ثابت</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">حق مسکن</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">بن و خوار و بار</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">حقوق پایه مشمول بیمه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">خالص حقوق مانده از ماه قبل</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پرداختی اضافه کار</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پرداختی اضافه کار ویژه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پرداختی اضافه کار در ماموریت</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پرداختی جمعه کار</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پرداختی تعطیل کار</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">کمک ایاب و ذهاب</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">حق مسئولیت</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">هزینه های جاری ماه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پورسانت توزیع</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پورسانت خارج محدوده</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پورسانت معادلی</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">حق اولاد</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">ماموریت</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پاداش ارزیابی عملکرد</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">پاداش</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">جبران کارکرد ماه 31 روزه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">معوقه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">عیدی</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">بازخرید مرخصی</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">حق سنوات</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">حقوق پایه مشمول و غیر مشمول</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">بیمه سهم کارمند</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">بیمه تکمیلی</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">مالیات حقوق</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">قسط وام ها</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">مساعده</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">تاخیر</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">تعجیل</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">غیبت</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">جریمه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">خروج غیرمجاز</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">مرخصی دانشجویی</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">مرخصی بدون حقوق</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">جریمه تاخیر بیش از 8 ساعت</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">خرید از شرکت</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">کسر کارکرد ماه 29 روزه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">کسور متفرقه</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">مجموع کسور</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">خالص پرداختی</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">نام بانک</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">شماره حساب</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">عملیات</th>
                                    </>
                                )}

                                {/* ===== تب چک کردن کارکرد ===== */}
                                {activeButton === "check" && (
                                    <>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">کد پرسنلی</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">نام و نام خانوادگی</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">گروه کاری</th>
                                        <th className="px-2 py-2 text-center border-b whitespace-nowrap">عملیات</th>
                                    </>
                                )}
                            </tr>
                        </thead>

                        {/* ===== بدنه ===== */}
                        <tbody>
                            {data.data.map((item, index) => {
                                const status = getStatusLabel(item.status);
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50 border-b">
                                        {/* چک‌باکس */}
                                        <td className="px-2 py-2 text-center sticky left-0 bg-white z-10">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => handleSelectItem(item.id)}
                                                className="w-4 h-4 text-blue-600 rounded"
                                            />
                                        </td>
                                        
                                        {/* ردیف */}
                                        <td className="px-2 py-2 text-center whitespace-nowrap">{index + 1}</td>

                                        {/* ===== تب مشاهده آخرین بررسی ===== */}
                                        {activeButton === "view" && (
                                            <>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item.year || "-"}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{getMonthName(item.month)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item?.user?.personnel_code || "-"}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item?.user?.first_name || ""} {item?.user?.last_name || ""}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item?.user?.workgroup_name || "-"}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item.child_count || 0}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item.work_days || 0}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item.overtime_hours || 0}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item.special_overtime_hours || 0}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item.mission_overtime_hours || 0}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.base_salary)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.housing_allowance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.food_allowance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.insurable_base_salary)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.prev_month_remain)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.overtime_pay)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.special_overtime_pay)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.mission_overtime_pay)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.friday_work_pay)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.holiday_work_pay)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.transportation_allowance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.responsibility_allowance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.current_month_expenses)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.distribution_commission)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.outside_commission)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.equivalent_commission)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.child_allowance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.mission_allowance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.performance_bonus)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.bonus)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.compensatory_31_days)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.arrears)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.annual_bonus)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.vacation_buyback)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.seniority_allowance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.insurable_and_non_insurable)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.employee_insurance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.supplementary_insurance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.tax)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.loan_installments)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.advance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.delay)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.early_leave)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.absence)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.penalty)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.unauthorized_exit)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.student_vacation)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.unpaid_vacation)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.late_penalty_8_hours)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.company_purchase)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.deduct_29_days)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.other_deductions)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap font-bold">{formatNumber(item.total_deductions)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap font-bold text-green-600">{formatNumber(item.net_payable)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item.bank_name || "-"}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item.account_number || "-"}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button className="cursor-pointer hover:text-blue-600">
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>مشاهده</TooltipContent>
                                                    </Tooltip>
                                                </td>
                                            </>
                                        )}

                                        {/* ===== تب سابقه واریز حقوق ===== */}
                                        {activeButton === "history" && (
                                            <>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item.year || "-"}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{getMonthName(item.month)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item.finalized_date || "-"}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item?.user?.personnel_code || "-"}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item?.user?.first_name || ""} {item?.user?.last_name || ""}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item?.user?.workgroup_name || "-"}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item.child_count || 0}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item.work_days || 0}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item.overtime_hours || 0}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item.special_overtime_hours || 0}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item.mission_overtime_hours || 0}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.base_salary)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.housing_allowance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.food_allowance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.insurable_base_salary)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.prev_month_remain)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.overtime_pay)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.special_overtime_pay)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.mission_overtime_pay)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.friday_work_pay)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.holiday_work_pay)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.transportation_allowance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.responsibility_allowance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.current_month_expenses)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.distribution_commission)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.outside_commission)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.equivalent_commission)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.child_allowance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.mission_allowance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.performance_bonus)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.bonus)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.compensatory_31_days)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.arrears)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.annual_bonus)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.vacation_buyback)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.seniority_allowance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.insurable_and_non_insurable)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.employee_insurance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.supplementary_insurance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.tax)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.loan_installments)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.advance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.delay)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.early_leave)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.absence)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.penalty)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.unauthorized_exit)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.student_vacation)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.unpaid_vacation)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.late_penalty_8_hours)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.company_purchase)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.deduct_29_days)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.other_deductions)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap font-bold">{formatNumber(item.total_deductions)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap font-bold text-green-600">{formatNumber(item.net_payable)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item.bank_name || "-"}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item.account_number || "-"}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">
                                                    <span className={`text-xs font-medium ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button className="cursor-pointer hover:text-blue-600">
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>مشاهده</TooltipContent>
                                                    </Tooltip>
                                                </td>
                                            </>
                                        )}

                                        {/* ===== تب محاسبه حقوق ===== */}
                                        {activeButton === "calculate" && (
                                            <>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item?.user?.personnel_code || "-"}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item?.user?.first_name || ""} {item?.user?.last_name || ""}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item?.user?.workgroup_name || "-"}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item.child_count || 0}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item.work_days || 0}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item.overtime_hours || 0}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item.special_overtime_hours || 0}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item.mission_overtime_hours || 0}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.base_salary)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.housing_allowance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.food_allowance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.insurable_base_salary)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.prev_month_remain)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.overtime_pay)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.special_overtime_pay)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.mission_overtime_pay)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.friday_work_pay)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.holiday_work_pay)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.transportation_allowance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.responsibility_allowance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.current_month_expenses)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.distribution_commission)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.outside_commission)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.equivalent_commission)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.child_allowance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.mission_allowance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.performance_bonus)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.bonus)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.compensatory_31_days)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.arrears)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.annual_bonus)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.vacation_buyback)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.seniority_allowance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.insurable_and_non_insurable)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.employee_insurance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.supplementary_insurance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.tax)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.loan_installments)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.advance)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.delay)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.early_leave)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.absence)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.penalty)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.unauthorized_exit)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.student_vacation)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.unpaid_vacation)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.late_penalty_8_hours)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.company_purchase)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.deduct_29_days)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{formatNumber(item.other_deductions)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap font-bold">{formatNumber(item.total_deductions)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap font-bold text-green-600">{formatNumber(item.net_payable)}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item.bank_name || "-"}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item.account_number || "-"}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button className="cursor-pointer hover:text-blue-600">
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>مشاهده</TooltipContent>
                                                    </Tooltip>
                                                </td>
                                            </>
                                        )}

                                        {/* ===== تب چک کردن کارکرد ===== */}
                                        {activeButton === "check" && (
                                            <>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item?.user?.personnel_code || "-"}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item?.user?.first_name || ""} {item?.user?.last_name || ""}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">{item?.user?.workgroup_name || "-"}</td>
                                                <td className="px-2 py-2 text-center whitespace-nowrap">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button className="cursor-pointer hover:text-blue-600">
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>مشاهده</TooltipContent>
                                                    </Tooltip>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* ===== دکمه‌های عملیاتی ===== */}
<div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
    <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
        {selectedItems.length} آیتم انتخاب شده
    </span>
    
    {activeButton === "view" && (
        <>
            <Button 
                variant="secondary" 
                onClick={handleDeleteSalary} 
                className="flex items-center gap-2 whitespace-nowrap !w-auto"
                size="sm"
            >
                <Trash2 className="w-4 h-4" />
                حذف محاسبه حقوق و دستمزد
            </Button>
            <Button 
                variant="secondary" 
                onClick={handleRecalculate} 
                className="flex items-center gap-2 whitespace-nowrap !w-auto"
                size="sm"
            >
                <RefreshCw className="w-4 h-4" />
                محاسبه مجدد حقوق و دستمزد
            </Button>
            <Button 
                variant="secondary" 
                onClick={handlePrint} 
                className="flex items-center gap-2 whitespace-nowrap !w-auto"
                size="sm"
            >
                <Printer className="w-4 h-4" />
                پرینت صورت حساب
            </Button>
            <Button 
                variant="secondary" 
                onClick={handleExportExcel} 
                className="flex items-center gap-2 whitespace-nowrap !w-auto"
                size="sm"
            >
                <Download className="w-4 h-4" />
                خروجی اکسل
            </Button>
            <Button 
                variant="primary" 
                onClick={handleFinalSubmit} 
                className="flex items-center gap-2 whitespace-nowrap !w-auto"
                size="sm"
            >
                <Save className="w-4 h-4" />
                ثبت نهایی
            </Button>
        </>
    )}

    {activeButton === "history" && (
        <>
            <Button 
                variant="secondary" 
                onClick={handlePrintSlip} 
                className="flex items-center gap-2 whitespace-nowrap !w-auto"
                size="sm"
            >
                <Printer className="w-4 h-4" />
                پرینت فیش حقوقی
            </Button>
            <Button 
                variant="secondary" 
                onClick={handleExportExcel} 
                className="flex items-center gap-2 whitespace-nowrap !w-auto"
                size="sm"
            >
                <Download className="w-4 h-4" />
                خروجی اکسل
            </Button>
        </>
    )}

    {activeButton === "calculate" && (
        <>
            <Button 
                variant="secondary" 
                onClick={handlePreSubmit} 
                className="flex items-center gap-2 whitespace-nowrap !w-auto"
                size="sm"
            >
                <Save className="w-4 h-4" />
                پیش ثبت
            </Button>
            <Button 
                variant="secondary" 
                onClick={handleExportExcel} 
                className="flex items-center gap-2 whitespace-nowrap !w-auto"
                size="sm"
            >
                <Download className="w-4 h-4" />
                خروجی اکسل
            </Button>
        </>
    )}

    {activeButton === "check" && (
        <>
            <Button 
                variant="secondary" 
                onClick={handleClearWork} 
                className="flex items-center gap-2 whitespace-nowrap !w-auto"
                size="sm"
            >
                <X className="w-4 h-4" />
                کارکرد صفر شود
            </Button>
            <Button 
                variant="secondary" 
                onClick={handleExportExcel} 
                className="flex items-center gap-2 whitespace-nowrap !w-auto"
                size="sm"
            >
                <Download className="w-4 h-4" />
                خروجی اکسل
            </Button>
        </>
    )}
</div>

                {/* ===== Pagination ===== */}
                <Pagination totalPage={data.pages} />
            </>
        )}
    </CardContent>
</Card>
             
        </div>
    );
}