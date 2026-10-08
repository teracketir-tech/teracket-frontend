// src/pages/hrm/end-year/bonus/index.jsx

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
    CheckCircle, XCircle, Calculator, Search, X, 
    DollarSign, Users, Calendar, FileText, CreditCard,
    Eye, PenBox, Trash2Icon
} from "lucide-react";
import Confirm from "@/components/ui/confirm";
import { checkAccess, formatDateToFa, formatDateToEn } from "@/lib/utils";

// ============== توابع کمکی ==============
const getCurrentPersianYear = () => {
    const today = new Date();
    const persianDate = formatDateToFa(today);
    return persianDate.split('/')[0];
};

// ============== Validation Schema ==============
const calculateSchema = yup.object({
    user_id: yup.string().required("انتخاب پرسنل الزامی است"),
    year: yup.string().required("سال الزامی است"),
});

// ============== کامپوننت اصلی ==============
export default function BonusSettlement() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [data, setData] = useState({ data: [], pages: 0, totalCount: 0 });
    const [showResult, setShowResult] = useState(false);
    const [calculatedData, setCalculatedData] = useState(null);
    const [viewingItem, setViewingItem] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    const currentYear = getCurrentPersianYear();

    // فیلترها
    const [filters, setFilters] = useState({
        user_id: searchParams.get("user_id") || "",
        year: searchParams.get("year") || "",
        status: searchParams.get("status") || "",
    });

    // ============== دریافت لیست ==============
    const fetchData = async () => {
        const params = new URLSearchParams();
        
        if (filters.user_id) params.set("user_id", filters.user_id);
        if (filters.year) params.set("year", filters.year);
        if (filters.status !== "") params.set("status", filters.status);
        
        const page = searchParams.get("page");
        const perPage = searchParams.get("per-page");
        if (page) params.set("page", page);
        if (perPage) params.set("per-page", perPage);
        
        const query = params.toString();

        setListLoading(true);
        try {
            const res = await api(`hrm-bonus-settlement?${query}`, "GET");
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

    // ============== useEffect با debounce ==============
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(timer);
    }, [filters]);

    useEffect(() => {
        fetchUsers();
    }, []);

    // ============== فرم محاسبه ==============
    const formik = useFormik({
        initialValues: {
            user_id: "",
            year: currentYear,
        },
        validationSchema: calculateSchema,
        onSubmit: handleCalculate,
        validateOnChange: true,
        validateOnMount: true,
    });

    // ============== محاسبه تسویه آخر سال ==============
    async function handleCalculate(values) {
        setLoading(true);
        setShowResult(false);
        setCalculatedData(null);

        const payload = {
            user_id: parseInt(values.user_id),
            year: parseInt(values.year),
        };

        const res = await api("hrm-bonus-settlement/calculate", "POST", payload);

        setLoading(false);

        if (res?.success) {
            setCalculatedData(res.calculated);
            setShowResult(true);
            toast.success("محاسبه تسویه آخر سال با موفقیت انجام شد");
            fetchData();
        } else {
            toast.error(res?.message || "خطا در محاسبه تسویه");
        }
    }

    // ============== تایید ==============
    const handleApprove = async (id) => {
        const res = await api(`hrm-bonus-settlement/${id}/approve`, "POST");
        if (res?.success) {
            toast.success("تسویه با موفقیت تایید شد");
            fetchData();
        } else {
            toast.error(res?.message || "خطا در تایید");
        }
    };

    // ============== پرداخت ==============
    const handlePay = async (id) => {
        const res = await api(`hrm-bonus-settlement/${id}/pay`, "POST");
        if (res?.success) {
            toast.success("تسویه با موفقیت پرداخت شد");
            fetchData();
        } else {
            toast.error(res?.message || "خطا در پرداخت");
        }
    };

    // ============== حذف ==============
    const handleDelete = async (id) => {
        const res = await api(`hrm-bonus-settlement/${id}`, "DELETE");
        if (res?.success) {
            toast.success("با موفقیت حذف شد");
            fetchData();
        } else {
            toast.error(res?.message || "خطا در حذف");
        }
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

    // ============== مدیریت فیلترها ==============
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleFilterSelectChange = (name, selectedOption) => {
        setFilters(prev => ({ ...prev, [name]: selectedOption || "" }));
    };

    const handleSearch = () => fetchData();

    const handleClearFilters = () => {
        setFilters({
            user_id: "",
            year: "",
            status: "",
        });
        setSearchParams({});
    };

    // ============== تبدیل داده‌ها ==============
    const userOptions = users.map((item) => ({
        value: String(item.id),
        label: `${item.first_name || ""} ${item.last_name || ""}`.trim() || item.phone_number || `کاربر ${item.id}`,
    }));

    const statusOptions = [
        { value: "", label: "همه وضعیت‌ها" },
        { value: "0", label: "پیش‌نویس" },
        { value: "1", label: "تایید شده" },
        { value: "2", label: "پرداخت شده" },
    ];

    const getStatusLabel = (status) => {
        const labels = {
            0: { label: "پیش‌نویس", color: "text-yellow-600" },
            1: { label: "تایید شده", color: "text-blue-600" },
            2: { label: "پرداخت شده", color: "text-green-600" },
        };
        return labels[status] || { label: "نامشخص", color: "text-gray-400" };
    };

    const formatNumber = (num) => {
        if (!num) return "۰";
        return new Intl.NumberFormat("fa-IR").format(num);
    };

    // ============== ستون‌های لیست ==============
    const columns = [
        "ردیف", 
        "پرسنل", 
        "سال", 
        "روزهای کارکرد", 
        "حقوق پایه", 
        "مبلغ عیدی", 
        "سنوات", 
        "پایه سنوات", 
        "وضعیت", 
        "عملیات"
    ];

    return (
        <div className="w-full space-y-4">
            {/* ========== عنوان ========== */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <DollarSign className="w-6 h-6" />
                    تسویه حساب آخر سال
                </h2>
            </div>

            {/* ========== فرم محاسبه ========== */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calculator className="w-5 h-5" />
                        محاسبه تسویه آخر سال (عیدی + سنوات + پایه سنوات)
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select
                            name="user_id"
                            title="پرسنل"
                            formik={formik}
                            options={userOptions}
                            placeholder="انتخاب پرسنل"
                            required
                            onChange={(selectedOption) => {
                                formik.setFieldValue("user_id", selectedOption?.value || "");
                            }}
                        />

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">سال (شمسی)</label>
                            <input
                                type="number"
                                name="year"
                                value={formik.values.year}
                                onChange={(e) => formik.setFieldValue("year", e.target.value)}
                                placeholder="مثال: ۱۴۰۴"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                min={1300}
                            />
                            {formik.touched.year && formik.errors.year && (
                                <div className="text-xs text-red-500 mt-1">{formik.errors.year}</div>
                            )}
                        </div>

                        <div className="flex items-end gap-2">
                            <Button
                                onClick={formik.handleSubmit}
                                isLoading={loading}
                                disabled={!formik.isValid || loading}
                            >
                                محاسبه تسویه
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ========== نتیجه محاسبه ========== */}
            {showResult && calculatedData && (
                <Card className="w-full border-green-500 border-2">
                    <CardHeader className="bg-green-50">
                        <CardTitle className="text-green-700 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            نتیجه محاسبه تسویه آخر سال
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-3 bg-blue-50 rounded-md text-center">
                                <span className="text-sm text-gray-600">روزهای کارکرد</span>
                                <p className="text-lg font-bold text-blue-700">{calculatedData.work_days || 0}</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-md text-center">
                                <span className="text-sm text-gray-600">حقوق پایه</span>
                                <p className="text-lg font-bold text-purple-700">{formatNumber(calculatedData.base_salary)} ریال</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-md text-center">
                                <span className="text-sm text-gray-600">مبلغ عیدی</span>
                                <p className="text-lg font-bold text-green-700">{formatNumber(calculatedData.bonus_amount)} ریال</p>
                            </div>
                            <div className="p-3 bg-orange-50 rounded-md text-center">
                                <span className="text-sm text-gray-600">سال‌های سابقه</span>
                                <p className="text-lg font-bold text-orange-700">{calculatedData.service_years || 0} سال</p>
                            </div>
                            <div className="p-3 bg-red-50 rounded-md text-center">
                                <span className="text-sm text-gray-600">مبلغ سنوات</span>
                                <p className="text-lg font-bold text-red-700">{formatNumber(calculatedData.seniority_amount)} ریال</p>
                            </div>
                            <div className="p-3 bg-indigo-50 rounded-md text-center">
                                <span className="text-sm text-gray-600">پایه سنوات</span>
                                <p className="text-lg font-bold text-indigo-700">{formatNumber(calculatedData.base_seniority_amount)} ریال</p>
                            </div>
                            <div className="p-3 bg-teal-50 rounded-md text-center col-span-2">
                                <span className="text-sm text-gray-600">مجموع تسویه</span>
                                <p className="text-xl font-bold text-teal-700">{formatNumber(calculatedData.total_settlement)} ریال</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ========== فیلترها ========== */}
            <Card className="w-full">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">جستجو در تسویه‌ها</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select
                            name="user_id"
                            title="پرسنل"
                            value={userOptions.find(opt => opt.value === filters.user_id) || null}
                            onChange={(selectedOption) => handleFilterSelectChange("user_id", selectedOption)}
                            options={userOptions}
                            placeholder="همه پرسنل"
                            isClearable
                        />

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">سال (شمسی)</label>
                            <input
                                type="number"
                                name="year"
                                value={filters.year}
                                onChange={handleFilterChange}
                                placeholder="سال"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                min={1300}
                            />
                        </div>

                        <Select
                            name="status"
                            title="وضعیت"
                            value={statusOptions.find(opt => opt.value === filters.status) || null}
                            onChange={(selectedOption) => handleFilterSelectChange("status", selectedOption)}
                            options={statusOptions}
                            placeholder="همه وضعیت‌ها"
                            isClearable
                        />
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
                        لیست تسویه‌های آخر سال
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
                        <Empty message="هیچ تسویه‌ای ثبت نشده است" />
                    ) : (
                        <>
                            <div className="w-full overflow-x-auto">
                                <div className="min-w-[1200px]">
                                    <div className="w-full grid grid-cols-10 gap-3 p-3 bg-gray-100 rounded-t-md">
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
                                                    className="w-full grid grid-cols-10 gap-3 px-3 py-3 hover:bg-gray-50 border-b last:border-b-0"
                                                >
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">{index + 1}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs text-center">
                                                            {item?.user?.first_name || ""} {item?.user?.last_name || ""}
                                                            <br />
                                                            <span className="text-gray-400 text-[10px]">({item?.user?.phone_number})</span>
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">{item.year}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">{item.work_days || 0}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">{formatNumber(item.base_salary)}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs font-bold text-green-600">
                                                            {formatNumber(item.bonus_amount)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs font-bold text-red-600">
                                                            {formatNumber(item.seniority_amount)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs font-bold text-indigo-600">
                                                            {formatNumber(item.base_seniority_amount)}
                                                        </span>
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
                                                                        className="cursor-pointer hover:text-blue-600"
                                                                        onClick={() => handleApprove(item.id)}
                                                                    >
                                                                        <CheckCircle className="w-4 h-4" />
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>تایید</TooltipContent>
                                                            </Tooltip>
                                                        )}

                                                        {checkAccess([703]) && item.status === 1 && (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <button
                                                                        className="cursor-pointer hover:text-green-600"
                                                                        onClick={() => handlePay(item.id)}
                                                                    >
                                                                        <CreditCard className="w-4 h-4" />
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>پرداخت</TooltipContent>
                                                            </Tooltip>
                                                        )}

                                                        {checkAccess([704]) && item.status === 0 && (
                                                            <Confirm
                                                                title="حذف تسویه"
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
                            <h3 className="text-lg font-semibold">جزئیات تسویه حساب</h3>
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
                                    <span className="text-xs text-gray-500">سال</span>
                                    <p className="font-medium text-sm">{viewingItem.year}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">روزهای کارکرد</span>
                                    <p className="font-medium text-sm">{viewingItem.work_days || 0}</p>
                                </div>
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">حقوق پایه</span>
                                    <p className="font-medium text-sm">{formatNumber(viewingItem.base_salary)} ریال</p>
                                </div>
                            </div>

                            <div className="p-2 bg-green-50 rounded border border-green-200">
                                <span className="text-xs text-gray-500">مبلغ عیدی</span>
                                <p className="font-medium text-lg text-green-700">{formatNumber(viewingItem.bonus_amount)} ریال</p>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 bg-orange-50 rounded">
                                    <span className="text-xs text-gray-500">سال‌های سابقه</span>
                                    <p className="font-medium text-sm">{viewingItem.service_years || 0} سال</p>
                                </div>
                                <div className="p-2 bg-red-50 rounded border border-red-200">
                                    <span className="text-xs text-gray-500">مبلغ سنوات</span>
                                    <p className="font-medium text-sm text-red-700">{formatNumber(viewingItem.seniority_amount)} ریال</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 bg-indigo-50 rounded">
                                    <span className="text-xs text-gray-500">پایه سنوات</span>
                                    <p className="font-medium text-sm">{viewingItem.base_service_years || 0} سال</p>
                                </div>
                                <div className="p-2 bg-indigo-50 rounded border border-indigo-200">
                                    <span className="text-xs text-gray-500">مبلغ پایه سنوات</span>
                                    <p className="font-medium text-sm text-indigo-700">{formatNumber(viewingItem.base_seniority_amount)} ریال</p>
                                </div>
                            </div>

                            <div className="p-2 bg-teal-50 rounded border border-teal-200">
                                <span className="text-xs text-gray-500">مجموع تسویه</span>
                                <p className="font-medium text-lg text-teal-700">
                                    {formatNumber((viewingItem.bonus_amount || 0) + (viewingItem.seniority_amount || 0) + (viewingItem.base_seniority_amount || 0))} ریال
                                </p>
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