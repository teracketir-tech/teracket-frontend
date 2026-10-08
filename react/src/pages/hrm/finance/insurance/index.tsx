// src/pages/hrm/finance/insurance/index.jsx

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
import { PenBox, Trash2Icon, Search, X, User } from "lucide-react";
import Confirm from "@/components/ui/confirm";
import { checkAccess, formatDateToFa, formatDateToEn } from "@/lib/utils";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const validationSchema = yup.object({
    user_id: yup.string().required("انتخاب کاربر الزامی است"),
    insurance_type: yup.string().required("نوع بیمه الزامی است"),
    insurance_number: yup.string().required("شماره بیمه الزامی است"),
    workshop_code: yup.string().nullable(),
    workshop_name: yup.string().nullable(),
    history_from: yup.string().nullable(),
    history_to: yup.string().nullable(),
});

export default function Insurance() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [data, setData] = useState({ data: [], pages: 0, totalCount: 0 });
    const [selectedUser, setSelectedUser] = useState(null);
    const [personnelCodeSearch, setPersonnelCodeSearch] = useState("");
    const [filters, setFilters] = useState({
        user_id: searchParams.get("user_id") || "",
        personnel_code: searchParams.get("personnel_code") || "",
        national_code: searchParams.get("national_code") || "",
        insurance_type: searchParams.get("insurance_type") || "",
        workgroup_id: searchParams.get("workgroup_id") || "",
    });

    const fetchData = async () => {
        const params = new URLSearchParams();
        
        if (filters.user_id) params.set("user_id", filters.user_id);
        if (filters.personnel_code) params.set("personnel_code", filters.personnel_code);
        if (filters.national_code) params.set("national_code", filters.national_code);
        if (filters.insurance_type) params.set("insurance_type", filters.insurance_type);
        if (filters.workgroup_id) params.set("workgroup_id", filters.workgroup_id);
        
        const page = searchParams.get("page");
        const perPage = searchParams.get("per-page");
        if (page) params.set("page", page);
        if (perPage) params.set("per-page", perPage);
        
        const query = params.toString();
        setListLoading(true);
        try {
            const res = await api(`hrm-insurance?${query}`, "GET");
            setData(res || { data: [], pages: 0 });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setListLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [searchParams, filters]);

    useEffect(() => {
        fetchOptions();
    }, []);

    const fetchOptions = async () => {
        try {
            const usersRes = await api("user?per-page=100", "GET");
            if (usersRes?.data) {
                setUsers(usersRes.data);
            }
        } catch (error) {
            console.error("Error fetching options:", error);
            toast.error("خطا در دریافت اطلاعات");
        }
    };

    // ===== جستجوی کاربر با کد پرسنلی =====
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

    // ===== انتخاب کاربر از لیست =====
    const handleUserSelect = (selectedOption) => {
        const userId = selectedOption || "";
        formik.setFieldValue("user_id", userId);
        
        if (userId) {
            const user = users.find(u => String(u.id) === userId);
            setSelectedUser(user);
            if (user?.personnel_code) {
                setPersonnelCodeSearch(user.personnel_code);
            }
        } else {
            setSelectedUser(null);
            setPersonnelCodeSearch("");
        }
    };

    // ===== تغییر دستی کد پرسنلی =====
    const handlePersonnelCodeChange = (e) => {
        const value = e.target.value;
        setPersonnelCodeSearch(value);
        
        if (selectedUser) {
            setSelectedUser(null);
            formik.setFieldValue("user_id", "");
        }
    };

    const formik = useFormik({
        initialValues: {
            user_id: "",
            insurance_type: "",
            insurance_number: "",
            workshop_code: "",
            workshop_name: "",
            history_from: "",
            history_to: "",
        },
        validationSchema,
        onSubmit: handleSubmit,
        validateOnChange: true,
        validateOnMount: true,
    });

    const handleEdit = (item) => {
        setEditingItem(item);
        formik.setValues({
            user_id: item.user_id || "",
            insurance_type: item.insurance_type || "",
            insurance_number: item.insurance_number || "",
            workshop_code: item.workshop_code || "",
            workshop_name: item.workshop_name || "",
            history_from: item.history_from_persian || "",
            history_to: item.history_to_persian || "",
        });
        
        const user = users.find(u => String(u.id) === item.user_id);
        if (user) {
            setSelectedUser(user);
            if (user.personnel_code) {
                setPersonnelCodeSearch(user.personnel_code);
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        formik.resetForm();
        setSelectedUser(null);
        setPersonnelCodeSearch("");
    };

    async function handleSubmit(values) {
        setLoading(true);

        const url = editingItem 
            ? `hrm-insurance/${editingItem.id}` 
            : "hrm-insurance";

        const payload = {
            ...values,
            user_id: parseInt(values.user_id),
            insurance_type: parseInt(values.insurance_type),
        };

        if (values.history_from) {
            payload.history_from = formatDateToEn(values.history_from);
        }
        if (values.history_to) {
            payload.history_to = formatDateToEn(values.history_to);
        }

        const res = await api(url, editingItem ? "PATCH" : "POST", payload);

        setLoading(false);

        if (res?.success) {
            toast.success(editingItem ? "اطلاعات بیمه با موفقیت ویرایش شد" : "اطلاعات بیمه با موفقیت ثبت شد");
            setEditingItem(null);
            formik.resetForm();
            setSelectedUser(null);
            setPersonnelCodeSearch("");
            fetchData();
        } else {
            toast.error(res?.message || "خطا در ثبت اطلاعات");
        }
    }

    const handleDelete = async (id) => {
        const res = await api(`hrm-insurance/${id}`, "DELETE");
        if (res?.success) {
            toast.success("اطلاعات بیمه با موفقیت حذف شد");
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
            [name]: selectedOption?.value || "",
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
            insurance_type: "",
            workgroup_id: "",
        });
        setSearchParams({});
    };

    const userOptions = users.map((item) => ({
        value: String(item.id),
        label: `${item.first_name || ""} ${item.last_name || ""}`.trim() || item.phone_number || `کاربر ${item.id}`,
    }));

    const insuranceTypeOptions = [
        { value: "1", label: "قبل از استخدام در شرکت" },
        { value: "2", label: "بعد از استخدام در شرکت" },
    ];

    const getInsuranceTypeLabel = (type) => {
        const types = {
            1: "قبل از استخدام",
            2: "بعد از استخدام",
        };
        return types[type] || "نامشخص";
    };

    const columns = ["ردیف", "کد پرسنلی", "نام و نام خانوادگی", "گروه کاری", "شماره بیمه", "نام کارگاه", "کد کارگاه", "تاریخ شروع بیمه", "تاریخ پایان بیمه", "نوع بیمه"];

    // ===== نمایش اطلاعات کاربر انتخاب شده =====
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

    return (
        <div className="w-full space-y-4">
            {/* فرم ثبت/ویرایش */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{editingItem ? "ویرایش اطلاعات بیمه" : "ثبت اطلاعات بیمه"}</CardTitle>
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
                                            onChange={handlePersonnelCodeChange}
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
                                    onChange={handleUserSelect}
                                    options={userOptions}
                                    placeholder="انتخاب پرسنل"
                                    isClearable
                                />
                            </div>
                        </div>

                        {renderSelectedUser()}
                    </div>

                    {/* ===== اطلاعات بیمه ===== */}
                    {selectedUser && (
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Select
                                name="insurance_type"
                                title="نوع بیمه"
                                formik={formik}
                                options={insuranceTypeOptions}
                                placeholder="انتخاب نوع بیمه"
                                required
                            />

                            <Input
                                type="text"
                                name="insurance_number"
                                title="شماره بیمه"
                                formik={formik}
                                placeholder="شماره بیمه"
                                required
                            />

                            <Input
                                type="text"
                                name="workshop_code"
                                title="کد کارگاه"
                                formik={formik}
                                placeholder="کد کارگاه"
                            />

                            <Input
                                type="text"
                                name="workshop_name"
                                title="نام کارگاه"
                                formik={formik}
                                placeholder="نام کارگاه"
                            />

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">سابقه بیمه از</label>
                                <DatePicker
                                    calendar={persian}
                                    locale={persian_fa}
                                    value={formik.values.history_from}
                                    onChange={(date) => {
                                        formik.setFieldValue("history_from", date?.format() || "");
                                    }}
                                    format="YYYY/MM/DD"
                                    inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                    placeholder="انتخاب تاریخ"
                                />
                            </div>

                            {/* تاریخ "تا" فقط برای نوع "قبل از استخدام" نمایش داده شود */}
                            {formik.values.insurance_type === "1" && (
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">سابقه بیمه تا</label>
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        value={formik.values.history_to}
                                        onChange={(date) => {
                                            formik.setFieldValue("history_to", date?.format() || "");
                                        }}
                                        format="YYYY/MM/DD"
                                        inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                        placeholder="انتخاب تاریخ"
                                    />
                                </div>
                            )}
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
                    <CardTitle className="text-base">جستجو در اطلاعات بیمه</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                         <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                نام پرسنل
                            </label>
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
                            <select
                                name="workgroup_id"
                                value={filters.workgroup_id || ""}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                            >
                                <option value="">همه گروه‌ها</option>
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                نوع بیمه
                            </label>
                            <Select
                                name="insurance_type"
                                value={insuranceTypeOptions.find(opt => opt.value === filters.insurance_type) || null}
                                onChange={(opt) => handleFilterSelectChange("insurance_type", opt)}
                                options={insuranceTypeOptions}
                                placeholder="همه انواع"
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

            {/* ============== لیست ============== */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>لیست اطلاعات بیمه</CardTitle>
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
                                <div className="min-w-[1200px]">
                                    <div className="w-full grid grid-cols-10 gap-2 p-3 bg-gray-100 rounded-t-md">
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
                                                className="w-full grid grid-cols-10 gap-2 px-3 py-3 hover:bg-gray-50 border-b last:border-b-0"
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
                                                    <span className="text-xs">-</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs">{item.insurance_number}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs">{item.workshop_name || "-"}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs">{item.workshop_code || "-"}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs">{item.history_from_persian || "-"}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs">{item.history_to_persian || "-"}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs">{getInsuranceTypeLabel(item.insurance_type)}</span>
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