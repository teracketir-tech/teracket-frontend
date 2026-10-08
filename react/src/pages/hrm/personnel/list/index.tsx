// src/pages/hrm/personnel/list/index.jsx

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
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
    Search, X, Eye, User, Phone, Mail, MapPin,
    Calendar, FileText, CheckCircle, XCircle,
    Download, Printer, Filter
} from "lucide-react";
import { checkAccess, formatDateToEn, formatDateToFa } from "@/lib/utils";
import PersonnelDetailModal from "./components/PersonnelDetailModal";

export default function PersonnelList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [data, setData] = useState({ data: [], pages: 0, totalCount: 0 });
    const [selectedPersonnel, setSelectedPersonnel] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [users, setUsers] = useState([]);

    // فیلترها
    const [filters, setFilters] = useState({
        user_id: searchParams.get("user_id") || "",
        first_name: searchParams.get("first_name") || "",
        last_name: searchParams.get("last_name") || "",
        personnel_code: searchParams.get("personnel_code") || "",
        national_code: searchParams.get("national_code") || "",
        date_from: searchParams.get("date_from") || "",
        date_to: searchParams.get("date_to") || "",
        status: searchParams.get("status") !== null ? searchParams.get("status") : "",
    });

    // ============== دریافت لیست پرسنل ==============
    const fetchData = async () => {
        const params = new URLSearchParams();

        if (filters.user_id) params.set("user_id", filters.user_id);
        if (filters.first_name) params.set("first_name", filters.first_name);
        if (filters.last_name) params.set("last_name", filters.last_name);
        if (filters.personnel_code) params.set("personnel_code", filters.personnel_code);
        if (filters.national_code) params.set("national_code", filters.national_code);
        if (filters.status !== "" && filters.status !== null) params.set("status", filters.status);

        // ✅ تبدیل تاریخ‌های شمسی به میلادی با formatDateToEn
        if (filters.date_from) {
            const gregorian = formatDateToEn(filters.date_from);
            if (gregorian) params.set("date_from", gregorian);
        }
        if (filters.date_to) {
            const gregorian = formatDateToEn(filters.date_to);
            if (gregorian) params.set("date_to", gregorian);
        }

        const page = searchParams.get("page");
        const perPage = searchParams.get("per-page");
        if (page) params.set("page", page);
        if (perPage) params.set("per-page", perPage);

        const query = params.toString();

        setListLoading(true);
        try {
            const res = await api(`hrm-personnel-basic?${query}`, "GET");
            setData(res || { data: [], pages: 0, totalCount: 0 });
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("خطا در دریافت اطلاعات");
        }
        setListLoading(false);
    };

    // ============== دریافت لیست کاربران برای فیلتر ==============
    const fetchUsers = async () => {
        try {
            const res = await api("user?per-page=100", "GET");
            if (res?.data) setUsers(res.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchData();
    }, []);

    // ============== مدیریت فیلترها ==============
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleFilterSelectChange = (name, selectedOption) => {
        setFilters(prev => ({ ...prev, [name]: selectedOption || "" }));
    };

    const handleDateChange = (name, date) => {
        setFilters(prev => ({ ...prev, [name]: date?.format() || "" }));
    };

    const handleSearch = () => {
        fetchData();
    };

    const handleClearFilters = () => {
        setFilters({
            user_id: "",
            first_name: "",
            last_name: "",
            personnel_code: "",
            national_code: "",
            date_from: "",
            date_to: "",
            status: "",
        });
        setSearchParams({});
        setTimeout(() => fetchData(), 100);
    };

    // ============== مشاهده جزئیات ==============


    const handleAcceptData = async (userId) => {
        setLoading(true);
         const payload = {
                user_id: userId,
                status: 1, // وضعیت تکمیل
            };

            const res = await api(`hrm-personnel-basic/accept-person?userId=${userId}`, "POST", payload);

            if (res?.success) {
                toast.success("اطلاعات پرسنل با موفقیت ثبت نهایی شد");
               fetchData();
            } else {
                toast.error(res?.message || "خطا در ثبت نهایی اطلاعات");
            }
        setLoading(false);
    };
    const handleViewDetail = async (userId) => {
        setLoading(true);
        try {
            const res = await api(`hrm-personnel-basic/get-by-user?userId=${userId}`, "GET");
            if (res?.success && res?.data) {
                setSelectedPersonnel(res.data);
                setShowDetailModal(true);
            } else {
                toast.error("اطلاعات پرسنل یافت نشد");
            }
        } catch (error) {
            console.error("Error fetching personnel detail:", error);
            toast.error("خطا در دریافت اطلاعات");
        }
        setLoading(false);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedPersonnel(null);
    };

    // ============== گزینه‌ها ==============
    const userOptions = users.map((item) => ({
        value: String(item.id),
        label: `${item.first_name || ""} ${item.last_name || ""}`.trim() || item.phone_number || `کاربر ${item.id}`,
    }));

    const statusOptions = [
        { value: "", label: "همه وضعیت‌ها" },
        { value: "0", label: "پیش‌نویس" },
        { value: "1", label: "تایید شده" },
    ];

    const getStatusLabel = (status) => {
        const labels = {
            0: { label: "پیش‌نویس", color: "text-yellow-600 bg-yellow-50" },
            1: { label: "تایید شده", color: "text-green-600 bg-green-50" },
        };
        return labels[status] || { label: "نامشخص", color: "text-gray-400 bg-gray-50" };
    };

    const formatNumber = (num) => {
        if (!num) return "۰";
        return new Intl.NumberFormat("fa-IR").format(num);
    };

    // ============== ستون‌ها ==============
    const columns = [
        "ردیف",
        "کد پرسنلی",
        "نام و نام خانوادگی",
        "نام پدر",
        "کد ملی",
        "شماره شناسنامه",
        "تاریخ تولد",
        "دین",

        "وضعیت تاهل",
        "تاریخ ثبت",
        "وضعیت ",
        "عملیات"
    ];

    return (
        <div className="w-full space-y-4">
            {/* ========== عنوان ========== */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <User className="w-6 h-6" />
                    لیست پرسنل
                </h2>
                {checkAccess([701]) && (
                    <Button onClick={() => window.location.href = "/hrm/personnel/create"}>
                        <User className="w-4 h-4 ml-2" />
                        پرسنل جدید
                    </Button>
                )}
            </div>

            {/* ========== فیلترها ========== */}
            <Card className="w-full">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        جستجو در پرسنل
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <Select
                            name="user_id"
                            title="نام کارمند"
                            value={userOptions.find(opt => opt.value === filters.user_id) || null}
                            onChange={(opt) => handleFilterSelectChange("user_id", opt)}
                            options={userOptions}
                            placeholder="همه کارمندان"
                            isClearable
                        />

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">کد پرسنلی</label>
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

                        <Select
                            name="status"
                            title="وضعیت"
                            value={statusOptions.find(opt => opt.value === filters.status) || null}
                            onChange={(opt) => handleFilterSelectChange("status", opt)}
                            options={statusOptions}
                            placeholder="همه وضعیت‌ها"
                            isClearable
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">از تاریخ</label>
                            <DatePicker
                                calendar={persian}
                                locale={persian_fa}
                                value={filters.date_from}
                                onChange={(date) => handleDateChange("date_from", date)}
                                format="YYYY/MM/DD"
                                className="w-full"
                                inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                placeholder="انتخاب تاریخ"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">تا تاریخ</label>
                            <DatePicker
                                calendar={persian}
                                locale={persian_fa}
                                value={filters.date_to}
                                onChange={(date) => handleDateChange("date_to", date)}
                                format="YYYY/MM/DD"
                                className="w-full"
                                inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                placeholder="انتخاب تاریخ"
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
                    <CardTitle>
                        لیست پرسنل
                        {data.totalCount > 0 && (
                            <span className="text-sm font-normal text-gray-500 mr-2">
                                (کل: {data.totalCount} نفر)
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
                        <Empty message="هیچ پرسنلی ثبت نشده است" />
                    ) : (
                        <>
                            <div className="w-full overflow-x-auto">
                                <div className="min-w-[1200px]">
                                    <div className="w-full grid grid-cols-12 gap-2 p-3 bg-gray-100 rounded-t-md">
                                        {columns.map((col, i) => (
                                            <div key={i} className="flex items-center justify-center">
                                                <span className="text-xs font-bold text-gray-600">{col}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col border-x border-b rounded-b-md">
                                        {data.data.map((item, index) => {
                                            const status = getStatusLabel(item.status);
                                            return (
                                                <div
                                                    key={item.id}
                                                    className="w-full grid grid-cols-12 gap-2 px-3 py-3 hover:bg-gray-50 border-b last:border-b-0"
                                                >
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">{index + 1}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">{item.personnel_code || "-"}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs text-center font-medium">
                                                            {item.first_name || ""} {item.last_name || ""}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">{item.father_name || "-"}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">{item.national_code || "-"}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">{item.shenasname_number || "-"}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">{item.birth_date_persian || "-"}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">
                                                            {item.religion == 1 ? "اسلام" :
                                                                item.religion == 2 ? "مسیحی" :
                                                                    item.religion == 3 ? "زرتشتی" :
                                                                        item.religion == 4 ? "کلیمی" : "-"}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">
                                                            {item.marital_status == 1 ? "مجرد" :
                                                                item.marital_status == 2 ? "متاهل" :
                                                                    item.marital_status == 3 ? "مطلقه" : "-"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">
                                                            {item.created_at ? new Date(item.created_at).toLocaleDateString('fa-IR') : "-"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">
                                                            {item.status == 1 ? "تایید شده" : "پیش نویس"}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-center gap-2">
                                                        {item.status != 1 && (
                                                            <Tooltip >
                                                                <TooltipTrigger asChild>
                                                                    <button
                                                                        className="cursor-pointer text-green-600 hover:text-green-900"
                                                                        onClick={() => handleAcceptData(item.user_id)}
                                                                    >
                                                                        <CheckCircle className="w-4 h-4" />
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>تایید وضعیت</TooltipContent>
                                                            </Tooltip>
                                                        )}

                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <button
                                                                    className="cursor-pointer hover:text-blue-600"
                                                                    onClick={() => handleViewDetail(item.user_id)}
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>مشاهده کامل</TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <Pagination totalPage={data.pages} />
                        </>
                    )}
                </CardContent>
            </Card>

            {/* ========== مودال نمایش جزئیات ========== */}
            {showDetailModal && selectedPersonnel && (
                <PersonnelDetailModal
                    personnel={selectedPersonnel}
                    onClose={handleCloseModal}
                    loading={loading}
                />
            )}
        </div>
    );
}