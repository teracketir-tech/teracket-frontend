// src/pages/hrm/performance/monthly-convert/index.jsx

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
import { CheckCircle, XCircle, Calculator, Search, X, Eye, User } from "lucide-react";
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

// ============== Validation Schema ==============
const calculateSchema = yup.object({
    user_id: yup.string().required("انتخاب پرسنل الزامی است"),
    year: yup.string().required("سال الزامی است"),
    month: yup.string().required("ماه الزامی است"),
    date_from: yup.string().nullable(),
    date_to: yup.string().nullable(),
});

// ============== کامپوننت اصلی ==============
export default function MonthlyConvert() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [allWorkgroups, setAllWorkgroups] = useState([]);
    const [data, setData] = useState({ data: [], pages: 0, totalCount: 0 });
    const [summaryResult, setSummaryResult] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [viewingItem, setViewingItem] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [personnelCodeSearch, setPersonnelCodeSearch] = useState("");

    const currentYear = getCurrentPersianYear();
    const currentMonth = getCurrentPersianMonth();
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

    // ============== fetchData ==============
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

    // ============== fetchUsers ==============
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

    // ============== fetchWorkgroups ==============
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

    // ============== جستجوی کاربر با کد پرسنلی ==============
    const searchUserByPersonnelCode = async () => {
        if (!personnelCodeSearch.trim()) {
            toast.warning("لطفاً کد پرسنلی را وارد کنید");
            return;
        }

        try {
            const res = await api(`user?personnel_code=${personnelCodeSearch}`, "GET");

            if (res?.data && res.data.length > 0) {
                const user = res.data[0];
                setSelectedUser(user);
                formik.setFieldValue("user_id", String(user.id));
                toast.success(`کاربر ${user.first_name || ""} ${user.last_name || ""} پیدا شد`);
            } else {
                const personnelRes = await api(`hrm-personnel-basic?personnel_code=${personnelCodeSearch}`, "GET");
                if (personnelRes?.data && personnelRes.data.length > 0) {
                    const basic = personnelRes.data[0];
                    const userRes = await api(`user/${basic.user_id}`, "GET");
                    if (userRes?.success && userRes?.data) {
                        const user = userRes.data;
                        setSelectedUser(user);
                        formik.setFieldValue("user_id", String(user.id));
                        toast.success(`کاربر ${user.first_name || ""} ${user.last_name || ""} پیدا شد`);
                    }
                } else {
                    toast.warning("هیچ کاربری با این کد پرسنلی یافت نشد");
                }
            }
        } catch (error) {
            console.error("Error searching user:", error);
            toast.error("خطا در جستجوی کاربر");
        }
    };

    // ============== کارت کاربر انتخاب شده ==============
    const renderSelectedUser = () => {
        if (!selectedUser) return null;
        return (
            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">
                        {selectedUser.first_name?.[0] || selectedUser.last_name?.[0] || '?'}
                    </div>
                    <div>
                        <p className="font-medium text-green-800">
                            {selectedUser.first_name || ""} {selectedUser.last_name || ""}
                        </p>
                        <div className="flex gap-3 text-xs text-green-600">
                            <span>کد پرسنلی: {selectedUser.personnel_code || "---"}</span>
                            <span>موبایل: {selectedUser.phone_number || "---"}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ============== useEffect ها ==============
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

    // ============== فرم محاسبه ==============
    const formik = useFormik({
        initialValues: {
            user_id: "",
            year: currentYear,
            month: currentMonth.toString().padStart(2, "0"),
            date_from: "",
            date_to: "",
        },
        validationSchema: calculateSchema,
        onSubmit: handleCalculate,
        validateOnChange: true,
        validateOnMount: true,
    });

    // ============== محاسبه عملکرد ماهانه ==============
    async function handleCalculate(values) {
        setLoading(true);
        setShowResult(false);
        setSummaryResult(null);

        const payload = {
            user_id: parseInt(values.user_id),
            year: parseInt(values.year),
            month: parseInt(values.month),
            date_from: values.date_from ? formatDateToEn(values.date_from) : null,
            date_to: values.date_to ? formatDateToEn(values.date_to) : null,
        };

        const res = await api("hrm-monthly-summary/calculate", "POST", payload);

        setLoading(false);

        if (res?.success) {
            setSummaryResult(res.summary);
            setShowResult(true);
            toast.success("محاسبه با موفقیت انجام شد");
            fetchData();
        } else {
            toast.error(res?.message || "خطا در محاسبه");
        }
    }

    // ============== نهایی کردن ==============
    const handleFinalize = async (id) => {
        const res = await api(`hrm-monthly-summary/${id}/finalize`, "POST");
        if (res?.success) {
            toast.success("خلاصه ماهانه نهایی شد");
            fetchData();
        } else {
            toast.error(res?.message || "خطا در نهایی کردن");
        }
    };

    // ============== حذف ==============
    const handleDelete = async (id) => {
        const res = await api(`hrm-monthly-summary/${id}`, "DELETE");
        if (res?.success) {
            toast.success("با موفقیت حذف شد");
            fetchData();
        } else {
            toast.error(res?.message || "خطا در حذف");
        }
    };

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

    // ============== ستون‌های لیست ==============
    const columns = ["ردیف", "کد پرسنلی", "نام و نام خانوادگی", "گروه کاری", "سال", "ماه", "ساعت کارکرد", "ساعت مرخصی", "ساعت ماموریت", "ساعت غیبت", "اضافه کار", "وضعیت", "عملیات"];

    return (
        <div className="w-full space-y-4">
            {/* ========== فرم محاسبه ========== */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calculator className="w-5 h-5" />
                        تبدیل کارکرد روزانه به ماهانه
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    {/* ===== بخش انتخاب پرسنل ===== */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-5">
                        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            انتخاب پرسنل
                        </h3>

                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="flex-[2]">
                                <p className="text-xs text-gray-500 mb-3">
                                    پرسنل را با کد پرسنلی جستجو یا از لیست انتخاب کنید
                                </p>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={personnelCodeSearch}
                                            onChange={(e) => setPersonnelCodeSearch(e.target.value)}
                                            placeholder="کد پرسنلی را وارد کنید..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <Button onClick={searchUserByPersonnelCode} className="flex items-center gap-2">
                                            <Search className="w-4 h-4" />
                                            جستجو
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-[3]">
                                <Select
                                    name="user_id"
                                    title="انتخاب کاربر از لیست"
                                    value={userOptions.find(opt => opt.value === formik.values.user_id) || null}
                                    onChange={(selectedOption) => {
                                        const value = selectedOption || "";
                                        formik.setFieldValue("user_id", value);
                                        if (value) {
                                            const user = users.find(u => String(u.id) === value);
                                            setSelectedUser(user);
                                            if (user?.personnel_code) {
                                                setPersonnelCodeSearch(user.personnel_code);
                                            }
                                        } else {
                                            setSelectedUser(null);
                                            setPersonnelCodeSearch("");
                                        }
                                    }}
                                    options={userOptions}
                                    placeholder="انتخاب پرسنل"
                                    isClearable
                                />
                            </div>
                        </div>

                        {renderSelectedUser()}
                    </div>

                    {/* ===== فرم ===== */}
                    {selectedUser && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Select
                                    name="year"
                                    title="سال (شمسی)"
                                    formik={formik}
                                    options={yearOptions}
                                    placeholder="انتخاب سال"
                                    required
                                />

                                <Select
                                    name="month"
                                    title="ماه"
                                    formik={formik}
                                    options={monthOptions}
                                    placeholder="انتخاب ماه"
                                    required
                                />

                                <div className="flex items-end gap-2">
                                    <Button
                                        onClick={formik.handleSubmit}
                                        isLoading={loading}
                                        disabled={!formik.isValid || loading || !selectedUser}
                                        className="flex items-center gap-2"
                                    >
                                        <Calculator className="w-4 h-4" />
                                        محاسبه
                                    </Button>
                                </div>
                            </div>

                            {/* ====== بازه تاریخ دلخواه (اختیاری) ====== */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">از تاریخ (اختیاری)</label>
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        value={formik.values.date_from}
                                        onChange={(date) => {
                                            formik.setFieldValue("date_from", date?.format() || "");
                                        }}
                                        format="YYYY/MM/DD"
                                        className="w-full"
                                        inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                        placeholder="انتخاب تاریخ"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">تا تاریخ (اختیاری)</label>
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        value={formik.values.date_to}
                                        onChange={(date) => {
                                            formik.setFieldValue("date_to", date?.format() || "");
                                        }}
                                        format="YYYY/MM/DD"
                                        className="w-full"
                                        inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                        placeholder="انتخاب تاریخ"
                                    />
                                </div>

                                <p className="text-xs text-gray-500 col-span-full">
                                    * در صورت عدم انتخاب بازه، کل ماه محاسبه می‌شود
                                </p>
                            </div>
                        </>
                    )}

                    {/* ===== دکمه محاسبه (وقتی پرسنل انتخاب نشده) ===== */}
                    {!selectedUser && (
                        <div className="text-center py-4 text-gray-500 text-sm">
                            برای مشاهده فرم محاسبه، ابتدا پرسنل را انتخاب کنید
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ========== نتیجه محاسبه ========== */}
            {showResult && summaryResult && (
                <Card className="w-full border-green-500 border-2">
                    <CardHeader className="bg-green-50">
                        <CardTitle className="text-green-700 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            نتیجه محاسبه
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <div className="p-3 bg-blue-50 rounded-md text-center">
                                <span className="text-sm text-gray-600">ساعت کارکرد</span>
                                <p className="text-lg font-bold text-blue-700">{summaryResult.total_work_hours}</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-md text-center">
                                <span className="text-sm text-gray-600">ساعت مرخصی</span>
                                <p className="text-lg font-bold text-purple-700">{summaryResult.total_vacation_hours}</p>
                            </div>
                            <div className="p-3 bg-orange-50 rounded-md text-center">
                                <span className="text-sm text-gray-600">ساعت ماموریت</span>
                                <p className="text-lg font-bold text-orange-700">{summaryResult.total_mission_hours}</p>
                            </div>
                            <div className="p-3 bg-red-50 rounded-md text-center">
                                <span className="text-sm text-gray-600">ساعت غیبت</span>
                                <p className="text-lg font-bold text-red-700">{summaryResult.total_absent_hours}</p>
                            </div>
                            <div className="p-3 bg-yellow-50 rounded-md text-center">
                                <span className="text-sm text-gray-600">اضافه کار</span>
                                <p className="text-lg font-bold text-yellow-700">{summaryResult.total_overtime_hours}</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-md text-center">
                                <span className="text-sm text-gray-600">روزهای کاری</span>
                                <p className="text-lg font-bold text-green-700">{summaryResult.work_days}</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-md text-center">
                                <span className="text-sm text-gray-600">روزهای مرخصی</span>
                                <p className="text-lg font-bold text-purple-700">{summaryResult.vacation_days}</p>
                            </div>
                            <div className="p-3 bg-orange-50 rounded-md text-center">
                                <span className="text-sm text-gray-600">روزهای ماموریت</span>
                                <p className="text-lg font-bold text-orange-700">{summaryResult.mission_days}</p>
                            </div>
                            <div className="p-3 bg-red-50 rounded-md text-center">
                                <span className="text-sm text-gray-600">روزهای غیبت</span>
                                <p className="text-lg font-bold text-red-700">{summaryResult.absent_days}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md text-center">
                                <span className="text-sm text-gray-600">روزهای تعطیل</span>
                                <p className="text-lg font-bold text-gray-700">{summaryResult.holiday_days}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ========== فیلترها ========== */}
            <Card className="w-full">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">جستجو در خلاصه عملکرد ماهانه</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* ========== لیست خلاصه ماهانه ========== */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>لیست خلاصه عملکرد ماهانه</CardTitle>
                </CardHeader>

                <CardContent>
                    {listLoading ? (
                        <div className="flex justify-center py-10">
                            <Loading />
                        </div>
                    ) : data?.data?.length === 0 ? (
                        <Empty message="هیچ خلاصه ماهانه‌ای ثبت نشده است" />
                    ) : (
                        <>
                            <div className="w-full overflow-x-auto">
                                <div className="min-w-[1300px]">
                                    <div className="w-full grid grid-cols-13 gap-2 p-3 bg-gray-100 rounded-t-md">
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
                                                    className="w-full grid grid-cols-13 gap-2 px-3 py-3 hover:bg-gray-50 border-b last:border-b-0"
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
                                                        <span className="text-xs">{item.total_work_hours || 0}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">{item.total_vacation_hours || 0}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">{item.total_mission_hours || 0}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">{item.total_absent_hours || 0}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs text-yellow-600">{item.total_overtime_hours || 0}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className={`text-xs font-medium ${status.color}`}>
                                                            {status.label}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <button
                                                                    className="cursor-pointer hover:text-blue-600"
                                                                    onClick={() => handleView(item)}
                                                                >
                                                                    <Eye className="w-3.5 h-3.5" />
                                                                </button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>مشاهده</TooltipContent>
                                                        </Tooltip>

                                                        {checkAccess([703]) && item.status === 0 && (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <button
                                                                        className="cursor-pointer hover:text-green-600"
                                                                        onClick={() => handleFinalize(item.id)}
                                                                    >
                                                                        <CheckCircle className="w-4 h-4" />
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>نهایی کردن</TooltipContent>
                                                            </Tooltip>
                                                        )}

                                                        {checkAccess([704]) && (
                                                            <Confirm
                                                                title="حذف خلاصه ماهانه"
                                                                onConfirm={() => handleDelete(item.id)}
                                                            >
                                                                <button className="cursor-pointer hover:text-red-600">
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <XCircle className="w-4 h-4 text-red-500" />
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>حذف</TooltipContent>
                                                                    </Tooltip>
                                                                </button>
                                                            </Confirm>
                                                        )}
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
            {showViewModal && viewingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">جزئیات خلاصه ماهانه</h3>
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
                                <div className="p-2 bg-gray-50 rounded text-center">
                                    <span className="text-xs text-gray-500">وضعیت</span>
                                    <p className={`font-medium text-sm ${getStatusLabel(viewingItem.status).color}`}>
                                        {getStatusLabel(viewingItem.status).label}
                                    </p>
                                </div>
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