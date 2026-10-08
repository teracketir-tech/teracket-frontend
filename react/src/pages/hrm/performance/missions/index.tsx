// src/pages/hrm/performance/missions/index.jsx

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
import { PenBox, Trash2Icon, CheckCircle, XCircle, Settings, MapPin, Search, X, Eye, User } from "lucide-react";
import Confirm from "@/components/ui/confirm";
import { checkAccess, formatDateToFa, formatDateToEn } from "@/lib/utils";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

// ============== Validation Schemas ==============
const missionValidationSchema = yup.object({
    user_id: yup.string().required("انتخاب پرسنل الزامی است"),
    mission_type_id: yup.string().required("انتخاب نوع ماموریت الزامی است"),
    date_from: yup.string().required("تاریخ شروع الزامی است"),
    date_to: yup.string().required("تاریخ پایان الزامی است"),
    time_from: yup.string().nullable(),
    time_to: yup.string().nullable(),
    location: yup.string().nullable(),
    description: yup.string().nullable(),
});

const missionTypeValidationSchema = yup.object({
    name: yup.string().required("نام نوع ماموریت الزامی است"),
    sort_order: yup.number().min(0, "ترتیب نمایش نمی‌تواند منفی باشد").nullable(),
    description: yup.string().nullable(),
});

// ============== گزینه‌های ثابت ==============
const statusOptions = [
    { value: "", label: "همه وضعیت ها" },
    { value: "0", label: "در انتظار" },
    { value: "1", label: "تایید شده" },
    { value: "2", label: "رد شده" },
    { value: "3", label: "لغو شده" },
];

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

const getYearOptions = () => {
    const years = [];
    for (let i = 1405 - 15; i <= 1405 + 15; i++) {
        years.push({ value: String(i), label: String(i) });
    }
    return years;
};

