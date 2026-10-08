// src/pages/hrm/contract/tabs/ReportTab.jsx

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import Button from "@/components/shared/Button";
import Select from "@/components/shared/inputs/Select";
import Loading from "@/components/shared/Loading";
import Empty from "@/components/shared/Empty";
import Pagination from "@/components/shared/Pagination";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
    Search,
    X,
    Eye,
    PenBox,
    Printer,
    Save,
    CheckCircle,
    XCircle,
    Clock,
} from "lucide-react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { formatDateToEn, formatNumber } from "@/lib/utils";

// ============== وضعیت‌های قرارداد ==============
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

const STATUS_BADGE = {
    0: { icon: Clock, label: "پیش‌نویس", color: "text-yellow-600" },
    1: { icon: CheckCircle, label: "فعال", color: "text-green-600" },
    2: { icon: XCircle, label: "منقضی", color: "text-red-600" },
    3: { icon: XCircle, label: "لغو شده", color: "text-gray-600" },
};

const CONTRACT_TYPES = {
    1: "موقت",
    2: "ساعتی",
    3: "پیمانکاری",
};

const CONTRACT_MODES = {
    1: "ستادی",
    2: "حمل و نقل",
};

const STATUS_OPTIONS = [
    { value: "", label: "همه وضعیت‌ها" },
    { value: "0", label: "پیش‌نویس" },
    { value: "1", label: "تایید شده" },
    { value: "2", label: "منقضی" },
    { value: "3", label: "لغو شده" },
];

