// src/pages/hrm/reports/index.tsx

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/inputs";
import Select from "@/components/shared/inputs/Select";
import Loading from "@/components/shared/Loading";
import Empty from "@/components/shared/Empty";
import { toast } from "sonner";
import { Search, FileSpreadsheet, Download } from "lucide-react";
import { api } from "@/lib/axios";

// ============== توابع کمکی ==============
// تولید لیست سال‌ها (مثل بقیه صفحات)
const yearsList = () => {
    const currentYear = 1405;
    const YearsArray = [];
    for (let year = currentYear - 15; year <= currentYear + 15; year++) {
        YearsArray.push(year);
    }
    return YearsArray;
};

// ============== گزینه‌های ثابت ==============
const MONTH_OPTIONS = [
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

const CONTRACT_TYPE_OPTIONS = [
    { value: "1", label: "موقت" },
    { value: "2", label: "ساعتی" },
    { value: "3", label: "پیمانکاری" },
];

// ============== کامپوننت اصلی ==============
export default function Reports() {
    const [activeTab, setActiveTab] = useState("tab_rpt1");
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [workgroups, setWorkgroups] = useState([]);
    const [data, setData] = useState([]);
    const [showResult, setShowResult] = useState(false);

    // گزینه‌های سال
    const yearOptions = yearsList().map((item) => ({
        value: String(item),
        label: String(item),
    }));

    // ===== فیلترهای تب 1: دستمزد و جریمه کارکرد =====
    const [filtersRpt1, setFiltersRpt1] = useState({
        user_id: "",
        personnel_code: "",
        national_code: "",
        workgroup_id: "",
    });

    // ===== فیلترهای تب 2: شرح پرداخت =====
    const [filtersRpt2, setFiltersRpt2] = useState({
        user_id: "",
        personnel_code: "",
        national_code: "",
        workgroup_id: "",
        month: "",
        year: "",
        contract_type: "",
    });

    // ===== فیلترهای تب 3: شرح کسور =====
    const [filtersRpt3, setFiltersRpt3] = useState({
        user_id: "",
        personnel_code: "",
        national_code: "",
        workgroup_id: "",
        month: "",
        year: "",
        contract_type: "",
    });

    // ============== دریافت لیست کاربران ==============
    const fetchUsers = async () => {
        try {
            const usersRes = await api("user?per-page=100", "GET");
            if (usersRes?.data) {
                setUsers(usersRes.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("خطا در دریافت اطلاعات کاربران");
        }
    };

    // ============== دریافت گروه‌های کاری ==============
    const fetchWorkgroups = async () => {
        try {
            const res = await api("hrm-workgroup/items", "GET");
            if (res?.success) {
                const options = res.data.map(item => ({
                    value: String(item.id),
                    label: item.name
                }));
                setWorkgroups(options);
            }
        } catch (error) {
            console.error("Error fetching workgroups:", error);
        }
    };

    // ============== useEffect ==============
    useEffect(() => {
        fetchUsers();
        fetchWorkgroups();
    }, []);

    // ============== شبیه‌سازی دریافت داده ==============
    const fetchData = (tab, filters) => {
        setLoading(true);
        setShowResult(false);

        setTimeout(() => {
            const mockData = generateMockData(tab, filters);
            setData(mockData);
            setShowResult(true);
            setLoading(false);
            toast.success("داده‌ها با موفقیت دریافت شدند");
        }, 2000);
    };

    // ============== تولید داده‌های نمونه ==============
    const generateMockData = (tab, filters) => {
        

        return [];
    };

    // ============== گزینه‌های کاربران ==============
    const userOptions = users.map((item) => ({
        value: String(item.id),
        label: `${item.first_name || ""} ${item.last_name || ""} (${item.personnel_code || item.phone_number || ""})`,
    }));

    const userFilterOptions = users.map((item) => ({
        value: String(item.id),
        label: `${item.first_name || ""} ${item.last_name || ""} (${item.personnel_code || item.phone_number || ""})`,
    }));

    const workgroupOptions = workgroups;

    // ============== مدیریت فیلترها ==============
    const handleFilterChange = (tab, e) => {
        const { name, value } = e.target;
        if (tab === "tab_rpt1") {
            setFiltersRpt1(prev => ({ ...prev, [name]: value }));
        } else if (tab === "tab_rpt2") {
            setFiltersRpt2(prev => ({ ...prev, [name]: value }));
        } else if (tab === "tab_rpt3") {
            setFiltersRpt3(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectChange = (tab, name, selectedOption) => {
        const value = selectedOption?.value || "";
        if (tab === "tab_rpt1") {
            setFiltersRpt1(prev => ({ ...prev, [name]: value }));
        } else if (tab === "tab_rpt2") {
            setFiltersRpt2(prev => ({ ...prev, [name]: value }));
        } else if (tab === "tab_rpt3") {
            setFiltersRpt3(prev => ({ ...prev, [name]: value }));
        }
    };

    // ============== جستجو ==============
    const handleSearch = (tab) => {
        if (tab === "tab_rpt1") {
            fetchData("tab_rpt1", filtersRpt1);
        } else if (tab === "tab_rpt2") {
            if (!filtersRpt2.month || !filtersRpt2.year) {
                toast.warning("لطفاً ماه و سال را انتخاب کنید");
                return;
            }
            fetchData("tab_rpt2", filtersRpt2);
        } else if (tab === "tab_rpt3") {
            if (!filtersRpt3.month || !filtersRpt3.year) {
                toast.warning("لطفاً ماه و سال را انتخاب کنید");
                return;
            }
            fetchData("tab_rpt3", filtersRpt3);
        }
    };

    // ============== خروجی اکسل ==============
    const handleExportExcel = (tab) => {
        toast.info(`در حال خروجی اکسل از تب ${tab === "tab_rpt1" ? "دستمزد و جریمه" : tab === "tab_rpt2" ? "شرح پرداخت" : "شرح کسور"}`);
    };

    // ============== فرمت عدد ==============
    const formatNumber = (num) => {
        if (!num) return "۰";
        return new Intl.NumberFormat("fa-IR").format(num);
    };

    const getMonthName = (month) => {
        const months = {
            1: "فروردین", 2: "اردیبهشت", 3: "خرداد",
            4: "تیر", 5: "مرداد", 6: "شهریور",
            7: "مهر", 8: "آبان", 9: "آذر",
            10: "دی", 11: "بهمن", 12: "اسفند"
        };
        return months[month] || "نامشخص";
    };

    // ============== ستون‌های هر تب ==============
    const getColumns = (tab) => {
        if (tab === "tab_rpt1") {
            return [
                "ردیف", "کد پرسنلی", "نام پرسنل", "گروه کاری",
                "حقوق پایه", "ساعت اضافه کار", "مبلغ اضافه کار",
                "جمعه کاری", "مبلغ جمعه کاری", "روز غیبت", "جریمه غیبت",
                "پاداش", "جریمه", "قابل پرداخت"
            ];
        }
        if (tab === "tab_rpt2") {
            return [
                "ردیف", "کد پرسنلی", "نام پرسنل", "گروه کاری",
                "ماه", "سال", "حقوق پایه", "حق مسکن", "بن خواربار",
                "حق اولاد", "ایاب و ذهاب", "حق مسئولیت", "اضافه کار",
                "پاداش", "مجموع پرداختی"
            ];
        }
        if (tab === "tab_rpt3") {
            return [
                "ردیف", "کد پرسنلی", "نام پرسنل", "گروه کاری",
                "ماه", "سال", "بیمه سهم کارمند", "بیمه تکمیلی",
                "مالیات", "قسط وام", "مساعده", "جریمه غیبت",
                "سایر کسور", "مجموع کسور"
            ];
        }
        return [];
    };

    // ============== رندر داده‌ها ==============
    const renderTable = (tab) => {
        if (loading) {
            return (
                <div className="flex justify-center py-10">
                    <Loading />
                </div>
            );
        }

        if (!showResult) {
            return (
                <div className="flex justify-center py-10 text-gray-400">
                    برای مشاهده نتایج، دکمه جستجو را بزنید
                </div>
            );
        }

        if (data.length === 0) {
            return <Empty message="هیچ داده‌ای یافت نشد" />;
        }

        const columns = getColumns(tab);

        return (
            <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse text-xs min-w-[1200px]">
                    <thead className="bg-gray-100">
                        <tr>
                            {columns.map((col, i) => (
                                <th key={i} className="px-2 py-2 text-center border-b whitespace-nowrap">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => {
                            const fullName = `${item.user?.first_name || ""} ${item.user?.last_name || ""}`.trim() || "-";
                            const personnelCode = item.user?.personnel_code || "-";

                            if (tab === "tab_rpt1") {
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50 border-b">
                                        <td className="px-2 py-2 text-center">{index + 1}</td>
                                        <td className="px-2 py-2 text-center">{personnelCode}</td>
                                        <td className="px-2 py-2 text-center">{fullName}</td>
                                        <td className="px-2 py-2 text-center">{item.workgroup_name || "-"}</td>
                                        <td className="px-2 py-2 text-center">{formatNumber(item.base_salary)}</td>
                                        <td className="px-2 py-2 text-center">{item.overtime_hours}</td>
                                        <td className="px-2 py-2 text-center">{formatNumber(item.overtime_pay)}</td>
                                        <td className="px-2 py-2 text-center">{item.friday_work}</td>
                                        <td className="px-2 py-2 text-center">{formatNumber(item.friday_pay)}</td>
                                        <td className="px-2 py-2 text-center">{item.absence_days}</td>
                                        <td className="px-2 py-2 text-center">{formatNumber(item.absence_penalty)}</td>
                                        <td className="px-2 py-2 text-center">{formatNumber(item.bonus)}</td>
                                        <td className="px-2 py-2 text-center">{formatNumber(item.penalty)}</td>
                                        <td className="px-2 py-2 text-center font-bold text-green-600">
                                            {formatNumber(item.net_payable)}
                                        </td>
                                    </tr>
                                );
                            }

                            if (tab === "tab_rpt2") {
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50 border-b">
                                        <td className="px-2 py-2 text-center">{index + 1}</td>
                                        <td className="px-2 py-2 text-center">{personnelCode}</td>
                                        <td className="px-2 py-2 text-center">{fullName}</td>
                                        <td className="px-2 py-2 text-center">{item.workgroup_name || "-"}</td>
                                        <td className="px-2 py-2 text-center">{getMonthName(item.month)}</td>
                                        <td className="px-2 py-2 text-center">{item.year}</td>
                                        <td className="px-2 py-2 text-center">{formatNumber(item.base_salary)}</td>
                                        <td className="px-2 py-2 text-center">{formatNumber(item.housing_allowance)}</td>
                                        <td className="px-2 py-2 text-center">{formatNumber(item.food_allowance)}</td>
                                        <td className="px-2 py-2 text-center">{formatNumber(item.child_allowance)}</td>
                                        <td className="px-2 py-2 text-center">{formatNumber(item.transportation)}</td>
                                        <td className="px-2 py-2 text-center">{formatNumber(item.responsibility)}</td>
                                        <td className="px-2 py-2 text-center">{formatNumber(item.overtime)}</td>
                                        <td className="px-2 py-2 text-center">{formatNumber(item.bonus)}</td>
                                        <td className="px-2 py-2 text-center font-bold text-green-600">
                                            {formatNumber(item.total_payment)}
                                        </td>
                                    </tr>
                                );
                            }

                            if (tab === "tab_rpt3") {
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50 border-b">
                                        <td className="px-2 py-2 text-center">{index + 1}</td>
                                        <td className="px-2 py-2 text-center">{personnelCode}</td>
                                        <td className="px-2 py-2 text-center">{fullName}</td>
                                        <td className="px-2 py-2 text-center">{item.workgroup_name || "-"}</td>
                                        <td className="px-2 py-2 text-center">{getMonthName(item.month)}</td>
                                        <td className="px-2 py-2 text-center">{item.year}</td>
                                        <td className="px-2 py-2 text-center">{formatNumber(item.insurance)}</td>
                                        <td className="px-2 py-2 text-center">{formatNumber(item.supplementary_insurance)}</td>
                                        <td className="px-2 py-2 text-center">{formatNumber(item.tax)}</td>
                                        <td className="px-2 py-2 text-center">{formatNumber(item.loan_installment)}</td>
                                        <td className="px-2 py-2 text-center">{formatNumber(item.advance)}</td>
                                        <td className="px-2 py-2 text-center">{formatNumber(item.absence_penalty)}</td>
                                        <td className="px-2 py-2 text-center">{formatNumber(item.other_deductions)}</td>
                                        <td className="px-2 py-2 text-center font-bold text-red-600">
                                            {formatNumber(item.total_deductions)}
                                        </td>
                                    </tr>
                                );
                            }

                            return null;
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    // ============== رندر فیلترهای هر تب ==============
    const renderFilters = (tab) => {
        if (tab === "tab_rpt1") {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* نام پرسنل - Select */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">نام پرسنل</label>
                        <Select
                            name="user_id"
                            value={userFilterOptions.find(opt => opt.value === filtersRpt1.user_id) || null}
                            onChange={(opt) => handleSelectChange("tab_rpt1", "user_id", opt)}
                            options={userFilterOptions}
                            placeholder="همه پرسنل"
                            isClearable
                        />
                    </div>

                    {/* کد پرسنلی - Input */}
                    <Input
                        type="text"
                        name="personnel_code"
                        value={filtersRpt1.personnel_code}
                        onChange={(e) => handleFilterChange("tab_rpt1", e)}
                        title="کد پرسنلی"
                        placeholder="کد پرسنلی"
                    />

                    {/* کد ملی - Input */}
                    <Input
                        type="text"
                        name="national_code"
                        value={filtersRpt1.national_code}
                        onChange={(e) => handleFilterChange("tab_rpt1", e)}
                        title="کد ملی"
                        placeholder="کد ملی"
                    />

                    {/* گروه کاری - Select */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">گروه کاری</label>
                        <Select
                            name="workgroup_id"
                            value={workgroupOptions.find(opt => opt.value === filtersRpt1.workgroup_id) || null}
                            onChange={(opt) => handleSelectChange("tab_rpt1", "workgroup_id", opt)}
                            options={workgroupOptions}
                            placeholder="همه گروه‌ها"
                            isClearable
                        />
                    </div>

                    {/* دکمه‌ها */}
                    <div className="flex gap-2 mt-6">
                        <Button onClick={() => handleSearch("tab_rpt1")} className="flex items-center gap-2">
                            <Search className="w-4 h-4" />
                            جستجو
                        </Button>
                        <Button variant="secondary" onClick={() => handleExportExcel("tab_rpt1")} className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            خروجی اکسل
                        </Button>
                    </div>
                </div>
            );
        }

        if (tab === "tab_rpt2") {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* نام پرسنل - Select */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">نام پرسنل</label>
                        <Select
                            name="user_id"
                            value={userFilterOptions.find(opt => opt.value === filtersRpt2.user_id) || null}
                            onChange={(opt) => handleSelectChange("tab_rpt2", "user_id", opt)}
                            options={userFilterOptions}
                            placeholder="همه پرسنل"
                            isClearable
                        />
                    </div>

                    {/* کد پرسنلی - Input */}
                    <Input
                        type="text"
                        name="personnel_code"
                        value={filtersRpt2.personnel_code}
                        onChange={(e) => handleFilterChange("tab_rpt2", e)}
                        title="کد پرسنلی"
                        placeholder="کد پرسنلی"
                    />

                    {/* کد ملی - Input */}
                    <Input
                        type="text"
                        name="national_code"
                        value={filtersRpt2.national_code}
                        onChange={(e) => handleFilterChange("tab_rpt2", e)}
                        title="کد ملی"
                        placeholder="کد ملی"
                    />

                    {/* گروه کاری - Select */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">گروه کاری</label>
                        <Select
                            name="workgroup_id"
                            value={workgroupOptions.find(opt => opt.value === filtersRpt2.workgroup_id) || null}
                            onChange={(opt) => handleSelectChange("tab_rpt2", "workgroup_id", opt)}
                            options={workgroupOptions}
                            placeholder="همه گروه‌ها"
                            isClearable
                        />
                    </div>

                    {/* ماه - Select */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">ماه</label>
                        <Select
                            name="month"
                            value={MONTH_OPTIONS.find(opt => opt.value === filtersRpt2.month) || null}
                            onChange={(opt) => handleSelectChange("tab_rpt2", "month", opt)}
                            options={MONTH_OPTIONS}
                            placeholder="انتخاب ماه"
                            isClearable
                        />
                    </div>

                    {/* سال - Select (مثل بقیه صفحات) */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">سال</label>
                        <Select
                            name="year"
                            value={yearOptions.find(opt => opt.value === filtersRpt2.year) || null}
                            onChange={(opt) => handleSelectChange("tab_rpt2", "year", opt)}
                            options={yearOptions}
                            placeholder="انتخاب سال"
                            isClearable
                        />
                    </div>

                    {/* نوع قرارداد - Select */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">نوع قرارداد</label>
                        <Select
                            name="contract_type"
                            value={CONTRACT_TYPE_OPTIONS.find(opt => opt.value === filtersRpt2.contract_type) || null}
                            onChange={(opt) => handleSelectChange("tab_rpt2", "contract_type", opt)}
                            options={CONTRACT_TYPE_OPTIONS}
                            placeholder="همه انواع"
                            isClearable
                        />
                    </div>

                    {/* دکمه‌ها */}
                    <div className="flex gap-2 mt-6">
                        <Button onClick={() => handleSearch("tab_rpt2")} className="flex items-center gap-2">
                            <Search className="w-4 h-4" />
                            جستجو
                        </Button>
                        <Button variant="secondary" onClick={() => handleExportExcel("tab_rpt2")} className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            خروجی اکسل
                        </Button>
                    </div>
                </div>
            );
        }

        if (tab === "tab_rpt3") {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* نام پرسنل - Select */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">نام پرسنل</label>
                        <Select
                            name="user_id"
                            value={userFilterOptions.find(opt => opt.value === filtersRpt3.user_id) || null}
                            onChange={(opt) => handleSelectChange("tab_rpt3", "user_id", opt)}
                            options={userFilterOptions}
                            placeholder="همه پرسنل"
                            isClearable
                        />
                    </div>

                    {/* کد پرسنلی - Input */}
                    <Input
                        type="text"
                        name="personnel_code"
                        value={filtersRpt3.personnel_code}
                        onChange={(e) => handleFilterChange("tab_rpt3", e)}
                        title="کد پرسنلی"
                        placeholder="کد پرسنلی"
                    />

                    {/* کد ملی - Input */}
                    <Input
                        type="text"
                        name="national_code"
                        value={filtersRpt3.national_code}
                        onChange={(e) => handleFilterChange("tab_rpt3", e)}
                        title="کد ملی"
                        placeholder="کد ملی"
                    />

                    {/* گروه کاری - Select */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">گروه کاری</label>
                        <Select
                            name="workgroup_id"
                            value={workgroupOptions.find(opt => opt.value === filtersRpt3.workgroup_id) || null}
                            onChange={(opt) => handleSelectChange("tab_rpt3", "workgroup_id", opt)}
                            options={workgroupOptions}
                            placeholder="همه گروه‌ها"
                            isClearable
                        />
                    </div>

                    {/* ماه - Select */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">ماه</label>
                        <Select
                            name="month"
                            value={MONTH_OPTIONS.find(opt => opt.value === filtersRpt3.month) || null}
                            onChange={(opt) => handleSelectChange("tab_rpt3", "month", opt)}
                            options={MONTH_OPTIONS}
                            placeholder="انتخاب ماه"
                            isClearable
                        />
                    </div>

                    {/* سال - Select (مثل بقیه صفحات) */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">سال</label>
                        <Select
                            name="year"
                            value={yearOptions.find(opt => opt.value === filtersRpt3.year) || null}
                            onChange={(opt) => handleSelectChange("tab_rpt3", "year", opt)}
                            options={yearOptions}
                            placeholder="انتخاب سال"
                            isClearable
                        />
                    </div>

                    {/* نوع قرارداد - Select */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">نوع قرارداد</label>
                        <Select
                            name="contract_type"
                            value={CONTRACT_TYPE_OPTIONS.find(opt => opt.value === filtersRpt3.contract_type) || null}
                            onChange={(opt) => handleSelectChange("tab_rpt3", "contract_type", opt)}
                            options={CONTRACT_TYPE_OPTIONS}
                            placeholder="همه انواع"
                            isClearable
                        />
                    </div>

                    {/* دکمه‌ها */}
                    <div className="flex gap-2 mt-6">
                        <Button onClick={() => handleSearch("tab_rpt3")} className="flex items-center gap-2">
                            <Search className="w-4 h-4" />
                            جستجو
                        </Button>
                        <Button variant="secondary" onClick={() => handleExportExcel("tab_rpt3")} className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            خروجی اکسل
                        </Button>
                    </div>
                </div>
            );
        }

        return null;
    };

    // ============== رندر نهایی ==============
    return (
        <div className="w-full space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FileSpreadsheet className="w-6 h-6" />
                    گزارشات
                </h2>
            </div>

            <Card className="w-full">
                <CardHeader className="pb-3">
                    <div className="flex gap-2 border-b pb-2">
                        <button
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeTab === "tab_rpt1"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() => setActiveTab("tab_rpt1")}
                        >
                            دستمزد و جریمه کارکرد
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeTab === "tab_rpt2"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() => setActiveTab("tab_rpt2")}
                        >
                            شرح پرداخت
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeTab === "tab_rpt3"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() => setActiveTab("tab_rpt3")}
                        >
                            شرح کسور
                        </button>
                    </div>
                </CardHeader>

                <CardContent>
                    {/* فیلترها */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        {renderFilters(activeTab)}
                    </div>

                    {/* عنوان مرتب‌سازی */}
                    <div className="text-right text-xs text-gray-500 mb-2">
                        * مرتب‌سازی بر اساس، کد پرسنلی می‌باشد
                    </div>

                    {/* جدول نتایج */}
                    {renderTable(activeTab)}
                </CardContent>
            </Card>
        </div>
    );
}