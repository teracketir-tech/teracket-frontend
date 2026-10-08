// src/pages/hrm/settings/workgroup/index.jsx

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { checkAccess } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/shared/Button";
import WorkGroupList from "./WorkGroupList";
import WorkGroupBakhshList from "./WorkGroupBakhshList";
import WorkGroupGhesmatList from "./WorkGroupGhesmatList";
import WorkGroupOnvanList from "./WorkGroupOnvanList";
import WorkGroupPersonel from "./WorkGroupPersonel";
import WorkGroupReport from "./WorkGroupReport";

export default function WorkGroupSettings() {
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(
        searchParams.get("tab") || "workgroup_1"
    );

    // تابع برای تغییر تب
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        // آپدیت URL
        const url = new URL(window.location);
        url.searchParams.set("tab", tabId);
        window.history.pushState({}, "", url);
    };

    // لیست تب‌ها
    const tabs = [
        { id: "workgroup_1", label: "گروه کاری جدید" },
        { id: "workgroup_2", label: "بخش گروه کاری" },
        { id: "workgroup_3", label: "قسمت گروه کاری" },
        { id: "workgroup_4", label: "عنوان گروه کاری" },
        { id: "workgroup_5", label: "اختصاص گروه کاری" },
        { id: "workgroup_6", label: "گزارش گروه کاری" },
    ];

    // رندر محتوای تب فعال
    const renderContent = () => {
        switch (activeTab) {
            case "workgroup_1":
                return <WorkGroupList />;
            case "workgroup_2":
                return <WorkGroupBakhshList />;
            case "workgroup_3":
                return <WorkGroupGhesmatList />;
            case "workgroup_4":
                return <WorkGroupOnvanList />;
            case "workgroup_5":
                return <WorkGroupPersonel />;
            case "workgroup_6":
                return <WorkGroupReport />;
            default:
                return <WorkGroupList />;
        }
    };

    return (
        <div className="w-full space-y-4">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-lg">مدیریت گروه کاری</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* تب‌ها با استایل سفارشی */}
                    <div className="w-full">
                        {/* هدر تب‌ها */}
                        <div className="flex flex-wrap gap-1 border-b border-gray-200 mb-4">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`
                                        px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200
                                        ${
                                            activeTab === tab.id
                                                ? "bg-blue-500 text-white shadow-md"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }
                                    `}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* محتوای تب فعال */}
                        <div className="mt-4">
                            {renderContent()}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}