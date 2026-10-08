// src/pages/hrm/payments/process/index.tsx

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import Button from "@/components/shared/Button";
import Select from "@/components/shared/inputs/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/shared/Loading";
import Empty from "@/components/shared/Empty";
import Pagination from "@/components/shared/Pagination";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
    Upload, FileSpreadsheet, Calculator, Search, X,
    Eye, Download, Printer, Save, RefreshCw, Trash2,
    CheckCircle, FileText, Users, History
} from "lucide-react";
import { formatDateToFa } from "@/lib/utils";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

// ============== گزینه‌های ماه ==============
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

// ============== تولید لیست سال‌ها ==============
const getYearOptions = () => {
    const currentYear = 1405;
    const years = [];
    for (let year = currentYear - 15; year <= currentYear + 15; year++) {
        years.push({ value: String(year), label: String(year) });
    }
    return years;
};

// ============== توابع کمکی ==============
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
    if (!num && num !== 0) return "۰";
    return new Intl.NumberFormat("fa-IR").format(num);
};

// ============== کامپوننت اصلی ==============
export default function ProcessManagement() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState("upload");
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [allWorkgroups, setAllWorkgroups] = useState([]);
    const [data, setData] = useState({ data: [], pages: 0, totalCount: 0 });
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef(null);
    const [activeReportTab, setActiveReportTab] = useState("history");

    const yearOptions = getYearOptions();

    // فیلترها
    const [filters, setFilters] = useState({
        user_id: searchParams.get("user_id") || "",
        personnel_code: searchParams.get("personnel_code") || "",
        national_code: searchParams.get("national_code") || "",
        workgroup_id: searchParams.get("workgroup_id") || "",
        month: searchParams.get("month") || "",
        year: searchParams.get("year") || "",
    });

    // فیلترهای بارگزاری
    const [uploadFilters, setUploadFilters] = useState({
        month: "",
        year: "",
        date_from: "",
        date_to: "",
    });

    // ============== دریافت لیست کاربران ==============
    const fetchUsers = async () => {
        try {
            const usersRes = await api("user?per-page=1000", "GET");
            if (usersRes?.data) {
                setUsers(usersRes.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
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

    // ============== دریافت داده‌ها ==============
    const fetchData = async () => {
        const params = new URLSearchParams();

        if (filters.user_id)        params.set("user_id", filters.user_id);
        if (filters.personnel_code) params.set("personnel_code", filters.personnel_code);
        if (filters.national_code)  params.set("national_code", filters.national_code);
        if (filters.workgroup_id)   params.set("workgroup_id", filters.workgroup_id);
        if (filters.month)          params.set("month", filters.month);
        if (filters.year)           params.set("year", filters.year);

        const page    = searchParams.get("page");
        const perPage = searchParams.get("per-page");
        if (page)    params.set("page", page);
        if (perPage) params.set("per-page", perPage);

        const query = params.toString();

        setListLoading(true);
        try {
            let url = "";
            switch (activeReportTab) {
                case "history":
                    url = `hrm-process/history?${query}`;
                    break;
                case "calculate":
                    url = `hrm-process/calculate-list?${query}`;
                    break;
                case "personnel":
                    url = `hrm-process/personnel-list?${query}`;
                    break;
                default:
                    url = `hrm-process?${query}`;
            }

            const res = await api(url, "GET");
            setData(res || { data: [], pages: 0, totalCount: 0 });

            if (res?.data) {
                setSelectedItems(res.data.map(item => item.id));
                setSelectAll(res.data.length > 0);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setListLoading(false);
    };

    // ============== useEffect ==============
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 300);
        return () => clearTimeout(timer);
    }, [filters, activeReportTab]);

    useEffect(() => {
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
            const next = prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id];
            setSelectAll(next.length === data.data.length && data.data.length > 0);
            return next;
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

    const handleUploadFilterSelectChange = (name, selectedOption) => {
        setUploadFilters(prev => ({ ...prev, [name]: selectedOption || "" }));
    };

    const handleSearch = () => {
        fetchData();
    };

    const handleClearFilters = () => {
        setFilters({
            user_id: "",
            personnel_code: "",
            national_code: "",
            workgroup_id: "",
            month: "",
            year: "",
        });
        setSearchParams({});
    };

    // ============== آپلود فایل ==============
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadFile(file);
            setFileName(file.name);
        }
    };

    const handleUpload = async () => {
        if (!uploadFile) {
            toast.warning("لطفاً یک فایل انتخاب کنید");
            return;
        }

        if (!uploadFilters.month) {
            toast.warning("لطفاً ماه را انتخاب کنید");
            return;
        }

        if (!uploadFilters.date_from || !uploadFilters.date_to) {
            toast.warning("لطفاً بازه تاریخ را مشخص کنید");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("file", uploadFile);
        formData.append("month", uploadFilters.month);
        formData.append("year", uploadFilters.year || formatDateToFa(new Date()).split('/')[0]);
        formData.append("date_from", uploadFilters.date_from);
        formData.append("date_to", uploadFilters.date_to);

        try {
            const res = await api("hrm-process/upload", "POST", formData, false);

            if (res?.success) {
                toast.success(res.message || "فرآیند با موفقیت بارگزاری شد");
                if (res.errors && res.errors.length > 0) {
                    res.errors.slice(0, 5).forEach((err) => toast.warning(err));
                    if (res.errors.length > 5) {
                        toast.warning(`و ${res.errors.length - 5} خطای دیگر...`);
                    }
                }
                setUploadFile(null);
                setFileName("");
                if (fileInputRef.current) fileInputRef.current.value = "";
                fetchData();
            } else {
                toast.error(res?.message || "خطا در بارگزاری فرآیند");
            }
        } catch (error) {
            console.error("Error uploading:", error);
            toast.error("خطا در بارگزاری فرآیند");
        }
        setLoading(false);
    };

    // ============== دکمه‌های عملیاتی ==============

    // پیش‌ثبت (برای تب calculate)
    const handlePreSubmit = async () => {
        if (selectedItems.length === 0) {
            toast.warning("هیچ آیتمی انتخاب نشده است");
            return;
        }

        setLoading(true);
        const res = await api("hrm-process/pre-submit", "POST", { ids: selectedItems });
        setLoading(false);

        if (res?.success) {
            toast.success(res.message);
            fetchData();
        } else {
            toast.error(res?.message || "خطا در پیش‌ثبت");
        }
    };

    // ثبت نهایی (برای تب calculate)
    const handleFinalSubmit = async () => {
        if (selectedItems.length === 0) {
            toast.warning("هیچ آیتمی انتخاب نشده است");
            return;
        }

        if (!confirm(`آیا از ثبت نهایی ${selectedItems.length} مورد اطمینان دارید؟`)) {
            return;
        }

        setLoading(true);
        const res = await api("hrm-process/final-submit", "POST", { ids: selectedItems });
        setLoading(false);

        if (res?.success) {
            toast.success(res.message);
            fetchData();
        } else {
            toast.error(res?.message || "خطا در ثبت نهایی");
        }
    };

    // محاسبه مجدد (برای تب calculate)
    const handleRecalculate = async () => {
        if (selectedItems.length === 0) {
            toast.warning("هیچ آیتمی انتخاب نشده است");
            return;
        }

        if (!confirm("آیا از محاسبه مجدد موارد انتخاب‌شده اطمینان دارید؟ پیش‌ثبت‌ها حذف خواهند شد.")) {
            return;
        }

        setLoading(true);
        const res = await api("hrm-process/recalculate", "POST", { ids: selectedItems });
        setLoading(false);

        if (res?.success) {
            toast.success(res.message);
            fetchData();
        } else {
            toast.error(res?.message || "خطا در محاسبه مجدد");
        }
    };

    // حذف (برای تب history)
    const handleDelete = async () => {
        if (selectedItems.length === 0) {
            toast.warning("هیچ آیتمی انتخاب نشده است");
            return;
        }

        if (!confirm(`آیا از حذف ${selectedItems.length} مورد اطمینان دارید؟`)) {
            return;
        }

        setLoading(true);
        const res = await api("hrm-process/delete-calcs", "POST", { ids: selectedItems });
        setLoading(false);

        if (res?.success) {
            toast.success(res.message);
            fetchData();
        } else {
            toast.error(res?.message || "خطا در حذف");
        }
    };

    // کارکرد صفر (برای تب personnel)
    const handleClearWork = async () => {
        if (selectedItems.length === 0) {
            toast.warning("هیچ آیتمی انتخاب نشده است");
            return;
        }

        if (!filters.year || !filters.month) {
            toast.warning("لطفاً ابتدا سال و ماه را انتخاب کنید");
            return;
        }

        const userIds = data.data
            .filter(item => selectedItems.includes(item.id))
            .map(item => item.user_id);

        if (!confirm(`آیا از صفر کردن کارکرد ${userIds.length} پرسنل اطمینان دارید؟`)) {
            return;
        }

        setLoading(true);
        const res = await api("hrm-process/clear-work", "POST", {
            user_ids: userIds,
            year: filters.year,
            month: filters.month,
        });
        setLoading(false);

        if (res?.success) {
            toast.success(res.message);
            fetchData();
        } else {
            toast.error(res?.message || "خطا در صفر کردن کارکرد");
        }
    };

    // پرینت (بعداً پیاده می‌کنیم)
    const handlePrint = () => {
        if (selectedItems.length === 0) {
            toast.warning("هیچ آیتمی انتخاب نشده است");
            return;
        }
        toast.info(`پرینت ${selectedItems.length} آیتم — به‌زودی`);
    };

    // خروجی اکسل (بعداً پیاده می‌کنیم)
    // خروجی اکسل
const handleExportExcel = async () => {
    if (selectedItems.length === 0) {
        toast.warning("هیچ آیتمی انتخاب نشده است");
        return;
    }

    setLoading(true);

    try {
        let type = "history";
        let payload: any = { ids: selectedItems };

        if (activeReportTab === "history") {
            type = "history";
            payload = { type, ids: selectedItems };
        } else if (activeReportTab === "calculate") {
            type = "calculate";
            payload = { type, ids: selectedItems };
        } else if (activeReportTab === "personnel") {
            type = "personnel";
            const userIds = data.data
                .filter(item => selectedItems.includes(item.id))
                .map(item => item.user_id);
            payload = { type, user_ids: userIds };
        }

        // درخواست باینری برای دانلود فایل
        const token = localStorage.getItem("token");
        const baseURL = import.meta.env.VITE_API_URL || "";

        const res = await fetch(`${baseURL}/hrm-process/export-excel`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error("خطا در دریافت فایل");
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `process_${type}_${Date.now()}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        toast.success("فایل اکسل دانلود شد");
    } catch (error) {
        console.error(error);
        toast.error("خطا در خروجی اکسل");
    }

    setLoading(false);
};

    // ============== تبدیل داده‌ها ==============
    const userFilterOptions = users.map((item) => ({
        value: String(item.id),
        label: `${item.first_name || ""} ${item.last_name || ""} (${item.personnel_code || item.phone_number || ""})`,
    }));

    const workgroupOptions = allWorkgroups;

    // ============== ستون‌ها ==============
    const getColumns = () => {
        switch (activeReportTab) {
            case "history":
                return ["ردیف", "کد پرسنلی", "نام و نام خانوادگی", "گروه کاری", "ماه", "سال", "مبلغ", "تاریخ واریز", "وضعیت", "عملیات"];
            case "calculate":
                return ["ردیف", "کد پرسنلی", "نام و نام خانوادگی", "گروه کاری", "ماه", "سال", "مبلغ", "وضعیت", "عملیات"];
            case "personnel":
                return ["ردیف", "کد پرسنلی", "نام و نام خانوادگی", "گروه کاری", "عملیات"];
            default:
                return ["ردیف", "کد پرسنلی", "نام و نام خانوادگی", "گروه کاری", "ماه", "سال", "مبلغ", "وضعیت", "عملیات"];
        }
    };

    return (
        <div className="w-full space-y-4">
            {/* ========== عنوان ========== */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FileSpreadsheet className="w-6 h-6" />
                    محاسبه فرآیند
                </h2>
            </div>

            {/* ========== تب‌های اصلی ========== */}
            <div className="flex gap-2 border-b pb-2">
                <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                        activeTab === "upload"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setActiveTab("upload")}
                >
                    <Upload className="w-4 h-4" />
                    بارگزاری فرآیندها
                </button>
                <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                        activeTab === "calculate"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setActiveTab("calculate")}
                >
                    <Calculator className="w-4 h-4" />
                    محاسبه فرآیندها
                </button>
            </div>

            {/* ========== تب بارگزاری فرآیندها ========== */}
            {activeTab === "upload" && (
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>بارگزاری فرآیندها</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    ماه <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    name="month"
                                    value={monthOptions.find(opt => opt.value === uploadFilters.month) || null}
                                    onChange={(opt) => handleUploadFilterSelectChange("month", opt)}
                                    options={monthOptions}
                                    placeholder="انتخاب ماه"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    سال
                                </label>
                                <Select
                                    name="year"
                                    value={yearOptions.find(opt => opt.value === uploadFilters.year) || null}
                                    onChange={(opt) => handleUploadFilterSelectChange("year", opt)}
                                    options={yearOptions}
                                    placeholder="انتخاب سال"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    از تاریخ <span className="text-red-500">*</span>
                                </label>
                                <DatePicker
                                    calendar={persian}
                                    locale={persian_fa}
                                    value={uploadFilters.date_from}
                                    onChange={(date) => {
                                        setUploadFilters(prev => ({
                                            ...prev,
                                            date_from: date?.format() || "",
                                        }));
                                    }}
                                    format="YYYY/MM/DD"
                                    className="w-full"
                                    inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                    placeholder="انتخاب تاریخ"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    تا تاریخ <span className="text-red-500">*</span>
                                </label>
                                <DatePicker
                                    calendar={persian}
                                    locale={persian_fa}
                                    value={uploadFilters.date_to}
                                    onChange={(date) => {
                                        setUploadFilters(prev => ({
                                            ...prev,
                                            date_to: date?.format() || "",
                                        }));
                                    }}
                                    format="YYYY/MM/DD"
                                    className="w-full"
                                    inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                    placeholder="انتخاب تاریخ"
                                />
                            </div>
                        </div>

                        {/* آپلود فایل */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <div className="flex flex-col items-center gap-3">
                                <Upload className="w-12 h-12 text-gray-400" />
                                <p className="text-sm text-gray-500">
                                    فایل اکسل فرآیند را انتخاب کنید
                                </p>
                                <p className="text-xs text-gray-400">
                                    ستون A: کد پرسنلی | ستون B: تعداد فرآیند
                                </p>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept=".xlsx,.xls"
                                        className="hidden"
                                        id="process_file"
                                    />
                                    <label
                                        htmlFor="process_file"
                                        className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition-colors"
                                    >
                                        انتخاب فایل
                                    </label>
                                    {fileName && (
                                        <span className="text-sm text-green-600">
                                            {fileName}
                                        </span>
                                    )}
                                </div>
                                <Button
                                    onClick={handleUpload}
                                    isLoading={loading}
                                    disabled={loading || !uploadFile || !uploadFilters.month}
                                    className="mt-2"
                                >
                                    <Upload className="w-4 h-4 ml-2" />
                                    بارگزاری فرآیند
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ========== تب محاسبه فرآیندها ========== */}
            {activeTab === "calculate" && (
                <>
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
                                        name="workgroup_id"
                                        value={workgroupOptions.find(opt => opt.value === filters.workgroup_id) || null}
                                        onChange={(opt) => handleFilterSelectChange("workgroup_id", opt)}
                                        options={workgroupOptions}
                                        placeholder="همه گروه‌ها"
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
                            </div>

                            <div className="flex items-center gap-3 mt-4">
                                <Button onClick={handleSearch} className="flex items-center gap-2">
                                    <Search className="w-4 h-4" />
                                    جستجو
                                </Button>
                                <Button variant="secondary" onClick={handleClearFilters} className="flex items-center gap-2">
                                    <X className="w-4 h-4" />
                                    پاک کردن
                                </Button>
                            </div>

                            {/* ===== دکمه‌های تب‌های گزارش ===== */}
                            <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t">
                                <Button
                                    variant={activeReportTab === "history" ? "primary" : "secondary"}
                                    onClick={() => setActiveReportTab("history")}
                                    className="flex items-center gap-2 whitespace-nowrap !w-auto"
                                    size="sm"
                                >
                                    <History className="w-4 h-4" />
                                    سابقه واریز فرآیند
                                </Button>
                                <Button
                                    variant={activeReportTab === "calculate" ? "primary" : "secondary"}
                                    onClick={() => setActiveReportTab("calculate")}
                                    className="flex items-center gap-2 whitespace-nowrap !w-auto"
                                    size="sm"
                                >
                                    <Calculator className="w-4 h-4" />
                                    محاسبه فرآیند
                                </Button>
                                <Button
                                    variant={activeReportTab === "personnel" ? "primary" : "secondary"}
                                    onClick={() => setActiveReportTab("personnel")}
                                    className="flex items-center gap-2 whitespace-nowrap !w-auto"
                                    size="sm"
                                >
                                    <Users className="w-4 h-4" />
                                    لیست پرسنل فرآیندی
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ========== لیست ========== */}
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>
                                {activeReportTab === "history" && "سابقه واریز فرآیند"}
                                {activeReportTab === "calculate" && "محاسبه فرآیند"}
                                {activeReportTab === "personnel" && "لیست پرسنل فرآیندی"}
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
                                    <div className="w-full overflow-x-auto">
                                        <table className="w-full border-collapse text-sm min-w-[800px]">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="px-3 py-2 text-center border-b whitespace-nowrap">
                                                        <button onClick={handleSelectAll} className="cursor-pointer">
                                                            {selectAll ? (
                                                                <CheckCircle className="w-4 h-4 text-blue-600" />
                                                            ) : (
                                                                <FileText className="w-4 h-4 text-gray-400" />
                                                            )}
                                                        </button>
                                                    </th>
                                                    {getColumns().map((col, i) => (
                                                        <th key={i} className="px-3 py-2 text-center border-b whitespace-nowrap">
                                                            {col}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.data.map((item, index) => (
                                                    <tr key={item.id} className="hover:bg-gray-50 border-b">
                                                        <td className="px-3 py-2 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedItems.includes(item.id)}
                                                                onChange={() => handleSelectItem(item.id)}
                                                                className="w-4 h-4 text-blue-600 rounded"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 text-center whitespace-nowrap">{index + 1}</td>
                                                        <td className="px-3 py-2 text-center whitespace-nowrap">{item?.user?.personnel_code || "-"}</td>
                                                        <td className="px-3 py-2 text-center whitespace-nowrap">{item?.user?.first_name || ""} {item?.user?.last_name || ""}</td>
                                                        <td className="px-3 py-2 text-center whitespace-nowrap">{item?.user?.workgroup_name || item?.workgroup?.name || "-"}</td>
                                                        {activeReportTab !== "personnel" && (
                                                            <>
                                                                <td className="px-3 py-2 text-center whitespace-nowrap">{getMonthName(item.month)}</td>
                                                                <td className="px-3 py-2 text-center whitespace-nowrap">{item.year}</td>
                                                                <td className="px-3 py-2 text-center whitespace-nowrap">{formatNumber(item.amount)}</td>
                                                            </>
                                                        )}
                                                        {activeReportTab === "history" && (
                                                            <td className="px-3 py-2 text-center whitespace-nowrap">
                                                                {item.date_paid
                                                                    ? new Date(item.date_paid).toLocaleDateString("fa-IR")
                                                                    : (item.created_at ? new Date(item.created_at).toLocaleDateString("fa-IR") : "-")}
                                                            </td>
                                                        )}
                                                        {activeReportTab !== "personnel" && (
                                                            <td className="px-3 py-2 text-center whitespace-nowrap">
                                                                <span className={`text-xs font-medium ${item.status === 1 ? 'text-green-600' : 'text-yellow-600'}`}>
                                                                    {item.status === 1 ? "تایید شده" : "پیش‌نویس"}
                                                                </span>
                                                            </td>
                                                        )}
                                                        <td className="px-3 py-2 text-center whitespace-nowrap">
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <button className="cursor-pointer hover:text-blue-600">
                                                                        <Eye className="w-4 h-4" />
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>مشاهده</TooltipContent>
                                                            </Tooltip>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* ===== دکمه‌های عملیاتی ===== */}
                                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
                                        <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                                            {selectedItems.length} آیتم انتخاب شده
                                        </span>

                                        {activeReportTab === "history" && (
                                            <>
                                                <Button variant="secondary" onClick={handlePrint} className="flex items-center gap-2 whitespace-nowrap !w-auto" size="sm">
                                                    <Printer className="w-4 h-4" />
                                                    پرینت فیش حقوقی
                                                </Button>
                                                <Button variant="secondary" onClick={handleExportExcel} className="flex items-center gap-2 whitespace-nowrap !w-auto" size="sm">
                                                    <Download className="w-4 h-4" />
                                                    خروجی اکسل
                                                </Button>
                                                <Button variant="secondary" onClick={handleDelete} isLoading={loading} className="flex items-center gap-2 whitespace-nowrap !w-auto text-red-600" size="sm">
                                                    <Trash2 className="w-4 h-4" />
                                                    حذف
                                                </Button>
                                            </>
                                        )}

                                        {activeReportTab === "calculate" && (
                                            <>
                                                <Button variant="secondary" onClick={handlePreSubmit} isLoading={loading} className="flex items-center gap-2 whitespace-nowrap !w-auto" size="sm">
                                                    <Save className="w-4 h-4" />
                                                    پیش ثبت
                                                </Button>
                                                <Button variant="secondary" onClick={handleRecalculate} isLoading={loading} className="flex items-center gap-2 whitespace-nowrap !w-auto" size="sm">
                                                    <RefreshCw className="w-4 h-4" />
                                                    محاسبه مجدد
                                                </Button>
                                                <Button variant="secondary" onClick={handleFinalSubmit} isLoading={loading} className="flex items-center gap-2 whitespace-nowrap !w-auto" size="sm">
                                                    <CheckCircle className="w-4 h-4" />
                                                    ثبت نهایی
                                                </Button>
                                                <Button variant="secondary" onClick={handleExportExcel} className="flex items-center gap-2 whitespace-nowrap !w-auto" size="sm">
                                                    <Download className="w-4 h-4" />
                                                    خروجی اکسل
                                                </Button>
                                            </>
                                        )}

                                        {activeReportTab === "personnel" && (
                                            <>
                                                <Button variant="secondary" onClick={handleClearWork} isLoading={loading} className="flex items-center gap-2 whitespace-nowrap !w-auto" size="sm">
                                                    <X className="w-4 h-4" />
                                                    کارکرد صفر شود
                                                </Button>
                                                <Button variant="secondary" onClick={handleExportExcel} className="flex items-center gap-2 whitespace-nowrap !w-auto" size="sm">
                                                    <Download className="w-4 h-4" />
                                                    خروجی اکسل
                                                </Button>
                                            </>
                                        )}
                                    </div>

                                    <Pagination totalPage={data.pages} />
                                </>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}