// src/pages/hrm/assets/create/index.tsx

import { useFormik } from "formik";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { api } from "@/lib/axios";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/inputs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/shared/Loading";
import Empty from "@/components/shared/Empty";
import Pagination from "@/components/shared/Pagination";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PenBox, Trash2Icon, Search, X, Eye } from "lucide-react";
import Confirm from "@/components/ui/confirm";
import { checkAccess } from "@/lib/utils";

const validationSchema = yup.object({
    name: yup.string().required("نام اموال الزامی است"),
    material: yup.string().nullable(),
    unit_price: yup.number().required("قیمت واحد الزامی است").min(0, "قیمت باید مثبت باشد"),
    total_count: yup.number().nullable(),
    description: yup.string().nullable(),
});

export default function CreateAsset() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [data, setData] = useState({ data: [], pages: 0, totalCount: 0 });
    const [editingItem, setEditingItem] = useState(null);
    const [viewingItem, setViewingItem] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    
    // فیلترها
    const [filters, setFilters] = useState({
        name: searchParams.get("name") || "",
        material: searchParams.get("material") || "",
        unit_price_from: searchParams.get("unit_price_from") || "",
        unit_price_to: searchParams.get("unit_price_to") || "",
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            material: "",
            unit_price: "",
            total_count: "",
            description: "",
        },
        validationSchema,
        onSubmit: handleSubmit,
        validateOnChange: true,
        validateOnMount: true,
    });

    // دریافت لیست اموال
    const fetchData = async () => {
        const params = new URLSearchParams();
        
        if (filters.name) params.set("name", filters.name);
        if (filters.material) params.set("material", filters.material);
        if (filters.unit_price_from) params.set("unit_price_from", filters.unit_price_from);
        if (filters.unit_price_to) params.set("unit_price_to", filters.unit_price_to);
        
        const page = searchParams.get("page");
        const perPage = searchParams.get("per-page");
        if (page) params.set("page", page);
        if (perPage) params.set("per-page", perPage);
        
        const query = params.toString();
        setListLoading(true);
        try {
            const res = await api(`hrm-asset?${query}`, "GET");
            setData(res || { data: [], pages: 0 });
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("خطا در دریافت اطلاعات");
        }
        setListLoading(false);
    };

    // ============== useEffect با debounce ==============
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(timer);
    }, [filters]);

    // وقتی ویرایش کلیک میشه
    const handleEdit = (item) => {
        setEditingItem(item);
        formik.setValues({
            name: item.name || "",
            material: item.material || "",
            unit_price: item.unit_price || "",
            total_count: item.total_count || "",
            description: item.description || "",
        });
    };

    // انصراف از ویرایش
    const handleCancelEdit = () => {
        setEditingItem(null);
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
            ? `hrm-asset/${editingItem.id}` 
            : "hrm-asset";

        const res = await api(url, editingItem ? "PATCH" : "POST", {
            ...values,
            unit_price: parseInt(values.unit_price),
            total_count: parseInt(values.total_count) || 0,
        });

        setLoading(false);

        if (res?.success) {
            toast.success(editingItem ? "اموال با موفقیت ویرایش شد" : "اموال با موفقیت ثبت شد");
            setEditingItem(null);
            formik.resetForm();
            fetchData();
        } else {
            toast.error(res?.message || "خطا در ثبت اموال");
        }
    }

    const handleDelete = async (id) => {
        const res = await api(`hrm-asset/${id}`, "DELETE");
        if (res?.success) {
            toast.success("اموال با موفقیت حذف شد");
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

    const handleClearFilters = () => {
        setFilters({
            name: "",
            material: "",
            unit_price_from: "",
            unit_price_to: "",
        });
        setSearchParams({});
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat("fa-IR").format(num);
    };

    const columns = ["ردیف", "نام", "جنس", "قیمت واحد", "تعداد کل", "موجودی", "عملیات"];

    return (
        <div className="w-full space-y-4">
            {/* فرم ثبت/ویرایش */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{editingItem ? "ویرایش اموال" : "تعریف اموال جدید"}</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <Input
                            type="text"
                            name="name"
                            title="نام اموال"
                            formik={formik}
                            placeholder="مثال: لپ تاپ، میز، صندلی"
                            required
                        />

                        <Input
                            type="text"
                            name="material"
                            title="جنس"
                            formik={formik}
                            placeholder="مثال: فلز، چوب، پلاستیک"
                        />

                        <Input
                            type="number"
                            name="unit_price"
                            title="قیمت واحد (ریال)"
                            formik={formik}
                            placeholder="مثال: ۲۵۰,۰۰۰,۰۰۰"
                            required
                        />

                        <Input
                            type="number"
                            name="total_count"
                            title="تعداد کل (اختیاری)"
                            formik={formik}
                            placeholder="مثال: ۱۰"
                        />

                        <div className="col-span-full">
                            <Input
                                type="textarea"
                                name="description"
                                title="توضیحات"
                                formik={formik}
                                placeholder="توضیحات اختیاری"
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
                    <CardTitle className="text-base">جستجو در لیست اموال</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                جستجو در نام
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={filters.name}
                                onChange={handleFilterChange}
                                placeholder="نام اموال را وارد کنید..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                جستجو در جنس
                            </label>
                            <input
                                type="text"
                                name="material"
                                value={filters.material}
                                onChange={handleFilterChange}
                                placeholder="جنس اموال را وارد کنید..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                قیمت از (ریال)
                            </label>
                            <input
                                type="number"
                                name="unit_price_from"
                                value={filters.unit_price_from}
                                onChange={handleFilterChange}
                                placeholder="مثال: ۱۰۰,۰۰۰"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                min={0}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                قیمت تا (ریال)
                            </label>
                            <input
                                type="number"
                                name="unit_price_to"
                                value={filters.unit_price_to}
                                onChange={handleFilterChange}
                                placeholder="مثال: ۵۰۰,۰۰۰"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                min={0}
                            />
                        </div>
                    </div>

                    <div className="flex items-end gap-2 mt-4">
                        <Button onClick={fetchData} className="flex items-center gap-2">
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

            {/* ============== لیست اموال ============== */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>لیست اموال</CardTitle>
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
                                <div className="min-w-[800px]">
                                    <div className="w-full grid grid-cols-7 gap-4 p-3 bg-gray-100 rounded-t-md">
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
                                                className="w-full grid grid-cols-7 gap-4 px-3 py-3 hover:bg-gray-50 border-b last:border-b-0"
                                            >
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs">{index + 1}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs font-medium">{item.name}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs">{item.material || "-"}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs">{formatNumber(item.unit_price)}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs">{item.total_count}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs font-bold">{item.available_count}</span>
                                                </div>
                                                <div className="flex items-center justify-center gap-1">
                                                    {/* ✅ دکمه مشاهده */}
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

                                                    {checkAccess([703]) && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <button
                                                                    className="cursor-pointer hover:text-blue-600"
                                                                    onClick={() => handleEdit(item)}
                                                                >
                                                                    <PenBox className="w-3.5 h-3.5" />
                                                                </button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>ویرایش</TooltipContent>
                                                        </Tooltip>
                                                    )}

                                                    {checkAccess([704]) && (
                                                        <Confirm
                                                            title="حذف اموال"
                                                            onConfirm={() => handleDelete(item.id)}
                                                        >
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

            {/* ========== ✅ مودال نمایش جزئیات ========== */}
            {showViewModal && viewingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">جزئیات اموال</h3>
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
                                    <span className="text-xs text-gray-500">نام اموال</span>
                                    <p className="font-medium text-sm">{viewingItem.name}</p>
                                </div>
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">جنس</span>
                                    <p className="font-medium text-sm">{viewingItem.material || "-"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">قیمت واحد</span>
                                    <p className="font-medium text-sm">{formatNumber(viewingItem.unit_price)} ریال</p>
                                </div>
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">تعداد کل</span>
                                    <p className="font-medium text-sm">{viewingItem.total_count}</p>
                                </div>
                            </div>

                            <div className="p-2 bg-blue-50 rounded border border-blue-200">
                                <span className="text-xs text-gray-500">موجودی قابل واگذاری</span>
                                <p className="font-medium text-lg text-blue-700">{viewingItem.available_count}</p>
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