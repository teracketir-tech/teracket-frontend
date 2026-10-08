// src/pages/hrm/settings/workgroup/WorkGroupBakhshList.jsx

import { useFormik } from "formik";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/inputs";
import Select from "@/components/shared/inputs/Select";
import Loading from "@/components/shared/Loading";
import Empty from "@/components/shared/Empty";
import Pagination from "@/components/shared/Pagination";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PenBox, Trash2Icon, CheckCircle, XCircle, Search, X } from "lucide-react";
import Confirm from "@/components/ui/confirm";
import { checkAccess } from "@/lib/utils";

const validationSchema = yup.object({
    workgroup_id: yup.string().required("انتخاب گروه کاری الزامی است"),
    name: yup.string().required("نام بخش الزامی است"),
});

export default function WorkGroupBakhshList() {
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [data, setData] = useState({ data: [], pages: 0, totalCount: 0 });
    const [workgroups, setWorkgroups] = useState([]);
    const [filters, setFilters] = useState({ workgroup_id: "", name: "", status: "" });
    const [searchTerm, setSearchTerm] = useState("");

    const fetchWorkgroups = async () => {
        try {
            const res = await api("hrm-workgroup/items", "GET");
            if (res?.success) setWorkgroups(res.data);
        } catch (error) {
            console.error("Error fetching workgroups:", error);
        }
    };

    const fetchData = async () => {
        const params = new URLSearchParams();
        if (filters.workgroup_id) params.set("workgroup_id", filters.workgroup_id);
        if (filters.name) params.set("name", filters.name);
        if (filters.status !== "") params.set("status", filters.status);

        setListLoading(true);
        try {
            const res = await api(`hrm-workgroup-bakhsh?${params.toString()}`, "GET");
            setData(res || { data: [], pages: 0 });
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("خطا در دریافت اطلاعات");
        }
        setListLoading(false);
    };

    useEffect(() => {
        fetchWorkgroups();
        fetchData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [filters]);

    const formik = useFormik({
        initialValues: { workgroup_id: "", name: "" },
        validationSchema,
        onSubmit: handleSubmit,
    });

    async function handleSubmit(values) {
        setLoading(true);
        
        const payload = {
            ...values,
            workgroup_id: parseInt(values.workgroup_id),
        };

        // ✅ اصلاح: بدون /create و /update
        const url = editingItem
            ? `hrm-workgroup-bakhsh/${editingItem.id}`
            : "hrm-workgroup-bakhsh";

        const method = editingItem ? "PATCH" : "POST";

        const res = await api(url, method, payload);

        setLoading(false);

        if (res?.success) {
            toast.success(
                editingItem ? "بخش با موفقیت ویرایش شد" : "بخش با موفقیت ثبت شد"
            );
            setEditingItem(null);
            formik.resetForm();
            fetchData();
        } else {
            toast.error(res?.message || "خطا در ثبت اطلاعات");
        }
    }

    const handleEdit = (item) => {
        setEditingItem(item);
        formik.setValues({
            workgroup_id: String(item.workgroup_id),
            name: item.name,
        });
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        formik.resetForm();
    };

    const handleDelete = async (id) => {
        // ✅ اصلاح: بدون /delete
        const res = await api(`hrm-workgroup-bakhsh/${id}`, "DELETE");
        if (res?.success) {
            toast.success("بخش با موفقیت حذف شد");
            fetchData();
        } else {
            toast.error(res?.message || "خطا در حذف");
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 1 ? 0 : 1;
        // ✅ اصلاح: بدون /update
        const res = await api(`hrm-workgroup-bakhsh/${id}`, "PATCH", {
            status: newStatus,
        });
        if (res?.success) {
            toast.success("وضعیت با موفقیت تغییر کرد");
            fetchData();
        } else {
            toast.error(res?.message || "خطا در تغییر وضعیت");
        }
    };

    const workgroupOptions = workgroups.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    const handleSearch = () => {
        setFilters({ ...filters, name: searchTerm });
    };

    const handleClearFilters = () => {
        setFilters({ workgroup_id: "", name: "", status: "" });
        setSearchTerm("");
    };

    const columns = ["ردیف", "گروه کاری", "نام بخش", "وضعیت", "عملیات"];

    return (
        <div className="space-y-4">
            {/* فرم ثبت/ویرایش */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select
                        name="workgroup_id"
                        title="گروه کاری"
                        formik={formik}
                        options={workgroupOptions}
                        placeholder="انتخاب گروه کاری"
                        required
                        onChange={(selectedOption) => {
                            formik.setFieldValue("workgroup_id", selectedOption || "");
                        }}
                    />
                    <div>
                        <Input
                            type="text"
                            name="name"
                            title={editingItem ? "ویرایش بخش" : "نام بخش جدید"}
                            formik={formik}
                            placeholder="مثال: مالی"
                        />
                    </div>
                    <div className="flex items-end gap-2">
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
                </div>
            </div>

            {/* فیلترها */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Select
                    name="filter_workgroup" 
                    value={workgroupOptions.find(opt => opt.value === filters.workgroup_id) || null}
                    onChange={(opt) => setFilters({ ...filters, workgroup_id: opt || "" })}
                    options={workgroupOptions}
                    placeholder="همه گروه‌ها"
                    isClearable
                />
                <div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="جستجوی نام بخش..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleSearch} className="flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        جستجو
                    </Button>
                    <Button variant="secondary" onClick={handleClearFilters} className="flex items-center gap-2">
                        <X className="w-4 h-4" />
                        پاک کردن
                    </Button>
                </div>
            </div>

            {/* لیست */}
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
                                            <span className="text-xs font-medium">{item?.workgroup?.name || "-"}</span>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs">{item.name}</span>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <button
                                                onClick={() => handleToggleStatus(item.id, item.status)}
                                                className="cursor-pointer"
                                            >
                                                {item.status === 1 ? (
                                                    <span className="flex items-center gap-1 text-xs text-green-600">
                                                        <CheckCircle className="w-4 h-4" /> فعال
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-xs text-gray-400">
                                                        <XCircle className="w-4 h-4" /> غیرفعال
                                                    </span>
                                                )}
                                            </button>
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
                                                    title="حذف بخش"
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
        </div>
    );
}