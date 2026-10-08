// src/pages/hrm/settings/working-days/index.jsx

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import Loading from "@/components/shared/Loading";
import Empty from "@/components/shared/Empty";
import Button from "@/components/shared/Button";
import Select from "@/components/shared/inputs/Select"; // اضافه کردن import Select

const MONTHS = [
    { value: 1, label: "فروردین", defaultDays: 31 },
    { value: 2, label: "اردیبهشت", defaultDays: 31 },
    { value: 3, label: "خرداد", defaultDays: 31 },
    { value: 4, label: "تیر", defaultDays: 31 },
    { value: 5, label: "مرداد", defaultDays: 31 },
    { value: 6, label: "شهریور", defaultDays: 31 },
    { value: 7, label: "مهر", defaultDays: 30 },
    { value: 8, label: "آبان", defaultDays: 30 },
    { value: 9, label: "آذر", defaultDays: 30 },
    { value: 10, label: "دی", defaultDays: 30 },
    { value: 11, label: "بهمن", defaultDays: 30 },
    { value: 12, label: "اسفند", defaultDays: 29 },
];

export default function WorkingDaysSettings() {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [financialYears, setFinancialYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedData, setSelectedData] = useState(null);
    const [monthDays, setMonthDays] = useState({});

    useEffect(() => {
        fetchFinancialYears();
    }, []);

    const fetchFinancialYears = async () => {
        setLoading(true);
        try {
            const res = await api("hrm-financial-year?per-page=100", "GET");
            console.log("📊 Financial Years Response:", res);
            
            if (res?.data && res.data.length > 0) {
                setFinancialYears(res.data);
                // انتخاب اولین سال به طور پیش‌فرض
                const firstYear = res.data[0];
                if (firstYear) {
                    setSelectedYear(String(firstYear.id));
                    fetchYearData(String(firstYear.id));
                }
            } else {
                toast.warning("هیچ سال مالی ثبت نشده است");
                setFinancialYears([]);
            }
        } catch (error) {
            console.error("Error fetching financial years:", error);
            toast.error("خطا در دریافت اطلاعات سال مالی");
        }
        setLoading(false);
    };

    const fetchYearData = async (yearId) => {
        if (!yearId) return;
        
        console.log("🔄 Fetching year data for ID:", yearId);
        setLoading(true);
        
        try {
            const res = await api(`hrm-financial-year/${yearId}`, "GET");
            console.log("📅 Year Data Response:", res);
            
            if (res?.success && res?.data) {
                setSelectedData(res.data);
                
                const days = res.data.day_count_months || {};
                console.log("📆 Days from API:", days);
                
                const completeDays = {};
                MONTHS.forEach((month) => {
                    completeDays[month.value] = days[month.value] || month.defaultDays;
                });
                
                console.log("✅ Complete Days:", completeDays);
                setMonthDays(completeDays);
            } else {
                console.error("❌ No data in response:", res);
                setSelectedData(null);
                setMonthDays({});
                toast.error(res?.message || "خطا در دریافت اطلاعات سال مالی");
            }
        } catch (error) {
            console.error("❌ Error fetching year data:", error);
            toast.error("خطا در دریافت اطلاعات");
            setSelectedData(null);
            setMonthDays({});
        }
        
        setLoading(false);
    };

    const handleYearChange = (value) => {
        console.log("🔍 Selected Year ID:", value);
        setSelectedYear(value);
        if (value) {
            fetchYearData(value);
        } else {
            setSelectedData(null);
            setMonthDays({});
        }
    };

    const handleDayChange = (month, value) => {
        const numValue = parseInt(value) || 0;
        setMonthDays((prev) => ({
            ...prev,
            [month]: numValue,
        }));
    };

    const handleSave = async () => {
        if (!selectedData) {
            toast.error("لطفاً ابتدا یک سال مالی انتخاب کنید");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                year: selectedData.year,
                salary: selectedData.salary,
                coupon: selectedData.coupon,
                housing_benefits: selectedData.housing_benefits,
                day_count_months: monthDays,
            };
            
            console.log("💾 Saving payload:", payload);
            
            const res = await api(`hrm-financial-year/${selectedData.id}`, "PATCH", payload);
            console.log("💾 Save Response:", res);

            if (res?.success) {
                toast.success("روزهای کاری با موفقیت ذخیره شد");
                fetchYearData(selectedYear);
            } else {
                toast.error(res?.message || "خطا در ذخیره اطلاعات");
                console.error("❌ Save error:", res);
            }
        } catch (error) {
            console.error("❌ Error saving:", error);
            toast.error("خطا در ذخیره اطلاعات");
        }
        setSaving(false);
    };

    // ساخت آرایه آپشن‌ها برای Select
    const yearOptionsArray = financialYears.map((item) => ({
        value: String(item.id),
        label: `${item.year} ${item.status === 1 ? "(فعال)" :"(غیرفعال)" }`,
    }));

    if (loading && !selectedData) {
        return (
            <div className="flex justify-center py-10">
                <Loading />
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">تنظیم روزهای کاری در ماه</h2>

                <div className="mb-6 max-w-xs">
                    <Select
                        name="year"
                        title="انتخاب سال مالی"
                        value={selectedYear}
                        options={yearOptionsArray}
                        placeholder="انتخاب سال مالی"
                        onChange={(value) => handleYearChange(value)}
                    />
                </div>

                {loading && (
                    <div className="flex justify-center py-5">
                        <Loading />
                    </div>
                )}

                {selectedData && !loading && (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                            {MONTHS.map((month) => (
                                <div key={month.value} className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        {month.label}
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="31"
                                        value={monthDays[month.value] || ""}
                                        onChange={(e) => handleDayChange(month.value, e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        placeholder="تعداد روز"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <Button onClick={handleSave} isLoading={saving} disabled={saving}>
                                ذخیره روزهای کاری
                            </Button>
                        </div>

                        <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm text-blue-700">
                            <span className="font-medium">نکته:</span> برای ماه‌هایی که مقدار وارد نشود، مقدار پیش‌فرض (۳۱ یا ۳۰) در نظر گرفته می‌شود.
                        </div>
                    </>
                )}

                {!selectedData && !loading && (
                    <div className="text-center py-10 text-gray-500">
                        لطفاً یک سال مالی را انتخاب کنید
                    </div>
                )}
            </div>
        </div>
    );
}