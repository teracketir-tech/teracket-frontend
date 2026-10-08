// src/pages/hrm/contract/index.jsx

import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, BarChart3 } from "lucide-react";
import DraftTab from "./tabs/DraftTab";
import ApprovalTab from "./tabs/ApprovalTab";
import ReportTab from "./tabs/ReportTab";

const TABS = [
    {
        id: "draft",
        label: "تدوین قرارداد",
        icon: FileText,
        component: DraftTab,
        description: "ثبت قرارداد جدید یا تمدید قرارداد قبلی"
    },
    {
        id: "approval",
        label: "ویرایش / تایید قرارداد",
        icon: CheckCircle,
        component: ApprovalTab,
        description: "ویرایش، تایید و مدیریت قراردادهای ثبت شده"
    },
    {
        id: "report",
        label: "گزارش قرارداد",
        icon: BarChart3,
        component: ReportTab,
        description: "جستجو و مشاهده گزارش قراردادها"
    },
];

export default function ContractManagement() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(
        searchParams.get("tab") || "draft"
    );

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        const url = new URL(window.location);
        url.searchParams.set("tab", tabId);
        window.history.pushState({}, "", url);
    };

    const activeTabData = TABS.find(tab => tab.id === activeTab);
    const TabComponent = activeTabData?.component;

    return (
        <div className="w-full space-y-4">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        مدیریت قراردادها
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* ===== نوار تب‌ها ===== */}
                    <div className="flex flex-wrap gap-1 border-b border-gray-200 mb-6">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`
                                        flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-t-lg transition-all duration-200
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

                    {/* ===== توضیحات تب ===== */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600">
                            {activeTabData?.description}
                        </p>
                    </div>

                    {/* ===== محتوای تب فعال ===== */}
                    <div className="min-h-[400px]">
                        {TabComponent ? (
                            <TabComponent />
                        ) : (
                            <div className="text-center py-20 text-gray-400">
                                <p className="text-lg">این تب در حال ساخت است...</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}