// src/pages/hrm/contract/tabs/ApprovalTab.jsx

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import Button from "@/components/shared/Button";
import Select from "@/components/shared/inputs/Select";
import Input from "@/components/shared/inputs";
import Loading from "@/components/shared/Loading";
import Empty from "@/components/shared/Empty";
import Pagination from "@/components/shared/Pagination";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
    Eye,
    PenBox,
    Trash2Icon,
    CheckCircle,
    XCircle,
    Search,
    X,
    Printer,
    RotateCcw,
    FileText,
    Clock,
    AlertCircle,
    User,
    Save,
} from "lucide-react";
import Confirm from "@/components/ui/confirm";
import { checkAccess, formatNumber } from "@/lib/utils";

// ============== وضعیت‌های قرارداد ==============
const STATUS = {
    DRAFT: 0,
    ACTIVE: 1,
    EXPIRED: 2,
    CANCELLED: 3,
};

const STATUS_LABELS = {
    0: "پیش‌نویس",
    1: "تایید شده",
    2: "منقضی",
    3: "لغو شده",
};

const STATUS_COLORS = {
    0: "bg-yellow-100 text-yellow-700",
    1: "bg-green-100 text-green-700",
    2: "bg-red-100 text-red-700",
    3: "bg-gray-100 text-gray-700",
};

const CONTRACT_TYPES = {
    1: "موقت",
    2: "ساعتی",
    3: "پیمانکاری",
};

// ============== زیر تب‌ها ==============
const SUB_TABS = [
    {
        id: "pending",
        label: "قراردادهای تایید نشده",
        icon: Clock,
        statusFilter: STATUS.DRAFT,
    },
    {
        id: "no-contract",
        label: "موزعین جدید فاقد قرارداد",
        icon: User,
        statusFilter: "no-contract", // وضعیت خاص برای موزعین بدون قرارداد
    },
];

export default function ApprovalTab() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeSubTab, setActiveSubTab] = useState("pending");
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [data, setData] = useState({ data: [], pages: 0, totalCount: 0 });
    const [users, setUsers] = useState([]);
    const [employers, setEmployers] = useState([]);
    const [contractTypes, setContractTypes] = useState([]);
    const [contractModes, setContractModes] = useState([]);
    const [selectedContract, setSelectedContract] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    // فیلترها
    const [filters, setFilters] = useState({
        user_id: searchParams.get("user_id") || "",
        national_code: searchParams.get("national_code") || "",
        employer_id: searchParams.get("employer_id") || "",
        contract_type: searchParams.get("contract_type") || "",
        contract_mode: searchParams.get("contract_mode") || "",
        first_name: searchParams.get("first_name") || "",
        last_name: searchParams.get("last_name") || "",
    });

    const [searchTerm, setSearchTerm] = useState("");

    // ===== دریافت لیست قراردادها =====
    const fetchData = async () => {
        const params = new URLSearchParams();

        // برای تب "قراردادهای تایید نشده"
        if (activeSubTab === "pending") {
            params.set("contract_status", STATUS.DRAFT);
        }

        // فیلترها
        if (filters.user_id) params.set("user_id", filters.user_id);
        if (filters.national_code) params.set("national_code", filters.national_code);
        if (filters.employer_id) params.set("employer_id", filters.employer_id);
        if (filters.contract_type) params.set("contract_type", filters.contract_type);
        if (filters.contract_mode) params.set("contract_mode", filters.contract_mode);
        if (filters.first_name) params.set("first_name", filters.first_name);
        if (filters.last_name) params.set("last_name", filters.last_name);

        const page = searchParams.get("page");
        const perPage = searchParams.get("per-page");
        if (page) params.set("page", page);
        if (perPage) params.set("per-page", perPage);

        setListLoading(true);
        try {
            let res;
            if (activeSubTab === "no-contract") {
                // برای موزعین بدون قرارداد - از API جداگانه استفاده می‌شود
                res = await api(`hrm-contract?contract_type=-555555&${params.toString()}`, "GET");
            } else {
                res = await api(`hrm-contract?${params.toString()}`, "GET");
            }
            setData(res || { data: [], pages: 0, totalCount: 0 });
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("خطا در دریافت اطلاعات");
        }
        setListLoading(false);
    };

    // ===== دریافت لیست‌های کمکی =====
    const fetchOptions = async () => {
        try {
            const [usersRes, employersRes, typesRes, modesRes] = await Promise.all([
                api("user?per-page=100", "GET"),
                api("hrm-contract/employers", "GET"),
                api("hrm-contract/types", "GET"),
                api("hrm-contract/modes", "GET"),
            ]);
            if (usersRes?.data) setUsers(usersRes.data);
            if (employersRes?.data) setEmployers(employersRes.data);
            if (typesRes?.data) setContractTypes(typesRes.data);
            if (modesRes?.data) setContractModes(modesRes.data);
        } catch (error) {
            console.error("Error fetching options:", error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchOptions();
    }, [filters, activeSubTab, searchParams]);

    // ===== مدیریت فیلترها =====
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleFilterSelectChange = (name, selectedOption) => {
        setFilters((prev) => ({ ...prev, [name]: selectedOption || "" }));
    };

    const handleSearch = () => fetchData();

    const handleClearFilters = () => {
        setFilters({
            user_id: "",
            national_code: "",
            employer_id: "",
            contract_type: "",
            contract_mode: "",
            first_name: "",
            last_name: "",
        });
        setSearchTerm("");
    };

    // ===== گزینه‌ها =====
    const userOptions = users.map((item) => ({
        value: String(item.id),
        label: `${item.first_name || ""} ${item.last_name || ""}`.trim() || item.phone_number || `کاربر ${item.id}`,
    }));

    const employerOptions = employers.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    const contractTypeOptions = contractTypes.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));
