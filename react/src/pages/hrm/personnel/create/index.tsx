// src/pages/hrm/personnel/create/index.jsx

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import Button from "@/components/shared/Button";
import Select from "@/components/shared/inputs/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/shared/Loading";
import BasicInfoTab from "./components/BasicInfoTab";
import ContactTab from "./components/ContactTab";  
import EducationTab from "./components/EducationTab";  
import CoursesTab from "./components/CoursesTab";
import LanguageTab from "./components/LanguageTab";
import SkillsTab from "./components/SkillsTab";
import WorkExperienceTab from "./components/WorkExperienceTab";
import DocumentsTab from "./components/DocumentsTab";
import FinalTab from "./components/FinalTab"; // ✅ اضافه شده

import {
    User,
    Phone,
    GraduationCap,
    BookOpen,
    Languages,
    Wrench,
    Briefcase,
    Upload,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Save,
    ClipboardCheck // ✅ اضافه شده
} from "lucide-react";

// ============== تب‌ها ==============
const TABS = [
    { id: "basic", label: "اطلاعات پایه", icon: User, component: BasicInfoTab },
    { id: "contact", label: "اطلاعات تماس و سکونت", icon: Phone, component: ContactTab },  
    { id: "education", label: "سوابق تحصیلی", icon: GraduationCap, component: EducationTab },
    { id: "courses", label: "دوره‌های آموزشی قبل از استخدام", icon: BookOpen, component: CoursesTab },
    { id: "language", label: "تسلط بر زبان خارجی", icon: Languages, component: LanguageTab },
    { id: "skills", label: "توانایی و مهارت", icon: Wrench, component: SkillsTab },
    { id: "work_experience", label: "سوابق کار", icon: Briefcase, component: WorkExperienceTab },
    { id: "documents", label: "بارگزاری مدارک", icon: Upload, component: DocumentsTab },
    { id: "final", label: "پیش تایید و ثبت نهایی", icon: ClipboardCheck, component: FinalTab }, // ✅ تغییر یافته
];

