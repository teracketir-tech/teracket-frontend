// src/pages/hrm/settings/financial-year/FinancialYearList.jsx

import { PenBox, Trash2Icon, CheckCircle, XCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Confirm from "@/components/ui/confirm";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { checkAccess } from "@/lib/utils";

const formatNumber = (num) => {
    if (!num) return "۰";
    return new Intl.NumberFormat("fa-IR").format(num);
};

export default function FinancialYearList({ data, onEdit, onDelete }) {
    const handleDelete = async (id) => {
        const res = await api(`hrm-financial-year/delete/${id}`, "DELETE");
        if (res?.success) {
            toast.success("سال مالی با موفقیت حذف شد");
            onDelete();
        } else {
            toast.error(res?.message || "خطا در حذف");
        }
    };

    const handleSetActive = async (id) => {
        const res = await api(`hrm-financial-year/set-active?id=${id}`, "POST");
        if (res?.success) {
            toast.success("سال مالی فعال شد");
            onDelete();
        } else {
            toast.error(res?.message || "خطا در فعال‌سازی");
        }
    };

    const columns = [
        "سال مالی",
        "مزد ماهانه",
        "حق اولاد",
        "کمک هزینه مسکن",
        "مزایای رفاهی",
        "حق سنوات",
        "پاداش عملکرد",
        "حق مسئولیت",
        "ایاب و ذهاب",
        "تاریخ ثبت",
        "ساعت ثبت",
        "وضعیت",
        "عملیات"
    ];

    return (
        <div className="w-full overflow-x-auto">
            <div className="min-w-[1300px]">
                {/* هدر - 13 ستون */}
                <div className="w-full grid grid-cols-13 gap-2 p-3 bg-gray-100 rounded-t-md">
                    {columns.map((col, i) => (
                        <div key={i} className="flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-600">{col}</span>
                        </div>
                    ))}
                </div>

                {/* داده‌ها */}
                <div className="flex flex-col border-x border-b rounded-b-md">
                    {data.map((item, index) => (
                        <div
                            key={item.id}
                            className="w-full grid grid-cols-13 gap-2 px-3 py-2 hover:bg-gray-50 border-b last:border-b-0"
                        >
                            <div className="flex items-center justify-center">
                                <span className="text-xs font-medium">{item.year}</span>
                            </div>
                            <div className="flex items-center justify-center">
                                <span className="text-xs">{formatNumber(item.salary)}</span>
                            </div>
                            <div className="flex items-center justify-center">
                                <span className="text-xs">{formatNumber(item.child_allowance)}</span>
                            </div>
                            <div className="flex items-center justify-center">
                                <span className="text-xs">{formatNumber(item.housing_benefits)}</span>
                            </div>
                            <div className="flex items-center justify-center">
                                <span className="text-xs">{formatNumber(item.welfare_allowance)}</span>
                            </div>
                            <div className="flex items-center justify-center">
                                <span className="text-xs">{formatNumber(item.seniority_allowance)}</span>
                            </div>
                            <div className="flex items-center justify-center">
                                <span className="text-xs">{formatNumber(item.performance_bonus)}</span>
                            </div>
                            <div className="flex items-center justify-center">
                                <span className="text-xs">{formatNumber(item.responsibility_allowance)}</span>
                            </div>
                            <div className="flex items-center justify-center">
                                <span className="text-xs">{formatNumber(item.transportation_allowance)}</span>
                            </div>
                            <div className="flex items-center justify-center">
                                <span className="text-xs">
                                    {item.registration_time?.split(' ')[0] || '---'}
                                </span>
                            </div>
                            <div className="flex items-center justify-center">
                                <span className="text-xs">
                                    {item.registration_time?.split(' ')[1]?.substring(0, 5) || '---'}
                                </span>
                            </div>
                            <div className="flex items-center justify-center">
                                {item.status === 1 ? (
                                    <span className="flex items-center gap-1 text-xs text-green-600">
                                        <CheckCircle className="w-4 h-4" /> فعال
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-xs text-gray-400">
                                        <XCircle className="w-4 h-4" /> غیرفعال
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center justify-center gap-1">
                                {checkAccess([703]) && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                className="cursor-pointer hover:text-blue-600"
                                                onClick={() => onEdit(item)}
                                            >
                                                <PenBox className="w-4 h-4" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>ویرایش</TooltipContent>
                                    </Tooltip>
                                )}

                                {checkAccess([703]) && item.status !== 1 && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                className="cursor-pointer hover:text-green-600"
                                                onClick={() => handleSetActive(item.id)}
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>فعال‌سازی</TooltipContent>
                                    </Tooltip>
                                )}

                                {checkAccess([704]) && (
                                    <Confirm title="حذف سال مالی" onConfirm={() => handleDelete(item.id)}>
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
    );
}