export default function ReportTab() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [data, setData] = useState({ data: [], pages: 0, totalCount: 0 });
    const [users, setUsers] = useState([]);
    const [employers, setEmployers] = useState([]);
    const [contractTypes, setContractTypes] = useState([]);
    const [contractModes, setContractModes] = useState([]);
    const [workgroups, setWorkgroups] = useState([]);
    const [selectedContract, setSelectedContract] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    // ===== فیلترها =====
    const [filters, setFilters] = useState({
        date_from: searchParams.get("date_from") || "",
        date_to: searchParams.get("date_to") || "",
        personnel_code: searchParams.get("personnel_code") || "",
        first_name: searchParams.get("first_name") || "",
        last_name: searchParams.get("last_name") || "",
        national_code: searchParams.get("national_code") || "",
        employer_id: searchParams.get("employer_id") || "",
        contract_type: searchParams.get("contract_type") || "",
        contract_mode: searchParams.get("contract_mode") || "",
        contract_status: searchParams.get("contract_status") || "",
        workgroup_id: searchParams.get("workgroup_id") || "",
    });

    // ===== State برای جلوگیری از ارسال خودکار =====
    const [searchFilters, setSearchFilters] = useState({ ...filters });

    // ===== دریافت لیست قراردادها (فقط با دکمه جستجو) =====
    const fetchData = async (paramsFilters) => {
        const params = new URLSearchParams();

        const currentFilters = paramsFilters || searchFilters;

        if (currentFilters.date_from) {
            const gregorian = formatDateToEn(currentFilters.date_from);
            if (gregorian) params.set("date_from", gregorian);
        }
        if (currentFilters.date_to) {
            const gregorian = formatDateToEn(currentFilters.date_to);
            if (gregorian) params.set("date_to", gregorian);
        }

        if (currentFilters.personnel_code) params.set("personnel_code", currentFilters.personnel_code);
        if (currentFilters.first_name) params.set("first_name", currentFilters.first_name);
        if (currentFilters.last_name) params.set("last_name", currentFilters.last_name);
        if (currentFilters.national_code) params.set("national_code", currentFilters.national_code);
        if (currentFilters.employer_id) params.set("employer_id", currentFilters.employer_id);
        if (currentFilters.contract_type) params.set("contract_type", currentFilters.contract_type);
        if (currentFilters.contract_mode) params.set("contract_mode", currentFilters.contract_mode);
        if (currentFilters.contract_status !== "") params.set("contract_status", currentFilters.contract_status);
        if (currentFilters.workgroup_id) params.set("workgroup_id", currentFilters.workgroup_id);

        const page = searchParams.get("page");
        const perPage = searchParams.get("per-page");
        if (page) params.set("page", page);
        if (perPage) params.set("per-page", perPage);

        setListLoading(true);
        try {
            const res = await api(`hrm-contract?${params.toString()}`, "GET");
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
            const [usersRes, employersRes, typesRes, modesRes, workgroupsRes] = await Promise.all([
                api("user?per-page=100", "GET"),
                api("hrm-contract/employers", "GET"),
                api("hrm-contract/types", "GET"),
                api("hrm-contract/modes", "GET"),
                api("hrm-workgroup/items", "GET"),
            ]);

            if (usersRes?.data) setUsers(usersRes.data);
            if (employersRes?.data) setEmployers(employersRes.data);
            if (typesRes?.data) setContractTypes(typesRes.data);
            if (modesRes?.data) setContractModes(modesRes.data);
            if (workgroupsRes?.success) setWorkgroups(workgroupsRes.data);
        } catch (error) {
            console.error("Error fetching options:", error);
        }
    };

    useEffect(() => {
        fetchOptions();
        // بارگذاری اولیه داده‌ها
        fetchData(filters);
    }, []);

    // ===== مدیریت فیلترها =====
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleFilterSelectChange = (name, selectedOption) => {
        // ✅ اصلاح: گرفتن مقدار از selectedOption
        const value = selectedOption || "";
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name, date) => {
        setFilters((prev) => ({ ...prev, [name]: date?.format() || "" }));
    };

    // ===== جستجو =====
    const handleSearch = () => {
        setSearchFilters({ ...filters });
        fetchData(filters);
    };

    // ===== پاک کردن فیلترها =====
    const handleClearFilters = () => {
        const emptyFilters = {
            date_from: "",
            date_to: "",
            personnel_code: "",
            first_name: "",
            last_name: "",
            national_code: "",
            employer_id: "",
            contract_type: "",
            contract_mode: "",
            contract_status: "",
            workgroup_id: "",
        };
        setFilters(emptyFilters);
        setSearchFilters(emptyFilters);
        setSearchParams({});
        fetchData(emptyFilters);
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

    const contractModeOptions = contractModes.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    const workgroupOptions = workgroups.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    // ===== پرینت =====
    const handlePrint = (id,url) => {
        window.open(`/hrm/contracts/print/${id}${url}`, "_blank");
    };

    // ===== مشاهده جزئیات =====
    const handleView = (item) => {
        setSelectedContract(item);
        setShowViewModal(true);
    };

    // ===== ویرایش =====
    const handleEdit = (id) => {
        window.location.href = `/hrm/contract/edit/${id}`;
    };

    // ===== ستون‌ها (فشرده) =====
    const columns = [
        "وضعیت",
        "ردیف",
        "شروع",
        "قطع",
        "کد پرسنلی",
        "نام و نام خانوادگی",
        "گروه کاری",
        "کد ملی",
        "شناسنامه",
        "تاریخ تولد",
        "کارفرما",
        "نوع",
        "حالت",
        "فایل",
        "اطلاعات",
    ];

    return (
        <div className="space-y-4">
            {/* ===== فیلترها (۲ ستونه) ===== */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* ستون راست */}
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">از تاریخ</label>
                                <DatePicker
                                    calendar={persian}
                                    locale={persian_fa}
                                    value={filters.date_from}
                                    onChange={(date) => handleDateChange("date_from", date)}
                                    format="YYYY/MM/DD"
                                    className="w-full"
                                    inputClass="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                    placeholder="انتخاب تاریخ"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">تا تاریخ</label>
                                <DatePicker
                                    calendar={persian}
                                    locale={persian_fa}
                                    value={filters.date_to}
                                    onChange={(date) => handleDateChange("date_to", date)}
                                    format="YYYY/MM/DD"
                                    className="w-full"
                                    inputClass="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                    placeholder="انتخاب تاریخ"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">کد پرسنلی</label>
                                <input
                                    type="text"
                                    name="personnel_code"
                                    value={filters.personnel_code || ""}
                                    onChange={handleFilterChange}
                                    placeholder="کد پرسنلی"
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                            </div>
                            <Select
                                name="employer_id"
                                title="کارفرما"
                                value={employerOptions.find((opt) => opt.value === filters.employer_id) || null}
                                onChange={(opt) => handleFilterSelectChange("employer_id", opt)}
                                options={employerOptions}
                                placeholder="همه کارفرمایان"
                                isClearable
                            />
                        </div>
                    </div>

                    {/* ستون چپ */}
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">نام کارمند</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={filters.first_name || ""}
                                    onChange={handleFilterChange}
                                    placeholder="نام کارمند"
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Select
                                name="contract_type"
                                title="نوع قرارداد"
                                value={contractTypeOptions.find((opt) => opt.value === filters.contract_type) || null}
                                onChange={(opt) => handleFilterSelectChange("contract_type", opt)}
                                options={contractTypeOptions}
                                placeholder="همه انواع"
                                isClearable
                            />
                            <Select
                                name="contract_mode"
                                title="حالت قرارداد"
                                value={contractModeOptions.find((opt) => opt.value === filters.contract_mode) || null}
                                onChange={(opt) => handleFilterSelectChange("contract_mode", opt)}
                                options={contractModeOptions}
                                placeholder="همه حالت‌ها"
                                isClearable
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Select
                                name="contract_status"
                                title="وضعیت"
                                value={STATUS_OPTIONS.find((opt) => opt.value === filters.contract_status) || null}
                                onChange={(opt) => handleFilterSelectChange("contract_status", opt)}
                                options={STATUS_OPTIONS}
                                placeholder="همه وضعیت‌ها"
                                isClearable
                            />
                            <Select
                                name="workgroup_id"
                                title="گروه کاری"
                                value={workgroupOptions.find((opt) => opt.value === filters.workgroup_id) || null}
                                onChange={(opt) => handleFilterSelectChange("workgroup_id", opt)}
                                options={workgroupOptions}
                                placeholder="همه گروه‌ها"
                                isClearable
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-3">
                    <Button onClick={handleSearch} className="flex items-center gap-2 text-sm px-3 py-1.5">
                        <Search className="w-4 h-4" />
                        جستجو
                    </Button>
                    <Button variant="secondary" onClick={handleClearFilters} className="flex items-center gap-2 text-sm px-3 py-1.5">
                        <X className="w-4 h-4" />
                        پاک کردن
                    </Button>
                </div>
            </div>

            {/* ===== لیست (فشرده) ===== */}
            {listLoading ? (
                <div className="flex justify-center py-10">
                    <Loading />
                </div>
            ) : data?.data?.length === 0 ? (
                <Empty message="هیچ قراردادی یافت نشد" />
            ) : (
                <>
                    <div className="w-full overflow-x-auto">
                        <div className="min-w-[1400px]">
                            <div className="w-full grid grid-cols-15 gap-1 p-2 bg-gray-100 rounded-t-md text-xs">
                                {columns.map((col, i) => (
                                    <div key={i} className="flex items-center justify-center">
                                        <span className="text-xs font-bold text-gray-600">{col}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col border-x border-b rounded-b-md text-xs">
                                {data.data.map((item, index) => {
                                    const statusInfo = STATUS_BADGE[item.contract_status] || STATUS_BADGE[0];
                                    const StatusIcon = statusInfo.icon;
                                    const isActive = item.contract_status === 1;

                                    return (
                                        <div
                                            key={item.id}
                                            className="w-full grid grid-cols-15 gap-1 px-2 py-1.5 hover:bg-gray-50 border-b last:border-b-0 items-center"
                                        >
                                            {/* وضعیت */}
                                            <div className="flex items-center justify-center">
                                                {isActive ? (
                                                    <span className="flex items-center gap-0.5 text-[10px] text-green-600">
                                                        <CheckCircle className="w-3 h-3" />
                                                        فعال
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                                                        <XCircle className="w-3 h-3" />
                                                        معلق
                                                    </span>
                                                )}
                                            </div>

                                            {/* ردیف */}
                                            <div className="flex items-center justify-center">
                                                <span className="text-xs">{index + 1}</span>
                                            </div>

                                            {/* شروع */}
                                            <div className="flex items-center justify-center">
                                                <span className="text-[10px]">{item.contract_from_date_persian || "-"}</span>
                                            </div>

                                            {/* قطع */}
                                            <div className="flex items-center justify-center">
                                                <span className="text-[10px]">{item.termination_date_persian || "-"}</span>
                                            </div>

                                            {/* کد پرسنلی */}
                                            <div className="flex items-center justify-center">
                                                <span className="text-[10px]">{item.personnel_code || "-"}</span>
                                            </div>

                                            {/* نام و نام خانوادگی */}
                                            <div className="flex items-center justify-center">
                                                <span className="text-[10px] text-center">
                                                    {item.first_name || ""} {item.last_name || ""}
                                                </span>
                                            </div>

                                            {/* گروه کاری */}
                                            <div className="flex items-center justify-center">
                                                <span className="text-[10px]">{item.workgroup_name || "-"}</span>
                                            </div>

                                            {/* کد ملی */}
                                            <div className="flex items-center justify-center">
                                                <span className="text-[10px]">{item.national_code || "-"}</span>
                                            </div>

                                            {/* شناسنامه */}
                                            <div className="flex items-center justify-center">
                                                <span className="text-[10px]">{item.shenasname_number || "-"}</span>
                                            </div>

                                            {/* تاریخ تولد */}
                                            <div className="flex items-center justify-center">
                                                <span className="text-[10px]">{item.birth_date_persian || "-"}</span>
                                            </div>

                                            {/* کارفرما */}
                                            <div className="flex items-center justify-center">
                                                <span className="text-[10px]">{item?.employer?.name || "-"}</span>
                                            </div>

                                            {/* نوع */}
                                            <div className="flex items-center justify-center">
                                                <span className="text-[10px]">
                                                    {CONTRACT_TYPES[item.contract_type] ||
                                                        item.contract_type_label ||
                                                        "-"}
                                                </span>
                                            </div>

                                            {/* حالت */}
                                            <div className="flex items-center justify-center">
                                                <span className="text-[10px]">
                                                    {CONTRACT_MODES[item.contract_mode] ||
                                                        item.contract_mode_label ||
                                                        "-"}
                                                </span>
                                            </div>

                                            {/* فایل (پرینت) */}
                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={() => handlePrint(item.id,'')}
                                                     style={{cursor:'pointer'}} className="text-blue-500 hover:text-blue-700"
                                                >
                                                    <Printer className="w-3.5 h-3.5" />
                                                </button>


  <button
                                                    onClick={() => handlePrint(item.id,'?spdf=true')}
                                                    style={{cursor:'pointer',marginRight:'10px'}} className="text-blue-500 hover:text-blue-700"
                                                >
                                                    <Save className="w-3.5 h-3.5" />
                                                </button>
                                                
                                            </div>

                                            {/* اطلاعات (مشاهده + ویرایش) */}
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

                                                {item.contract_status === 0 && (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                className="cursor-pointer hover:text-blue-600"
                                                                onClick={() => handleEdit(item.id)}
                                                            >
                                                                <PenBox className="w-3.5 h-3.5" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>ویرایش</TooltipContent>
                                                    </Tooltip>
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

            {/* ===== مودال مشاهده جزئیات ===== */}
            {showViewModal && selectedContract && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">جزئیات قرارداد</h3>
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-2 bg-gray-50 rounded">
                                <span className="text-xs text-gray-500">عنوان</span>
                                <p className="font-medium">{selectedContract.title || "-"}</p>
                            </div>
                            <div className="p-2 bg-gray-50 rounded">
                                <span className="text-xs text-gray-500">نوع قرارداد</span>
                                <p className="font-medium">
                                    {CONTRACT_TYPES[selectedContract.contract_type] ||
                                        selectedContract.contract_type_label ||
                                        "-"}
                                </p>
                            </div>
                            <div className="p-2 bg-gray-50 rounded">
                                <span className="text-xs text-gray-500">پرسنل</span>
                                <p className="font-medium">
                                    {selectedContract?.user?.first_name || ""}{" "}
                                    {selectedContract?.user?.last_name || ""}
                                </p>
                            </div>
                            <div className="p-2 bg-gray-50 rounded">
                                <span className="text-xs text-gray-500">وضعیت</span>
                                <p
                                    className={`font-medium ${
                                        STATUS_COLORS[selectedContract.contract_status]
                                    }`}
                                >
                                    {STATUS_LABELS[selectedContract.contract_status] || "-"}
                                </p>
                            </div>
                            <div className="p-2 bg-gray-50 rounded">
                                <span className="text-xs text-gray-500">تاریخ شروع</span>
                                <p className="font-medium">
                                    {selectedContract.contract_from_date_persian || "-"}
                                </p>
                            </div>
                            <div className="p-2 bg-gray-50 rounded">
                                <span className="text-xs text-gray-500">تاریخ پایان</span>
                                <p className="font-medium">
                                    {selectedContract.contract_to_date_persian || "-"}
                                </p>
                            </div>
                            <div className="p-2 bg-gray-50 rounded">
                                <span className="text-xs text-gray-500">مدت</span>
                                <p className="font-medium">
                                    {selectedContract.contract_duration_months || 0} ماه /{" "}
                                    {selectedContract.contract_duration_days || 0} روز
                                </p>
                            </div>
                            <div className="p-2 bg-blue-50 rounded">
                                <span className="text-xs text-gray-500">مبلغ</span>
                                <p className="font-medium text-blue-700">
                                    {formatNumber(selectedContract.total_salary)} ریال
                                </p>
                            </div>
                            <div className="p-2 bg-gray-50 rounded">
                                <span className="text-xs text-gray-500">کارفرما</span>
                                <p className="font-medium">{selectedContract?.employer?.name || "-"}</p>
                            </div>
                            <div className="p-2 bg-gray-50 rounded">
                                <span className="text-xs text-gray-500">کد پرسنلی</span>
                                <p className="font-medium">{selectedContract.personnel_code || "-"}</p>
                            </div>
                        </div>

                        {selectedContract.description && (
                            <div className="mt-4 p-2 bg-gray-50 rounded">
                                <span className="text-xs text-gray-500">توضیحات</span>
                                <p className="font-medium text-sm">{selectedContract.description}</p>
                            </div>
                        )}

                        <div className="mt-4 flex justify-end">
                            <Button variant="secondary" onClick={() => setShowViewModal(false)}>
                                بستن
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}