// ============== کامپوننت اصلی ==============
export default function PersonnelCreate() {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [editingItem, setEditingItem] = useState(null);

    const activeTab = TABS[activeTabIndex];
    const TabComponent = activeTab.component;

    // ============== دریافت لیست کاربران ==============
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

    useEffect(() => {
        fetchUsers();
    }, []);

    // ============== انتخاب کاربر ==============
    const handleUserSelect = (selectedOption) => {
        const userId = selectedOption || "";
        if (userId) {
            const user = users.find(u => String(u.id) === userId);
            setSelectedUser(user);
            setActiveTabIndex(0);
        } else {
            setSelectedUser(null);
            setActiveTabIndex(0);
        }
    };

    // ============== رفتن به تب بعدی ==============
    const goToNextTab = () => {
        if (activeTabIndex < TABS.length - 1) {
            setActiveTabIndex(activeTabIndex + 1);
        }
    };

    // ============== رفتن به تب قبلی ==============
    const goToPrevTab = () => {
        if (activeTabIndex > 0) {
            setActiveTabIndex(activeTabIndex - 1);
        }
    };

    // ============== تبدیل داده‌ها ==============
    const userOptions = users.map((item) => ({
        value: String(item.id),
        label: `${item.first_name || ""} ${item.last_name || ""}  | کدپرسنلی : ${item.personnel_code || " - "} `.trim() || item.phone_number || `کاربر ${item.id}`,
    }));

    // ============== رندر ==============
    return (
        <div className="w-full space-y-4">
            {/* ========== عنوان و انتخاب کاربر ========== */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        ثبت و ویرایش اطلاعات پرسنل
                    </CardTitle>
                </CardHeader>
               <CardContent>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ستون راست - انتخاب پرسنل */}
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
                انتخاب پرسنل <span className="text-red-500">*</span>
            </label>
            <Select
                name="user_id"
                value={userOptions.find(opt => opt.value === selectedUser?.id?.toString()) || null}
                onChange={handleUserSelect}
                options={userOptions}
                placeholder="یک پرسنل را انتخاب کنید..."
                isClearable
                required
            />
            {!selectedUser && (
                <p className="text-xs text-gray-400 mt-1">
                    برای ثبت یا ویرایش، یک پرسنل انتخاب کنید
                </p>
            )}
        </div>

        {/* ستون چپ - اطلاعات پرسنل انتخابی */}
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
                اطلاعات پرسنل
            </label>
            {selectedUser ? (
                <div className="p-3 bg-blue-50 rounded-md border border-blue-200 ">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <span className="text-gray-500">نام:</span>
                            <span className="mr-1 font-medium">
                                {selectedUser.first_name || ""} {selectedUser.last_name || ""}
                            </span>
                        </div>
                        {selectedUser.phone_number && (
                            <div>
                                <span className="text-gray-500">موبایل:</span>
                                <span className="mr-1 font-medium">{selectedUser.phone_number}</span>
                            </div>
                        )}
                        {selectedUser.email && (
                            <div className="col-span-2">
                                <span className="text-gray-500">ایمیل:</span>
                                <span className="mr-1 font-medium">{selectedUser.email}</span>
                            </div>
                        )}
                        {selectedUser.national_code && (
                            <div>
                                <span className="text-gray-500">کد ملی:</span>
                                <span className="mr-1 font-medium">{selectedUser.national_code}</span>
                            </div>
                        )}
                        {selectedUser.group && (
                            <div>
                                <span className="text-gray-500">گروه:</span>
                                <span className="mr-1 font-medium">{selectedUser.group?.name || '---'}</span>
                            </div>
                        )}
                        {selectedUser.company && (
                            <div className="col-span-2">
                                <span className="text-gray-500">شرکت:</span>
                                <span className="mr-1 font-medium">{selectedUser.company?.name || '---'}</span>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div style={{height:'50px'}} className="p-4 bg-gray-50 rounded-md border border-dashed border-gray-300 h-full flex items-center justify-center">
                    <p className="text-sm text-gray-400 text-center">
                        برای مشاهده اطلاعات، یک پرسنل را انتخاب کنید
                    </p>
                </div>
            )}
            <br/>
        </div>
    </div>
</CardContent>
            </Card>

            {/* ========== تب‌ها ========== */}
            {selectedUser && (
                <Card className="w-full">
                    <CardContent className="p-6">
                        {/* نوار تب‌ها */}
                        <div className="flex justify-between items-center mb-8">
                            {TABS.map((tab, index) => {
                                const Icon = tab.icon;
                                const isActive = activeTabIndex === index;
                                const isCompleted = index < activeTabIndex;
                                const isLast = index === TABS.length - 1;

                                return (
                                    <div key={tab.id} className="flex flex-col items-center flex-1">
                                        {/* دایره */}
                                        <div
                                            className={`
                                                w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer
                                                ${isActive 
                                                    ? 'bg-blue-500 text-white ring-4 ring-blue-200 ring-offset-2 scale-110' 
                                                    : isCompleted 
                                                        ? 'bg-green-500 text-white' 
                                                        : 'bg-gray-200 text-gray-400'
                                                }
                                            `}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        
                                        {/* نام تب */}
                                        <span className={`
                                            text-xs mt-2 text-center font-medium
                                            ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}
                                        `}>
                                            {tab.label}
                                        </span>
                                        
                                        {/* شماره قدم */}
                                        <span className={`
                                            text-[10px] mt-1
                                            ${isActive ? 'text-blue-500' : isCompleted ? 'text-green-500' : 'text-gray-400'}
                                        `}>
                                            {isCompleted ? '✓' : `${index + 1}`}
                                        </span>

                                        {/* خط اتصال */}
                                        {!isLast && (
                                            <div className={`
                                                w-full h-0.5 mt-[-20px] mx-2
                                                ${index < activeTabIndex ? 'bg-green-400' : 'bg-gray-200'}
                                            `} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* محتوای تب */}
                        <div className="min-h-[400px]">
                            {TabComponent ? (
                                <TabComponent
                                    user={selectedUser}
                                    onNext={goToNextTab}
                                    onPrev={goToPrevTab}
                                    isFirst={activeTabIndex === 0}
                                    isLast={activeTabIndex === TABS.length - 1}
                                />
                            ) : (
                                <div className="text-center py-20 text-gray-400">
                                    <p className="text-lg">این تب در حال ساخت است...</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}