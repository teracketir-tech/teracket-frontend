// src/pages/hrm/personnel/create/components/FinalTab.jsx

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import Button from "@/components/shared/Button";
import Loading from "@/components/shared/Loading";
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
    AlertCircle,
    FileText,
    Calendar,
    MapPin,
    Mail,
    CreditCard,
    UserCheck,
    ClipboardCheck,
    Save,
    ChevronRight,
    ChevronLeft
} from "lucide-react";

// ============== کامپوننت اصلی ==============
export default function FinalTab({ user, onNext, onPrev, isFirst, isLast }) {
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [userData, setUserData] = useState({
        basic: null,
        contact: null,
        education: [],
        courses: [],
        language: [],
        skills: [],
        workExperience: [],
        documents: null,
    });
    const STANDARD_FIELDS = [
        { key: "photo", label: "عکس پرسنلی", accept: "image/*" },
        { key: "signature", label: "امضای الکترونیکی", accept: "image/*" },
        { key: "birth_certificate", label: "شناسنامه", accept: "image/*,application/pdf" },
        { key: "national_card", label: "کارت ملی", accept: "image/*,application/pdf" },
        { key: "health_certificate", label: "گواهی سلامت", accept: "image/*,application/pdf" },
        { key: "education_document_1", label: "مدرک تحصیلی (پیام نور)", accept: "image/*,application/pdf" },
        { key: "education_document_2", label: "مدرک تحصیلی (علم و صنعت)", accept: "image/*,application/pdf" },
    ];
    const [validationErrors, setValidationErrors] = useState([]);
    // ✅ state برای وضعیت تایید
    const [isAccepted, setIsAccepted] = useState(false);

    // ============== بارگذاری تمام اطلاعات ==============
    useEffect(() => {
        if (user?.id) {
            loadAllData(user.id);
        }
    }, [user]);

    const loadAllData = async (userId) => {
        setLoadingData(true);
        setValidationErrors([]);

        try {
            // بارگذاری همزمان تمام اطلاعات
            const [
                basicRes,
                contactRes,
                educationRes,
                coursesRes,
                languageRes,
                skillsRes,
                workExperienceRes,
                documentsRes,
            ] = await Promise.all([
                api(`hrm-personnel-basic/get-by-user?userId=${userId}`, "GET").catch(() => ({ success: false })),
                api(`hrm-personnel-contact/get-by-user?userId=${userId}`, "GET").catch(() => ({ success: false })),
                api(`hrm-personnel-education/get-by-user?userId=${userId}`, "GET").catch(() => ({ success: false })),
                api(`hrm-personnel-course/get-by-user?userId=${userId}`, "GET").catch(() => ({ success: false })),
                api(`hrm-personnel-language/get-by-user?userId=${userId}`, "GET").catch(() => ({ success: false })),
                api(`hrm-personnel-skill/get-by-user?userId=${userId}`, "GET").catch(() => ({ success: false })),
                api(`hrm-personnel-work-experience/get-by-user?userId=${userId}`, "GET").catch(() => ({ success: false })),
                api(`hrm-personnel-document/get-by-user?userId=${userId}`, "GET").catch(() => ({ success: false })),
            ]);

            const basicData = basicRes?.success ? basicRes.data : null;

            setUserData({
                basic: basicData,
                contact: contactRes?.success ? contactRes.data : null,
                education: educationRes?.success ? educationRes.data : [],
                courses: coursesRes?.success ? coursesRes.data : [],
                language: languageRes?.success ? languageRes.data : [],
                skills: skillsRes?.success ? skillsRes.data : [],
                workExperience: workExperienceRes?.success ? workExperienceRes.data : [],
                documents: documentsRes?.success ? documentsRes.data : null,
            });

            // ✅ تنظیم وضعیت تایید
            setIsAccepted(basicData?.status === 1);

            // بررسی validation
            validateData(basicData, contactRes?.data, educationRes?.data);
        } catch (error) {
            console.error("Error loading all data:", error);
            toast.error("خطا در بارگذاری اطلاعات");
        }

        setLoadingData(false);
    };

    // ============== Validation ==============
    const validateData = (basic, contact, education) => {
        const errors = [];

        // اطلاعات پایه
        if (!basic) {
            errors.push("اطلاعات پایه ثبت نشده است");
        } else {
            if (!basic.first_name && !basic.last_name) {
                errors.push("نام و نام خانوادگی ثبت نشده است");
            }
            if (!basic.national_code) {
                errors.push("کد ملی ثبت نشده است");
            }
            if (!basic.birth_date) {
                errors.push("تاریخ تولد ثبت نشده است");
            }
        }

        // اطلاعات تماس
        if (!contact) {
            errors.push("اطلاعات تماس و سکونت ثبت نشده است");
        } else {
            if (!contact.mobile) {
                errors.push("شماره موبایل ثبت نشده است");
            }
        }

        // سوابق تحصیلی
        if (!education || education.length === 0) {
            errors.push("حداقل یک سابقه تحصیلی ثبت شود");
        }

        setValidationErrors(errors);
    };

    // ============== ثبت نهایی ==============
    const handleFinalSubmit = async () => {
        if (validationErrors.length > 0) {
            toast.error("لطفاً ابتدا خطاهای زیر را برطرف کنید");
            return;
        }

      /*  if (isAccepted) {
            toast.warning("اطلاعات این کاربر قبلاً تایید شده است");
            return;
        }*/

        setLoading(true);

        try {
            const payload = {
                user_id: user?.id,
                status: 1, // وضعیت تکمیل
            };

            const res = await api(`hrm-personnel-basic/accept-person?userId=${user?.id}`, "POST", payload);

            if (res?.success) {
                toast.success("اطلاعات پرسنل با موفقیت ثبت نهایی شد");
                setIsAccepted(true); // ✅ به‌روزرسانی state
                // می‌توانید به صفحه لیست هدایت کنید
                // navigate("/hrm/personnel");
            } else {
                toast.error(res?.message || "خطا در ثبت نهایی اطلاعات");
            }
        } catch (error) {
            console.error("Error finalizing:", error);
            toast.error("خطا در ثبت نهایی اطلاعات");
        }

        setLoading(false);
    };

    // ============== نمایش اطلاعات ==============
    const renderBasicInfo = () => {
        if (!userData.basic) {
            return <div className="text-red-500 text-sm">اطلاعات پایه ثبت نشده است</div>;
        }

        const data = userData.basic;
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div>
                    <span className="text-gray-500">نام:</span>
                    <span className="mr-1 font-medium">{data.first_name || "-"}</span>
                </div>
                <div>
                    <span className="text-gray-500">نام خانوادگی:</span>
                    <span className="mr-1 font-medium">{data.last_name || "-"}</span>
                </div>
                <div>
                    <span className="text-gray-500">کد ملی:</span>
                    <span className="mr-1 font-medium">{data.national_code || "-"}</span>
                </div>
                <div>
                    <span className="text-gray-500">تاریخ تولد:</span>
                    <span className="mr-1 font-medium">{data.birth_date_persian || "-"}</span>
                </div>
                <div>
                    <span className="text-gray-500">نام پدر:</span>
                    <span className="mr-1 font-medium">{data.father_name || "-"}</span>
                </div>
                <div>
                    <span className="text-gray-500">جنسیت:</span>
                    <span className="mr-1 font-medium">
                        {data.gender === 1 ? "مرد" : data.gender === 2 ? "زن" : "-"}
                    </span>
                </div>
                <div>
                    <span className="text-gray-500">وضعیت تاهل:</span>
                    <span className="mr-1 font-medium">
                        {data.marital_status === 1 ? "مجرد" : data.marital_status === 2 ? "متاهل" : data.marital_status === 3 ? "مطلقه" : "-"}
                    </span>
                </div>
                <div>
                    <span className="text-gray-500">گروه خونی:</span>
                    <span className="mr-1 font-medium">{data.blood_type || "-"}</span>
                </div>
            </div>
        );
    };

    const renderContactInfo = () => {
        if (!userData.contact) {
            return <div className="text-red-500 text-sm">اطلاعات تماس ثبت نشده است</div>;
        }

        const data = userData.contact;
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <div>
                    <span className="text-gray-500">موبایل:</span>
                    <span className="mr-1 font-medium">{data.mobile || "-"}</span>
                </div>
                <div>
                    <span className="text-gray-500">تلفن ثابت:</span>
                    <span className="mr-1 font-medium">
                        {data.phone_prefix && data.phone_number ? `${data.phone_prefix}-${data.phone_number}` : "-"}
                    </span>
                </div>
                <div>
                    <span className="text-gray-500">ایمیل:</span>
                    <span className="mr-1 font-medium">{data.email || "-"}</span>
                </div>
                <div>
                    <span className="text-gray-500">استان:</span>
                    <span className="mr-1 font-medium">{data.state?.name || "-"}</span>
                </div>
                <div>
                    <span className="text-gray-500">شهر:</span>
                    <span className="mr-1 font-medium">{data.city?.name || "-"}</span>
                </div>
                <div>
                    <span className="text-gray-500">وضعیت مسکن:</span>
                    <span className="mr-1 font-medium">
                        {data.housing_status === 1 ? "مالک" : data.housing_status === 2 ? "مستاجر" : data.housing_status === 3 ? "سایر" : "-"}
                    </span>
                </div>
                <div className="col-span-full">
                    <span className="text-gray-500">آدرس:</span>
                    <span className="mr-1 font-medium">{data.address || "-"}</span>
                </div>
            </div>
        );
    };

    const renderList = (items, title, fields) => {
        if (!items || items.length === 0) {
            return <div className="text-red-500 text-sm">{title} ثبت نشده است</div>;
        }

        return (
            <div className="space-y-2">
                {items.map((item, index) => (
                    <div key={item.id || index} className="bg-gray-50 p-2 rounded text-sm">
                        {fields.map((field, i) => (
                            <span key={i} className="ml-3">
                                <span className="text-gray-500">{field.label}:</span>
                                <span className="mr-1 font-medium">{item[field.key] || "-"}</span>
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    // ============== رندر ==============
    if (loadingData) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loading />
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* عنوان */}
            <div className="flex items-center gap-2 mb-6">
                <ClipboardCheck className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-semibold">پیش تایید و ثبت نهایی</h3>
            </div>

            {/* ✅ نمایش وضعیت تایید */}
            {isAccepted && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-green-700 font-medium">
                            این کاربر قبلاً تایید شده است
                        </span>
                    </div>
                </div>
            )}

            {/* هشدار خطاها */}
            {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                        <div>
                            <p className="text-red-700 font-medium">لطفاً موارد زیر را برطرف کنید:</p>
                            <ul className="list-disc list-inside text-red-600 text-sm mt-1">
                                {validationErrors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* اطلاعات کاربر */}
            <div className="space-y-6">
                {/* اطلاعات پایه */}
                <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <User className="w-5 h-5 text-blue-500" />
                        <h4 className="font-semibold">اطلاعات پایه</h4>
                        {userData.basic && <CheckCircle className="w-4 h-4 text-green-500 mr-auto" />}
                    </div>
                    {renderBasicInfo()}
                </div>

                {/* اطلاعات تماس */}
                <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Phone className="w-5 h-5 text-blue-500" />
                        <h4 className="font-semibold">اطلاعات تماس و سکونت</h4>
                        {userData.contact && <CheckCircle className="w-4 h-4 text-green-500 mr-auto" />}
                    </div>
                    {renderContactInfo()}
                </div>

                {/* سوابق تحصیلی */}
                <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <GraduationCap className="w-5 h-5 text-blue-500" />
                        <h4 className="font-semibold">سوابق تحصیلی</h4>
                        {userData.education.length > 0 && <CheckCircle className="w-4 h-4 text-green-500 mr-auto" />}
                    </div>
                    {renderList(userData.education, "سوابق تحصیلی", [
                        { key: "institution_name", label: "مرکز" },
                        { key: "degree", label: "مدرک" },
                        { key: "field_of_study", label: "رشته" },
                    ])}
                </div>

                {/* دوره‌های آموزشی */}
                <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="w-5 h-5 text-blue-500" />
                        <h4 className="font-semibold">دوره‌های آموزشی</h4>
                        {userData.courses.length > 0 && <CheckCircle className="w-4 h-4 text-green-500 mr-auto" />}
                    </div>
                    {renderList(userData.courses, "دوره‌های آموزشی", [
                        { key: "course_name", label: "دوره" },
                        { key: "institution_name", label: "موسسه" },
                    ])}
                </div>

                {/* زبان‌ها */}
                <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Languages className="w-5 h-5 text-blue-500" />
                        <h4 className="font-semibold">تسلط بر زبان خارجی</h4>
                        {userData.language.length > 0 && <CheckCircle className="w-4 h-4 text-green-500 mr-auto" />}
                    </div>
                    {renderList(userData.language, "زبان‌ها", [
                        { key: "language_name", label: "زبان" },
                    ])}
                </div>

                {/* مهارت‌ها */}
                <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Wrench className="w-5 h-5 text-blue-500" />
                        <h4 className="font-semibold">توانایی و مهارت</h4>
                        {userData.skills.length > 0 && <CheckCircle className="w-4 h-4 text-green-500 mr-auto" />}
                    </div>
                    {renderList(userData.skills, "مهارت‌ها", [
                        { key: "skill_title", label: "مهارت" },
                    ])}
                </div>

                {/* سوابق کار */}
                <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Briefcase className="w-5 h-5 text-blue-500" />
                        <h4 className="font-semibold">سوابق کار</h4>
                        {userData.workExperience.length > 0 && <CheckCircle className="w-4 h-4 text-green-500 mr-auto" />}
                    </div>
                    {renderList(userData.workExperience, "سوابق کار", [
                        { key: "company_name", label: "محل خدمت" },
                        { key: "position", label: "سمت" },
                    ])}
                </div>
                {/* مدارک */}
                <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Upload className="w-5 h-5 text-blue-500" />
                        <h4 className="font-semibold">مدارک</h4>
                        {userData.documents && <CheckCircle className="w-4 h-4 text-green-500 mr-auto" />}
                    </div>
                    {userData.documents ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                           
                            {STANDARD_FIELDS.map((field) => {
                                const value = userData.documents[field.key];
                                if (value) {
                                    return (
                                        <div key={field.key}>
                                            <span className="text-gray-500">{field.label}:</span>
                                            <span className="mr-1 font-medium text-green-600">✓ آپلود شده</span>
                                        </div>
                                    );
                                }
                                return null;
                            })}

                            {/* مدارک سفارشی */}
                            {userData.documents.custom_documents && userData.documents.custom_documents.length > 0 && (
                                <div className="col-span-full mt-2 pt-2 border-t border-gray-200">
                                    <span className="text-gray-500">مدارک سفارشی:</span>
                                    <span className="mr-1 font-medium text-green-600">
                                        {userData.documents.custom_documents.length} فایل
                                    </span>
                                    <div className="mt-1 space-y-1">
                                        {userData.documents.custom_documents.map((doc, index) => (
                                            <div key={index} className="text-xs text-gray-600 mr-4">
                                                • {doc.title || `مدرک ${index + 1}`}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-red-500 text-sm">مدارکی ثبت نشده است</div>
                    )}
                </div>
            </div>

            {/* وضعیت کلی */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-blue-500" />
                        <span className="font-medium">وضعیت کلی:</span>
                        <span className={isAccepted ? "text-green-600 font-bold" : "text-orange-600 font-bold"}>
                            {isAccepted ? "✅ تایید شده" : "⏳ در انتظار تایید"}
                        </span>
                    </div>
                    {validationErrors.length === 0 ? (
                        <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">همه اطلاعات تکمیل شده است</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="w-5 h-5" />
                            <span className="font-medium">{validationErrors.length} مورد نیاز به تکمیل دارد</span>
                        </div>
                    )}
                </div>
            </div>

            {/* دکمه‌ها */}
            <div className="flex justify-between items-center pt-4 border-t mt-6">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onPrev}
                    disabled={isFirst}
                    className="flex items-center gap-2"
                >
                    <ChevronRight className="w-4 h-4" />
                    قبلی
                </Button>

                <Button
                    type="button"
                    onClick={handleFinalSubmit}
                    isLoading={loading}
                   /* disabled={loading || validationErrors.length > 0 || isAccepted}*/
                    className={`flex items-center gap-2 ${isAccepted ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                        }`}
                >  
                    <Save className="w-4 h-4" />
                    {isAccepted ? "تایید شده" : "ثبت نهایی"}
                </Button>
            </div>
        </div>
    );
}