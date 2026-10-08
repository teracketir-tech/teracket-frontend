// src/pages/hrm/assets/transfer/index.tsx

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
import { Trash2Icon, Search, X, Eye, User, UserPlus, UserMinus, CheckCircle, EyeOff } from "lucide-react";
import Confirm from "@/components/ui/confirm";
import { checkAccess } from "@/lib/utils";

const validationSchema = yup.object({
    from_user_id: yup.string().required("انتخاب پرسنل مبدا الزامی است"),
    to_user_id: yup.string().required("انتخاب پرسنل مقصد الزامی است"),
    asset_type: yup.string().required("انتخاب نوع اموال الزامی است"),
    selected_assignments: yup.array().min(1, "حداقل یک اموال باید انتخاب شود"),
    description: yup.string().nullable(),
});

// گزینه‌های نوع اموال
const assetTypeOptions = [
    { value: "original", label: "در اختیار اصلی" },
    { value: "transferred", label: "واگذار شده" },
];

export default function TransferAsset() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [fromUser, setFromUser] = useState(null);
    const [toUser, setToUser] = useState(null);
    const [fromPersonnelCodeSearch, setFromPersonnelCodeSearch] = useState("");
    const [toPersonnelCodeSearch, setToPersonnelCodeSearch] = useState("");
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignments, setSelectedAssignments] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [data, setData] = useState({ data: [], pages: 0, totalCount: 0 });
    const [viewingItem, setViewingItem] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showItemsModal, setShowItemsModal] = useState(false);
    const [viewingTransferItems, setViewingTransferItems] = useState([]);
    const [allAssets, setAllAssets] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectAll, setSelectAll] = useState(true);

    // فیلترها
    const [filters, setFilters] = useState({
        user_id: searchParams.get("user_id") || "",
        personnel_code: searchParams.get("personnel_code") || "",
        asset_id: searchParams.get("asset_id") || "",
    });

    // دریافت لیست انتقال‌ها
    const fetchTransfers = async () => {
        const params = new URLSearchParams();
        
        if (filters.user_id) params.set("user_id", filters.user_id);
        if (filters.personnel_code) params.set("personnel_code", filters.personnel_code);
        if (filters.asset_id) params.set("asset_id", filters.asset_id);
        
        const page = searchParams.get("page");
        const perPage = searchParams.get("per-page");
        if (page) params.set("page", page);
        if (perPage) params.set("per-page", perPage);
        
        const query = params.toString();
        setListLoading(true);
        try {
            const res = await api(`hrm-asset-transfer?${query}`, "GET");
            setData(res || { data: [], pages: 0 });
        } catch (error) {
            console.error("Error fetching transfers:", error);
        }
        setListLoading(false);
    };

    // ============== useEffect ==============
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTransfers();
        }, 300);

        return () => clearTimeout(timer);
    }, [filters]);

    useEffect(() => {
        fetchOptions();
        fetchAllAssets();
    }, []);

    const fetchOptions = async () => {
        setLoadingOptions(true);
        
        try {
            const usersRes = await api("user?per-page=100", "GET");
            if (usersRes?.data) {
                setUsers(usersRes.data);
            }
        } catch (error) {
            console.error("Error fetching options:", error);
            toast.error("خطا در دریافت اطلاعات");
        }

        setLoadingOptions(false);
    };

    // ============== دریافت همه اموال برای فیلتر ==============
    const fetchAllAssets = async () => {
        try {
            const res = await api("hrm-asset?per-page=100", "GET");
            if (res?.data) {
                const options = res.data.map(item => ({
                    value: String(item.id),
                    label: `${item.name} ${item.material ? `(${item.material})` : ""}`
                }));
                setAllAssets(options);
            }
        } catch (error) {
            console.error("Error fetching all assets:", error);
        }
    };
 
    // ============== دریافت اموال در اختیار کاربر ==============
