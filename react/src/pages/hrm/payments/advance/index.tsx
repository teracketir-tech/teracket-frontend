// src/pages/hrm/payments/advance/index.tsx

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
import { PenBox, Trash2Icon, CheckCircle, Search, X, Eye, User } from "lucide-react";
import Confirm from "@/components/ui/confirm";
import { checkAccess, formatDateToFa, formatDateToEn } from "@/lib/utils";

// ============== توابع ==============
const yearsList = () => {
    const currentYear =1405;
    const YearsArray = [];
    for (let year = currentYear - 15; year <= currentYear + 15; year++) {
        YearsArray.push(year);
    }
    return YearsArray;
};

const validationSchema = yup.object({
    user_id: yup.string().required("انتخاب پرسنل الزامی است"),
    amount: yup.number().required("مبلغ مساعده الزامی است").min(1, "مبلغ باید بیشتر از 0 باشد"),
    month: yup.string().required("ماه الزامی است"),
    year: yup.string().required("سال الزامی است"),
    description: yup.string().nullable(),
});

export default function Advance() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [viewingItem, setViewingItem] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [data, setData] = useState({ data: [], pages: 0, totalCount: 0 });
    const [currentYear, setCurrentYear] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [personnelCodeSearch, setPersonnelCodeSearch] = useState("");
    
    const [filters, setFilters] = useState({
        user_id: searchParams.get("user_id") || "",
        personnel_code: searchParams.get("personnel_code") || "",
        national_code: searchParams.get("national_code") || "",
        month: searchParams.get("month") || "",
        year: searchParams.get("year") || "",
        status: searchParams.get("status") || "",
    });

    const yearOptions = yearsList().map((item) => ({
        value: String(item),
        label: String(item),
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
        { value: "", label: "همه وضعیت ها" },
        { value: "0", label: "تسویه نشده" },
        { value: "1", label: "تسویه شده" },
    ];

    // ============== دریافت سال فعال ==============
    const getCurrentPersianYear = async () => {
        const today = new Date();
        const persianDate = formatDateToFa(today);
        const pyear = persianDate.split('/')[0];
        
        try {
            const activeYear = await api("hrm-financial-year/active", "GET");
            if (activeYear?.success) {
                const year = String(activeYear?.data?.year || pyear);
                setCurrentYear(year);
                formik.setFieldValue("year", year);
             //   setFilters(prev => ({ ...prev, year: year }));
                return;
            }
        } catch (error) {
            console.error("Error fetching active year:", error);
        }
        
        setCurrentYear(pyear);
        formik.setFieldValue("year", pyear);
        //setFilters(prev => ({ ...prev, year: pyear }));
    };

    const fetchData = async () => {
        const params = new URLSearchParams();
        
        if (filters.user_id) params.set("user_id", filters.user_id);
        if (filters.personnel_code) params.set("personnel_code", filters.personnel_code);
        if (filters.national_code) params.set("national_code", filters.national_code);
        if (filters.month) params.set("month", filters.month);
        if (filters.year) params.set("year", filters.year);
        if (filters.status !== "") params.set("status", filters.status);
        
        const page = searchParams.get("page");
        const perPage = searchParams.get("per-page");
        if (page) params.set("page", page);
        if (perPage) params.set("per-page", perPage);
        
        const query = params.toString();

        setListLoading(true);
        try {
            const res = await api(`hrm-advance?${query}`, "GET");
            setData(res || { data: [], pages: 0 });
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
    }, [filters]);

    useEffect(() => {
        getCurrentPersianYear();
        fetchOptions();
    }, []);

    const fetchOptions = async () => {
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

    // ============== نمایش اطلاعات کاربر انتخاب شده ==============
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

    const formik = useFormik({
        initialValues: {
            user_id: "",
            amount: "",
            month: "",
            year: "",
            description: "",
        },
        validationSchema,
        onSubmit: handleSubmit,
        validateOnChange: true,
        validateOnMount: true,
    });

    const handleEdit = (item) => {
        setEditingItem(item);
        const user = users.find(u => String(u.id) === item.user_id);
        if (user) {
            setSelectedUser(user);
            setPersonnelCodeSearch(user.personnel_code || "");
        }
        formik.setValues({
            user_id: item.user_id || "",
            amount: item.amount || "",
            month: item.month || "",
            year: item.year || "",
            description: item.description || "",
        });
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        setSelectedUser(null);
        setPersonnelCodeSearch("");
        formik.resetForm();
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

    async function handleSubmit(values) {
        setLoading(true);

        const url = editingItem 
            ? `hrm-advance/${editingItem.id}` 
            : "hrm-advance";

        const res = await api(url, editingItem ? "PATCH" : "POST", {
            ...values,
            user_id: parseInt(values.user_id),
            amount: parseInt(values.amount),
            month: parseInt(values.month),
            year: parseInt(values.year),
        });

        setLoading(false);

        if (res?.success) {
            toast.success(editingItem ? "مساعده با موفقیت ویرایش شد" : "مساعده با موفقیت ثبت شد");
            setEditingItem(null);
            setSelectedUser(null);
            setPersonnelCodeSearch("");
            formik.resetForm();
            getCurrentPersianYear();
            fetchData();
        } else {
            toast.error(res?.message || "خطا در ثبت اطلاعات");
        }
    }

    const handleDelete = async (id) => {
        const res = await api(`hrm-advance/${id}`, "DELETE");
        if (res?.success) {
            toast.success("مساعده با موفقیت حذف شد");
            fetchData();
        } else {
            toast.error(res?.message || "خطا در حذف");
        }
    };

    const handleSettle = async (id) => {
        const res = await api(`hrm-advance/${id}/settle`, "POST");
        if (res?.success) {
            toast.success("مساعده با موفقیت تسویه شد");
            fetchData();
        } else {
            toast.error(res?.message || "خطا در تسویه");
        }
    };

    // ============== مدیریت فیلترها ==============
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFilterSelectChange = (name, selectedOption) => {
        setFilters(prev => ({
            ...prev,
            [name]: selectedOption || "",
        }));
    };

    const handleSearch = () => {
        fetchData();
    };

    const handleClearFilters = () => {
        setFilters({
            user_id: "",
            personnel_code: "",
            national_code: "",
            month: "",
            year:  "",
            status: "",
        });
        setSearchParams({});
    };

    const userOptions = users.map((item) => ({
        value: String(item.id),
        label: `${item.first_name || ""} ${item.last_name || ""} (${item.personnel_code || item.phone_number || ""})`,
    }));

    const userFilterOptions = users.map((item) => ({
        value: String(item.id),
        label: `${item.first_name || ""} ${item.last_name || ""} (${item.personnel_code || item.phone_number || ""})`,
    }));

    const getMonthLabel = (month) => {
        const months = {
            1: "فروردین", 2: "اردیبهشت", 3: "خرداد",
            4: "تیر", 5: "مرداد", 6: "شهریور",
            7: "مهر", 8: "آبان", 9: "آذر",
            10: "دی", 11: "بهمن", 12: "اسفند"
        };
        return months[month] || "نامشخص";
    };

    const getStatusLabel = (status) => {
        if (status === 1) {
            return { label: "تسویه شده", color: "text-green-600" };
        }
        return { label: "تسویه نشده", color: "text-red-600" };
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat("fa-IR").format(num);
    };

    const columns = ["ردیف", "سال", "ماه", "کد پرسنلی", "نام و نام خانوادگی", "مبلغ مساعده (ریال)", "تاریخ ثبت", "وضعیت مساعده", "عملیات"];

    return (
        <div className="w-full space-y-4">
            {/* ========== فرم ثبت/ویرایش ========== */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{editingItem ? "ویرایش مساعده" : "ثبت مساعده"}</CardTitle>
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
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            <Input
                                type="number"
                                name="amount"
                                title="مبلغ مساعده (ریال)"
                                formik={formik}
                                placeholder="مثال: ۵,۰۰۰,۰۰۰"
                                required
                                min={1}
                            />

                            <Select
                                name="month"
                                title="ماه"
                                formik={formik}
                                options={monthOptions}
                                placeholder="انتخاب ماه"
                                required
                            />

                            <Select
                                name="year"
                                title="سال"
                                formik={formik}
                                options={yearOptions}
                                placeholder="انتخاب سال"
                                required
                            />

                            <div className="col-span-full">
                                <Input
                                    type="textarea"
                                    name="description"
                                    title="توضیحات"
                                    formik={formik}
                                    placeholder="توضیحات (اختیاری)"
                                    rows={2}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 mt-5">
                        <Button
                            onClick={formik.handleSubmit}
                            isLoading={loading}
                            disabled={!formik.isValid || loading || !selectedUser}
                        >
                            {editingItem ? "ویرایش" : "ثبت"}
                        </Button>
                        {editingItem && (
                            <Button variant="secondary" onClick={handleCancelEdit}>
                                انصراف
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* ============== فیلترها ============== */}
            <Card className="w-full">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">جستجو در مساعده‌ها</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* نام پرسنل */}
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

                        {/* کد پرسنلی */}
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

                        {/* کد ملی */}
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

                        {/* ماه */}
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

                        {/* سال */}
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

                        {/* وضعیت */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                وضعیت
                            </label>
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

                    <div className="flex items-end gap-2 mt-4">
                        <Button onClick={handleSearch} className="flex items-center gap-2">
                            <Search className="w-4 h-4" />
                            جستجو
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleClearFilters}
                            className="flex items-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            پاک کردن
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* ============== لیست ============== */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>لیست مساعده‌ها</CardTitle>
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
                                <div className="min-w-[900px]">
                                    <div className="w-full grid grid-cols-9 gap-4 p-3 bg-gray-100 rounded-t-md">
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
                                                    className="w-full grid grid-cols-9 gap-4 px-3 py-3 hover:bg-gray-50 border-b last:border-b-0"
                                                >
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">{index + 1}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">{item.year}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">{getMonthLabel(item.month)}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">{item?.user?.personnel_code || item?.user?.phone_number || "-"}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs text-center">
                                                            {item?.user?.first_name || ""} {item?.user?.last_name || ""}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs font-bold">{formatNumber(item.amount)}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">
                                                            {item.created_at ? new Date(item.created_at).toLocaleDateString("fa-IR") : "-"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className={`text-xs font-medium ${status.color}`}>
                                                            {status.label}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-center gap-2">
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

                                                        {checkAccess([703]) && item.status === 0 && (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <button
                                                                        className="cursor-pointer hover:text-blue-600"
                                                                        onClick={() => handleEdit(item)}
                                                                    >
                                                                        <PenBox className="w-4 h-4" />
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>ویرایش</TooltipContent>
                                                            </Tooltip>
                                                        )}

                                                        {checkAccess([703]) && item.status === 0 && (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <button
                                                                        className="cursor-pointer hover:text-green-600"
                                                                        onClick={() => handleSettle(item.id)}
                                                                    >
                                                                        <CheckCircle className="w-4 h-4" />
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>تسویه</TooltipContent>
                                                            </Tooltip>
                                                        )}

                                                        {checkAccess([704]) && (
                                                            <Confirm
                                                                title="حذف مساعده"
                                                                onConfirm={() => handleDelete(item.id)}
                                                            >
                                                                <button className="cursor-pointer hover:text-red-600">
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Trash2Icon className="w-4 h-4 text-red-500" />
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
                            <h3 className="text-lg font-semibold">جزئیات مساعده</h3>
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
                                    <p className="font-medium text-sm">{viewingItem?.user?.personnel_code || viewingItem?.user?.phone_number || "-"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">سال</span>
                                    <p className="font-medium text-sm">{viewingItem.year}</p>
                                </div>
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">ماه</span>
                                    <p className="font-medium text-sm">{getMonthLabel(viewingItem.month)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 bg-blue-50 rounded">
                                    <span className="text-xs text-gray-500">مبلغ</span>
                                    <p className="font-bold text-blue-700">{formatNumber(viewingItem.amount)} ریال</p>
                                </div>
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">وضعیت</span>
                                    <p className={`font-medium text-sm ${getStatusLabel(viewingItem.status).color}`}>
                                        {getStatusLabel(viewingItem.status).label}
                                    </p>
                                </div>
                            </div>

                            {viewingItem.description && (
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">توضیحات</span>
                                    <p className="font-medium text-sm">{viewingItem.description}</p>
                                </div>
                            )}
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