const noContractTypeOptions = [
    { value: "10", label: "حقوق بگیر" },
    { value: "21", label: "پورسانتی" },
    { value: "31", label: "حقوق بگیر و پورسانتی" },
];
    const contractModeOptions = contractModes.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    // ===== تایید نهایی =====
    const handleFinalApprove = async (id) => {
        if (
            !confirm(
                "آیا از تایید نهایی این قرارداد اطمینان دارید؟ پس از تایید، قرارداد قابل ویرایش نخواهد بود."
            )
        ) {
            return;
        }

        setLoading(true);
        try {
            const res = await api(`hrm-contract/${id}/approve`, "POST");
            if (res?.success) {
                toast.success("قرارداد با موفقیت تایید شد");
                fetchData();
            } else {
                toast.error(res?.message || "خطا در تایید");
            }
        } catch (error) {
            toast.error("خطا در ارتباط با سرور");
        }
        setLoading(false);
    };

    // ===== حذف قرارداد (فقط پیش‌نویس) =====
    const handleDelete = async (id) => {
        const res = await api(`hrm-contract/${id}`, "DELETE");
        if (res?.success) {
            toast.success("قرارداد با موفقیت حذف شد");
            fetchData();
        } else {
            toast.error(res?.message || "خطا در حذف");
        }
    };

    // ===== ویرایش =====
    const handleEdit = (item) => {
        // فقط پیش‌نویس قابل ویرایش است
        if (item.contract_status !== STATUS.DRAFT) {
            toast.warning("این قرارداد تایید شده است و قابل ویرایش نمی‌باشد");
            return;
        }
        // هدایت به صفحه تدوین با داده‌های قرارداد
        navigate(`/hrm/contract/edit/${item.id}`);
    };

    // ===== پرینت =====
    const handlePrint = (id,url="") => {
        window.open(`/hrm/contracts/print/${id}${url}`, "_blank");
    };

    // ===== ستون‌ها =====
    const columns = [
        "ردیف",
        "نام و نام خانوادگی",
        "نام پدر",
        "کد ملی",
        "کارفرما",
        "نوع قرارداد",
        "حالت قرارداد",
        "شماره قرارداد",
        "تاریخ ثبت", 
        "تایید نهایی",
        "",
    ];

    // ===== رندر تب "موزعین جدید فاقد قرارداد" =====
    if (activeSubTab === "no-contract") {
        return (
        <div className="space-y-4">
            {/* ===== زیر تب‌ها ===== */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
                {SUB_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeSubTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSubTab(tab.id)}
                            className={`
                                flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                                ${isActive
                                    ? "bg-blue-500 text-white shadow-md"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }
                            `}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* ===== فیلترها ===== */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">نام کارمند</label>
                        <Select
                            name="user_id"
                            value={userOptions.find((opt) => opt.value === filters.user_id) || null}
                            onChange={(opt) => handleFilterSelectChange("user_id", opt)}
                            options={userOptions}
                            placeholder="همه کارمندان"
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
                        <label className="text-sm font-medium text-gray-700 mb-1">نمایندگی</label>
                        <Select
                            name="employer_id"
                            value={employerOptions.find((opt) => opt.value === filters.employer_id) || null}
                            onChange={(opt) => handleFilterSelectChange("employer_id", opt)}
                            
                            placeholder="نمایندگی"
                            isClearable
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">نوع قرارداد</label>
                        <Select
                            name="contract_type"
                            value={
                                noContractTypeOptions.find(
                                    (opt) => opt.value === filters.contract_type
                                ) || null
                            }
                            onChange={(opt) => handleFilterSelectChange("contract_type", opt)}
                            options={noContractTypeOptions}
                            placeholder="همه انواع"
                            isClearable
                        />
                    </div>

                    <div className="flex flex-col">
                        
                    </div>
                </div>

                <div className="flex gap-3 mt-3">
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

            {/* ===== لیست ===== */}
            {listLoading ? (
                <div className="flex justify-center py-10">
                    <Loading />
                </div>
            ) : data?.data?.length === 0 ? (
                <Empty message="موزعین جدید فاقد قرارداد یافت نشد" />
            ) : (
                <>
                    <div className="w-full overflow-x-auto">
                        <div className="min-w-[1200px]">
                            <div className="w-full grid grid-cols-12 gap-2 p-3 bg-gray-100 rounded-t-md">
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
                                        className="w-full grid grid-cols-12 gap-2 px-3 py-3 hover:bg-gray-50 border-b last:border-b-0"
                                    >
                                        {/* ردیف */}
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs">{index + 1}</span>
                                        </div>

                                        {/* نام و نام خانوادگی */}
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs text-center">
                                                {item.first_name || ""} {item.last_name || ""}
                                            </span>
                                        </div>

                                        {/* نام پدر */}
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs">{item.father_name || "-"}</span>
                                        </div>

                                        {/* کد ملی */}
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs">{item.national_code || "-"}</span>
                                        </div>

                                        {/* کارفرما */}
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs">{item?.employer?.name || "-"}</span>
                                        </div>

                                        {/* نوع قرارداد */}
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs">
                                                {CONTRACT_TYPES[item.contract_type] ||
                                                    item.contract_type_label ||
                                                    "-"}
                                            </span>
                                        </div>

                                        {/* حالت قرارداد */}
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs">{item.contract_mode_label || "-"}</span>
                                        </div>

                                        {/* شماره قرارداد */}
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs font-medium">{item.id || "-"}</span>
                                        </div>

                                        {/* تاریخ ثبت */}
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs">{item.created_at ? new Date(item.created_at).toLocaleDateString('fa-IR') : "-"}</span>
                                        </div>

                                        

                                        {/* تایید نهایی */}
                                        <div className="flex items-center justify-center">
                                            <Button
                                                variant="success"
                                                size="sm"
                                                onClick={() => handleFinalApprove(item.id)}
                                                className="text-xs px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md"
                                            >
                                                تایید نهایی
                                            </Button>
                                        </div>

                                        {/* عملیات (ویرایش و حذف) */}
                                        <div className="flex items-center justify-center gap-2">
                                           <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            className="cursor-pointer hover:text-blue-600"
                                                            onClick={() => handlePrint(item.id)}
                                                        >
                                                            <Printer className="w-4 h-4" />
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>پرینت</TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            className="cursor-pointer hover:text-blue-600"
                                                            onClick={() => handlePrint(item.id,'?spdf=true')}
                                                        >
                                                            <Save className="w-4 h-4" />
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>ذخیره PDF</TooltipContent>
                                                </Tooltip>
                                           
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
                                                    title="حذف قرارداد"
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

    return (
        <div className="space-y-4">
            {/* ===== زیر تب‌ها ===== */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
                {SUB_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeSubTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSubTab(tab.id)}
                            className={`
                                flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                                ${isActive
                                    ? "bg-blue-500 text-white shadow-md"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }
                            `}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* ===== فیلترها ===== */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">نام کارمند</label>
                        <Select
                            name="user_id"
                            value={userOptions.find((opt) => opt.value === filters.user_id) || null}
                            onChange={(opt) => handleFilterSelectChange("user_id", opt)}
                            options={userOptions}
                            placeholder="همه کارمندان"
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
                        <label className="text-sm font-medium text-gray-700 mb-1">کارفرما</label>
                        <Select
                            name="employer_id"
                            value={employerOptions.find((opt) => opt.value === filters.employer_id) || null}
                            onChange={(opt) => handleFilterSelectChange("employer_id", opt)}
                            options={employerOptions}
                            placeholder="همه کارفرمایان"
                            isClearable
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">نوع قرارداد</label>
                        <Select
                            name="contract_type"
                            value={
                                contractTypeOptions.find(
                                    (opt) => opt.value === filters.contract_type
                                ) || null
                            }
                            onChange={(opt) => handleFilterSelectChange("contract_type", opt)}
                            options={contractTypeOptions}
                            placeholder="همه انواع"
                            isClearable
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">حالت قرارداد</label>
                        <Select
                            name="contract_mode"
                            value={
                                contractModeOptions.find(
                                    (opt) => opt.value === filters.contract_mode
                                ) || null
                            }
                            onChange={(opt) => handleFilterSelectChange("contract_mode", opt)}
                            options={contractModeOptions}
                            placeholder="همه حالت‌ها"
                            isClearable
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-3">
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

            {/* ===== لیست ===== */}
            {listLoading ? (
                <div className="flex justify-center py-10">
                    <Loading />
                </div>
            ) : data?.data?.length === 0 ? (
                <Empty message="هیچ قرارداد تایید نشده‌ای یافت نشد" />
            ) : (
                <>
                    <div className="w-full overflow-x-auto">
                        <div className="min-w-[1200px]">
                            <div className="w-full grid grid-cols-12 gap-2 p-3 bg-gray-100 rounded-t-md">
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
                                        className="w-full grid grid-cols-12 gap-2 px-3 py-3 hover:bg-gray-50 border-b last:border-b-0"
                                    >
                                        {/* ردیف */}
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs">{index + 1}</span>
                                        </div>

                                        {/* نام و نام خانوادگی */}
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs text-center">
                                                {item.first_name || ""} {item.last_name || ""}
                                            </span>
                                        </div>

                                        {/* نام پدر */}
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs">{item.father_name || "-"}</span>
                                        </div>

                                        {/* کد ملی */}
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs">{item.national_code || "-"}</span>
                                        </div>

                                        {/* کارفرما */}
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs">{item?.employer?.name || "-"}</span>
                                        </div>

                                        {/* نوع قرارداد */}
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs">
                                                {CONTRACT_TYPES[item.contract_type] ||
                                                    item.contract_type_label ||
                                                    "-"}
                                            </span>
                                        </div>

                                        {/* حالت قرارداد */}
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs">{item.contract_mode_label || "-"}</span>
                                        </div>

                                        {/* شماره قرارداد */}
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs font-medium">{item.id || "-"}</span>
                                        </div>

                                        {/* تاریخ ثبت */}
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs">{item.created_at ? new Date(item.created_at).toLocaleDateString('fa-IR') : "-"}</span>
                                        </div>

                                        {/* پرینت */}
                                        

                                        {/* تایید نهایی */}
                                        <div className="flex items-center justify-center">
                                            <Button
                                                variant="success"
                                                size="sm"
                                                onClick={() => handleFinalApprove(item.id)}
                                                className="text-xs px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md"
                                            >
                                                تایید نهایی
                                            </Button>
                                        </div>

                                        {/* عملیات (ویرایش و حذف) */}
                                        <div className="flex items-center justify-center gap-2">
                                            <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            className="cursor-pointer hover:text-blue-600"
                                                            onClick={() => handlePrint(item.id)}
                                                        >
                                                            <Printer className="w-4 h-4" />
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>پرینت</TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            className="cursor-pointer hover:text-blue-600"
                                                            onClick={() => handlePrint(item.id,'?spdf=true')}
                                                        >
                                                            <Save className="w-4 h-4" />
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>ذخیره PDF</TooltipContent>
                                                </Tooltip>
                                           
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
                                                    title="حذف قرارداد"
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