const fetchUserAssignments = async (userId) => {
    if (!userId) {
        setAssignments([]);
        setSelectedAssignments([]);
        return;
    }

    try {
        const assetType = formik.values.asset_type;
        // ارسال type به API
        const url = assetType 
            ? `hrm-asset-assignment/personnel-assets?userId=${userId}&type=${assetType}`
            : `hrm-asset-assignment/personnel-assets?userId=${userId}`;
            
        const res = await api(url, "GET");        
        if (res?.data) {
            setAssignments(res.data);
            setSelectedAssignments(res.data.map(item => item.id));
            setSelectAll(true);
        }
    } catch (error) {
        console.error("Error fetching user assignments:", error);
        toast.error("خطا در دریافت اموال کاربر");
    }
};

    // دریافت شناسه‌های assignment هایی که از طریق انتقال ایجاد شده‌اند
    const getTransferAssignmentIds = async () => {
        try {
            const res = await api("hrm-asset-transfer?per-page=1000", "GET");
            if (res?.data) {
                return res.data.map(item => item.assignment_id).filter(Boolean);
            }
            return [];
        } catch (error) {
            console.error("Error fetching transfer ids:", error);
            return [];
        }
    };

    // ============== جستجوی کاربر مبدا با کد پرسنلی ==============
    const searchFromUserByPersonnelCode = async () => {
        if (!fromPersonnelCodeSearch.trim()) {
            toast.warning("لطفاً کد پرسنلی مبدا را وارد کنید");
            return;
        }

        try {
            const res = await api(`user?personnel_code=${fromPersonnelCodeSearch}`, "GET");
            
            if (res?.data && res.data.length > 0) {
                const user = res.data[0];
                setFromUser(user);
                formik.setFieldValue("from_user_id", String(user.id));
                await fetchUserAssignments(user.id);
                toast.success(`کاربر ${user.first_name || ""} ${user.last_name || ""} پیدا شد`);
            } else {
                const personnelRes = await api(`hrm-personnel-basic?personnel_code=${fromPersonnelCodeSearch}`, "GET");
                if (personnelRes?.data && personnelRes.data.length > 0) {
                    const basic = personnelRes.data[0];
                    const userRes = await api(`user/${basic.user_id}`, "GET");
                    if (userRes?.success && userRes?.data) {
                        const user = userRes.data;
                        setFromUser(user);
                        formik.setFieldValue("from_user_id", String(user.id));
                        await fetchUserAssignments(user.id);
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

    // ============== جستجوی کاربر مقصد با کد پرسنلی ==============
    const searchToUserByPersonnelCode = async () => {
        if (!toPersonnelCodeSearch.trim()) {
            toast.warning("لطفاً کد پرسنلی مقصد را وارد کنید");
            return;
        }

        try {
            const res = await api(`user?personnel_code=${toPersonnelCodeSearch}`, "GET");
            
            if (res?.data && res.data.length > 0) {
                const user = res.data[0];
                setToUser(user);
                formik.setFieldValue("to_user_id", String(user.id));
                toast.success(`کاربر ${user.first_name || ""} ${user.last_name || ""} پیدا شد`);
            } else {
                const personnelRes = await api(`hrm-personnel-basic?personnel_code=${toPersonnelCodeSearch}`, "GET");
                if (personnelRes?.data && personnelRes.data.length > 0) {
                    const basic = personnelRes.data[0];
                    const userRes = await api(`user/${basic.user_id}`, "GET");
                    if (userRes?.success && userRes?.data) {
                        const user = userRes.data;
                        setToUser(user);
                        formik.setFieldValue("to_user_id", String(user.id));
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

    const formik = useFormik({
        initialValues: {
            from_user_id: "",
            to_user_id: "",
            asset_type: "",
            selected_assignments: [],
            description: "",
        },
        validationSchema,
        onSubmit: handleSubmit,
        validateOnChange: true,
        validateOnMount: true,
    });

    // وقتی نوع اموال تغییر میکنه
    useEffect(() => {
        if (fromUser) {
            fetchUserAssignments(fromUser.id);
        }
    }, [formik.values.asset_type]);

    // وقتی لیست اموال تغییر میکنه، selected_assignments رو به‌روز کن
    useEffect(() => {
        formik.setFieldValue("selected_assignments", selectedAssignments);
    }, [selectedAssignments]);

    // ============== تابع انتخاب/عدم انتخاب همه ==============
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedAssignments([]);
            setSelectAll(false);
        } else {
            setSelectedAssignments(assignments.map(item => item.id));
            setSelectAll(true);
        }
    };

    // ============== تابع انتخاب/عدم انتخاب یک آیتم ==============
    const handleSelectItem = (id) => {
        setSelectedAssignments(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    // ============== نمایش اطلاعات کاربر مبدا ==============
    const renderFromUser = () => {
        if (!fromUser) return null;
        return (
            <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm">
                        {fromUser.first_name?.[0] || fromUser.last_name?.[0] || '?'}
                    </div>
                    <div>
                        <p className="font-medium text-red-800">
                            {fromUser.first_name || ""} {fromUser.last_name || ""}
                        </p>
                        <div className="flex gap-3 text-xs text-red-600">
                            <span>کد پرسنلی: {fromUser.personnel_code || "---"}</span>
                            <span>موبایل: {fromUser.phone_number || "---"}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ============== نمایش اطلاعات کاربر مقصد ==============
    const renderToUser = () => {
        if (!toUser) return null;
        return (
            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">
                        {toUser.first_name?.[0] || toUser.last_name?.[0] || '?'}
                    </div>
                    <div>
                        <p className="font-medium text-green-800">
                            {toUser.first_name || ""} {toUser.last_name || ""}
                        </p>
                        <div className="flex gap-3 text-xs text-green-600">
                            <span>کد پرسنلی: {toUser.personnel_code || "---"}</span>
                            <span>موبایل: {toUser.phone_number || "---"}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ============== نمایش لیست اموال قابل انتخاب ==============
    const renderAssignmentsList = () => {
        if (assignments.length === 0) {
            return (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-700">
                        {formik.values.asset_type === "original" 
                            ? "هیچ اموالی در اختیار اصلی یافت نشد" 
                            : formik.values.asset_type === "transferred" 
                                ? "هیچ اموال واگذار شده‌ای یافت نشد" 
                                : "لطفاً نوع اموال را انتخاب کنید"}
                    </p>
                </div>
            );
        }

        const formatNumber = (num) => {
            return new Intl.NumberFormat("fa-IR").format(num);
        };

        return (
            <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 flex items-center gap-4 border-b">
                    <button
                        onClick={handleSelectAll}
                        className="flex items-center gap-2 text-sm"
                    >
                        <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                            className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-gray-700">انتخاب همه</span>
                    </button>
                    <span className="text-sm text-gray-500">
                        {selectedAssignments.length} از {assignments.length} مورد انتخاب شده
                    </span>
                </div>
                <div className="max-h-60 overflow-y-auto">
                    {assignments.map((item) => (
                        <div
                            key={item.id}
                            className="px-4 py-2 border-b last:border-b-0 flex items-center gap-4 hover:bg-gray-50"
                        >
                            <input
                                type="checkbox"
                                checked={selectedAssignments.includes(item.id)}
                                onChange={() => handleSelectItem(item.id)}
                                className="w-4 h-4 text-blue-600 rounded"
                            />
                            <div className="flex-1">
                                <p className="text-sm font-medium">{item?.asset?.name || "-"}</p>
                                <div className="flex gap-4 text-xs text-gray-500">
                                    <span>تعداد: {item.assigned_count}</span>
                                    <span>قیمت واحد: {formatNumber(item.unit_price)} ریال</span>
                                    <span>شماره برچسب: {item.label_number || "ندارد"}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    async function handleSubmit(values) {
        if (selectedAssignments.length === 0) {
            toast.error("حداقل یک اموال باید انتخاب شود");
            return;
        }

        setIsSubmitting(true);
        setLoading(true);

        try {
            // برای هر assignment انتخاب شده، یک انتقال ایجاد کن
            const transferPromises = selectedAssignments.map(assignmentId => {
                const assignment = assignments.find(a => a.id === assignmentId);
                return api("hrm-asset-transfer", "POST", {
                    assignment_id: assignmentId,
                    from_user_id: parseInt(values.from_user_id),
                    to_user_id: parseInt(values.to_user_id),
                    transfer_count: assignment?.assigned_count || 1,
                    transfer_type: values.asset_type === "original" ? 0 : 1,
                    description: values.description || "",
                });
            });

            const results = await Promise.all(transferPromises);
            
            const allSuccess = results.every(res => res?.success);
            
            if (allSuccess) {
                toast.success(`${results.length} مورد اموال با موفقیت انتقال یافت`);
                formik.resetForm();
                setFromUser(null);
                setToUser(null);
                setAssignments([]);
                setSelectedAssignments([]);
                setFromPersonnelCodeSearch("");
                setToPersonnelCodeSearch("");
                setSelectAll(true);
                fetchOptions();
                fetchTransfers();
            } else {
                const errors = results.filter(res => !res?.success);
                toast.error(`${errors.length} مورد خطا در انتقال اموال رخ داد`);
            }
        } catch (error) {
            console.error("Error submitting:", error);
            toast.error("خطا در انتقال اموال");
        }

        setLoading(false);
        setIsSubmitting(false);
    }

    const handleDelete = async (id) => {
        const res = await api(`hrm-asset-transfer/${id}`, "DELETE");
        
        if (res?.success) {
            toast.success("رکورد انتقال با موفقیت حذف شد");
            fetchTransfers();
            fetchOptions();
        } else {
            toast.error(res?.message || "خطا در حذف");
        }
    };

    // ============== مشاهده جزئیات انتقال ==============
    const handleViewTransferItems = async (item) => {
       
        setViewingItem(item);
        try {
            // دریافت جزئیات همه آیتم‌های این انتقال (با فرض اینکه همه با یک assignment_id مرتبط هستند)
            const res = await api(`hrm-asset-transfer?viewall=true&assignment_id=${item.assignment_id}`, "GET");
            if (res?.data) {
                setViewingTransferItems(res.data);
                setShowItemsModal(true);
            }
        } catch (error) {
            console.error("Error fetching transfer items:", error);
            toast.error("خطا در دریافت جزئیات انتقال");
        }
    };

    const handleCloseItemsModal = () => {
        setShowItemsModal(false);
        setViewingTransferItems([]);
        setViewingItem(null);
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
        fetchTransfers();
    };

    const handleClearFilters = () => {
        setFilters({
            user_id: "",
            personnel_code: "",
            asset_id: "",
        });
        setSearchParams({});
    };

    if (loadingOptions) {
        return (
            <div className="flex justify-center py-10">
                <Loading />
            </div>
        );
    }

    // ============== گزینه‌های Select با کد پرسنلی ==============
    const userOptions = users.map((item) => {
        const label = item.personnel_code 
            ? `${item.first_name || ""} ${item.last_name || ""} (کدپرسنلی : ${item.personnel_code})`
            : `${item.first_name || ""} ${item.last_name || ""} (شماره همراه : ${item.phone_number || ""})`;
        return {
            value: String(item.id),
            label: label,
        };
    });

    const formatNumber = (num) => {
        return new Intl.NumberFormat("fa-IR").format(num);
    };

    // ستون‌های لیست انتقال‌ها (گروه‌بندی شده)
    const columns = ["ردیف", "کد پرسنلی", "نام پرسنل", "کد پرسنلی واگذار کننده", "نام پرسنل واگذار کننده", "تعداد اموال واگذار شده", "عملیات"];

    // بررسی اینکه آیا دکمه فعال بشه
    const isButtonDisabled = loading || !formik.isValid || selectedAssignments.length === 0 || !fromUser || !toUser || isSubmitting;

    return (
        <div className="w-full space-y-4">
            {/* ========== فرم انتقال ========== */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>انتقال اموال بین پرسنل</CardTitle>
                </CardHeader>

                <CardContent>
                    {/* ===== بخش انتخاب پرسنل مبدا ===== */}
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-5">
                        <h3 className="text-sm font-bold text-red-700 mb-3 flex items-center gap-2">
                            <UserMinus className="w-4 h-4" />
                            انتقال اموال از (مبدا)
                        </h3>

                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="flex-[2]">
                                <p className="text-xs text-gray-500 mb-3">
                                    پرسنل مبدا را با کد پرسنلی جستجو یا از لیست انتخاب کنید
                                </p>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={fromPersonnelCodeSearch}
                                            onChange={(e) => setFromPersonnelCodeSearch(e.target.value)}
                                            placeholder="کد پرسنلی مبدا را وارد کنید..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <Button onClick={searchFromUserByPersonnelCode} variant="secondary" className="flex items-center gap-2">
                                            <Search className="w-4 h-4" />
                                            جستجو
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-[3]">
                                <Select
                                    name="from_user_id"
                                    title="انتخاب کاربر مبدا از لیست"
                                    value={userOptions.find(opt => opt.value === formik.values.from_user_id) || null}
                                    onChange={(selectedOption) => {
                                        const value = selectedOption || "";
                                        formik.setFieldValue("from_user_id", value);
                                        if (value) {
                                            const user = users.find(u => String(u.id) === value);
                                            setFromUser(user);
                                            if (user?.personnel_code) {
                                                setFromPersonnelCodeSearch(user.personnel_code);
                                            }
                                            fetchUserAssignments(user.id);
                                        } else {
                                            setFromUser(null);
                                            setFromPersonnelCodeSearch("");
                                            setAssignments([]);
                                            setSelectedAssignments([]);
                                        }
                                    }}
                                    options={userOptions}
                                    placeholder="انتخاب پرسنل مبدا"
                                    isClearable
                                />
                            </div>
                        </div>

                        {renderFromUser()}
                    </div>

                    {/* ===== بخش انتخاب پرسنل مقصد ===== */}
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-5">
                        <h3 className="text-sm font-bold text-green-700 mb-3 flex items-center gap-2">
                            <UserPlus className="w-4 h-4" />
                            انتقال اموال به (مقصد)
                        </h3>

                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="flex-[2]">
                                <p className="text-xs text-gray-500 mb-3">
                                    پرسنل مقصد را با کد پرسنلی جستجو یا از لیست انتخاب کنید
                                </p>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={toPersonnelCodeSearch}
                                            onChange={(e) => setToPersonnelCodeSearch(e.target.value)}
                                            placeholder="کد پرسنلی مقصد را وارد کنید..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <Button onClick={searchToUserByPersonnelCode} variant="secondary" className="flex items-center gap-2">
                                            <Search className="w-4 h-4" />
                                            جستجو
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-[3]">
                                <Select
                                    name="to_user_id"
                                    title="انتخاب کاربر مقصد از لیست"
                                    value={userOptions.find(opt => opt.value === formik.values.to_user_id) || null}
                                    onChange={(selectedOption) => {
                                        const value = selectedOption || "";
                                        formik.setFieldValue("to_user_id", value);
                                        if (value) {
                                            const user = users.find(u => String(u.id) === value);
                                            setToUser(user);
                                            if (user?.personnel_code) {
                                                setToPersonnelCodeSearch(user.personnel_code);
                                            }
                                        } else {
                                            setToUser(null);
                                            setToPersonnelCodeSearch("");
                                        }
                                    }}
                                    options={userOptions}
                                    placeholder="انتخاب پرسنل مقصد"
                                    isClearable
                                />
                            </div>
                        </div>

                        {renderToUser()}
                    </div>

                    {/* ===== فرم ===== */}
                    {fromUser && toUser && (
                        <div className="w-full space-y-4">
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Select
                                    name="asset_type"
                                    title="انتقال از اموال"
                                    formik={formik}
                                    options={assetTypeOptions}
                                    placeholder="انتخاب نوع اموال"
                                    required
                                />
                            </div>

                            {/* لیست اموال قابل انتخاب */}
                            {formik.values.asset_type && (
                                <div className="w-full">
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                        انتخاب اموال برای انتقال
                                    </label>
                                    {renderAssignmentsList()}
                                </div>
                            )}

                            <div className="w-full">
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
                    )}

                    <div className="flex gap-3 mt-5">
                        <Button
                            onClick={formik.handleSubmit}
                            isLoading={loading}
                            disabled={isButtonDisabled}
                        >
                            انتقال اموال
                        </Button>
                        {isButtonDisabled && fromUser && toUser && (
                            <span className="text-xs text-red-500 self-center">
                                {selectedAssignments.length === 0 && " - حداقل یک اموال انتخاب کنید"}
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* ========== فیلترها ========== */}
            <Card className="w-full">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">جستجو در انتقال‌های انجام شده</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                کد پرسنلی
                            </label>
                            <input
                                type="text"
                                name="personnel_code"
                                value={filters.personnel_code}
                                onChange={handleFilterChange}
                                placeholder="کد پرسنلی"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                نام پرسنل
                            </label>
                            <Select
                                name="user_id"
                                value={userOptions.find(opt => opt.value === filters.user_id) || null}
                                onChange={(selectedOption) => handleFilterSelectChange("user_id", selectedOption)}
                                options={userOptions}
                                placeholder="همه پرسنل"
                                isClearable
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                اموال واگذار
                            </label>
                            <Select
                                name="asset_id"
                                value={allAssets.find(opt => opt.value === filters.asset_id) || null}
                                onChange={(selectedOption) => handleFilterSelectChange("asset_id", selectedOption)}
                                options={allAssets}
                                placeholder="همه اموال"
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

            {/* ========== لیست انتقال‌ها (گروه‌بندی شده) ========== */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>لیست انتقال‌های انجام شده</CardTitle>
                </CardHeader>

                <CardContent>
                    {listLoading ? (
                        <div className="flex justify-center py-10">
                            <Loading />
                        </div>
                    ) : data?.data?.length === 0 ? (
                        <Empty message="هیچ انتقالی انجام نشده است" />
                    ) : (
                        <>
                            <div className="w-full overflow-x-auto">
                                <div className="min-w-[900px]">
                                    <div className="w-full grid grid-cols-7 gap-3 p-3 bg-gray-100 rounded-t-md">
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
                                                className="w-full grid grid-cols-7 gap-3 px-3 py-3 hover:bg-gray-50 border-b last:border-b-0"
                                            >
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs">{index + 1}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs">{item?.toUser?.personnel_code || "-"}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs">
                                                        {item?.toUser?.first_name || ""} {item?.toUser?.last_name || ""}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs">{item?.fromUser?.personnel_code || "-"}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs">
                                                        {item?.fromUser?.first_name || ""} {item?.fromUser?.last_name || ""}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs font-bold">{item.transfer_count}</span>
                                                </div>
                                                <div className="flex items-center justify-center gap-1">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                className="cursor-pointer hover:text-blue-600"
                                                                onClick={() => handleViewTransferItems(item)}
                                                            >
                                                                <Eye className="w-3.5 h-3.5" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>مشاهده جزئیات</TooltipContent>
                                                    </Tooltip>

                                                    {checkAccess([704]) && (
                                                        <Confirm
                                                            title="حذف انتقال"
                                                            description="آیا از حذف این انتقال اطمینان دارید؟"
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

            {/* ========== مودال نمایش جزئیات انتقال ========== */}
            {showItemsModal && viewingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">جزئیات انتقال</h3>
                            <button
                                onClick={handleCloseItemsModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm">
                                <span className="font-medium">از:</span> {viewingItem?.fromUser?.first_name || ""} {viewingItem?.fromUser?.last_name || ""} 
                                ({viewingItem?.fromUser?.personnel_code || "نامشخص"})
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">به:</span> {viewingItem?.toUser?.first_name || ""} {viewingItem?.toUser?.last_name || ""} 
                                ({viewingItem?.toUser?.personnel_code || "نامشخص"})
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">تاریخ:</span> {viewingItem.transfer_date ? new Date(viewingItem.transfer_date).toLocaleDateString("fa-IR") : "-"}
                            </p>
                        </div>

                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-right">#</th>
                                        <th className="px-3 py-2 text-right">نام اموال</th>
                                        <th className="px-3 py-2 text-right">شماره برچسب</th>
                                        <th className="px-3 py-2 text-right">تعداد</th>
                                        <th className="px-3 py-2 text-right">قیمت واحد (ریال)</th>
                                        <th className="px-3 py-2 text-right">توضیحات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {viewingTransferItems.map((item, index) => (
                                        <tr key={item.id} className="border-b hover:bg-gray-50">
                                            <td className="px-3 py-2">{index + 1}</td>
                                            <td className="px-3 py-2">{item?.assignment?.asset?.name || item?.asset?.name || "-"}</td>
                                            <td className="px-3 py-2">{item?.assignment?.label_number || "-"}</td>
                                            <td className="px-3 py-2">{item.transfer_count}</td>
                                            <td className="px-3 py-2">{formatNumber(item?.assignment?.unit_price || 0)}</td>
                                            <td className="px-3 py-2">{item.description || "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <Button variant="secondary" onClick={handleCloseItemsModal}>
                                بستن
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}