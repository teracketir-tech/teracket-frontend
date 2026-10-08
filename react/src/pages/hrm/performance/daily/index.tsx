// src/pages/hrm/performance/daily/index.tsx

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
import { PenBox, Trash2Icon, CalendarRange, Calendar, Search, X, Eye, User, Edit3, FileEdit } from "lucide-react";
import Confirm from "@/components/ui/confirm";
import { checkAccess, formatDateToFa, formatDateToEn } from "@/lib/utils";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

// ============== Validation Schemas ==============
const validationSchema = yup.object({
    user_id: yup.string().required("انتخاب پرسنل الزامی است"),
    workgroup_ids: yup.array().nullable(),
    attendance_date: yup.string().required("تاریخ الزامی است"),
    check_in_time: yup.string().nullable(),
    check_out_time: yup.string().nullable(),
    is_full_day: yup.boolean().default(false),
    description: yup.string().nullable(),
});

const rangeValidationSchema = yup.object({
    user_id: yup.string().required("انتخاب پرسنل الزامی است"),
    workgroup_ids: yup.array().nullable(),
    date_from: yup.string().required("تاریخ از الزامی است"),
    date_to: yup.string().required("تاریخ تا الزامی است"),
    is_full_day: yup.boolean().default(false),
    description: yup.string().nullable(),
});

const bulkEditValidationSchema = yup.object({
    user_id: yup.string().required("انتخاب پرسنل الزامی است"),
    edit_type: yup.string().required("نوع ویرایش الزامی است"),
    month: yup.string().when("edit_type", {
        is: "monthly",
        then: (schema) => schema.required("ماه الزامی است"),
        otherwise: (schema) => schema.nullable(),
    }),
    year: yup.string().when("edit_type", {
        is: "monthly",
        then: (schema) => schema.required("سال الزامی است"),
        otherwise: (schema) => schema.nullable(),
    }),
    date_from: yup.string().when("edit_type", {
        is: "range",
        then: (schema) => schema.required("تاریخ از الزامی است"),
        otherwise: (schema) => schema.nullable(),
    }),
    date_to: yup.string().when("edit_type", {
        is: "range",
        then: (schema) => schema.required("تاریخ تا الزامی است"),
        otherwise: (schema) => schema.nullable(),
    }),
    check_in_time: yup.string().nullable(),
    check_out_time: yup.string().nullable(),
    is_full_day: yup.boolean().default(false),
    description: yup.string().nullable(),
});

// ============== گزینه‌های وضعیت ==============
const attendanceStatusOptions = [
    { value: "", label: "همه وضعیت‌ها" },
    { value: "full_day", label: "حضور کامل" },
    { value: "absent", label: "غیبت" },
    { value: "vacation", label: "مرخصی" },
    { value: "mission", label: "ماموریت" },
    { value: "holiday", label: "روز تعطیل" },
];

const calculationStatusOptions = [
    { value: "", label: "همه" },
    { value: "calculated", label: "محاسبه شده" },
    { value: "not_calculated", label: "محاسبه نشده" },
];

