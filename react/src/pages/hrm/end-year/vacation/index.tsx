// src/pages/hrm/end-year/vacation/index.jsx

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
    CalendarCheck, Users, Calendar, FileText, CreditCard,
    Eye, PenBox, Trash2Icon
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

// ============== Validation Schema ==============
const normalizeDigits = (value) =>
    String(value ?? "")
        .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
        .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));

const calculateSchema = yup.object({
    user_id: yup.string().required("انتخاب پرسنل الزامی است"),
    year: yup.string().required("سال الزامی است"),
});

// ============== کامپوننت اصلی ==============
export default function VacationBuyback() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [personnelCodeSearch, setPersonnelCodeSearch] = useState("");
    const [searchedPersonnelCode, setSearchedPersonnelCode] = useState("");
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
            const res = await api(`hrm-vacation-buyback?${query}`, "GET");
            setData(res || { data: [], pages: 0 });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setListLoading(false);
    };

    // ============== دریافت لیست کاربران ==============
    const fetchUsers = async () => {
        try {
            const usersRes = await api("user?per-page=1000", "GET");
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

    // ============== محاسبه بازخرید مرخصی ==============
    async function handleCalculate(values) {
        setLoading(true);
        setShowResult(false);
        setCalculatedData(null);

        const payload = {
            user_id: parseInt(values.user_id),
            year: parseInt(values.year),
        };

        const res = await api("hrm-vacation-buyback/calculate", "POST", payload);

        setLoading(false);

        if (res?.success) {
            setCalculatedData(res.calculated);
            setShowResult(true);
            toast.success("محاسبه بازخرید مرخصی با موفقیت انجام شد");
            fetchData();
        } else {
            toast.error(res?.message || "خطا در محاسبه بازخرید مرخصی");
        }
    }

    // ============== تایید ==============
    const handleApprove = async (id) => {
        const res = await api(`hrm-vacation-buyback/${id}/approve`, "POST");
        if (res?.success) {
            toast.success("بازخرید مرخصی با موفقیت تایید شد");
            fetchData();
        } else {
            toast.error(res?.message || "خطا در تایید");
        }
    };

    // ============== پرداخت ==============
    const handlePay = async (id) => {
        const res = await api(`hrm-vacation-buyback/${id}/pay`, "POST");
        if (res?.success) {
            toast.success("بازخرید مرخصی با موفقیت پرداخت شد");
            fetchData();
        } else {
            toast.error(res?.message || "خطا در پرداخت");
        }
    };

    // ============== حذف ==============
    const handleDelete = async (id) => {
        const res = await api(`hrm-vacation-buyback/${id}`, "DELETE");
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

    // ✅ اصلاح: استفاده از selectedOption به جای selectedOption?.value
    const handleFilterSelectChange = (name, selectedValue) => {
        setFilters(prev => ({ ...prev, [name]: selectedValue || "" }));
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
    const userOptions = users.map((item) => {
        const fullName = `${item.first_name || ""} ${item.last_name || ""}`.trim();
        const personnelCode = String(item.personnel_code || "");
        return {
            value: String(item.id),
            label: `${fullName || item.phone_number || `کاربر ${item.id}`}${personnelCode ? ` (${personnelCode})` : ""}`,
            personnelCode,
        };
    });

    const filteredUserOptions = searchedPersonnelCode
        ? userOptions.filter((item) =>
              normalizeDigits(item.personnelCode).includes(searchedPersonnelCode)
          )
        : userOptions;

    const handlePersonnelSearch = () => {
        const code = normalizeDigits(personnelCodeSearch).trim();

        if (!code) {
            setSearchedPersonnelCode("");
            toast.info("کد پرسنلی را وارد کنید");
            return;
        }

        setSearchedPersonnelCode(code);
        formik.setFieldValue("user_id", "");

        const matches = userOptions.filter(
            (item) => item.personnelCode && normalizeDigits(item.personnelCode).includes(code)
        );

        if (matches.length === 0) {
            toast.error("پرسنلی با این کد پرسنلی پیدا نشد");
            return;
        }

        if (matches.length === 1) {
            formik.setFieldValue("user_id", matches[0].value);
            toast.success("پرسنل انتخاب شد");
            return;
        }

        formik.setFieldValue("user_id", "");
        toast.info("چند پرسنل پیدا شد؛ از لیست انتخاب کنید");
    };

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
    const columns = ["ردیف", "پرسنل", "سال", "مجموع مرخصی", "روزهای باقیمانده", "روزهای بازخرید", "مبلغ بازخرید", "وضعیت", "عملیات"];

    return (
        <div className="w-full space-y-4">
            {/* ========== عنوان ========== */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <CalendarCheck className="w-6 h-6" />
                    بازخرید مانده مرخصی
                </h2>
            </div>

            {/* ========== فرم محاسبه ========== */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calculator className="w-5 h-5" />
                        محاسبه بازخرید مرخصی
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="mb-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <div className="mb-1 text-sm font-semibold text-gray-800">انتخاب پرسنل</div>
                        <p className="mb-4 text-xs text-gray-500">
                            پرسنل را با کد پرسنلی جستجو یا از لیست انتخاب کنید
                        </p>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm font-medium text-gray-700">
                                    کد پرسنلی
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={personnelCodeSearch}
                                        onChange={(e) => setPersonnelCodeSearch(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handlePersonnelSearch();
                                            }
                                        }}
                                        placeholder="کد پرسنلی را وارد کنید"
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={handlePersonnelSearch}
                                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
                                    >
                                        <Search className="h-4 w-4" />
                                        جستجو
                                    </button>
                                </div>
                            </div>

                            <Select
                                name="user_id"
                                title="انتخاب کاربر از لیست"
                                formik={formik}
                                options={filteredUserOptions}
                                placeholder="انتخاب پرسنل"
                                required
                            />
                        </div>

                        {searchedPersonnelCode && (
                            <button
                                type="button"
                                onClick={() => {
                                    setPersonnelCodeSearch("");
                                    setSearchedPersonnelCode("");
                                }}
                                className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                            >
                                نمایش همه پرسنل
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex flex-col">
                            <label className="mb-1 text-sm font-medium text-gray-700">سال (شمسی)</label>
                            <input
                                type="number"
                                name="year"
                                value={formik.values.year}
                                onChange={(e) => formik.setFieldValue("year", e.target.value)}
                                placeholder="مثال: ۱۴۰۴"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                min={1300}
                            />
                            {formik.touched.year && formik.errors.year && (
                                <div className="mt-1 text-xs text-red-500">{formik.errors.year}</div>
                            )}
                        </div>

                        <div className="flex items-end justify-start gap-2">
                            <Button
                                onClick={formik.handleSubmit}
                                isLoading={loading}
                                disabled={!formik.isValid || loading}
                            >
                                محاسبه بازخرید
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ========== نتیجه محاسبه ========== */}
            {showResult && calculatedData && (
                <Card className="w-full border-purple-500 border-2">
                    <CardHeader className="bg-purple-50">
                        <CardTitle className="text-purple-700 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            نتیجه محاسبه بازخرید مرخصی
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <div className="p-3 bg-blue-50 rounded-md text-center">
                                <span className="text-sm text-gray-600">مجموع مرخصی</span>
                                <p className="text-lg font-bold text-blue-700">{calculatedData.total_vacation_days || 0} روز</p>
                            </div>
                            <div className="p-3 bg-yellow-50 rounded-md text-center">
                                <span className="text-sm text-gray-600">روزهای باقیمانده</span>
                                <p className="text-lg font-bold text-yellow-700">{calculatedData.remaining_days || 0} روز</p>
                            </div>
                            <div className="p-3 bg-orange-50 rounded-md text-center">
                                <span className="text-sm text-gray-600">روزهای بازخرید</span>
                                <p className="text-lg font-bold text-orange-700">{calculatedData.buyback_days || 0} روز</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-md text-center">
                                <span className="text-sm text-gray-600">حقوق روزانه</span>
                                <p className="text-lg font-bold text-purple-700">{formatNumber(calculatedData.daily_salary)} ریال</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-md text-center">
                                <span className="text-sm text-gray-600">مبلغ بازخرید</span>
                                <p className="text-lg font-bold text-green-700">{formatNumber(calculatedData.buyback_amount)} ریال</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ========== فیلترها ========== */}
            <Card className="w-full">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">جستجو در بازخرید مرخصی</CardTitle>
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
                        لیست بازخرید مرخصی
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
                        <Empty message="هیچ بازخرید مرخصی ثبت نشده است" />
                    ) : (
                        <>
                            <div className="w-full overflow-x-auto">
                                <div className="min-w-[1100px]">
                                    <div className="w-full grid grid-cols-9 gap-3 p-3 bg-gray-100 rounded-t-md">
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
                                                    className="w-full grid grid-cols-9 gap-3 px-3 py-3 hover:bg-gray-50 border-b last:border-b-0"
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
                                                        <span className="text-xs">{item.total_vacation_days || 0}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs font-bold text-yellow-600">{item.remaining_days || 0}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs text-orange-600">{item.buyback_days || 0}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs font-bold text-green-600">
                                                            {formatNumber(item.buyback_amount)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className={`text-xs font-medium ${status.color}`}>
                                                            {status.label}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-center gap-1">
                                                        {/* ✅ دکمه مشاهده (Eye) - اضافه شده */}
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
                                                            <>
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
                                                            </>
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
                                                                title="حذف بازخرید مرخصی"
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

            {/* ========== ✅ مودال نمایش جزئیات (اضافه شده) ========== */}
            {showViewModal && viewingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">جزئیات بازخرید مرخصی</h3>
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
                                    <p className="font-medium text-sm">{viewingItem?.user?.phone_number || "-"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">سال</span>
                                    <p className="font-medium text-sm">{viewingItem.year}</p>
                                </div>
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">وضعیت</span>
                                    <p className={`font-medium text-sm ${getStatusLabel(viewingItem.status).color}`}>
                                        {getStatusLabel(viewingItem.status).label}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div className="p-2 bg-blue-50 rounded">
                                    <span className="text-xs text-gray-500">مجموع مرخصی</span>
                                    <p className="font-medium text-sm">{viewingItem.total_vacation_days || 0} روز</p>
                                </div>
                                <div className="p-2 bg-yellow-50 rounded">
                                    <span className="text-xs text-gray-500">روزهای باقیمانده</span>
                                    <p className="font-medium text-sm text-yellow-700">{viewingItem.remaining_days || 0} روز</p>
                                </div>
                                <div className="p-2 bg-orange-50 rounded">
                                    <span className="text-xs text-gray-500">روزهای بازخرید</span>
                                    <p className="font-medium text-sm text-orange-600">{viewingItem.buyback_days || 0} روز</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 bg-purple-50 rounded">
                                    <span className="text-xs text-gray-500">حقوق روزانه</span>
                                    <p className="font-medium text-sm">{formatNumber(viewingItem.daily_salary)} ریال</p>
                                </div>
                                <div className="p-2 bg-green-50 rounded border border-green-200">
                                    <span className="text-xs text-gray-500">مبلغ بازخرید</span>
                                    <p className="font-medium text-lg text-green-700">{formatNumber(viewingItem.buyback_amount)} ریال</p>
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