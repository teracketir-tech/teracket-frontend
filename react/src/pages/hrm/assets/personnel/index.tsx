// src/pages/hrm/assets/personnel/index.tsx

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
import { Trash2Icon, Search, X, Eye, User, CheckCircle, Edit3 } from "lucide-react";
import Confirm from "@/components/ui/confirm";
import { checkAccess } from "@/lib/utils";

const validationSchema = yup.object({
    asset_id: yup.string().required("انتخاب اموال الزامی است"),
    user_id: yup.string().required("انتخاب پرسنل الزامی است"),
    unit_price: yup.number().required("قیمت اموال الزامی است").min(1, "قیمت اموال را صحیح وارد کنید"),
    assigned_count: yup.number().required("تعداد الزامی است").min(1, "تعداد باید حداقل 1 باشد"),
    label_number: yup.string().nullable(),
    description: yup.string().nullable(),
});

export default function PersonnelAssets() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [assets, setAssets] = useState([]);
    const [allAssets, setAllAssets] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [personnelCodeSearch, setPersonnelCodeSearch] = useState("");
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [data, setData] = useState({ data: [], pages: 0, totalCount: 0 });
    const [viewingItem, setViewingItem] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [allWorkgroups, setAllWorkgroups] = useState([]);
    const [allBakhshs, setAllBakhshs] = useState([]);
    const [allGhesmats, setAllGhesmats] = useState([]);
    const [selectedWorkgroup, setSelectedWorkgroup] = useState("");
    const [selectedBakhsh, setSelectedBakhsh] = useState("");
    
    // لیست اموال پیش‌ثبت (draft)
    const [draftAssets, setDraftAssets] = useState([]);
    const [draftLoading, setDraftLoading] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    
    // State برای مدیریت ویرایش در لیست Draft
    const [editingDraftId, setEditingDraftId] = useState(null);
    const [editDraftValues, setEditDraftValues] = useState({
        assigned_count: 0,
        unit_price: 0,
    });
    const [editDraftLoading, setEditDraftLoading] = useState(false);
    
    // فیلترها
    const [filters, setFilters] = useState({
        user_id: searchParams.get("user_id") || "",
        personnel_code: searchParams.get("personnel_code") || "",
        workgroup_id: searchParams.get("workgroup_id") || "",
        bakhsh_id: searchParams.get("bakhsh_id") || "",
        label_number: searchParams.get("label_number") || "",
        asset_id: searchParams.get("asset_id") || "",
    });

    // دریافت لیست واگذاری‌ها (تایید شده)
    const fetchAssignments = async () => {
        const params = new URLSearchParams();
        
        if (filters.user_id) params.set("user_id", filters.user_id);
        if (filters.personnel_code) params.set("personnel_code", filters.personnel_code);
        if (filters.workgroup_id) params.set("workgroup_id", filters.workgroup_id);
        if (filters.bakhsh_id) params.set("bakhsh_id", filters.bakhsh_id);
        if (filters.label_number) params.set("label_number", filters.label_number);
        if (filters.asset_id) params.set("asset_id", filters.asset_id);
        
        const page = searchParams.get("page");
        const perPage = searchParams.get("per-page");
        if (page) params.set("page", page);
        if (perPage) params.set("per-page", perPage);
        
        const query = params.toString();
        setListLoading(true);
        try {
            const res = await api(`hrm-asset-assignment?${query}`, "GET");
            setData(res || { data: [], pages: 0 });
        } catch (error) {
            console.error("Error fetching assignments:", error);
        }
        setListLoading(false);
    };

    // دریافت لیست اموال پیش‌ثبت (draft) یک کاربر
    const fetchDraftAssets = async (userId) => {
        if (!userId) {
            setDraftAssets([]);
            return;
        }

        setDraftLoading(true);
        try {
            const res = await api(`hrm-asset-assignment/draft-assets?userId=${userId}`, "GET");
            if (res?.success) {
                setDraftAssets(res.data || []);
            } else {
                setDraftAssets([]);
            }
        } catch (error) {
            console.error("Error fetching draft assets:", error);
            setDraftAssets([]);
        }
        setDraftLoading(false);
    };

    // ============== useEffect ==============
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAssignments();
        }, 300);

        return () => clearTimeout(timer);
    }, [filters]);

    useEffect(() => {
        fetchOptions();
        fetchWorkgroups();
        fetchAllAssets();
    }, []);

    const fetchOptions = async () => {
        setLoadingOptions(true);
        
        try {
            const assetsRes = await api("hrm-asset?per-page=100", "GET");
            if (assetsRes?.data) {
                const availableAssets = assetsRes.data.filter(item => (item.available_count || 0) > 0);
                setAssets(availableAssets);
            }

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

    // ============== دریافت لیست همه اموال برای فیلتر ==============
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

    // ============== دریافت گروه‌های کاری، بخش‌ها و قسمت‌ها ==============
    const fetchWorkgroups = async () => {
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

    const fetchBakhshs = async (workgroupId) => {
        if (!workgroupId) {
            setAllBakhshs([]);
            return;
        }
        try {
            const res = await api(`hrm-workgroup-bakhsh/items?workgroupId=${workgroupId}`, "GET");
            if (res?.success) {
                const options = res.data.map(item => ({
                    value: String(item.id),
                    label: item.name
                }));
                setAllBakhshs(options);
            }
        } catch (error) {
            console.error("Error fetching bakhshs:", error);
        }
    };

    const fetchGhesmats = async (bakhshId) => {
        if (!bakhshId) {
            setAllGhesmats([]);
            return;
        }
        try {
            const res = await api(`hrm-workgroup-ghesmat/items?bakhshId=${bakhshId}`, "GET");
            if (res?.success) {
                const options = res.data.map(item => ({
                    value: String(item.id),
                    label: item.name
                }));
                setAllGhesmats(options);
            }
        } catch (error) {
            console.error("Error fetching ghesmats:", error);
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
                await fetchDraftAssets(user.id);
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
                        await fetchDraftAssets(user.id);
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
            asset_id: "",
            user_id: "",
            unit_price: 0,
            label_number: "",
            assigned_count: "",
            description: "",
        },
        validationSchema,
        onSubmit: handleSubmit,
        validateOnChange: true,
        validateOnMount: true,
    });

    // وقتی کاربر تغییر میکنه، لیست draft رو به‌روز کن
    useEffect(() => {
        if (formik.values.user_id) {
            fetchDraftAssets(formik.values.user_id);
        } else {
            setDraftAssets([]);
        }
    }, [formik.values.user_id]);

    useEffect(() => {
        const assetId = formik.values.asset_id;
        if (assetId) {
            const asset = assets.find(a => String(a.id) === assetId);
            setSelectedAsset(asset);
            if (asset) {
                formik.setFieldValue("assigned_count", Math.min(1, asset.available_count || 0));
                formik.setFieldValue("unit_price", asset.unit_price || 0);
            }
        } else {
            setSelectedAsset(null);
        }
    }, [formik.values.asset_id, assets]);

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

    // ============== تایید نهایی همه اموال پیش‌ثبت ==============
    const handleConfirmAll = async () => {
        if (!selectedUser) {
            toast.warning("لطفاً ابتدا یک پرسنل انتخاب کنید");
            return;
        }

        if (draftAssets.length === 0) {
            toast.warning("هیچ اموال پیش‌ثبتی برای این کاربر وجود ندارد");
            return;
        }

        if (!confirm(`آیا از تایید نهایی ${draftAssets.length} مورد اموال پیش‌ثبت برای ${selectedUser.first_name} ${selectedUser.last_name} اطمینان دارید؟`)) {
            return;
        }

        setConfirmLoading(true);
        try {
            const res = await api(`hrm-asset-assignment/confirm-draft?userId=${selectedUser.id}`, "POST");
            if (res?.success) {
                toast.success(res.message || "تمامی اموال پیش‌ثبت با موفقیت تایید شد");
                await fetchDraftAssets(selectedUser.id);
                fetchAssignments();
                fetchOptions();
            } else {
                toast.error(res?.message || "خطا در تایید اموال");
            }
        } catch (error) {
            console.error("Error confirming draft:", error);
            toast.error("خطا در تایید اموال");
        }
        setConfirmLoading(false);
    };

    // ============== حذف یک اموال پیش‌ثبت ==============
    const handleDeleteDraft = async (id) => {
        if (!confirm("آیا از حذف این اموال پیش‌ثبت اطمینان دارید؟")) {
            return;
        }

        try {
            const res = await api(`hrm-asset-assignment/delete-draft?id=${id}`, "DELETE");
            if (res?.success) {
                toast.success("اموال پیش‌ثبت با موفقیت حذف شد");
                if (selectedUser) {
                    await fetchDraftAssets(selectedUser.id);
                    fetchAssignments();
                    fetchOptions();
                }
            } else {
                toast.error(res?.message || "خطا در حذف اموال پیش‌ثبت");
            }
        } catch (error) {
            console.error("Error deleting draft:", error);
            toast.error("خطا در حذف اموال پیش‌ثبت");
        }
    };

    // ============== شروع ویرایش یک آیتم پیش‌ثبت ==============
    const handleStartEditDraft = (item) => {
        setEditingDraftId(item.id);
        setEditDraftValues({
            assigned_count: item.assigned_count || 0,
            unit_price: item.unit_price || 0,
        });
    };

    // ============== لغو ویرایش ==============
    const handleCancelEditDraft = () => {
        setEditingDraftId(null);
        setEditDraftValues({
            assigned_count: 0,
            unit_price: 0,
        });
    };

    // ============== ذخیره تغییرات ویرایش ==============
    const handleSaveEditDraft = async (id) => {
        if (editDraftValues.assigned_count < 1) {
            toast.error("تعداد باید حداقل 1 باشد");
            return;
        }
        if (editDraftValues.unit_price < 1) {
            toast.error("قیمت باید بیشتر از 0 باشد");
            return;
        }

        setEditDraftLoading(true);
        try {
            const payload = {
                assigned_count: parseInt(editDraftValues.assigned_count),
                unit_price: parseInt(editDraftValues.unit_price),
                total_price: parseInt(editDraftValues.assigned_count) * parseInt(editDraftValues.unit_price),
            };

            const res = await api(`hrm-asset-assignment/${id}`, "PATCH", payload);
            if (res?.success) {
                toast.success("اموال پیش‌ثبت با موفقیت ویرایش شد");
                setEditingDraftId(null);
                if (selectedUser) {
                    await fetchDraftAssets(selectedUser.id);
                }
            } else {
                toast.error(res?.message || "خطا در ویرایش اموال پیش‌ثبت");
            }
        } catch (error) {
            console.error("Error editing draft:", error);
            toast.error("خطا در ویرایش اموال پیش‌ثبت");
        }
        setEditDraftLoading(false);
    };

    async function handleSubmit(values) {
        setLoading(true);

        try {
            const asset = assets.find(a => String(a.id) === values.asset_id);
            const unitPrice = asset?.unit_price || 0;

            const payload = {
                ...values,
                asset_id: parseInt(values.asset_id),
                user_id: parseInt(values.user_id),
                unit_price: parseInt(values.unit_price),
                assigned_count: parseInt(values.assigned_count),
                status_insert: 0, // draft
            };

            const res = await api("hrm-asset-assignment", "POST", payload);

            if (res?.success) {
                toast.success("اموال با موفقیت پیش‌ثبت شد");
                formik.resetForm();
                setSelectedAsset(null);
                if (selectedUser) {
                    await fetchDraftAssets(selectedUser.id);
                }
                fetchOptions();
                fetchAssignments();
            } else {
                toast.error(res?.message || "خطا در ثبت اموال");
            }
        } catch (error) {
            console.error("Error submitting:", error);
            toast.error("خطا در ثبت اموال");
        }

        setLoading(false);
    }

    const handleReturn = async (id) => {
        const res = await api(`hrm-asset-assignment/${id}`, "DELETE");
        
        if (res?.success) {
            toast.success("اموال با موفقیت بازگشت داده شد");
            fetchAssignments();
            fetchOptions();
        } else {
            toast.error(res?.message || "خطا در بازگشت اموال");
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
        fetchAssignments();
    };

    const handleClearFilters = () => {
        setFilters({
            user_id: "",
            personnel_code: "",
            workgroup_id: "",
            bakhsh_id: "",
            label_number: "",
            asset_id: "",
        });
        setSearchParams({});
        setAllBakhshs([]);
        setAllGhesmats([]);
        setSelectedWorkgroup("");
        setSelectedBakhsh("");
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

    const userFilterOptions = users.map((item) => {
        const label = item.personnel_code 
            ? `${item.first_name || ""} ${item.last_name || ""} (کدپرسنلی : ${item.personnel_code})`
            : `${item.first_name || ""} ${item.last_name || ""} (شماره همراه : ${item.phone_number || ""})`;
        return {
            value: String(item.id),
            label: label,
        };
    });

    const assetOptions = assets.map((item) => ({
        value: String(item.id),
        label: `${item.name} ${item.material ? `(${item.material})` : ""} - موجود: ${item.available_count || 0}`,
        disabled: (item.available_count || 0) <= 0,
    }));

    const workgroupOptions = allWorkgroups;
    const bakhshOptions = allBakhshs;
    const ghesmatOptions = allGhesmats;

    const formatNumber = (num) => {
        return new Intl.NumberFormat("fa-IR").format(num);
    };

    // ============== ستون‌های گرید ==============
    const columns = [
        "ردیف", "کد پرسنلی", "نام پرسنل", "گروه کاری", "بخش", "قسمت",
        "شماره برچسب", "نام اموال", "جنس", "تعداد اموال", "قیمت واحد (ریال)",
        "توضیحات", "عملیات"
    ];

    return (
        <div className="w-full space-y-4">
            {/* ========== فرم واگذاری ========== */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>ثبت اموال برای پرسنل</CardTitle>
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
                                            fetchDraftAssets(user.id);
                                        } else {
                                            setSelectedUser(null);
                                            setPersonnelCodeSearch("");
                                            setDraftAssets([]);
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
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Select
                                name="asset_id"
                                title="انتخاب اموال"
                                formik={formik}
                                  onChange={(selectedOption) => {
                                 
                                      const asset = assets.find(a => String(a.id) === selectedOption);
                                     if (asset) {
                                         setSelectedAsset(asset);
                                         formik.setFieldValue("unit_price", asset.unit_price || 0);
                                         formik.setFieldValue("assigned_count", Math.min(1, asset.available_count || 0));
                                     }
                                }}
                                options={assetOptions}
                                placeholder="انتخاب اموال"
                                required
                            />

                            {selectedAsset && (
                                <div className="p-3 bg-blue-50 rounded-md">
                                    <p className="text-sm">
                                        <span className="font-medium">نام:</span> {selectedAsset.name}
                                        <br />
                                        <span className="font-medium">موجودی:</span> {selectedAsset.available_count || 0}
                                        <br />
                                        <span className="font-medium">قیمت ثبت شده هنگام درج:</span> {new Intl.NumberFormat("fa-IR").format(selectedAsset.unit_price || 0)} ریال
                                    </p>
                                </div>
                            )}
                            </div>
                            <br/>
                             <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5">
                            <Input
                                type="text"
                                name="label_number"
                                title="شماره برچسب"
                                formik={formik}
                                placeholder="شماره برچسب (اختیاری)"
                            />

                            <Input
                                type="number"
                                name="assigned_count"
                                title="تعداد"
                                formik={formik}
                                placeholder="تعداد اموال"
                                required
                                min={1}
                                max={selectedAsset?.available_count || 0}
                            />

                          <Input
                                type="number"
                                name="unit_price"
                                title="قیمت"
                                formik={formik}
                                placeholder="قیمت اموال"
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
                        </>
                    )}

                    <div className="flex gap-3 mt-5">
                        <Button
                            onClick={formik.handleSubmit}
                            isLoading={loading}
                            disabled={!formik.isValid || loading || !selectedAsset || !selectedUser}
                        >
                            پیش ثبت
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* ========== لیست اموال پیش‌ثبت (Draft) ========== */}
            {selectedUser && (
                <Card className="w-full border-yellow-400 border-2">
                    <CardHeader className="bg-yellow-50">
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <span className="text-yellow-700">اموال پیش‌ثبت</span>
                                <span className="text-sm font-normal text-gray-500">
                                    ({selectedUser.first_name} {selectedUser.last_name})
                                </span>
                                {draftAssets.length > 0 && (
                                    <span className="text-sm font-normal bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
                                        {draftAssets.length} مورد
                                    </span>
                                )}
                            </span>
                           
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {draftLoading ? (
                            <div className="flex justify-center py-6">
                                <Loading />
                            </div>
                        ) : draftAssets.length === 0 ? (
                            <div className="text-center py-6 text-gray-400">
                                <p>هیچ اموال پیش‌ثبتی برای این کاربر وجود ندارد</p>
                            </div>
                        ) : (
                            <div className="w-full overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-yellow-50">
                                        <tr>
                                            <th className="px-3 py-2 text-right">#</th>
                                            <th className="px-3 py-2 text-right">نام اموال</th>
                                            <th className="px-3 py-2 text-right">جنس</th>
                                            <th className="px-3 py-2 text-right">تعداد</th>
                                            <th className="px-3 py-2 text-right">قیمت واحد (ریال)</th>
                                            <th className="px-3 py-2 text-right">شماره برچسب</th>
                                            <th className="px-3 py-2 text-right">عملیات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {draftAssets.map((item, index) => {
                                            const isEditing = editingDraftId === item.id;
                                            return (
                                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                                    <td className="px-3 py-2">{index + 1}</td>
                                                    <td className="px-3 py-2">{item?.asset?.name || "-"}</td>
                                                    <td className="px-3 py-2">{item?.asset?.material || "-"}</td>
                                                    <td className="px-3 py-2">
                                                        {isEditing ? (
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={editDraftValues.assigned_count}
                                                                onChange={(e) => setEditDraftValues(prev => ({
                                                                    ...prev,
                                                                    assigned_count: parseInt(e.target.value) || 0
                                                                }))}
                                                                className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            />
                                                        ) : (
                                                            <span className="font-medium">{item.assigned_count}</span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        {isEditing ? (
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={editDraftValues.unit_price}
                                                                onChange={(e) => setEditDraftValues(prev => ({
                                                                    ...prev,
                                                                    unit_price: parseInt(e.target.value) || 0
                                                                }))}
                                                                className="w-32 px-2 py-1 border border-gray-300 rounded-md text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            />
                                                        ) : (
                                                            <span>{formatNumber(item.unit_price)}</span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2">{item.label_number || "-"}</td>
                                                    <td className="px-3 py-2">
                                                        <div className="flex items-center gap-2">
                                                            {isEditing ? (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleSaveEditDraft(item.id)}
                                                                        disabled={editDraftLoading}
                                                                        className="text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 bg-green-50 rounded hover:bg-green-100 transition-colors disabled:opacity-50"
                                                                    >
                                                                        {editDraftLoading ? "در حال..." : "ذخیره"}
                                                                    </button>
                                                                    <button
                                                                        onClick={handleCancelEditDraft}
                                                                        className="text-gray-500 hover:text-gray-700 text-sm font-medium px-3 py-1 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                                                                    >
                                                                        انصراف
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <button
                                                                                onClick={() => handleStartEditDraft(item)}
                                                                                className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                                                                            >
                                                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                                                </svg>
                                                                            </button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>ویرایش</TooltipContent>
                                                                    </Tooltip>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <button
                                                                                onClick={() => handleDeleteDraft(item.id)}
                                                                                className="text-red-500 hover:text-red-700 transition-colors p-1"
                                                                            >
                                                                                <Trash2Icon className="w-4 h-4" />
                                                                            </button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>حذف</TooltipContent>
                                                                    </Tooltip>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                 {draftAssets.length > 0 && (
                                <Button
                                    onClick={handleConfirmAll}
                                    isLoading={confirmLoading}
                                    className="bg-green-600 hover:bg-green-700"
                                    size="sm"
                                >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    ثبت نهایی همه
                                </Button>
                            )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* ========== فیلترها ========== */}
            <Card className="w-full">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">جستجو در اموال در اختیار پرسنل</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                نام پرسنل
                            </label>
                            <Select
                                name="user_id"
                                value={userFilterOptions.find(opt => opt.value === filters.user_id) || null}
                                onChange={(selectedOption) => handleFilterSelectChange("user_id", selectedOption)}
                                options={userFilterOptions}
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
                                گروه کاری
                            </label>
                            <Select
                                name="workgroup_id"
                                value={workgroupOptions.find(opt => opt.value === filters.workgroup_id) || null}
                                onChange={(selectedOption) => {
                                    const value = selectedOption || "";
                                    handleFilterSelectChange("workgroup_id", selectedOption);
                                    setSelectedWorkgroup(value);
                                    if (value) {
                                        fetchBakhshs(value);
                                    } else {
                                        setAllBakhshs([]);
                                        setAllGhesmats([]);
                                        setSelectedBakhsh("");
                                        setFilters(prev => ({ ...prev, bakhsh_id: "", ghesmat_id: "" }));
                                    }
                                }}
                                options={workgroupOptions}
                                placeholder="همه گروه‌ها"
                                isClearable
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                بخش
                            </label>
                            <Select
                                name="bakhsh_id"
                                value={bakhshOptions.find(opt => opt.value === filters.bakhsh_id) || null}
                                onChange={(selectedOption) => {
                                    const value = selectedOption || "";
                                    handleFilterSelectChange("bakhsh_id", selectedOption);
                                    setSelectedBakhsh(value);
                                    if (value) {
                                        fetchGhesmats(value);
                                    } else {
                                        setAllGhesmats([]);
                                        setFilters(prev => ({ ...prev, ghesmat_id: "" }));
                                    }
                                }}
                                options={bakhshOptions}
                                placeholder="همه بخش‌ها"
                                isClearable
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                شماره برچسب
                            </label>
                            <input
                                type="text"
                                name="label_number"
                                value={filters.label_number || ""}
                                onChange={handleFilterChange}
                                placeholder="شماره برچسب"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                اموال در اختیار
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

            {/* ========== لیست واگذاری‌ها (تایید شده) ========== */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>لیست اموال در اختیار پرسنل (تایید شده)</CardTitle>
                </CardHeader>

                <CardContent>
                    {listLoading ? (
                        <div className="flex justify-center py-10">
                            <Loading />
                        </div>
                    ) : data?.data?.length === 0 ? (
                        <Empty message="هیچ اموالی در اختیار پرسنل نیست" />
                    ) : (
                        <>
                            <div className="w-full overflow-x-auto">
                                <div className="min-w-[1400px]">
                                    <div className="w-full grid grid-cols-13 gap-3 p-3 bg-gray-100 rounded-t-md text-xs">
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
                                                className="w-full grid grid-cols-13 gap-3 px-3 py-2 hover:bg-gray-50 border-b last:border-b-0 text-xs"
                                            >
                                                <div className="flex items-center justify-center">
                                                    <span>{index + 1}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span>{item?.user?.personnel_code || "-"}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span>{item?.user?.first_name || ""} {item?.user?.last_name || ""}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span>{item?.user?.workgroup_name || "-"}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span>{item?.user?.bakhsh_name || "-"}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span>{item?.user?.ghesmat_name || "-"}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span>{item.label_number || "-"}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span>{item?.asset?.name || "-"}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span>{item?.asset?.material || "-"}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span>{item.assigned_count}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span>{formatNumber(item.unit_price)}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="truncate max-w-[80px]" title={item.description || ""}>
                                                        {item.description || "-"}
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

                                                    {checkAccess([704]) && (
                                                        <Confirm
                                                            title="بازگشت اموال"
                                                            description="آیا از بازگشت این اموال اطمینان دارید؟"
                                                            onConfirm={() => handleReturn(item.id)}
                                                        >
                                                            <button className="cursor-pointer hover:text-red-600">
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Trash2Icon className="w-3.5 h-3.5 text-red-500" />
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>بازگشت</TooltipContent>
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

            {/* ========== مودال نمایش جزئیات ========== */}
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
                                    <span className="text-xs text-gray-500">بخش</span>
                                    <p className="font-medium text-sm">{viewingItem?.user?.bakhsh_name || "-"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">نام اموال</span>
                                    <p className="font-medium text-sm">{viewingItem?.asset?.name || "-"}</p>
                                </div>
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">جنس</span>
                                    <p className="font-medium text-sm">{viewingItem?.asset?.material || "-"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">شماره برچسب</span>
                                    <p className="font-medium text-sm">{viewingItem.label_number || "-"}</p>
                                </div>
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">تعداد  </span>
                                    <p className="font-medium text-sm">{viewingItem.assigned_count}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 bg-blue-50 rounded">
                                    <span className="text-xs text-gray-500">قیمت واحد</span>
                                    <p className="font-medium text-sm">{formatNumber(viewingItem.unit_price)} ریال</p>
                                </div>
                                <div className="p-2 bg-green-50 rounded border border-green-200">
                                    <span className="text-xs text-gray-500">قیمت کل</span>
                                    <p className="font-medium text-lg text-green-700">{formatNumber(viewingItem.total_price)} ریال</p>
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