// ============== تولید لیست سال‌ها ==============
const getYearOptions = () => {
    const currentYear = 1405;
    const years = [];
    for (let i = currentYear - 15; i <= currentYear + 15; i++) {
        years.push({ value: String(i), label: String(i) });
    }
    return years;
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

const editTypeOptions = [
    { value: "monthly", label: "ویرایش ماهانه" },
    { value: "range", label: "ویرایش رنج تاریخ" },
];

export default function DailyAttendance() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [allWorkgroups, setAllWorkgroups] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [editingRange, setEditingRange] = useState(null);
    const [viewingItem, setViewingItem] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [data, setData] = useState({ data: [], pages: 0, totalCount: 0 });
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedBulkUser, setSelectedBulkUser] = useState(null);
    const [personnelCodeSearch, setPersonnelCodeSearch] = useState("");
    const [bulkPersonnelCodeSearch, setBulkPersonnelCodeSearch] = useState("");

    // ===== فیلترها =====
    const [filters, setFilters] = useState({
        user_id: searchParams.get("user_id") || "",
        workgroup_ids: searchParams.get("workgroup_ids") ? searchParams.get("workgroup_ids").split(',') : [],
        date_from: searchParams.get("date_from") || "",
        date_to: searchParams.get("date_to") || "",
        status: searchParams.get("status") || "",
        calculation_status: searchParams.get("calculation_status") || "",
        personnel_code: searchParams.get("personnel_code") || "",
        national_code: searchParams.get("national_code") || "",
    });

    const [activeTab, setActiveTab] = useState("single");
    const yearOptions = getYearOptions();

    // ============== دریافت لیست کارکردها ==============
    const fetchData = async () => {
        const params = new URLSearchParams();
        
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
        if (filters.workgroup_ids && filters.workgroup_ids.length > 0) {
            params.set("workgroup_ids", filters.workgroup_ids.join(','));
        }
        if (filters.status) params.set("status", filters.status);
        if (filters.calculation_status) params.set("calculation_status", filters.calculation_status);
        
        const page = searchParams.get("page");
        const perPage = searchParams.get("per-page");
        if (page) params.set("page", page);
        if (perPage) params.set("per-page", perPage);
        
        const query = params.toString();

        setListLoading(true);
        try {
            const res = await api(`hrm-daily-attendance?${query}`, "GET");
            
            if (res?.data) {
                const formattedData = res.data.map(item => ({
                    ...item,
                    attendance_date_persian: item.attendance_date ? formatDateToFa(item.attendance_date) : item.attendance_date_persian
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

    // ============== دریافت لیست پرسنل ==============
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

    // ============== دریافت لیست گروه‌های کاری ==============
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

    // ============== جستجوی کاربر با کد پرسنلی (فرم ثبت) ==============
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
                rangeFormik.setFieldValue("user_id", String(user.id));
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
                        rangeFormik.setFieldValue("user_id", String(user.id));
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

    // ============== جستجوی کاربر با کد پرسنلی (ویرایش دسته‌ای) ==============
    const searchBulkUserByPersonnelCode = async () => {
        if (!bulkPersonnelCodeSearch.trim()) {
            toast.warning("لطفاً کد پرسنلی را وارد کنید");
            return;
        }

        try {
            const res = await api(`user?personnel_code=${bulkPersonnelCodeSearch}`, "GET");
            
            if (res?.data && res.data.length > 0) {
                const user = res.data[0];
                setSelectedBulkUser(user);
                bulkFormik.setFieldValue("user_id", String(user.id));
                toast.success(`کاربر ${user.first_name || ""} ${user.last_name || ""} پیدا شد`);
            } else {
                const personnelRes = await api(`hrm-personnel-basic?personnel_code=${bulkPersonnelCodeSearch}`, "GET");
                if (personnelRes?.data && personnelRes.data.length > 0) {
                    const basic = personnelRes.data[0];
                    const userRes = await api(`user/${basic.user_id}`, "GET");
                    if (userRes?.success && userRes?.data) {
                        const user = userRes.data;
                        setSelectedBulkUser(user);
                        bulkFormik.setFieldValue("user_id", String(user.id));
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

    // ============== useEffect ها ==============
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 300);
        return () => clearTimeout(timer);
    }, [filters, searchParams]);

    useEffect(() => {
        fetchUsers();
        fetchAllWorkgroups();
    }, []);

    // ============== گزینه‌های Select ==============
    const userOptions = users.map((item) => ({
        value: String(item.id),
        label: `${item.first_name || ""} ${item.last_name || ""} (${item.personnel_code || ""})`,
    }));

    const workgroupOptions = allWorkgroups;

    // ============== فرم ثبت تکی ==============
    const formik = useFormik({
        initialValues: {
            user_id: "",
            workgroup_ids: [],
            attendance_date: formatDateToFa(new Date().toString()),
            check_in_time: "",
            check_out_time: "",
            is_full_day: false,
            description: "",
        },
        validationSchema,
        onSubmit: handleSingleSubmit,
        validateOnChange: true,
        validateOnMount: true,
    });

    // ============== فرم ثبت رنج ==============
    const rangeFormik = useFormik({
        initialValues: {
            user_id: "",
            workgroup_ids: [],
            date_from: formatDateToFa(new Date().toString()),
            date_to: formatDateToFa(new Date().toString()),
            is_full_day: false,
            check_in_time: "",
            check_out_time: "",
            description: "",
        },
        validationSchema: rangeValidationSchema,
        onSubmit: handleRangeSubmit,
        validateOnChange: true,
        validateOnMount: true,
    });

    // ============== فرم ویرایش دسته‌ای ==============
    const bulkFormik = useFormik({
        initialValues: {
            user_id: "",
            edit_type: "",
            month: "",
            year: "",
            date_from: "",
            date_to: "",
            check_in_time: "",
            check_out_time: "",
            is_full_day: false,
            description: "",
        },
        validationSchema: bulkEditValidationSchema,
        onSubmit: handleBulkSubmit,
        validateOnChange: true,
        validateOnMount: true,
    });

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

    // ============== نمایش اطلاعات کاربر انتخاب شده برای ویرایش دسته‌ای ==============
    const renderSelectedBulkUser = () => {
        if (!selectedBulkUser) return null;
        return (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                        {selectedBulkUser.first_name?.[0] || selectedBulkUser.last_name?.[0] || '?'}
                    </div>
                    <div>
                        <p className="font-medium text-blue-800">
                            {selectedBulkUser.first_name || ""} {selectedBulkUser.last_name || ""}
                        </p>
                        <div className="flex gap-3 text-xs text-blue-600">
                            <span>کد پرسنلی: {selectedBulkUser.personnel_code || "---"}</span>
                            <span>موبایل: {selectedBulkUser.phone_number || "---"}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ============== ثبت تکی ==============
    async function handleSingleSubmit(values) {
        setLoading(true);

        const url = editingItem 
            ? `hrm-daily-attendance/${editingItem.id}` 
            : "hrm-daily-attendance";

        const gregorianDate = formatDateToEn(values.attendance_date);
        
        const payload = {
            user_id: parseInt(values.user_id),
            workgroup_ids: values.workgroup_ids || [],
            attendance_date: gregorianDate,
            attendance_date_persian: values.attendance_date,
            is_full_day: values.is_full_day ? 1 : 0,
            description: values.description || null,
        };

        if (!values.is_full_day) {
            payload.check_in_time = values.check_in_time || null;
            payload.check_out_time = values.check_out_time || null;
        }

        const res = await api(url, editingItem ? "PATCH" : "POST", payload);

        setLoading(false);

        if (res?.success) {
            toast.success(editingItem ? "کارکرد با موفقیت ویرایش شد" : "کارکرد با موفقیت ثبت شد");
            setEditingItem(null);
            setSelectedUser(null);
            setPersonnelCodeSearch("");
            formik.resetForm();
            fetchData();
        } else {
            toast.error(res?.message || "خطا در ثبت اطلاعات");
        }
    }

    // ============== ثبت رنج ==============
    async function handleRangeSubmit(values) {
        setLoading(true);

        const payload = {
            user_id: parseInt(values.user_id),
            workgroup_ids: values.workgroup_ids || [],
            date_from: values.date_from,
            date_to: values.date_to,
            is_full_day: values.is_full_day ? 1 : 0,
            description: values.description || '',
        };

        if (!values.is_full_day) {
            payload.check_in_time = values.check_in_time || null;
            payload.check_out_time = values.check_out_time || null;
        }

        const res = await api("hrm-daily-attendance/save-range", "POST", payload);

        setLoading(false);

        if (res?.success) {
            if (res.saved_count > 0) {
                toast.success(res?.message || "کارکردها با موفقیت ثبت شد");
            }
            if (res.errors && res.errors.length > 0) {
                res.errors.forEach((err) => toast.error(err));
            }
            setSelectedUser(null);
            setPersonnelCodeSearch("");
            rangeFormik.resetForm();
            fetchData();
        } else {
            toast.error(res?.message || "خطا در ثبت اطلاعات");
        }
    }

    // ============== ویرایش دسته‌ای ==============
    async function handleBulkSubmit(values) {
        setLoading(true);

        let payload = {
            user_id: parseInt(values.user_id),
            is_full_day: values.is_full_day ? 1 : 0,
            description: values.description || '',
        };

        if (!values.is_full_day) {
            payload.check_in_time = values.check_in_time || null;
            payload.check_out_time = values.check_out_time || null;
        }

        let url = "";
        
        if (values.edit_type === "monthly") {
            url = "hrm-daily-attendance/bulk-edit-monthly";
            payload.month = parseInt(values.month);
            payload.year = parseInt(values.year);
        } else {
            url = "hrm-daily-attendance/bulk-edit-range";
            payload.date_from = formatDateToEn(values.date_from);
            payload.date_to = formatDateToEn(values.date_to);
        }

        const res = await api(url, "POST", payload);

        setLoading(false);

        if (res?.success) {
            toast.success(res?.message || "ویرایش دسته‌ای با موفقیت انجام شد");
            setSelectedBulkUser(null);
            setBulkPersonnelCodeSearch("");
            bulkFormik.resetForm();
            fetchData();
        } else {
            toast.error(res?.message || "خطا در ویرایش دسته‌ای");
        }
    }

    // ============== ویرایش تکی (اصلاح شده) ==============
    const handleEdit = (item) => {
        // تنظیم editingItem
        setEditingItem(item);
        setActiveTab("single");
  
        // پیدا کردن کاربر و تنظیم selectedUser
        if (item.user_id) {

             const user = users.find(u => u.id == item.user_id);
            if (user) {
                 setSelectedUser(user);
                 setPersonnelCodeSearch(user.personnel_code || "");
            }
        }
        
        // تبدیل workgroup_ids به آرایه
        let workgroupIds = [];
        if (item.workgroup_ids) {
            if (Array.isArray(item.workgroup_ids)) {
                workgroupIds = item.workgroup_ids.map(id => String(id));
            } else if (typeof item.workgroup_ids === 'string') {
                try {
                    const parsed = JSON.parse(item.workgroup_ids);
                    workgroupIds = Array.isArray(parsed) ? parsed.map(id => String(id)) : [];
                } catch {
                    workgroupIds = [];
                }
            }
        }
        
        // تنظیم مقادیر فرم
        formik.setValues({
            user_id: item.user_id ? String(item.user_id) : "",
            workgroup_ids: workgroupIds,
            attendance_date: item.attendance_date_persian || formatDateToFa(new Date().toString()),
            check_in_time: item.check_in_time || "",
            check_out_time: item.check_out_time || "",
            is_full_day: item.is_full_day === 1,
            description: item.description || "",
        });
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        setEditingRange(null);
        setSelectedUser(null);
        setSelectedBulkUser(null);
        setPersonnelCodeSearch("");
        setBulkPersonnelCodeSearch("");
        formik.resetForm();
        rangeFormik.resetForm();
        bulkFormik.resetForm();
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

    // ============== حذف ==============
    const handleDelete = async (id) => {
        const res = await api(`hrm-daily-attendance/${id}`, "DELETE");
        if (res?.success) {
            toast.success("کارکرد با موفقیت حذف شد");
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

    const handleFilterMultiSelectChange = (name, selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
        setFilters(prev => ({
            ...prev,
            [name]: values,
        }));
    };

    const handleSearch = () => {
        fetchData();
    };

    const handleClearFilters = () => {
        setFilters({
            user_id: "",
            workgroup_ids: [],
            date_from: "",
            date_to: "",
            status: "",
            calculation_status: "",
            personnel_code: "",
            national_code: "",
        });
        setSearchParams({});
    };

    // ============== وضعیت حضور ==============
    const getStatusLabel = (item) => {
        if (item.is_full_day === 1) {
            return { label: "حضور کامل", color: "text-green-600" };
        }
        if (item.is_absent === 1) {
            return { label: "غیبت", color: "text-red-600" };
        }
        if (item.is_vacation === 1) {
            return { label: "مرخصی", color: "text-blue-600" };
        }
        if (item.is_mission === 1) {
            return { label: "ماموریت", color: "text-purple-600" };
        }
        if (item.is_holiday === 1) {
            return { label: "روز تعطیل", color: "text-gray-600" };
        }
        return { label: "نامشخص", color: "text-gray-400" };
    };

    // ============== ستون‌های لیست ==============
    const columns = [
        "ردیف", "کد پرسنلی", "نام و نام خانوادگی", "گروه کاری", "تاریخ کارکرد",
        "ساعت شروع کارکرد", "ساعت پایان کارکرد", "مجموع ساعت کارکرد",
        "اضافه کار", "اضافه کار ویژه", "اضافه کار در ماموریت",
        "جمعه کار", "تعطیل کار", "تأخیر", "تعجیل",
        "غیبت (روز)", "ماموریت (روز)", "خروج غیر مجاز",
        "تاریخ ثبت", "وضعیت حضور", "عملیات"
    ];

    return (
        <div className="w-full space-y-4">
            {/* ========== فرم ثبت ========== */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>
                        {editingItem || editingRange ? "ویرایش کارکرد" : "ثبت کارکرد روزانه"}
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    {/* تب‌ها */}
                    <div className="flex gap-2 mb-5 border-b pb-2 flex-wrap">
                        <button
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                                activeTab === "single" 
                                    ? "bg-blue-500 text-white" 
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() => setActiveTab("single")}
                        >
                            <Calendar className="w-4 h-4" />
                            ثبت تکی
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                                activeTab === "range" 
                                    ? "bg-blue-500 text-white" 
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() => setActiveTab("range")}
                        >
                            <CalendarRange className="w-4 h-4" />
                            ثبت رنج
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                                activeTab === "bulk" 
                                    ? "bg-blue-500 text-white" 
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() => setActiveTab("bulk")}
                        >
                            <FileEdit className="w-4 h-4" />
                            ویرایش دسته‌ای
                        </button>
                    </div>

                    {/* ===== بخش انتخاب پرسنل (مشترک برای ثبت تکی و رنج) ===== */}
                    {(activeTab === "single" || activeTab === "range") && (
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
                                            rangeFormik.setFieldValue("user_id", value);
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
                    )}

                    {/* ===== فرم ثبت تکی ===== */}
                   {activeTab === "single" && (
    <div className="w-full space-y-4">
        {/* ردیف اول */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <Select
                name="workgroup_ids"
                title="گروه‌های کاری"
                formik={formik}
                options={workgroupOptions}
                placeholder="انتخاب گروه‌های کاری"
                isMulti
                onChange={(selectedOptions) => {
                    const values = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
                    formik.setFieldValue("workgroup_ids", values);
                }}
            />

            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                    تاریخ <span className="text-red-500">*</span>
                </label>
                <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    value={formik.values.attendance_date}
                    onChange={(date) => {
                        formik.setFieldValue("attendance_date", date?.format() || "");
                    }}
                    format="YYYY/MM/DD"
                    className="w-full"
                    inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                    placeholder="انتخاب تاریخ"
                />
                {formik.touched.attendance_date && formik.errors.attendance_date && (
                    <div className="text-xs text-red-500 mt-1">{formik.errors.attendance_date}</div>
                )}
            </div>

            <div className="flex items-center gap-2 pt-6">
                <input
                    type="checkbox"
                    id="is_full_day"
                    name="is_full_day"
                    checked={formik.values.is_full_day}
                    onChange={(e) => formik.setFieldValue("is_full_day", e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_full_day" className="text-sm font-medium text-gray-700">
                    حضور کامل
                </label>
            </div>

            <div style={{display:'none'}} className="col-span-full">
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

        {/* ردیف دوم - ساعت‌ها */}
        {!formik.values.is_full_day && (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                        ساعت ورود
                    </label>
                    <input
                        type="time"
                        name="check_in_time"
                        value={formik.values.check_in_time || ""}
                        onChange={(e) => formik.setFieldValue("check_in_time", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                        step="60"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                        ساعت خروج
                    </label>
                    <input
                        type="time"
                        name="check_out_time"
                        value={formik.values.check_out_time || ""}
                        onChange={(e) => formik.setFieldValue("check_out_time", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                        step="60"
                    />
                </div>
            </div>
        )}

        {/* دکمه‌ها */}
        <div className="w-full flex gap-3 mt-2">
            <Button
                onClick={formik.handleSubmit}
                isLoading={loading}
                disabled={!formik.isValid || loading || !selectedUser}
            >
                {editingItem ? "ویرایش" : "ثبت"}
            </Button>
            {(editingItem || editingRange) && (
                <Button variant="secondary" onClick={handleCancelEdit}>
                    انصراف
                </Button>
            )}
        </div>
    </div>
)}

                    {/* ===== فرم ثبت رنج ===== */}
                    {activeTab === "range" && (
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            <Select
                                name="workgroup_ids"
                                title="گروه‌های کاری"
                                formik={rangeFormik}
                                options={workgroupOptions}
                                placeholder="انتخاب گروه‌های کاری"
                                isMulti
                                onChange={(selectedOptions) => {
                                    const values = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
                                    rangeFormik.setFieldValue("workgroup_ids", values);
                                }}
                            />

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    تاریخ از <span className="text-red-500">*</span>
                                </label>
                                <DatePicker
                                    calendar={persian}
                                    locale={persian_fa}
                                    value={rangeFormik.values.date_from}
                                    onChange={(date) => {
                                        rangeFormik.setFieldValue("date_from", date?.format() || "");
                                    }}
                                    format="YYYY/MM/DD"
                                    className="w-full"
                                    inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                    placeholder="انتخاب تاریخ"
                                />
                                {rangeFormik.touched.date_from && rangeFormik.errors.date_from && (
                                    <div className="text-xs text-red-500 mt-1">{rangeFormik.errors.date_from}</div>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    تاریخ تا <span className="text-red-500">*</span>
                                </label>
                                <DatePicker
                                    calendar={persian}
                                    locale={persian_fa}
                                    value={rangeFormik.values.date_to}
                                    onChange={(date) => {
                                        rangeFormik.setFieldValue("date_to", date?.format() || "");
                                    }}
                                    format="YYYY/MM/DD"
                                    className="w-full"
                                    inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                    placeholder="انتخاب تاریخ"
                                />
                                {rangeFormik.touched.date_to && rangeFormik.errors.date_to && (
                                    <div className="text-xs text-red-500 mt-1">{rangeFormik.errors.date_to}</div>
                                )}
                            </div>

                            <div className="flex items-center gap-2 pt-6">
                                <input
                                    type="checkbox"
                                    id="range_is_full_day"
                                    name="is_full_day"
                                    checked={rangeFormik.values.is_full_day}
                                    onChange={(e) => rangeFormik.setFieldValue("is_full_day", e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="range_is_full_day" className="text-sm font-medium text-gray-700">
                                    حضور کامل
                                </label>
                            </div>

                            {!rangeFormik.values.is_full_day && (
                                <>
                                    <Input
                                        type="time"
                                        name="check_in_time"
                                        title="ساعت ورود"
                                        formik={rangeFormik}
                                    />

                                    <Input
                                        type="time"
                                        name="check_out_time"
                                        title="ساعت خروج"
                                        formik={rangeFormik}
                                    />
                                </>
                            )}

                            <div className="col-span-full">
                                <Input
                                    type="textarea"
                                    name="description"
                                    title="توضیحات"
                                    formik={rangeFormik}
                                    placeholder="توضیحات (اختیاری)"
                                    rows={2}
                                />
                            </div>

                            <div className="col-span-full flex gap-3 mt-2">
                                <Button
                                    onClick={rangeFormik.handleSubmit}
                                    isLoading={loading}
                                    disabled={!rangeFormik.isValid || loading || !selectedUser}
                                >
                                    {editingRange ? "ویرایش رنج" : "ثبت رنج"}
                                </Button>
                                {editingRange && (
                                    <Button variant="secondary" onClick={handleCancelEdit}>
                                        انصراف
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ===== فرم ویرایش دسته‌ای ===== */}
                    {activeTab === "bulk" && (
                        <div className="space-y-5">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <h3 className="text-sm font-bold text-blue-700 mb-3 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    انتخاب پرسنل برای ویرایش دسته‌ای
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
                                                    value={bulkPersonnelCodeSearch}
                                                    onChange={(e) => setBulkPersonnelCodeSearch(e.target.value)}
                                                    placeholder="کد پرسنلی را وارد کنید..."
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                />
                                            </div>
                                            <div className="flex items-end">
                                                <Button onClick={searchBulkUserByPersonnelCode} className="flex items-center gap-2" variant="secondary">
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
                                            value={userOptions.find(opt => opt.value === bulkFormik.values.user_id) || null}
                                            onChange={(selectedOption) => {
                                                const value = selectedOption || "";
                                                bulkFormik.setFieldValue("user_id", value);
                                                if (value) {
                                                    const user = users.find(u => String(u.id) === value);
                                                    setSelectedBulkUser(user);
                                                    if (user?.personnel_code) {
                                                        setBulkPersonnelCodeSearch(user.personnel_code);
                                                    }
                                                } else {
                                                    setSelectedBulkUser(null);
                                                    setBulkPersonnelCodeSearch("");
                                                }
                                            }}
                                            options={userOptions}
                                            placeholder="انتخاب پرسنل"
                                            isClearable
                                        />
                                    </div>
                                </div>

                                {renderSelectedBulkUser()}
                            </div>

                            {selectedBulkUser && (
                                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                    <Select
                                        name="edit_type"
                                        title="نوع ویرایش"
                                        formik={bulkFormik}
                                        options={editTypeOptions}
                                        placeholder="انتخاب نوع ویرایش"
                                        required
                                    />

                                    {bulkFormik.values.edit_type === "monthly" && (
                                        <>
                                            <Select
                                                name="month"
                                                title="ماه"
                                                formik={bulkFormik}
                                                options={monthOptions}
                                                placeholder="انتخاب ماه"
                                                required
                                            />
                                            <Select
                                                name="year"
                                                title="سال"
                                                formik={bulkFormik}
                                                options={yearOptions}
                                                placeholder="انتخاب سال"
                                                required
                                                isSearchable
                                            />
                                        </>
                                    )}

                                    {bulkFormik.values.edit_type === "range" && (
                                        <>
                                            <div className="flex flex-col">
                                                <label className="text-sm font-medium text-gray-700 mb-1">
                                                    تاریخ از <span className="text-red-500">*</span>
                                                </label>
                                                <DatePicker
                                                    calendar={persian}
                                                    locale={persian_fa}
                                                    value={bulkFormik.values.date_from}
                                                    onChange={(date) => {
                                                        bulkFormik.setFieldValue("date_from", date?.format() || "");
                                                    }}
                                                    format="YYYY/MM/DD"
                                                    className="w-full"
                                                    inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                                    placeholder="انتخاب تاریخ"
                                                />
                                                {bulkFormik.touched.date_from && bulkFormik.errors.date_from && (
                                                    <div className="text-xs text-red-500 mt-1">{bulkFormik.errors.date_from}</div>
                                                )}
                                            </div>

                                            <div className="flex flex-col">
                                                <label className="text-sm font-medium text-gray-700 mb-1">
                                                    تاریخ تا <span className="text-red-500">*</span>
                                                </label>
                                                <DatePicker
                                                    calendar={persian}
                                                    locale={persian_fa}
                                                    value={bulkFormik.values.date_to}
                                                    onChange={(date) => {
                                                        bulkFormik.setFieldValue("date_to", date?.format() || "");
                                                    }}
                                                    format="YYYY/MM/DD"
                                                    className="w-full"
                                                    inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                                    placeholder="انتخاب تاریخ"
                                                />
                                                {bulkFormik.touched.date_to && bulkFormik.errors.date_to && (
                                                    <div className="text-xs text-red-500 mt-1">{bulkFormik.errors.date_to}</div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {selectedBulkUser && bulkFormik.values.edit_type && (
                                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-4 border-t">
                                    <div className="flex items-center gap-2 pt-6">
                                        <input
                                            type="checkbox"
                                            id="bulk_is_full_day"
                                            name="is_full_day"
                                            checked={bulkFormik.values.is_full_day}
                                            onChange={(e) => bulkFormik.setFieldValue("is_full_day", e.target.checked)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="bulk_is_full_day" className="text-sm font-medium text-gray-700">
                                            حضور کامل
                                        </label>
                                    </div>

                                    {!bulkFormik.values.is_full_day && (
                                        <>
                                            <Input
                                                type="time"
                                                name="check_in_time"
                                                title="ساعت ورود (دسته‌ای)"
                                                formik={bulkFormik}
                                                placeholder="ساعت ورود"
                                            />

                                            <Input
                                                type="time"
                                                name="check_out_time"
                                                title="ساعت خروج (دسته‌ای)"
                                                formik={bulkFormik}
                                                placeholder="ساعت خروج"
                                            />
                                        </>
                                    )}

                                    <div className="col-span-full">
                                        <Input
                                            type="textarea"
                                            name="description"
                                            title="توضیحات (دسته‌ای)"
                                            formik={bulkFormik}
                                            placeholder="توضیحات (اختیاری)"
                                            rows={2}
                                        />
                                    </div>

                                    <div className="col-span-full flex gap-3 mt-2">
                                        <Button
                                            onClick={bulkFormik.handleSubmit}
                                            isLoading={loading}
                                            disabled={!bulkFormik.isValid || loading || !selectedBulkUser}
                                            className="bg-purple-600 hover:bg-purple-700"
                                        >
                                            <Edit3 className="w-4 h-4 ml-2" />
                                            اعمال ویرایش دسته‌ای
                                        </Button>
                                        {editingRange && (
                                            <Button variant="secondary" onClick={handleCancelEdit}>
                                                انصراف
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ========== فیلترها ========== */}
            <Card className="w-full">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">جستجو در کارکرد روزانه</CardTitle>
                </CardHeader>
                <CardContent>
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
                                name="workgroup_ids"
                                value={workgroupOptions.filter(opt => filters.workgroup_ids.includes(opt.value))}
                                onChange={(opt) => handleFilterMultiSelectChange("workgroup_ids", opt)}
                                options={workgroupOptions}
                                placeholder="همه گروه‌ها"
                                isMulti
                                isClearable
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">وضعیت حضور</label>
                            <Select
                                name="status"
                                value={attendanceStatusOptions.find(opt => opt.value === filters.status) || null}
                                onChange={(opt) => handleFilterSelectChange("status", opt)}
                                options={attendanceStatusOptions}
                                placeholder="همه وضعیت‌ها"
                                isClearable
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">وضعیت</label>
                            <Select
                                name="calculation_status"
                                value={calculationStatusOptions.find(opt => opt.value === filters.calculation_status) || null}
                                onChange={(opt) => handleFilterSelectChange("calculation_status", opt)}
                                options={calculationStatusOptions}
                                placeholder="همه"
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

            {/* ========== لیست ========== */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>لیست کارکرد روزانه</CardTitle>
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
                                <div >
                                    <div className="w-full grid grid-cols-21 gap-1 p-3 bg-gray-100 rounded-t-md text-xs">
                                        {columns.map((col, i) => (
                                            <div key={i} className="flex items-center justify-center text-center">
                                                <span className="text-xs font-bold text-gray-600">{col}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col border-x border-b rounded-b-md">
                                        {data.data.map((item, index) => {
                                            const status = getStatusLabel(item);
                                            return (
                                                <div
                                                    key={item.id}
                                                    className="w-full grid grid-cols-21 gap-1 px-2 py-2 hover:bg-gray-50 border-b last:border-b-0 text-xs"
                                                >
                                                    <div className="flex items-center justify-center">
                                                        <span>{index + 1}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span>{item?.user?.personnel_code || "-"}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center text-center">
                                                        <span>
                                                            {item?.user?.first_name || ""} {item?.user?.last_name || ""}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span>{item.workgroup_names || "-"}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span>{item.attendance_date_persian || "-"}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span>{item.check_in_time || "-"}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span>{item.check_out_time || "-"}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="font-bold text-blue-600">{item.work_duration_formatted || "00:00"}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-orange-600">{item.overtime_formatted || "00:00"}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span>-</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span>-</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span>-</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span>-</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span>-</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span>-</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span>{item.is_absent === 1 ? "۱" : "۰"}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span>{item.is_mission === 1 ? "۱" : "۰"}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span>-</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span>{item.created_at ? new Date(item.created_at).toLocaleDateString("fa-IR") : "-"}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className={`font-medium ${status.color}`}>
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

                                                        {checkAccess([704]) && (
                                                            <Confirm
                                                                title="حذف کارکرد"
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

            {/* ========== مودال نمایش جزئیات ========== */}
            {showViewModal && viewingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">جزئیات کارکرد</h3>
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

                            <div className="p-2 bg-gray-50 rounded">
                                <span className="text-xs text-gray-500">گروه کاری</span>
                                <p className="font-medium text-sm">{viewingItem.workgroup_names || "-"}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">تاریخ</span>
                                    <p className="font-medium text-sm">{viewingItem.attendance_date_persian || "-"}</p>
                                </div>
                                <div className="p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-500">وضعیت حضور</span>
                                    <p className={`font-medium text-sm ${getStatusLabel(viewingItem).color}`}>
                                        {getStatusLabel(viewingItem).label}
                                    </p>
                                </div>
                            </div>

                            {!viewingItem.is_full_day && (
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="p-2 bg-gray-50 rounded">
                                        <span className="text-xs text-gray-500">ساعت ورود</span>
                                        <p className="font-medium text-sm">{viewingItem.check_in_time || "-"}</p>
                                    </div>
                                    <div className="p-2 bg-gray-50 rounded">
                                        <span className="text-xs text-gray-500">ساعت خروج</span>
                                        <p className="font-medium text-sm">{viewingItem.check_out_time || "-"}</p>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 bg-blue-50 rounded">
                                    <span className="text-xs text-gray-500">مدت کارکرد</span>
                                    <p className="font-medium text-sm text-blue-700">{viewingItem.work_duration_formatted || "00:00"}</p>
                                </div>
                                <div className="p-2 bg-orange-50 rounded">
                                    <span className="text-xs text-gray-500">اضافه کار</span>
                                    <p className="font-medium text-sm text-orange-600">{viewingItem.overtime_formatted || "00:00"}</p>
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