// src/pages/hrm/performance/monthly/index.jsx

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
import { FileSpreadsheet, Search, X, Eye, Printer, Download } from "lucide-react";
import { checkAccess, formatDateToFa, formatDateToEn } from "@/lib/utils";

// ============== توابع کمکی ==============
const getCurrentPersianYear = () => {
    const today = new Date();
    const persianDate = formatDateToFa(today);
    return persianDate.split('/')[0];
};

const getYearOptions = () => {
    const years = [];
    for (let i = 1405 - 15; i <= 1405 + 15; i++) {
        years.push({ value: String(i), label: String(i) });
    }
    return years;
};

// ============== گزینه‌های ثابت ==============
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
];

// ============== کامپوننت اصلی ==============
export default function MonthlyReport() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [listLoading, setListLoading] = useState(false);
    const [data, setData] = useState({ data: [], pages: 0, totalCount: 0 });
    const [users, setUsers] = useState([]);
    const [allWorkgroups, setAllWorkgroups] = useState([]);
    const [viewingItem, setViewingItem] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    const currentYear = getCurrentPersianYear();
    const yearOptions = getYearOptions();

    // ============== فیلترها ==============
    const [filters, setFilters] = useState({
        user_id: searchParams.get("user_id") || "",
        year: searchParams.get("year") || "",
        month: searchParams.get("month") || "",
        status: searchParams.get("status") || "",
        personnel_code: searchParams.get("personnel_code") || "",
        national_code: searchParams.get("national_code") || "",
        workgroup_id: searchParams.get("workgroup_id") || "",
    });

    // ============== دریافت لیست ==============
    const fetchData = async () => {
        const params = new URLSearchParams();

        if (filters.user_id) params.set("user_id", filters.user_id);
        if (filters.year) params.set("year", filters.year);
        if (filters.month) params.set("month", filters.month);
        if (filters.status !== "") params.set("status", filters.status);
        if (filters.personnel_code) params.set("personnel_code", filters.personnel_code);
        if (filters.national_code) params.set("national_code", filters.national_code);
        if (filters.workgroup_id) params.set("workgroup_id", filters.workgroup_id);

        const page = searchParams.get("page");
        const perPage = searchParams.get("per-page");
        if (page) params.set("page", page);
        if (perPage) params.set("per-page", perPage);

        const query = params.toString();

        setListLoading(true);
        try {
            const res = await api(`hrm-monthly-summary?${query}`, "GET");
            setData(res || { data: [], pages: 0 });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setListLoading(false);
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
    const fetchAllWorkgroups = async () => {
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
        const timer = setTimeout(() => {
            fetchData();
        }, 300);
        return () => clearTimeout(timer);
    }, [filters]);

    useEffect(() => {
        fetchUsers();
        fetchAllWorkgroups();
    }, []);

    // ============== مدیریت فیلترها ==============
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleFilterSelectChange = (name, selectedOption) => {
        setFilters(prev => ({ ...prev, [name]: selectedOption || "" }));
    };

    const handleSearch = () => {
        fetchData();
    };

    const handleClearFilters = () => {
        setFilters({
            user_id: "",
            year: "",
            month: "",
            status: "",
            personnel_code: "",
            national_code: "",
            workgroup_id: "",
        });
        setSearchParams({});
    };

    // ============== مشاهده جزئیات ==============
    const handleView = (item) => {
        setViewingItem(item);
        setShowViewModal(true);
    };

    const handleCloseViewModal = () => {
        setShowViewModal(false);
        setViewingItem(null);
    };

    // ============== خروجی اکسل ==============
    const handleExportExcel = () => {
        toast.info("در حال آماده‌سازی خروجی اکسل...");
    };

    // ============== چاپ ==============
    const handlePrint = () => {
        window.print();
    };

    // ============== تبدیل داده‌ها ==============
    const userOptions = users.map((item) => ({
        value: String(item.id),
        label: `${item.first_name || ""} ${item.last_name || ""} (${item.personnel_code || ""})`,
    }));

    const workgroupOptions = allWorkgroups;

    const getStatusLabel = (status) => {
        if (status === 1) {
            return { label: "نهایی", color: "text-green-600" };
        }
        return { label: "پیش‌نویس", color: "text-yellow-600" };
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

    // ============== محاسبه مجموع ==============
    const calculateTotal = (data, field) => {
        return data.reduce((sum, item) => {
            const value = parseFloat(item[field]) || 0;
            return sum + value;
        }, 0);
    };

    // ============== ستون‌های لیست ==============
    const columns = [
        "ردیف",
        "کد پرسنلی",
        "نام و نام خانوادگی",
        "گروه کاری",
        "سال",
        "ماه",
        "ساعت کارکرد",
        "ساعت مرخصی",
        "ساعت ماموریت",
        "ساعت غیبت",
        "اضافه کار",
        "روزهای کاری",
        "وضعیت",
        "عملیات",
    ];

    // ============== رندر ==============
    return (
        <div className="w-full space-y-4">
            {/* ========== عنوان ========== */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FileSpreadsheet className="w-6 h-6" />
                    گزارش کارکرد ماهانه
                </h2>
                <div className="flex gap-2">
                   {/* <Button variant="secondary" onClick={handleExportExcel} className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        خروجی اکسل
                    </Button>
                    <Button variant="secondary" onClick={handlePrint} className="flex items-center gap-2">
                        <Printer className="w-4 h-4" />
                        چاپ
                    </Button>*/}
                </div>
            </div>

            {/* ========== فیلترها ========== */}
            <Card className="w-full">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">فیلترهای گزارش</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* نام پرسنل */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">نام پرسنل</label>
                            <Select
                                name="user_id"
                                value={userOptions.find(opt => opt.value === filters.user_id) || null}
                                onChange={(opt) => handleFilterSelectChange("user_id", opt)}
                                options={userOptions}
                                placeholder="همه پرسنل"
                                isClearable
                            />
                        </div>

                        {/* کد پرسنلی */}
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

                        {/* کد ملی */}
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

                        {/* گروه کاری */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">گروه کاری</label>
                            <Select
                                name="workgroup_id"
                                value={workgroupOptions.find(opt => opt.value === filters.workgroup_id) || null}
                                onChange={(opt) => handleFilterSelectChange("workgroup_id", opt)}
                                options={workgroupOptions}
                                placeholder="همه گروه‌ها"
                                isClearable
                            />
                        </div>

                        {/* سال */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">سال</label>
                            <Select
                                name="year"
                                value={yearOptions.find(opt => opt.value === filters.year) || null}
                                onChange={(opt) => handleFilterSelectChange("year", opt)}
                                options={yearOptions}
                                placeholder="همه سال‌ها"
                                isClearable
                                isSearchable
                            />
                        </div>

                        {/* ماه */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">ماه</label>
                            <Select
                                name="month"
                                value={monthOptions.find(opt => opt.value === filters.month) || null}
                                onChange={(opt) => handleFilterSelectChange("month", opt)}
                                options={monthOptions}
                                placeholder="همه ماه‌ها"
                                isClearable
                            />
                        </div>

                        {/* وضعیت */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">وضعیت</label>
                            <Select
                                name="status"
                                value={statusOptions.find(opt => opt.value === filters.status) || null}
                                onChange={(opt) => handleFilterSelectChange("status", opt)}
                                options={statusOptions}
                                placeholder="همه وضعیت‌ها"
                                isClearable
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
                        لیست کارکرد ماهانه
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
                                <div className="min-w-[1400px]">
                                    <div className="w-full grid grid-cols-14 gap-2 p-3 bg-gray-100 rounded-t-md">
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
                                                    className="w-full grid grid-cols-14 gap-2 px-3 py-3 hover:bg-gray-50 border-b last:border-b-0"
                                                >
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">{index + 1}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">{item?.user?.personnel_code || "-"}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs text-center">
                                                            {item?.user?.first_name || ""} {item?.user?.last_name || ""}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">{item?.user?.workgroup_name || "-"}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">{item.year}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">{getMonthName(item.month)}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs font-bold text-blue-600">
                                                            {item.total_work_hours || 0}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs text-purple-600">
                                                            {item.total_vacation_hours || 0}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs text-orange-600">
                                                            {item.total_mission_hours || 0}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs text-red-600">
                                                            {item.total_absent_hours || 0}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs font-bold text-yellow-600">
                                                            {item.total_overtime_hours || 0}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">{item.work_days_count || 0}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className={`text-xs font-medium ${status.color}`}>
                                                            {status.label}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <button
                                                                    className="cursor-pointer hover:text-blue-600"
                                                                    onClick={() => handleView(item)}
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>مشاهده</TooltipContent>
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

            {/* ========== خلاصه آماری ========== */}
            {data?.data?.length > 0 && (
                <Card className="w-full bg-gray-50">
                    <CardContent className="pt-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">خلاصه آماری</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {(() => {
                                const totalWork = calculateTotal(data.data, 'total_work_hours');
                                const totalVacation = calculateTotal(data.data, 'total_vacation_hours');
                                const totalMission = calculateTotal(data.data, 'total_mission_hours');
                                const totalAbsent = calculateTotal(data.data, 'total_absent_hours');
                                const totalOvertime = calculateTotal(data.data, 'total_overtime_hours');
                                return (
                                    <>
                                        <div className="p-3 bg-blue-100 rounded-md text-center">
                                            <span className="text-xs text-gray-600">مجموع کارکرد</span>
                                            <p className="text-lg font-bold text-blue-700">{totalWork.toFixed(2)}</p>
                                        </div>
                                        <div className="p-3 bg-purple-100 rounded-md text-center">
                                            <span className="text-xs text-gray-600">مجموع مرخصی</span>
                                            <p className="text-lg font-bold text-purple-700">{totalVacation.toFixed(2)}</p>
                                        </div>
                                        <div className="p-3 bg-orange-100 rounded-md text-center">
                                            <span className="text-xs text-gray-600">مجموع ماموریت</span>
                                            <p className="text-lg font-bold text-orange-700">{totalMission.toFixed(2)}</p>
                                        </div>
                                        <div className="p-3 bg-red-100 rounded-md text-center">
                                            <span className="text-xs text-gray-600">مجموع غیبت</span>
                                            <p className="text-lg font-bold text-red-700">{totalAbsent.toFixed(2)}</p>
                                        </div>
                                        <div className="p-3 bg-yellow-100 rounded-md text-center">
                                            <span className="text-xs text-gray-600">مجموع اضافه کار</span>
                                            <p className="text-lg font-bold text-yellow-700">{totalOvertime.toFixed(2)}</p>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ========== مودال نمایش جزئیات ========== */}
            {showViewModal && viewingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">جزئیات کارکرد ماهانه</h3>
                            <button
                                onClick={handleCloseViewModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">پرسنل</span>
                                    <p className="font-medium text-sm">
                                        {viewingItem?.user?.first_name || ""} {viewingItem?.user?.last_name || ""}
                                    </p>
                                </div>
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">کد پرسنلی</span>
                                    <p className="font-medium text-sm">{viewingItem?.user?.personnel_code || "-"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">گروه کاری</span>
                                    <p className="font-medium text-sm">{viewingItem?.user?.workgroup_name || "-"}</p>
                                </div>
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">کد ملی</span>
                                    <p className="font-medium text-sm">{viewingItem?.user?.national_code || "-"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">سال</span>
                                    <p className="font-medium text-sm">{viewingItem.year}</p>
                                </div>
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">ماه</span>
                                    <p className="font-medium text-sm">{getMonthName(viewingItem.month)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div className="p-2 bg-blue-50 rounded text-center">
                                    <span className="text-xs text-gray-500">ساعت کارکرد</span>
                                    <p className="font-bold text-blue-700">{viewingItem.total_work_hours || 0}</p>
                                </div>
                                <div className="p-2 bg-purple-50 rounded text-center">
                                    <span className="text-xs text-gray-500">ساعت مرخصی</span>
                                    <p className="font-bold text-purple-700">{viewingItem.total_vacation_hours || 0}</p>
                                </div>
                                <div className="p-2 bg-orange-50 rounded text-center">
                                    <span className="text-xs text-gray-500">ساعت ماموریت</span>
                                    <p className="font-bold text-orange-700">{viewingItem.total_mission_hours || 0}</p>
                                </div>
                                <div className="p-2 bg-red-50 rounded text-center">
                                    <span className="text-xs text-gray-500">ساعت غیبت</span>
                                    <p className="font-bold text-red-700">{viewingItem.total_absent_hours || 0}</p>
                                </div>
                                <div className="p-2 bg-yellow-50 rounded text-center">
                                    <span className="text-xs text-gray-500">اضافه کار</span>
                                    <p className="font-bold text-yellow-700">{viewingItem.total_overtime_hours || 0}</p>
                                </div>
                                <div className="p-2 bg-green-50 rounded text-center">
                                    <span className="text-xs text-gray-500">روزهای کاری</span>
                                    <p className="font-bold text-green-700">{viewingItem.work_days_count || 0}</p>
                                </div>
                            </div>

                            <div className="p-2 bg-gray-50 rounded">
                                <span className="text-xs text-gray-500">وضعیت</span>
                                <p className={`font-medium text-sm ${getStatusLabel(viewingItem.status).color}`}>
                                    {getStatusLabel(viewingItem.status).label}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end">
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