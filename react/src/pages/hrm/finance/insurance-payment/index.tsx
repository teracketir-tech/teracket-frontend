// src/pages/hrm/finance/insurance-payment/index.tsx

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
import { PenBox, Trash2Icon, Search, X } from "lucide-react";
import Confirm from "@/components/ui/confirm";
import { checkAccess, formatDateToFa,persianNumberToEn } from "@/lib/utils";

// ============== توابع کمکی ==============
// دریافت سال شمسی فعلی
const getCurrentPersianYear = () => {
    const today = new Date();
    const persianDate =persianNumberToEn(formatDateToFa(today)) ;
    return persianDate.split('/')[0]; // 1404
};

// تولید لیست سال‌ها از ۱۵ سال قبل تا ۱۵ سال بعد
const getYearOptions = () => {
    const currentYear = parseInt(getCurrentPersianYear());
    const years = [];
    for (let i = currentYear - 15; i <= currentYear + 15; i++) {
        years.push({ value: String(i), label: String(i) });
    }
    return years;
};

const validationSchema = yup.object({
    month: yup.string().required("ماه واریز الزامی است"),
    year: yup.string().required("سال الزامی است"),
    amount: yup.number().required("مبلغ واریزی الزامی است").min(1, "مبلغ باید بیشتر از 0 باشد"),
    description: yup.string().nullable(),
});

export default function InsurancePayment() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [data, setData] = useState({ data: [], pages: 0, totalCount: 0 });
    const [filters, setFilters] = useState({
        month: searchParams.get("month") || "",
        year: searchParams.get("year") || "",
    });

    const currentYear = getCurrentPersianYear();
    const yearOptions = getYearOptions(); // ✅ اینجا فراخوانی شده

    console.log("yearOptions:", yearOptions); // برای دیباگ

    const fetchData = async () => {
        const params = new URLSearchParams();
        
        if (filters.month) params.set("month", filters.month);
        if (filters.year) params.set("year", filters.year);
        
        const page = searchParams.get("page");
        const perPage = searchParams.get("per-page");
        if (page) params.set("page", page);
        if (perPage) params.set("per-page", perPage);
        
        const query = params.toString();
        setListLoading(true);
        try {
            const res = await api(`hrm-insurance-payment?${query}`, "GET");
            setData(res || { data: [], pages: 0 });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setListLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [searchParams, filters.month, filters.year]);

    const formik = useFormik({
        initialValues: {
            month: "",
            year: currentYear,
            amount: "",
            description: "",
        },
        validationSchema,
        onSubmit: handleSubmit,
        validateOnChange: true,
        validateOnMount: true,
    });

    const handleEdit = (item) => {
        setEditingItem(item);
        formik.setValues({
            month: item.month || "",
            year: item.year || "",
            amount: item.amount || "",
            description: item.description || "",
        });
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        formik.resetForm();
    };

    async function handleSubmit(values) {
        setLoading(true);

        const url = editingItem 
            ? `hrm-insurance-payment/${editingItem.id}` 
            : "hrm-insurance-payment";

        const res = await api(url, editingItem ? "PATCH" : "POST", {
            month: parseInt(values.month),
            year: parseInt(values.year),
            amount: parseInt(values.amount),
            description: values.description,
        });

        setLoading(false);

        if (res?.success) {
            toast.success(editingItem ? "پرداختی حق بیمه با موفقیت ویرایش شد" : "پرداختی حق بیمه با موفقیت ثبت شد");
            setEditingItem(null);
            formik.resetForm();
            fetchData();
        } else {
            toast.error(res?.message || "خطا در ثبت اطلاعات");
        }
    }

    const handleDelete = async (id) => {
        const res = await api(`hrm-insurance-payment/${id}`, "DELETE");
        if (res?.success) {
            toast.success("پرداختی حق بیمه با موفقیت حذف شد");
            fetchData();
        } else {
            toast.error(res?.message || "خطا در حذف");
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
            month: "",
            year: "",
        });
        setSearchParams({});
    };

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

    const getMonthLabel = (month) => {
        const months = {
            1: "فروردین", 2: "اردیبهشت", 3: "خرداد",
            4: "تیر", 5: "مرداد", 6: "شهریور",
            7: "مهر", 8: "آبان", 9: "آذر",
            10: "دی", 11: "بهمن", 12: "اسفند"
        };
        return months[month] || "نامشخص";
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat("fa-IR").format(num);
    };

    const columns = ["ردیف", "ماه", "سال", "مبلغ پرداختی", "عملیات"];

    return (
        <div className="w-full space-y-4">
            {/* فرم ثبت/ویرایش */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{editingItem ? "ویرایش پرداختی حق بیمه" : "ثبت پرداختی حق بیمه"}</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5">
                        <Select
                            name="month"
                            title="ماه واریز"
                            formik={formik}
                            options={monthOptions}
                            placeholder="انتخاب ماه"
                            required
                        />

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                سال (شمسی) <span className="text-red-500">*</span>
                            </label>
                            <Select
                                name="year"
                                value={yearOptions.find(opt => opt.value === formik.values.year) || null}
                                onChange={(opt) => {
                                    formik.setFieldValue("year", opt || "");
                                }}
                                options={yearOptions}
                                placeholder="انتخاب سال"
                                isSearchable
                            />
                            {formik.touched.year && formik.errors.year && (
                                <div className="text-xs text-red-500 mt-1">{formik.errors.year}</div>
                            )}
                        </div>

                        <Input
                            type="number"
                            name="amount"
                            title="مبلغ واریزی (ریال)"
                            formik={formik}
                            placeholder="مثال: ۵,۰۰۰,۰۰۰"
                            required
                            min={1}
                        />

                        <div className="col-span-full">
                            <Input
                                type="textarea"
                                name="description"
                                title="توضیحات"
                                formik={formik}
                                placeholder="توضیحات (اختیاری)"
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-5">
                        <Button
                            onClick={formik.handleSubmit}
                            isLoading={loading}
                            disabled={!formik.isValid || loading}
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
                    <CardTitle className="text-base">جستجو در پرداختی‌های حق بیمه</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                سال (شمسی)
                            </label>
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

                        <div className="flex items-end gap-2">
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
                    </div>
                </CardContent>
            </Card>

            {/* ============== لیست ============== */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>لیست پرداختی‌های حق بیمه</CardTitle>
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
                                <div className="min-w-[600px]">
                                    <div className="w-full grid grid-cols-5 gap-4 p-3 bg-gray-100 rounded-t-md">
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
                                                className="w-full grid grid-cols-5 gap-4 px-3 py-3 hover:bg-gray-50 border-b last:border-b-0"
                                            >
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs">{index + 1}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs">{getMonthLabel(item.month)}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs">{item.year}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs">{formatNumber(item.amount)}</span>
                                                </div>
                                                <div className="flex items-center justify-center gap-2">
                                                    {checkAccess([703]) && (
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

                                                    {checkAccess([704]) && (
                                                        <Confirm
                                                            title="حذف پرداختی حق بیمه"
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
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <Pagination totalPage={data.pages} />
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}