// ============== تب مدیریت انواع ماموریت ==============
function MissionTypeManagement({ missionTypes, fetchMissionTypes }) {
    const [loading, setLoading] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const formik = useFormik({
        initialValues: {
            name: "",
            sort_order: 0,
            description: "",
        },
        validationSchema: missionTypeValidationSchema,
        onSubmit: handleSubmit,
        validateOnChange: true,
        validateOnMount: true,
    });

    const handleEdit = (item) => {
        setEditingItem(item);
        formik.setValues({
            name: item.name || "",
            sort_order: item.sort_order || 0,
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
            ? `hrm-mission-type/${editingItem.id}`
            : "hrm-mission-type";

        const payload = {
            ...values,
            sort_order: values.sort_order ? parseInt(values.sort_order) : 0,
        };

        const res = await api(url, editingItem ? "PATCH" : "POST", payload);

        setLoading(false);

        if (res?.success) {
            toast.success(editingItem ? "نوع ماموریت با موفقیت ویرایش شد" : "نوع ماموریت با موفقیت ثبت شد");
            setEditingItem(null);
            formik.resetForm();
            fetchMissionTypes();
        } else {
            toast.error(res?.message || "خطا در ثبت اطلاعات");
        }
    }

    const handleDelete = async (id) => {
        const res = await api(`hrm-mission-type/${id}`, "DELETE");
        if (res?.success) {
            toast.success("نوع ماموریت با موفقیت حذف شد");
            fetchMissionTypes();
        } else {
            toast.error(res?.message || "خطا در حذف");
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const res = await api(`hrm-mission-type/${id}/toggle-status`, "POST");
        if (res?.success) {
            toast.success(currentStatus ? "نوع ماموریت غیرفعال شد" : "نوع ماموریت فعال شد");
            fetchMissionTypes();
        } else {
            toast.error(res?.message || "خطا در تغییر وضعیت");
        }
    };

    const columns = ["ردیف", "نام", "ترتیب", "وضعیت", "عملیات"];

    return (
        <div className="w-full space-y-4">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{editingItem ? "ویرایش نوع ماموریت" : "افزودن نوع ماموریت جدید"}</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input
                            type="text"
                            name="name"
                            title="نام نوع ماموریت"
                            formik={formik}
                            placeholder="مثال: ماموریت کاری"
                            required
                        />

                        <Input
                            type="number"
                            name="sort_order"
                            title="ترتیب نمایش"
                            formik={formik}
                            placeholder="مثال: ۱"
                            min={0}
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

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>لیست انواع ماموریت</CardTitle>
                </CardHeader>

                <CardContent>
                    {missionTypes?.length === 0 ? (
                        <Empty message="هیچ نوع ماموریتی ثبت نشده است" />
                    ) : (
                        <div className="w-full overflow-x-auto">
                            <div className="min-w-[500px]">
                                <div className="w-full grid grid-cols-5 gap-3 p-3 bg-gray-100 rounded-t-md">
                                    {columns.map((col, i) => (
                                        <div key={i} className="flex items-center justify-center">
                                            <span className="text-xs font-bold text-gray-600">{col}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col border-x border-b rounded-b-md">
                                    {missionTypes.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className="w-full grid grid-cols-5 gap-3 px-3 py-3 hover:bg-gray-50 border-b last:border-b-0"
                                        >
                                            <div className="flex items-center justify-center">
                                                <span className="text-xs">{index + 1}</span>
                                            </div>
                                            <div className="flex items-center justify-center">
                                                <span className="text-xs font-medium">{item.name}</span>
                                            </div>
                                            <div className="flex items-center justify-center">
                                                <span className="text-xs">{item.sort_order}</span>
                                            </div>
                                            <div className="flex items-center justify-center">
                                                <span className={`text-xs font-medium ${item.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                                    {item.is_active ? "فعال" : "غیرفعال"}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-center gap-1">
                                                {checkAccess([703]) && (
                                                    <>
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

                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <button
                                                                    className={`cursor-pointer ${item.is_active ? 'hover:text-red-600' : 'hover:text-green-600'}`}
                                                                    onClick={() => handleToggleStatus(item.id, item.is_active)}
                                                                >
                                                                    {item.is_active ? (
                                                                        <XCircle className="w-3.5 h-3.5" />
                                                                    ) : (
                                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                                    )}
                                                                </button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>{item.is_active ? "غیرفعال" : "فعال"}</TooltipContent>
                                                        </Tooltip>
                                                    </>
                                                )}

                                                {checkAccess([704]) && (
                                                    <Confirm
                                                        title="حذف نوع ماموریت"
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
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// ============== کامپوننت اصلی ==============
export default function Missions() {
    const [activeTab, setActiveTab] = useState("missions");
    const [reportTab, setReportTab] = useState("list");
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [missionTypes, setMissionTypes] = useState([]);
    const [allWorkgroups, setAllWorkgroups] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [viewingItem, setViewingItem] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [data, setData] = useState({ data: [], pages: 0, totalCount: 0 });
    const [selectedUser, setSelectedUser] = useState(null);
    const [personnelCodeSearch, setPersonnelCodeSearch] = useState("");

    // ============== فیلترهای اصلی ==============
    const [filters, setFilters] = useState({
        user_id: searchParams.get("user_id") || "",
        mission_type_id: searchParams.get("mission_type_id") || "",
        status: searchParams.get("status") || "",
        date_from: searchParams.get("date_from") || "",
        date_to: searchParams.get("date_to") || "",
        personnel_code: searchParams.get("personnel_code") || "",
        national_code: searchParams.get("national_code") || "",
        workgroup_id: searchParams.get("workgroup_id") || "",
    });

    // ============== فیلترهای ماهانه ==============
    const [monthlyFilters, setMonthlyFilters] = useState({
        month: searchParams.get("month") || "",
        year: searchParams.get("year") || "",
        user_id: searchParams.get("user_id") || "",
        personnel_code: searchParams.get("personnel_code") || "",
        national_code: searchParams.get("national_code") || "",
        mission_type_id: searchParams.get("mission_type_id") || "",
        workgroup_id: searchParams.get("workgroup_id") || "",
    });

    const yearOptions = getYearOptions();

    // ============== fetchData ==============
    const fetchData = async () => {
        let url = "";
        const params = new URLSearchParams();

        if (reportTab === "list") {
            url = "hrm-mission";
            if (filters.user_id) params.set("user_id", filters.user_id);
            if (filters.mission_type_id) params.set("mission_type_id", filters.mission_type_id);
            if (filters.status !== "") params.set("status", filters.status);
            if (filters.date_from) {
                const gregorian = formatDateToEn(filters.date_from);
                if (gregorian) params.set("date_from", gregorian);
            }
            if (filters.date_to) {
                const gregorian = formatDateToEn(filters.date_to);
                if (gregorian) params.set("date_to", gregorian);
            }
            if (filters.personnel_code) params.set("personnel_code", filters.personnel_code);
            if (filters.national_code) params.set("national_code", filters.national_code);
            if (filters.workgroup_id) params.set("workgroup_id", filters.workgroup_id);
        } else if (reportTab === "daily") {
            url = "hrm-mission/daily-report";
            if (filters.date_from) {
                const gregorian = formatDateToEn(filters.date_from);
                if (gregorian) params.set("date_from", gregorian);
            }
            if (filters.date_to) {
                const gregorian = formatDateToEn(filters.date_to);
                if (gregorian) params.set("date_to", gregorian);
            }
            if (filters.user_id) params.set("user_id", filters.user_id);
            if (filters.personnel_code) params.set("personnel_code", filters.personnel_code);
            if (filters.national_code) params.set("national_code", filters.national_code);
            if (filters.mission_type_id) params.set("mission_type_id", filters.mission_type_id);
            if (filters.workgroup_id) params.set("workgroup_id", filters.workgroup_id);
        } else {
            url = "hrm-mission/monthly-report";
            if (monthlyFilters.month) params.set("month", monthlyFilters.month);
            if (monthlyFilters.year) params.set("year", monthlyFilters.year);
            if (monthlyFilters.user_id) params.set("user_id", monthlyFilters.user_id);
            if (monthlyFilters.personnel_code) params.set("personnel_code", monthlyFilters.personnel_code);
            if (monthlyFilters.national_code) params.set("national_code", monthlyFilters.national_code);
            if (monthlyFilters.mission_type_id) params.set("mission_type_id", monthlyFilters.mission_type_id);
            if (monthlyFilters.workgroup_id) params.set("workgroup_id", monthlyFilters.workgroup_id);
        }

        const page = searchParams.get("page");
        const perPage = searchParams.get("per-page");
        if (page) params.set("page", page);
        if (perPage) params.set("per-page", perPage);

        const query = params.toString();

        setListLoading(true);
        try {
            const res = await api(`${url}?${query}`, "GET");

            if (res?.data) {
                const formattedData = res.data.map(item => ({
                    ...item,
                    date_from_persian: item.date_from ? formatDateToFa(item.date_from) : item.date_from_persian,
                    date_to_persian: item.date_to ? formatDateToFa(item.date_to) : item.date_to_persian,
                }));
                setData({ ...res, data: formattedData });
            } else {
                setData(res || { data: [], pages: 0 });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setListLoading(false);
    };

    const fetchMissionTypes = async () => {
        try {
            const typesRes = await api("hrm-mission-type/list", "GET");
            if (typesRes?.data) {
                const typesArray = Object.entries(typesRes.data).map(([id, name]) => ({
                    id: parseInt(id),
                    name: name,
                }));
                setMissionTypes(typesArray);
            }
        } catch (error) {
            console.error("Error fetching mission types:", error);
            toast.error("خطا در دریافت اطلاعات");
        }
    };

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

    // ============== نمایش کارت کاربر انتخاب شده ==============
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
    }, [filters, monthlyFilters, reportTab]);

    useEffect(() => {
        fetchMissionTypes();
        fetchUsers();
        fetchAllWorkgroups();
    }, []);

    // ============== فرم ==============
    const formik = useFormik({
        initialValues: {
            user_id: "",
            mission_type_id: "",
            date_from: "",
            date_to: "",
            time_from: "",
            time_to: "",
            location: "",
            description: "",
        },
        validationSchema: missionValidationSchema,
        onSubmit: handleSubmit,
        validateOnChange: true,
        validateOnMount: true,
    });

    const handleEdit = (item) => {
        setEditingItem(item);
        const user = users.find(u => String(u.id) === String(item.user_id));
        if (user) {
            setSelectedUser(user);
            setPersonnelCodeSearch(user.personnel_code || "");
        }
        formik.setValues({
            user_id: item.user_id || "",
            mission_type_id: item.mission_type_id || "",
            date_from: item.date_from_persian || "",
            date_to: item.date_to_persian || "",
            time_from: item.time_from || "",
            time_to: item.time_to || "",
            location: item.location || "",
            description: item.description || "",
        });
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        setSelectedUser(null);
        setPersonnelCodeSearch("");
        formik.resetForm();
    };

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
            ? `hrm-mission/${editingItem.id}`
            : "hrm-mission";

        const payload = {
            ...values,
            user_id: parseInt(values.user_id),
            mission_type_id: parseInt(values.mission_type_id),
            date_from: formatDateToEn(values.date_from),
            date_to: formatDateToEn(values.date_to),
        };

        const res = await api(url, editingItem ? "PATCH" : "POST", payload);

        setLoading(false);

        if (res?.success) {
            toast.success(editingItem ? "ماموریت با موفقیت ویرایش شد" : "ماموریت با موفقیت ثبت شد");
            setEditingItem(null);
            setSelectedUser(null);
            setPersonnelCodeSearch("");
            formik.resetForm();
            fetchData();
        } else {
            toast.error(res?.message || "خطا در ثبت اطلاعات");
        }
    }

    const handleDelete = async (id) => {
        const res = await api(`hrm-mission/${id}`, "DELETE");
        if (res?.success) {
            toast.success("ماموریت با موفقیت حذف شد");
            fetchData();
        } else {
            toast.error(res?.message || "خطا در حذف");
        }
    };

    const handleApprove = async (id) => {
        const res = await api(`hrm-mission/${id}/approve`, "POST");
        if (res?.success) {
            toast.success("ماموریت با موفقیت تایید شد");
            fetchData();
        } else {
            toast.error(res?.message || "خطا در تایید");
        }
    };

    const handleReject = async (id) => {
        const res = await api(`hrm-mission/${id}/reject`, "POST");
        if (res?.success) {
            toast.success("ماموریت با موفقیت رد شد");
            fetchData();
        } else {
            toast.error(res?.message || "خطا در رد");
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

    const handleMonthlyFilterChange = (e) => {
        const { name, value } = e.target;
        setMonthlyFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleMonthlyFilterSelectChange = (name, selectedOption) => {
        setMonthlyFilters(prev => ({ ...prev, [name]: selectedOption || "" }));
    };

    const handleSearch = () => {
        fetchData();
    };

    const handleClearFilters = () => {
        setFilters({
            user_id: "",
            mission_type_id: "",
            status: "",
            date_from: "",
            date_to: "",
            personnel_code: "",
            national_code: "",
            workgroup_id: "",
        });
        setSearchParams({});
    };

    const handleClearMonthlyFilters = () => {
        setMonthlyFilters({
            month: "",
            year: "",
            user_id: "",
            personnel_code: "",
            national_code: "",
            mission_type_id: "",
            workgroup_id: "",
        });
        setSearchParams({});
    };

    // ============== گزینه‌ها ==============
    const userOptions = users.map((item) => ({
        value: String(item.id),
        label: `${item.first_name || ""} ${item.last_name || ""} (${item.personnel_code || ""})`,
    }));

    const userFilterOptions = users.map((item) => ({
        value: String(item.id),
        label: `${item.first_name || ""} ${item.last_name || ""} (${item.personnel_code || ""})`,
    }));

    const typeOptions = missionTypes.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    const workgroupOptions = allWorkgroups;

    const getStatusLabel = (status) => {
        const labels = {
            0: { label: "در انتظار", color: "text-yellow-600" },
            1: { label: "تایید شده", color: "text-green-600" },
            2: { label: "رد شده", color: "text-red-600" },
            3: { label: "لغو شده", color: "text-gray-600" },
        };
        return labels[status] || { label: "نامشخص", color: "text-gray-400" };
    };

    // ============== ستون‌ها ==============
    const listColumns = ["ردیف", "کد پرسنلی", "نام و نام خانوادگی", "گروه کاری", "نوع ماموریت", "تاریخ شروع", "تاریخ پایان", "ساعت شروع", "ساعت پایان", "تعداد روز", "مکان", "وضعیت", "عملیات"];
    const dailyColumns = ["ردیف", "تاریخ", "کد پرسنلی", "نام و نام خانوادگی", "گروه کاری", "نوع ماموریت", "تعداد روز", "تاریخ ثبت"];
    const monthlyColumns = ["ردیف", "سال", "ماه", "کد پرسنلی", "نام و نام خانوادگی", "گروه کاری", "نوع ماموریت", "تعداد روز", "تاریخ ثبت"];

    return (
        <div className="w-full space-y-4">
            {/* ============== تب‌های اصلی ============== */}
            <div className="flex gap-2 border-b pb-2">
                <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                        activeTab === "missions"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setActiveTab("missions")}
                >
                    <MapPin className="w-4 h-4" />
                    ثبت ماموریت
                </button>
                <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                        activeTab === "types"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setActiveTab("types")}
                >
                    <Settings className="w-4 h-4" />
                    مدیریت انواع ماموریت
                </button>
            </div>

            {activeTab === "missions" && (
                <div className="w-full space-y-4">
                    {/* ========== فرم ثبت/ویرایش ========== */}
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>{editingItem ? "ویرایش ماموریت" : "ثبت ماموریت"}</CardTitle>
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
                                    <Select
                                        name="mission_type_id"
                                        title="نوع ماموریت"
                                        formik={formik}
                                        options={typeOptions}
                                        placeholder="انتخاب نوع ماموریت"
                                        required
                                    />

                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-1">
                                            تاریخ شروع <span className="text-red-500">*</span>
                                        </label>
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
                                        {formik.touched.date_from && formik.errors.date_from && (
                                            <div className="text-xs text-red-500 mt-1">{formik.errors.date_from}</div>
                                        )}
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-1">
                                            تاریخ پایان <span className="text-red-500">*</span>
                                        </label>
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
                                        {formik.touched.date_to && formik.errors.date_to && (
                                            <div className="text-xs text-red-500 mt-1">{formik.errors.date_to}</div>
                                        )}
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-1">ساعت شروع</label>
                                        <input
                                            type="time"
                                            name="time_from"
                                            value={formik.values.time_from || ""}
                                            onChange={(e) => formik.setFieldValue("time_from", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-1">ساعت پایان</label>
                                        <input
                                            type="time"
                                            name="time_to"
                                            value={formik.values.time_to || ""}
                                            onChange={(e) => formik.setFieldValue("time_to", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        />
                                    </div>

                                    <Input
                                        type="text"
                                        name="location"
                                        title="مکان ماموریت"
                                        formik={formik}
                                        placeholder="مکان ماموریت"
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

                    {/* ========== تب‌های گزارش ========== */}
                    <div className="flex gap-2 border-b pb-2">
                        
                    </div>

                    {/* ========== فیلترها ========== */}
                    <Card className="w-full">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">
                                {reportTab === "list" ? "جستجو در لیست ماموریت‌ها" :
                                 reportTab === "daily" ? "جستجو در ماموریت روزانه" :
                                 "جستجو در ماموریت ماهانه"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {reportTab === "monthly" ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-1">ماه</label>
                                        <Select
                                            name="month"
                                            value={monthOptions.find(opt => opt.value === monthlyFilters.month) || null}
                                            onChange={(opt) => handleMonthlyFilterSelectChange("month", opt)}
                                            options={monthOptions}
                                            placeholder="همه ماه‌ها"
                                            isClearable
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-1">سال</label>
                                        <Select
                                            name="year"
                                            value={yearOptions.find(opt => opt.value === monthlyFilters.year) || null}
                                            onChange={(opt) => handleMonthlyFilterSelectChange("year", opt)}
                                            options={yearOptions}
                                            placeholder="همه سال‌ها"
                                            isClearable
                                            isSearchable
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-1">کد پرسنلی</label>
                                        <input
                                            type="text"
                                            name="personnel_code"
                                            value={monthlyFilters.personnel_code || ""}
                                            onChange={handleMonthlyFilterChange}
                                            placeholder="کد پرسنلی"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-1">نام پرسنل</label>
                                        <Select
                                            name="user_id"
                                            value={userOptions.find(opt => opt.value === monthlyFilters.user_id) || null}
                                            onChange={(opt) => handleMonthlyFilterSelectChange("user_id", opt)}
                                            options={userOptions}
                                            placeholder="همه پرسنل"
                                            isClearable
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-1">کد ملی</label>
                                        <input
                                            type="text"
                                            name="national_code"
                                            value={monthlyFilters.national_code || ""}
                                            onChange={handleMonthlyFilterChange}
                                            placeholder="کد ملی"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-1">نوع ماموریت</label>
                                        <Select
                                            name="mission_type_id"
                                            value={typeOptions.find(opt => opt.value === monthlyFilters.mission_type_id) || null}
                                            onChange={(opt) => handleMonthlyFilterSelectChange("mission_type_id", opt)}
                                            options={typeOptions}
                                            placeholder="همه انواع"
                                            isClearable
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-1">گروه کاری</label>
                                        <Select
                                            name="workgroup_id"
                                            value={workgroupOptions.find(opt => opt.value === monthlyFilters.workgroup_id) || null}
                                            onChange={(opt) => handleMonthlyFilterSelectChange("workgroup_id", opt)}
                                            options={workgroupOptions}
                                            placeholder="همه گروه‌ها"
                                            isClearable
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-1">از تاریخ</label>
                                        <DatePicker
                                            calendar={persian}
                                            locale={persian_fa}
                                            value={filters.date_from}
                                            onChange={(date) => {
                                                setFilters(prev => ({
                                                    ...prev,
                                                    date_from: date?.format() || "",
                                                }));
                                            }}
                                            format="YYYY/MM/DD"
                                            className="w-full"
                                            inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                            placeholder="انتخاب تاریخ"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-1">تا تاریخ</label>
                                        <DatePicker
                                            calendar={persian}
                                            locale={persian_fa}
                                            value={filters.date_to}
                                            onChange={(date) => {
                                                setFilters(prev => ({
                                                    ...prev,
                                                    date_to: date?.format() || "",
                                                }));
                                            }}
                                            format="YYYY/MM/DD"
                                            className="w-full"
                                            inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                            placeholder="انتخاب تاریخ"
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
                                        <label className="text-sm font-medium text-gray-700 mb-1">نوع ماموریت</label>
                                        <Select
                                            name="mission_type_id"
                                            value={typeOptions.find(opt => opt.value === filters.mission_type_id) || null}
                                            onChange={(opt) => handleFilterSelectChange("mission_type_id", opt)}
                                            options={typeOptions}
                                            placeholder="همه انواع"
                                            isClearable
                                        />
                                    </div>

                                    {reportTab === "list" && (
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
                                    )}
                                </div>
                            )}

                            <div className="flex items-end gap-2 mt-4">
                                <Button onClick={handleSearch} className="flex items-center gap-2">
                                    <Search className="w-4 h-4" />
                                    جستجو
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={reportTab === "monthly" ? handleClearMonthlyFilters : handleClearFilters}
                                    className="flex items-center gap-2"
                                >
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
                                {reportTab === "list" ? "لیست ماموریت‌ها" :
                                 reportTab === "daily" ? "گزارش ماموریت روزانه" :
                                 "گزارش ماموریت ماهانه"}
                            </CardTitle>
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
                                            <div className={`w-full grid gap-3 p-3 bg-gray-100 rounded-t-md ${
                                                reportTab === "list" ? "grid-cols-13" : "grid-cols-8"
                                            }`}>
                                                {(reportTab === "list" ? listColumns :
                                                  reportTab === "daily" ? dailyColumns :
                                                  monthlyColumns).map((col, i) => (
                                                    <div key={i} className="flex items-center justify-center">
                                                        <span className="text-xs font-bold text-gray-600">{col}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex flex-col border-x border-b rounded-b-md">
                                                {data.data.map((item, index) => {
                                                    const status = getStatusLabel(item.status);
                                                    const isListTab = reportTab === "list";

                                                    return (
                                                        <div
                                                            key={item.id || index}
                                                            className={`w-full grid gap-3 px-3 py-3 hover:bg-gray-50 border-b last:border-b-0 ${
                                                                isListTab ? "grid-cols-13" : "grid-cols-8"
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-center">
                                                                <span className="text-xs">{index + 1}</span>
                                                            </div>

                                                            {!isListTab && reportTab === "daily" && (
                                                                <div className="flex items-center justify-center">
                                                                    <span className="text-xs">{item.date_persian || "-"}</span>
                                                                </div>
                                                            )}

                                                            {!isListTab && reportTab === "monthly" && (
                                                                <>
                                                                    <div className="flex items-center justify-center">
                                                                        <span className="text-xs">{item.year || "-"}</span>
                                                                    </div>
                                                                    <div className="flex items-center justify-center">
                                                                        <span className="text-xs">{item.month_name || "-"}</span>
                                                                    </div>
                                                                </>
                                                            )}

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
                                                                <span className="text-xs">{item?.missionType?.name || "-"}</span>
                                                            </div>

                                                            {isListTab && (
                                                                <>
                                                                    <div className="flex items-center justify-center">
                                                                        <span className="text-xs">{item.date_from_persian || "-"}</span>
                                                                    </div>
                                                                    <div className="flex items-center justify-center">
                                                                        <span className="text-xs">{item.date_to_persian || "-"}</span>
                                                                    </div>
                                                                    <div className="flex items-center justify-center">
                                                                        <span className="text-xs">{item.time_from || "-"}</span>
                                                                    </div>
                                                                    <div className="flex items-center justify-center">
                                                                        <span className="text-xs">{item.time_to || "-"}</span>
                                                                    </div>
                                                                </>
                                                            )}

                                                            <div className="flex items-center justify-center">
                                                                <span className="text-xs font-bold">{item.days_count || item.days || 0}</span>
                                                            </div>

                                                            {isListTab && (
                                                                <>
                                                                    <div className="flex items-center justify-center">
                                                                        <span className="text-xs">{item.location || "-"}</span>
                                                                    </div>
                                                                    <div className="flex items-center justify-center">
                                                                        <span className={`text-xs font-medium ${status.color}`}>
                                                                            {status.label}
                                                                        </span>
                                                                    </div>
                                                                </>
                                                            )}

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

                                                                {isListTab && checkAccess([703]) && item.status === 0 && (
                                                                    <>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <button
                                                                                    className="cursor-pointer hover:text-green-600"
                                                                                    onClick={() => handleApprove(item.id)}
                                                                                >
                                                                                    <CheckCircle className="w-4 h-4" />
                                                                                </button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>تایید</TooltipContent>
                                                                        </Tooltip>

                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <button
                                                                                    className="cursor-pointer hover:text-red-600"
                                                                                    onClick={() => handleReject(item.id)}
                                                                                >
                                                                                    <XCircle className="w-4 h-4" />
                                                                                </button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>رد</TooltipContent>
                                                                        </Tooltip>

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
                                                                    </>
                                                                )}

                                                                {isListTab && checkAccess([704]) && (
                                                                    <Confirm
                                                                        title="حذف ماموریت"
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
                </div>
            )}

            {activeTab === "types" && (
                <MissionTypeManagement
                    missionTypes={missionTypes}
                    fetchMissionTypes={fetchMissionTypes}
                />
            )}

            {/* ========== مودال نمایش جزئیات ========== */}
            {showViewModal && viewingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">جزئیات ماموریت</h3>
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
                                    <span className="text-xs text-gray-500">نوع ماموریت</span>
                                    <p className="font-medium text-sm">{viewingItem?.missionType?.name || "-"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">تاریخ شروع</span>
                                    <p className="font-medium text-sm">{viewingItem.date_from_persian || "-"}</p>
                                </div>
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">تاریخ پایان</span>
                                    <p className="font-medium text-sm">{viewingItem.date_to_persian || "-"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">ساعت شروع</span>
                                    <p className="font-medium text-sm">{viewingItem.time_from || "-"}</p>
                                </div>
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">ساعت پایان</span>
                                    <p className="font-medium text-sm">{viewingItem.time_to || "-"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 bg-blue-50 rounded">
                                    <span className="text-xs text-gray-500">تعداد روز</span>
                                    <p className="font-medium text-sm text-blue-700">{viewingItem.days_count || 0}</p>
                                </div>
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">مکان</span>
                                    <p className="font-medium text-sm">{viewingItem.location || "-"}</p>
                                </div>
                            </div>

                            <div className="p-2 bg-gray-50 rounded">
                                <span className="text-xs text-gray-500">وضعیت</span>
                                <p className={`font-medium text-sm ${getStatusLabel(viewingItem.status).color}`}>
                                    {getStatusLabel(viewingItem.status).label}
                                </p>
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