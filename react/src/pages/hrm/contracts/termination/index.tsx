// src/pages/hrm/contracts/termination/index.jsx

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
import { XCircle, Search, X, CalendarX } from "lucide-react";
import { checkAccess, formatDateToFa, formatDateToEn } from "@/lib/utils";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const terminationSchema = yup.object({
    termination_date: yup.string().nullable(),
    termination_reason: yup.string().nullable(),
});

const normalizeDigits = (value) =>
    String(value ?? "")
        .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
        .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));

// دریافت تاریخ امروز به صورت شمسی
const getTodayPersian = () => {
    return formatDateToFa(new Date().toString());
};

export default function ContractTermination() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [data, setData] = useState({ data: [], pages: 0, totalCount: 0 });
    const [selectedContract, setSelectedContract] = useState(null);
    const [showTerminateModal, setShowTerminateModal] = useState(false);
    
    const [users, setUsers] = useState([]);
    const [personnelCodeSearch, setPersonnelCodeSearch] = useState("");
    const [searchedPersonnelCode, setSearchedPersonnelCode] = useState("");
    const [employers, setEmployers] = useState([]);
    const [contractTypes, setContractTypes] = useState([]);

    const [filters, setFilters] = useState({
        user_id: searchParams.get("user_id") || "",
        national_code: searchParams.get("national_code") || "",
        first_name: searchParams.get("first_name") || "",
        last_name: searchParams.get("last_name") || "",
        employer_id: searchParams.get("employer_id") || "",
        contract_type: searchParams.get("contract_type") || "",
        date_from: searchParams.get("date_from") || "",
        date_to: searchParams.get("date_to") || "",
    });

    // ============== دریافت اطلاعات ==============
    const fetchData = async () => {
        const params = new URLSearchParams();
        
        if (filters.user_id) params.set("user_id", filters.user_id);
        if (filters.national_code) params.set("national_code", filters.national_code);
        if (filters.first_name) params.set("first_name", filters.first_name);
        if (filters.last_name) params.set("last_name", filters.last_name);
        if (filters.employer_id) params.set("employer_id", filters.employer_id);
        if (filters.contract_type) params.set("contract_type", filters.contract_type);
        if (filters.date_from) {
            const gregorian = formatDateToEn(filters.date_from);
            if (gregorian) params.set("date_from", gregorian);
        }
        if (filters.date_to) {
            const gregorian = formatDateToEn(filters.date_to);
            if (gregorian) params.set("date_to", gregorian);
        }
        
        const page = searchParams.get("page");
        const perPage = searchParams.get("per-page");
        if (page) params.set("page", page);
        if (perPage) params.set("per-page", perPage);
        
        const query = params.toString();

        setListLoading(true);
        try {
            const res = await api(`hrm-contract/expiring?${query}`, "GET");
            if (res?.data) {
                const formattedData = res.data.map(item => ({
                    ...item,
                    contract_to_date_persian: item.contract_to_date ? formatDateToFa(item.contract_to_date) : item.contract_to_date_persian,
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

    // ============== دریافت لیست‌های کمکی ==============
    const fetchOptions = async () => {
        try {
            const [usersRes, employersRes, typesRes] = await Promise.all([
                api("user?per-page=1000", "GET"),
                api("hrm-contract/employers", "GET"),
                api("hrm-contract/types", "GET"),
            ]);
            if (usersRes?.data) setUsers(usersRes.data);
            if (employersRes?.data) setEmployers(employersRes.data);
            if (typesRes?.data) setContractTypes(typesRes.data);
        } catch (error) {
            console.error("Error fetching options:", error);
            toast.error("خطا در دریافت اطلاعات");
        }
    };

    // ============== useEffect برای فیلترها ==============
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(timer);
    }, [filters]);

    // ============== دریافت اولیه ==============
    useEffect(() => {
        fetchOptions();
    }, []);

    // ============== قطع همکاری ==============
    const formik = useFormik({
        initialValues: {
            termination_date: getTodayPersian(),
            termination_reason: "",
        },
        validationSchema: terminationSchema,
        onSubmit: handleTerminate,
        validateOnChange: true,
        validateOnMount: true,
    });

    const handleOpenTerminate = (contract) => {
        setSelectedContract(contract);
        setShowTerminateModal(true);
        formik.setValues({
            termination_date: getTodayPersian(),
            termination_reason: "",
        });
    };

    const handleCloseTerminate = () => {
        setShowTerminateModal(false);
        setSelectedContract(null);
        formik.resetForm();
    };

    async function handleTerminate(values) {
        if (!selectedContract) return;
        
        setLoading(true);
        
        const payload = {
            termination_date: formatDateToEn(values.termination_date),
            termination_reason: values.termination_reason,
        };

        const res = await api(`hrm-contract/${selectedContract.id}/terminate`, "POST", payload);

        setLoading(false);

        if (res?.success) {
            toast.success("قطع همکاری با موفقیت ثبت شد");
            handleCloseTerminate();
            fetchData();
        } else {
            toast.error(res?.message || "خطا در ثبت قطع همکاری");
        }
    }

    // ============== مدیریت فیلترها ==============
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleFilterSelectChange = (name, selectedValue) => {
        setFilters(prev => ({ ...prev, [name]: selectedValue || "" }));
    };

    const handlePersonnelSearch = () => {
        const code = normalizeDigits(personnelCodeSearch).trim();

        if (!code) {
            setSearchedPersonnelCode("");
            toast.info("کد پرسنلی را وارد کنید");
            return;
        }

        setSearchedPersonnelCode(code);

        const matches = userOptions.filter(
            (item) => item.personnelCode && normalizeDigits(item.personnelCode).includes(code)
        );

        if (matches.length === 0) {
            setFilters((prev) => ({ ...prev, user_id: "" }));
            toast.error("پرسنلی با این کد پرسنلی پیدا نشد");
            return;
        }

        if (matches.length === 1) {
            setFilters((prev) => ({ ...prev, user_id: matches[0].value }));
            toast.success("پرسنل انتخاب شد");
            return;
        }

        setFilters((prev) => ({ ...prev, user_id: "" }));
        toast.info("چند پرسنل پیدا شد؛ از لیست انتخاب کنید");
    };

    const handleSearch = () => {
        fetchData();
    };

    const handleClearFilters = () => {
        setFilters({
            user_id: "",
            national_code: "",
            first_name: "",
            last_name: "",
            employer_id: "",
            contract_type: "",
            date_from: "",
            date_to: "",
        });
        setSearchParams({});
    };

    // ============== تبدیل داده‌ها ==============
    const userOptions = users.map((item) => {
        const fullName = `${item.first_name || ""} ${item.last_name || ""}`.trim();
        const personnelCode = String(item.personnel_code || "");

        return {
            value: String(item.id),
            label: `${fullName || item.phone_number || `کاربر ${item.id}`}${personnelCode ? ` (${personnelCode})` : ""}`,
            personnelCode,
        };
    });

    const filteredUserOptions = searchedPersonnelCode
        ? userOptions.filter((item) =>
              normalizeDigits(item.personnelCode).includes(searchedPersonnelCode)
          )
        : userOptions;

    const employerOptions = employers.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    const contractTypeOptions = contractTypes.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    const formatNumber = (num) => {
        if (!num) return "۰";
        return new Intl.NumberFormat("fa-IR").format(num);
    };

    const columns = ["ردیف", "عنوان", "پرسنل", "نوع قرارداد", "تاریخ پایان", "روزهای باقیمانده", "عملیات"];

    // ============== محاسبه روزهای باقیمانده ==============
    const getRemainingDays = (dateTo) => {
        if (!dateTo) return "-";
        const today = new Date();
        const end = new Date(dateTo);
        const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
        if (diff < 0) return "منقضی";
        return `${diff} روز`;
    };

    const getRemainingDaysColor = (dateTo) => {
        if (!dateTo) return "text-gray-400";
        const today = new Date();
        const end = new Date(dateTo);
        const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
        if (diff < 0) return "text-red-600";
        if (diff <= 7) return "text-orange-600";
        return "text-green-600";
    };

    return (
        <div className="w-full space-y-4">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarX className="w-5 h-5" />
                        قطع همکاری
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="flex min-w-0 flex-col">
                            <label className="mb-1 text-sm font-medium text-gray-700">از تاریخ</label>
                            <DatePicker
                                calendar={persian}
                                locale={persian_fa}
                                value={filters.date_from}
                                onChange={(date) => {
                                    setFilters(prev => ({ ...prev, date_from: date?.format() || "" }));
                                }}
                                format="YYYY/MM/DD"
                                className="w-full"
                                inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                placeholder="انتخاب تاریخ"
                            />
                        </div>

                        <div className="flex min-w-0 flex-col">
                            <label className="mb-1 text-sm font-medium text-gray-700">تا تاریخ</label>
                            <DatePicker
                                calendar={persian}
                                locale={persian_fa}
                                value={filters.date_to}
                                onChange={(date) => {
                                    setFilters(prev => ({ ...prev, date_to: date?.format() || "" }));
                                }}
                                format="YYYY/MM/DD"
                                className="w-full"
                                inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                placeholder="انتخاب تاریخ"
                            />
                        </div>

                        <div className="flex min-w-0 flex-col">
                            <label className="mb-1 text-sm font-medium text-gray-700">جستجو با کد پرسنلی</label>
                            <div className="flex min-w-0 gap-2">
                                <input
                                    type="text"
                                    value={personnelCodeSearch}
                                    onChange={(e) => setPersonnelCodeSearch(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handlePersonnelSearch();
                                        }
                                    }}
                                    placeholder="کد پرسنلی"
                                    className="w-full min-w-0 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                />
                                <Button
                                    type="button"
                                    onClick={handlePersonnelSearch}
                                    className="flex shrink-0 items-center justify-center gap-1 px-3"
                                >
                                    <Search className="h-4 w-4" />
                                    جستجو
                                </Button>
                            </div>
                            {searchedPersonnelCode && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPersonnelCodeSearch("");
                                        setSearchedPersonnelCode("");
                                    }}
                                    className="mt-1 self-start text-xs text-blue-600 hover:text-blue-800"
                                >
                                    نمایش همه پرسنل
                                </button>
                            )}
                        </div>

                        <div className="min-w-0">
                            <Select
                                name="user_id"
                                title="پرسنل"
                                value={filters.user_id}
                                onChange={(selectedValue) => handleFilterSelectChange("user_id", selectedValue)}
                                options={filteredUserOptions}
                                placeholder="همه پرسنل"
                                required={false}
                            />
                        </div>

                        <div className="flex min-w-0 flex-col">
                            <label className="mb-1 text-sm font-medium text-gray-700">نام کارمند</label>
                            <input
                                type="text"
                                name="first_name"
                                value={filters.first_name || ""}
                                onChange={handleFilterChange}
                                placeholder="نام کارمند"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex min-w-0 flex-col">
                            <label className="mb-1 text-sm font-medium text-gray-700">کد ملی</label>
                            <input
                                type="text"
                                name="national_code"
                                value={filters.national_code || ""}
                                onChange={handleFilterChange}
                                placeholder="کد ملی"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="min-w-0">
                            <Select
                                name="employer_id"
                                title="کارفرما"
                                value={employerOptions.find(opt => opt.value === filters.employer_id) || null}
                                onChange={(selectedOption) => handleFilterSelectChange("employer_id", selectedOption)}
                                options={employerOptions}
                                placeholder="همه کارفرمایان"
                                isClearable
                            />
                        </div>

                        <div className="min-w-0">
                            <Select
                                name="contract_type"
                                title="نوع قرارداد"
                                value={contractTypeOptions.find(opt => opt.value === filters.contract_type) || null}
                                onChange={(selectedOption) => handleFilterSelectChange("contract_type", selectedOption)}
                                options={contractTypeOptions}
                                placeholder="همه انواع"
                                isClearable
                            />
                        </div>

                        <div className="flex flex-wrap items-end gap-2 border-t border-gray-100 pt-4 md:col-span-2 lg:col-span-4">
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
                </CardContent>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>لیست قراردادهای در حال انقضا</CardTitle>
                    <p className="text-sm text-gray-500">قراردادهایی که تا ۳۰ روز آینده اعتبارشان به پایان می‌رسد</p>
                </CardHeader>

                <CardContent>
                    {listLoading ? (
                        <div className="flex justify-center py-10">
                            <Loading />
                        </div>
                    ) : data?.data?.length === 0 ? (
                        <Empty message="هیچ قرارداد در حال انقضایی یافت نشد" />
                    ) : (
                        <>
                            <div className="w-full overflow-x-auto">
                                <div className="min-w-[700px]">
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
                                                    <span className="text-xs">{item.title || "-"}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs text-center">
                                                        {item?.user?.first_name || ""} {item?.user?.last_name || ""}
                                                        <br />
                                                        <span className="text-gray-400 text-[10px]">({item?.user?.phone_number})</span>
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs">{item.contract_type_label || "-"}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-xs">{item.contract_to_date_persian || "-"}</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <span className={`text-xs font-medium ${getRemainingDaysColor(item.contract_to_date)}`}>
                                                        {getRemainingDays(item.contract_to_date)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-center gap-2">
                                                    {checkAccess([703]) && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <button
                                                                    className="cursor-pointer hover:text-red-600"
                                                                    onClick={() => handleOpenTerminate(item)}
                                                                >
                                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                                </button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>قطع همکاری</TooltipContent>
                                                        </Tooltip>
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

            {/* ========== مودال قطع همکاری ========== */}
            {showTerminateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold mb-4">قطع همکاری</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            قرارداد: <span className="font-medium">{selectedContract?.title || "بدون عنوان"}</span>
                            <br />
                            پرسنل: <span className="font-medium">{selectedContract?.user?.first_name || ""} {selectedContract?.user?.last_name || ""}</span>
                        </p>
                        
                        <form className="space-y-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">تاریخ قطع همکاری</label>
                                <DatePicker
                                    calendar={persian}
                                    locale={persian_fa}
                                    value={formik.values.termination_date}
                                    onChange={(date) => {
                                        formik.setFieldValue("termination_date", date?.format() || "");
                                    }}
                                    format="YYYY/MM/DD"
                                    className="w-full"
                                    inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                    placeholder="انتخاب تاریخ"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">دلیل قطع همکاری</label>
                                <textarea
                                    name="termination_reason"
                                    value={formik.values.termination_reason}
                                    onChange={(e) => formik.setFieldValue("termination_reason", e.target.value)}
                                    rows={3}
                                    placeholder="دلیل قطع همکاری را وارد کنید..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                            </div>

                            <div className="flex gap-3 justify-end">
                                <Button variant="secondary" onClick={handleCloseTerminate}>
                                    انصراف
                                </Button>
                                <Button
                                    onClick={formik.handleSubmit}
                                    isLoading={loading}
                                    disabled={loading}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    قطع همکاری
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}