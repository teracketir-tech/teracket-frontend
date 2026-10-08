// src/pages/hrm/contract/components/steps/SalaryStep.jsx

import { useEffect } from "react";
import { toast } from "sonner";
import Input from "@/components/shared/inputs";
import Select from "@/components/shared/inputs/Select";
import Button from "@/components/shared/Button";
import FormSection from "../shared/FormSection";
import { DollarSign, Clock, Briefcase, CalendarSync } from "lucide-react";

// ===== گزینه‌های نحوه پرداخت (پیمانکاری) =====
const PAYMENT_PERIOD_OPTIONS = [
    { value: "daily", label: "هر روز" },
    { value: "weekly", label: "هر هفته" },
    { value: "monthly", label: "هر ماه" },
    { value: "project", label: "پروژه" },
];

export default function SalaryStep({
    formik,
    contractType,
    financialYear,        // سال مالی فعال (برای دکمه)
    selectedFinancialYear // سال مالی بر اساس تاریخ شروع
}) {
    const isTemporary = contractType === "1";
    const isHourly = contractType === "2";
    const isProject = contractType === "3";

    // ===== پر کردن از سال مالی (با اولویت selectedFinancialYear) =====
    const fillFromFinancialYear = () => {
        // اولویت با سال مالی انتخاب شده بر اساس تاریخ است
        const targetYear = selectedFinancialYear || financialYear;

        if (!targetYear) {
            toast.warning("هیچ سال مالی یافت نشد");
            return;
        }

        // بررسی اینکه آیا مقادیر قبلی وارد شده‌اند
        const hasValues =
            formik.values.base_salary ||
            formik.values.housing_allowance ||
            formik.values.welfare_allowance ||
            formik.values.child_allowance ||
            formik.values.seniority_allowance ||
            formik.values.performance_bonus ||
            formik.values.responsibility_allowance ||
            formik.values.transportation_allowance;

        if (hasValues) {
            if (!confirm("آیا می‌خواهید مقادیر فعلی با مقادیر سال مالی جایگزین شوند؟")) {
                return;
            }
        }
        if (contractType == 1) {


            formik.setValues({
                ...formik.values,
                base_salary: targetYear.salary || "",
                child_allowance: targetYear.child_allowance || "",
                housing_allowance: targetYear.housing_benefits || "",
                welfare_allowance: targetYear.welfare_allowance || "",
                seniority_allowance: targetYear.seniority_allowance || "",
                performance_bonus: targetYear.performance_bonus || "",
                responsibility_allowance: targetYear.responsibility_allowance || "",
                transportation_allowance: targetYear.transportation_allowance || "",
            });
        }

        if (contractType == 2) {

            formik.setValues({
                ...formik.values,
                hourly_salary: targetYear.salary || "",
                hourly_housing_allowance: targetYear.housing_benefits || "",
                hourly_welfare_allowance: targetYear.welfare_allowance || "",
                hourly_child_allowance: targetYear.child_allowance || "",
                hourly_seniority_allowance: targetYear.seniority_allowance || "",
                hourly_performance_bonus: targetYear.performance_bonus || "",
            });
        }


        toast.success(`مقادیر از سال مالی ${targetYear.year} با موفقیت پر شد`);
    };

    // ===== محاسبه مجموع حق‌السعی (نوع موقت) =====
    const calculateTemporaryTotal = () => {
        const fields = [
            'base_salary',
            'child_allowance',
            'housing_allowance',
            'welfare_allowance',
            'seniority_allowance',
            'performance_bonus',
            'responsibility_allowance',
            'transportation_allowance',
            'other_allowance'
        ];
        let total = 0;
        fields.forEach(field => {
            total += parseFloat(formik.values[field]) || 0;
        });
        return total;
    };

    // ===== محاسبه مجموع حق‌السعی (نوع ساعتی) =====
    const calculateHourlyTotal = () => {
        const fields = [
            'hourly_salary',
            'hourly_housing_allowance',
            'hourly_welfare_allowance',
            'hourly_child_allowance',
            'hourly_seniority_allowance',
            'hourly_bonus',
            'hourly_leave_salary',
            'hourly_performance_bonus'
        ];
        let total = 0;
        fields.forEach(field => {
            total += parseFloat(formik.values[field]) || 0;
        });
        return total;
    };

    // ===== فرمت اعداد =====
    const formatNumber = (num) => {
        if (!num) return "۰";
        return new Intl.NumberFormat("fa-IR").format(num);
    };

    // ============================================================
    // ===== رندر نوع موقت =====
    // ============================================================
    if (isTemporary) {
        const total = calculateTemporaryTotal();
        return (
            <FormSection title="حق‌السعی" icon={DollarSign}>
                {/* دکمه پر کردن از سال مالی */}
                <div className="flex justify-end mb-4">
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={fillFromFinancialYear}
                        className="flex items-center gap-1 text-xs"
                    >
                        <CalendarSync className="w-3 h-3" />
                        پر کردن از سال مالی
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Input
                        type="number"
                        name="base_salary"
                        title="مزد ماهانه (ریال)"
                        formik={formik}
                        placeholder="مبلغ را وارد کنید"
                    />
                    <Input
                        type="number"
                        name="child_allowance"
                        title="حق اولاد (ریال)"
                        formik={formik}
                        placeholder="مبلغ را وارد کنید"
                    />
                    <Input
                        type="number"
                        name="housing_allowance"
                        title="کمک هزینه مسکن (ریال)"
                        formik={formik}
                        placeholder="مبلغ را وارد کنید"
                    />
                    <Input
                        type="number"
                        name="welfare_allowance"
                        title="مزایای رفاهی و انگیزشی (ریال)"
                        formik={formik}
                        placeholder="مبلغ را وارد کنید"
                    />
                    <Input
                        type="number"
                        name="seniority_allowance"
                        title="حق سنوات (ریال)"
                        formik={formik}
                        placeholder="مبلغ را وارد کنید"
                    />
                    <Input
                        type="number"
                        name="performance_bonus"
                        title="پاداش عملکرد (ریال)"
                        formik={formik}
                        placeholder="مبلغ را وارد کنید"
                    />
                    <Input
                        type="number"
                        name="responsibility_allowance"
                        title="حق مسئولیت (ریال)"
                        formik={formik}
                        placeholder="مبلغ را وارد کنید"
                    />
                    <Input
                        type="number"
                        name="transportation_allowance"
                        title="کمک ایاب و ذهاب (ریال)"
                        formik={formik}
                        placeholder="مبلغ را وارد کنید"
                    />
                    <Input
                        type="number"
                        name="other_allowance"
                        title="سایر (ریال)"
                        formik={formik}
                        placeholder="مبلغ را وارد کنید"
                    />
                </div>

                {/* مجموع */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-700">
                            مجموع حق‌السعی:
                        </span>
                        <span className="text-lg font-bold text-blue-700">
                            {formatNumber(total)} ریال
                        </span>
                    </div>
                </div>
            </FormSection>
        );
    }

    // ============================================================
    // ===== رندر نوع ساعتی =====
    // ============================================================
    if (isHourly) {
        const total = calculateHourlyTotal();
        return (
            <FormSection title="حق‌السعی" icon={Clock}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Input
                        type="number"
                        name="hourly_salary"
                        title="مزد ساعتی با احتساب تعطیلات هفتگی"
                        formik={formik}
                        placeholder="ریال به ازای هر ساعت"
                    />
                    <Input
                        type="number"
                        name="hourly_housing_allowance"
                        title="کمک هزینه مسکن"
                        formik={formik}
                        placeholder="ریال به ازای هر ساعت"
                    />
                    <Input
                        type="number"
                        name="hourly_welfare_allowance"
                        title="مزایای رفاهی و انگیزشی"
                        formik={formik}
                        placeholder="ریال به ازای هر ساعت"
                    />
                    <Input
                        type="number"
                        name="hourly_child_allowance"
                        title="حق اولاد"
                        formik={formik}
                        placeholder="ریال به ازای هر ساعت"
                    />
                    <Input
                        type="number"
                        name="hourly_seniority_allowance"
                        title="حق سنوات"
                        formik={formik}
                        placeholder="ریال به ازای هر ساعت"
                    />
                    <Input
                        type="number"
                        name="hourly_bonus"
                        title="حق عیدی و پاداش"
                        formik={formik}
                        placeholder="ریال به ازای هر ساعت"
                    />
                    <Input
                        type="number"
                        name="hourly_leave_salary"
                        title="مزد مرخصی بابت هر یک ساعت کار"
                        formik={formik}
                        placeholder="ریال به ازای هر ساعت"
                    />
                    <Input
                        type="number"
                        name="hourly_performance_bonus"
                        title="پاداش عملکرد"
                        formik={formik}
                        placeholder="ریال به ازای هر ساعت"
                    />
                    <Input
                        type="number"
                        name="transportation_allowance"
                        title="کمک ایاب و ذهاب"
                        formik={formik}
                        placeholder="ریال"
                    />
                </div>

                {/* مجموع */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-700">
                            مجموع حق‌السعی:
                        </span>
                        <span className="text-lg font-bold text-blue-700">
                            {formatNumber(total)} ریال به ازای هر ساعت
                        </span>
                    </div>
                </div>
            </FormSection>
        );
    }

    // ============================================================
    // ===== رندر نوع پیمانکاری =====
    // ============================================================
    if (isProject) {
        return (
            <FormSection title="حق‌السعی" icon={Briefcase}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Input
                        type="number"
                        name="contract_amount"
                        title="مبلغ قرارداد (ریال)"
                        formik={formik}
                        placeholder="مبلغ را وارد کنید"
                    />

                    <Select
                        name="contract_payment_type"
                        title="نحوه پرداخت"
                        formik={formik}
                        options={PAYMENT_PERIOD_OPTIONS}
                        placeholder="انتخاب نحوه پرداخت"
                        value={PAYMENT_PERIOD_OPTIONS.find(
                            opt => opt.value === formik.values.contract_payment_type
                        )}
                        onChange={(selectedOption) => {
                            formik.setFieldValue("contract_payment_type", selectedOption || "daily");
                        }}
                    />

                    <Input
                        type="number"
                        name="responsibility_allowance"
                        title="حق مسئولیت (ریال)"
                        formik={formik}
                        placeholder="مبلغ را وارد کنید"
                    />

                    <Input
                        type="number"
                        name="performance_bonus"
                        title="پاداش عملکرد (ریال)"
                        formik={formik}
                        placeholder="مبلغ را وارد کنید"
                    />

                    <Input
                        type="number"
                        name="transportation_allowance"
                        title="کمک ایاب و ذهاب (ریال)"
                        formik={formik}
                        placeholder="مبلغ را وارد کنید"
                    />
                </div>

                {/* نمایش مبلغ قرارداد با نحوه پرداخت */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-700">
                            مبلغ قرارداد:
                        </span>
                        <span className="text-lg font-bold text-blue-700">
                            {formatNumber(formik.values.contract_amount)} ریال
                            {formik.values.contract_payment_type && (
                                <span className="text-sm font-normal mr-1">
                                    در {PAYMENT_PERIOD_OPTIONS.find(opt => opt.value === formik.values.contract_payment_type)?.label || ''}
                                </span>
                            )}
                        </span>
                    </div>
                </div>
            </FormSection>
        );
    }

    return null;
}