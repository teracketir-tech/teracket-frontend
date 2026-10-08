// src/pages/hrm/personnel/list/components/PersonnelDetailModal.jsx

import { useState, useEffect } from "react";
import { X, User, Phone, Mail, MapPin, Calendar, FileText, 
    GraduationCap, BookOpen, Languages, Wrench, Briefcase, 
    Upload, CheckCircle, XCircle, Printer, Download } from "lucide-react";
import { api } from "@/lib/axios";
import Button from "@/components/shared/Button";
import Loading from "@/components/shared/Loading";
import { formatDateToFa } from "@/lib/utils";

export default function PersonnelDetailModal({ personnel, onClose, loading }) {
    const [activeTab, setActiveTab] = useState("basic");
    const [additionalData, setAdditionalData] = useState({
        contact: null,
        education: [],
        courses: [],
        language: [],
        skills: [],
        workExperience: [],
        documents: null,
    });
    const [loadingData, setLoadingData] = useState(false);

    // ============== بارگذاری اطلاعات تکمیلی ==============
    useEffect(() => {
        if (personnel?.user_id) {
            loadAdditionalData(personnel.user_id);
        }
    }, [personnel]);

    const loadAdditionalData = async (userId) => {
        setLoadingData(true);
        try {
            const [
                contactRes,
                educationRes,
                coursesRes,
                languageRes,
                skillsRes,
                workExperienceRes,
                documentsRes,
            ] = await Promise.all([
                api(`hrm-personnel-contact/get-by-user?userId=${userId}`, "GET").catch(() => ({ success: false })),
                api(`hrm-personnel-education/get-by-user?userId=${userId}`, "GET").catch(() => ({ success: false })),
                api(`hrm-personnel-course/get-by-user?userId=${userId}`, "GET").catch(() => ({ success: false })),
                api(`hrm-personnel-language/get-by-user?userId=${userId}`, "GET").catch(() => ({ success: false })),
                api(`hrm-personnel-skill/get-by-user?userId=${userId}`, "GET").catch(() => ({ success: false })),
                api(`hrm-personnel-work-experience/get-by-user?userId=${userId}`, "GET").catch(() => ({ success: false })),
                api(`hrm-personnel-document/get-by-user?userId=${userId}`, "GET").catch(() => ({ success: false })),
            ]);

            setAdditionalData({
                contact: contactRes?.success ? contactRes.data : null,
                education: educationRes?.success ? educationRes.data : [],
                courses: coursesRes?.success ? coursesRes.data : [],
                language: languageRes?.success ? languageRes.data : [],
                skills: skillsRes?.success ? skillsRes.data : [],
                workExperience: workExperienceRes?.success ? workExperienceRes.data : [],
                documents: documentsRes?.success ? documentsRes.data : null,
            });
        } catch (error) {
            console.error("Error loading additional data:", error);
        }
        setLoadingData(false);
    };

    // ============== فرمت اعداد ==============
    const formatNumber = (num) => {
        if (!num) return "۰";
        return new Intl.NumberFormat("fa-IR").format(num);
    };

    // ============== توابع تبدیل ==============
    const getDegreeLabel = (value) => {
        const degrees = {
            1: "سیکل", 2: "دیپلم", 3: "فوق دیپلم", 4: "لیسانس",
            5: "فوق لیسانس", 6: "دکترا", 7: "فوق دکترا", 8: "بی سواد"
        };
        return degrees[value] || value || "-";
    };

    // ✅ اصلاح: تبدیل سطح زبان و مهارت به فارسی
    const getLevelLabel = (value) => {
        if (!value) return "-";
        const levels = {
            "excellent": "عالی",
            "good": "خوب",
            "average": "متوسط",
            "weak": "ضعیف",
            // اگر عددی هم بود
            "1": "عالی",
            "2": "خوب",
            "3": "متوسط",
            "4": "ضعیف",
        };
        return levels[value] || value;
    };

    // ✅ تبدیل واحد مدت به فارسی
    const getDurationUnitLabel = (value) => {
        if (!value) return "-";
        const units = {
            "hour": "ساعت",
            "day": "روز",
            "week": "هفته",
            "month": "ماه",
            "year": "سال",
        };
        return units[value] || value;
    };

    // ✅ تبدیل گواهی به فارسی
    const getCertificateLabel = (value) => {
        if (value === "1" || value === 1 || value === true) return "دارد";
        if (value === "0" || value === 0 || value === false) return "ندارد";
        return "-";
    };

    // ============== تب‌ها ==============
    const tabs = [
        { id: "basic", label: "اطلاعات پایه", icon: User },
        { id: "contact", label: "تماس و سکونت", icon: Phone },
        { id: "education", label: "تحصیلات", icon: GraduationCap },
        { id: "courses", label: "دوره‌ها", icon: BookOpen },
        { id: "language", label: "زبان‌ها", icon: Languages },
        { id: "skills", label: "مهارت‌ها", icon: Wrench },
        { id: "work", label: "سوابق کار", icon: Briefcase },
        { id: "documents", label: "مدارک", icon: Upload },
    ];

    // ============== رندر اطلاعات پایه ==============
    const renderBasicInfo = () => {
        const p = personnel;
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                    <p className="text-sm text-gray-500">نام</p>
                    <p className="font-medium">{p.first_name || "-"}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">نام خانوادگی</p>
                    <p className="font-medium">{p.last_name || "-"}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">نام پدر</p>
                    <p className="font-medium">{p.father_name || "-"}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">کد ملی</p>
                    <p className="font-medium">{p.national_code || "-"}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">شماره شناسنامه</p>
                    <p className="font-medium">{p.shenasname_number || "-"}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">محل صدور</p>
                    <p className="font-medium">{p.shenasname_city || "-"}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">تاریخ تولد</p>
                    <p className="font-medium">{p.birth_date_persian || "-"}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">محل تولد</p>
                    <p className="font-medium">{p.birth_place || "-"}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">جنسیت</p>
                    <p className="font-medium">
                        {p.gender === 1 ? "مرد" : p.gender === 2 ? "زن" : "-"}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">وضعیت تاهل</p>
                    <p className="font-medium">
                        {p.marital_status === 1 ? "مجرد" : p.marital_status === 2 ? "متاهل" : p.marital_status === 3 ? "مطلقه" : "-"}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">گروه خونی</p>
                    <p className="font-medium">{p.blood_type || "-"}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">دین</p>
                    <p className="font-medium">
                        {p.religion === 1 ? "اسلام" : p.religion === 2 ? "مسیحی" : p.religion === 3 ? "زرتشتی" : p.religion === 4 ? "کلیمی" : "-"}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">مذهب</p>
                    <p className="font-medium">{p.religion_detail || "-"}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">ملیت</p>
                    <p className="font-medium">{p.nationality === 1 ? "ایرانی" : p.nationality === 2 ? "غیرایرانی" : "-"}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">وضعیت</p>
                    <p className="font-medium">
                        {p.status === 1 ? (
                            <span className="text-green-600 flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" /> تایید شده
                            </span>
                        ) : (
                            <span className="text-yellow-600 flex items-center gap-1">
                                <XCircle className="w-4 h-4" /> پیش‌نویس
                            </span>
                        )}
                    </p>
                </div>
            </div>
        );
    };

    // ============== رندر اطلاعات تماس ==============
    const renderContactInfo = () => {
        const c = additionalData.contact;
        if (!c) return <p className="text-gray-400 text-sm">اطلاعات تماس ثبت نشده است</p>;
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                    <p className="text-sm text-gray-500">موبایل</p>
                    <p className="font-medium">{c.mobile || "-"}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">تلفن ثابت</p>
                    <p className="font-medium">
                        {c.phone_prefix && c.phone_number ? `${c.phone_prefix}-${c.phone_number}` : "-"}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">ایمیل</p>
                    <p className="font-medium">{c.email || "-"}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">استان</p>
                    <p className="font-medium">{c.state?.name || "-"}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">شهر</p>
                    <p className="font-medium">{c.city?.name || "-"}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">وضعیت مسکن</p>
                    <p className="font-medium">
                        {c.housing_status === 1 ? "مالک" : c.housing_status === 2 ? "مستاجر" : c.housing_status === 3 ? "سایر" : "-"}
                    </p>
                </div>
                <div className="col-span-2">
                    <p className="text-sm text-gray-500">کد پستی</p>
                    <p className="font-medium">{c.postal_code || "-"}</p>
                </div>
                <div className="col-span-3">
                    <p className="text-sm text-gray-500">آدرس</p>
                    <p className="font-medium">{c.address || "-"}</p>
                </div>
            </div>
        );
    };

    // ============== رندر لیست‌ها با فرمت‌های فارسی ==============
    const renderList = (items, title, fields, emptyMessage) => {
        if (!items || items.length === 0) {
            return <p className="text-gray-400 text-sm">{emptyMessage || `${title} ثبت نشده است`}</p>;
        }
        return (
            <div className="space-y-2">
                {items.map((item, index) => (
                    <div key={item.id || index} className="bg-gray-50 p-3 rounded-lg border">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                            {fields.map((field, i) => {
                                let value = item[field.key];
                                
                                // ✅ اعمال فرمت‌های مختلف
                                if (field.format) {
                                    value = field.format(value);
                                } else if (field.key === 'degree') {
                                    value = getDegreeLabel(value);
                                } else if (field.key === 'has_certificate') {
                                    value = getCertificateLabel(value);
                                } else if (field.key === 'duration_unit') {
                                    value = getDurationUnitLabel(value);
                                } else if (field.key === 'reading_level' || 
                                           field.key === 'writing_level' || 
                                           field.key === 'speaking_level' ||
                                           field.key === 'skill_level') {
                                    value = getLevelLabel(value);
                                }
                                
                                return (
                                    <div key={i}>
                                        <span className="text-gray-500">{field.label}:</span>
                                        <span className="mr-1 font-medium">{value || "-"}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // ============== رندر مدارک ==============
    const renderDocuments = () => {
        const docs = additionalData.documents;
        if (!docs) return <p className="text-gray-400 text-sm">مدرکی ثبت نشده است</p>;

        const standardFields = [
            { key: "photo", label: "عکس پرسنلی" },
            { key: "signature", label: "امضای الکترونیکی" },
            { key: "birth_certificate", label: "شناسنامه" },
            { key: "national_card", label: "کارت ملی" },
            { key: "health_certificate", label: "گواهی سلامت" },
            { key: "education_document_1", label: "مدرک تحصیلی (پیام نور)" },
            { key: "education_document_2", label: "مدرک تحصیلی (علم و صنعت)" },
        ];

        const getFileUrl = (filename) => {
            const baseUrl = import.meta.env.VITE_API_URL || "";
            const baseWithoutApi = baseUrl.replace('/hq/', '');
            return `${baseWithoutApi}/uploads/personnel/${filename}`;
        };

        return (
            <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {standardFields.map((field) => {
                        const value = docs[field.key];
                        if (value) {
                            return (
                                <div key={field.key} className="bg-gray-50 p-3 rounded-lg border">
                                    <p className="text-sm text-gray-500">{field.label}</p>
                                    <a 
                                        href={getFileUrl(value)} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1 mt-1"
                                    >
                                        <FileText className="w-4 h-4" />
                                        مشاهده فایل
                                    </a>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>

                {docs.custom_documents && docs.custom_documents.length > 0 && (
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">مدارک سفارشی:</p>
                        <div className="space-y-1">
                            {docs.custom_documents.map((doc, index) => (
                                <div key={index} className="bg-gray-50 p-2 rounded border text-sm">
                                    <span className="text-gray-500">{doc.title || `مدرک ${index + 1}`}:</span>
                                    <a 
                                        href={getFileUrl(doc.file)} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:text-blue-700 mr-2"
                                    >
                                        مشاهده
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!docs.photo && !docs.signature && !docs.birth_certificate && 
                 !docs.national_card && !docs.health_certificate && 
                 !docs.education_document_1 && !docs.education_document_2 && 
                 (!docs.custom_documents || docs.custom_documents.length === 0) && (
                    <p className="text-gray-400 text-sm">هیچ مدرکی ثبت نشده است</p>
                )}
            </div>
        );
    };

    // ============== رندر محتوای تب ==============
    const renderTabContent = () => {
        if (loadingData) {
            return (
                <div className="flex justify-center py-10">
                    <Loading />
                </div>
            );
        }

        switch (activeTab) {
            case "basic":
                return renderBasicInfo();
            case "contact":
                return renderContactInfo();
            case "education":
                return renderList(
                    additionalData.education,
                    "سوابق تحصیلی",
                    [
                        { key: "institution_name", label: "مرکز" },
                        { key: "degree", label: "مدرک" },
                        { key: "field_of_study", label: "رشته" },
                        { key: "orientation", label: "گرایش" },
                        { key: "start_date_persian", label: "شروع" },
                        { key: "end_date_persian", label: "پایان" },
                        { key: "gpa", label: "معدل" },
                    ]
                );
            case "courses":
                return renderList(
                    additionalData.courses,
                    "دوره‌های آموزشی",
                    [
                        { key: "institution_name", label: "موسسه" },
                        { key: "course_name", label: "دوره" },
                        { key: "start_date_persian", label: "شروع" },
                        { key: "end_date_persian", label: "پایان" },
                        { key: "duration", label: "مدت" },
                        { key: "duration_unit", label: "واحد" },
                        { key: "has_certificate", label: "گواهی" },
                    ]
                );
            case "language":
                return renderList(
                    additionalData.language,
                    "زبان‌ها",
                    [
                        { key: "language_name", label: "زبان" },
                        { key: "reading_level", label: "خواندن" },
                        { key: "writing_level", label: "نوشتن" },
                        { key: "speaking_level", label: "صحبت کردن" },
                    ]
                );
            case "skills":
                return renderList(
                    additionalData.skills,
                    "مهارت‌ها",
                    [
                        { key: "skill_title", label: "مهارت" },
                        { key: "skill_level", label: "سطح" },
                        { key: "skill_description", label: "توضیح" },
                    ]
                );
            case "work":
                return renderList(
                    additionalData.workExperience,
                    "سوابق کار",
                    [
                        { key: "company_name", label: "محل خدمت" },
                        { key: "position", label: "سمت" },
                        { key: "start_date_persian", label: "شروع" },
                        { key: "end_date_persian", label: "پایان" },
                        { key: "job_description", label: "شرح وظیفه" },
                    ]
                );
            case "documents":
                return renderDocuments();
            default:
                return <p className="text-gray-400">اطلاعاتی موجود نیست</p>;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* هدر */}
                <div className="flex justify-between items-center p-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                            {personnel?.first_name?.[0] || personnel?.last_name?.[0] || '?'}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">
                                {personnel?.first_name || ""} {personnel?.last_name || ""}
                            </h3>
                            <p className="text-sm text-gray-500">
                                کد پرسنلی: {personnel?.user_id || "-"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                      
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 p-1"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* تب‌ها */}
                <div className="flex overflow-x-auto border-b px-4 gap-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all
                                    ${isActive 
                                        ? 'border-blue-500 text-blue-600' 
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }
                                `}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* محتوا */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <Loading />
                        </div>
                    ) : (
                        renderTabContent()
                    )}
                </div>

                {/* فوتر */}
                <div className="p-4 border-t flex justify-end">
                    <Button variant="secondary" onClick={onClose}>
                        بستن
                    </Button>
                </div>
            </div>
        </div>
    );
}