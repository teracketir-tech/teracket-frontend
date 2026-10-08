// src/pages/hrm/personnel/create/components/LanguageTab.jsx

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import Button from "@/components/shared/Button";
import { Plus, Trash2 } from "lucide-react";

// ============== گزینه‌های Select ==============
const LANGUAGE_OPTIONS = [
    { value: "english", label: "انگلیسی" },
    { value: "french", label: "فرانسه" },
    { value: "other", label: "سایر" },
];

const LEVEL_OPTIONS = [
    { value: "excellent", label: "عالی" },
    { value: "good", label: "خوب" },
    { value: "average", label: "متوسط" },
    { value: "weak", label: "ضعیف" },
];

// ============== کامپوننت اصلی ==============
export default function LanguageTab({ user, onNext, onPrev, isFirst, isLast }) {
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [languageList, setLanguageList] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);

    const [formData, setFormData] = useState({
        language_name: "",
        other_language: "",      // فیلد جدید برای زبان‌های دیگه
        reading_level: "",
        writing_level: "",
        speaking_level: "",
    });

    // ============== بارگذاری اطلاعات ==============
    useEffect(() => {
        if (user?.id) {
            loadUserData(user.id);
        } else {
            setLanguageList([]);
        }
    }, [user]);

    const loadUserData = async (userId) => {
        setLoadingData(true);
        try {
            const res = await api(`hrm-personnel-language/get-by-user?userId=${userId}`, "GET");
            
            if (res?.success && res?.data) {
                setLanguageList(res.data);
            } else {
                setLanguageList([]);
            }
        } catch (error) {
            console.error("Error loading data:", error);
            setLanguageList([]);
        }
        setLoadingData(false);
    };

    // ============== مدیریت فرم ==============
    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddOrUpdate = () => {
        // اعتبارسنجی
        if (!formData.language_name) {
            toast.error("انتخاب زبان الزامی است");
            return;
        }

        // اگر "سایر" انتخاب شده و فیلد خالی است
        if (formData.language_name === "other" && !formData.other_language.trim()) {
            toast.error("لطفاً نام زبان را وارد کنید");
            return;
        }

        // مقدار نهایی زبان
        let finalLanguage = formData.language_name;
        if (formData.language_name === "other") {
            finalLanguage = formData.other_language.trim();
        }

        const newItem = {
            language_name: finalLanguage,
            reading_level: formData.reading_level || null,
            writing_level: formData.writing_level || null,
            speaking_level: formData.speaking_level || null,
        };

        if (editingIndex !== null) {
            const updatedList = [...languageList];
            updatedList[editingIndex] = { ...newItem };
            setLanguageList(updatedList);
            setEditingIndex(null);
            toast.success("زبان با موفقیت ویرایش شد");
        } else {
            setLanguageList([...languageList, { ...newItem, id: Date.now() }]);
            toast.success("زبان با موفقیت اضافه شد");
        }

        // ریست فرم
        setFormData({
            language_name: "",
            other_language: "",
            reading_level: "",
            writing_level: "",
            speaking_level: "",
        });
    };

    const handleEdit = (index) => {
        const item = languageList[index];
        // تشخیص اینکه آیا زبان از لیست اصلی هست یا "سایر"
        const isStandard = LANGUAGE_OPTIONS.some(opt => opt.value === item.language_name);
        const languageName = isStandard ? item.language_name : "other";
        const otherLanguage = isStandard ? "" : item.language_name;

        setEditingIndex(index);
        setFormData({
            language_name: languageName,
            other_language: otherLanguage,
            reading_level: item.reading_level || "",
            writing_level: item.writing_level || "",
            speaking_level: item.speaking_level || "",
        });
    };

    const handleDelete = (index) => {
        if (window.confirm("آیا از حذف این زبان اطمینان دارید؟")) {
            const newList = languageList.filter((_, i) => i !== index);
            setLanguageList(newList);
            if (editingIndex === index) {
                setEditingIndex(null);
                setFormData({
                    language_name: "",
                    other_language: "",
                    reading_level: "",
                    writing_level: "",
                    speaking_level: "",
                });
            }
            toast.success("زبان با موفقیت حذف شد");
        }
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setFormData({
            language_name: "",
            other_language: "",
            reading_level: "",
            writing_level: "",
            speaking_level: "",
        });
    };

    // ============== ذخیره نهایی ==============
    const handleSubmit = async () => {
        setLoading(true);
        
        try {
            const payload = {
                user_id: user?.id,
                items: languageList.map(item => ({
                    language_name: item.language_name,
                    reading_level: item.reading_level || null,
                    writing_level: item.writing_level || null,
                    speaking_level: item.speaking_level || null,
                })),
            };

            const res = await api("hrm-personnel-language/save-all", "POST", payload);
            
            if (res?.success) {
                toast.success("تسلط بر زبان خارجی با موفقیت ذخیره شد");
                onNext();
            } else {
                toast.error(res?.message || "خطا در ذخیره اطلاعات");
            }
        } catch (error) {
            console.error("Error saving:", error);
            toast.error("خطا در ذخیره اطلاعات");
        }
        
        setLoading(false);
    };

    const getLanguageLabel = (value) => {
        const found = LANGUAGE_OPTIONS.find(opt => opt.value === value);
        return found?.label || value;
    };

    const getLevelLabel = (value) => {
        const found = LEVEL_OPTIONS.find(opt => opt.value === value);
        return found?.label || value;
    };

    if (loadingData) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-500">در حال بارگذاری اطلاعات...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* ===== فرم ثبت ===== */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-700 mb-4">
                    {editingIndex !== null ? "ویرایش زبان" : "افزودن زبان جدید"}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* زبان */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">زبان</label>
                        <select
                            value={formData.language_name}
                            onChange={(e) => handleFormChange("language_name", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                        >
                            <option value="">انتخاب زبان</option>
                            {LANGUAGE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* فیلد "سایر" - فقط وقتی "سایر" انتخاب شده نمایش داده میشه */}
                    {formData.language_name === "other" && (
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">نام زبان (سایر)</label>
                            <input
                                type="text"
                                value={formData.other_language}
                                onChange={(e) => handleFormChange("other_language", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                placeholder="نام زبان را وارد کنید"
                            />
                        </div>
                    )}

                    {/* خواندن */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">خواندن</label>
                        <select
                            value={formData.reading_level}
                            onChange={(e) => handleFormChange("reading_level", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                        >
                            <option value="">انتخاب سطح</option>
                            {LEVEL_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* نوشتن */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">نوشتن</label>
                        <select
                            value={formData.writing_level}
                            onChange={(e) => handleFormChange("writing_level", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                        >
                            <option value="">انتخاب سطح</option>
                            {LEVEL_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* صحبت کردن */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">صحبت کردن</label>
                        <select
                            value={formData.speaking_level}
                            onChange={(e) => handleFormChange("speaking_level", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                        >
                            <option value="">انتخاب سطح</option>
                            {LEVEL_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex gap-3 mt-4">
                    <Button
                        type="button"
                        onClick={handleAddOrUpdate}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        {editingIndex !== null ? "ویرایش" : "افزودن"}
                    </Button>
                    {editingIndex !== null && (
                        <Button type="button" variant="secondary" onClick={handleCancelEdit}>
                            انصراف
                        </Button>
                    )}
                </div>
            </div>

            {/* ===== لیست زبان‌ها ===== */}
            {languageList.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 grid grid-cols-12 gap-2 text-xs font-bold text-gray-600">
                        <div className="col-span-2">زبان</div>
                        <div className="col-span-3">خواندن</div>
                        <div className="col-span-3">نوشتن</div>
                        <div className="col-span-3">صحبت کردن</div>
                        <div className="col-span-1 text-center">عملیات</div>
                    </div>
                    
                    {languageList.map((item, index) => {
                        // تشخیص اینکه آیا زبان در لیست استاندارد هست یا نه
                        const isStandard = LANGUAGE_OPTIONS.some(opt => opt.value === item.language_name);
                        const displayName = isStandard ? getLanguageLabel(item.language_name) : item.language_name;
                        
                        return (
                            <div key={item.id || index} className="px-4 py-3 border-b last:border-b-0 grid grid-cols-12 gap-2 hover:bg-gray-50 items-center">
                                <div className="col-span-2 text-sm font-medium">{displayName}</div>
                                <div className="col-span-3 text-sm">{getLevelLabel(item.reading_level) || "-"}</div>
                                <div className="col-span-3 text-sm">{getLevelLabel(item.writing_level) || "-"}</div>
                                <div className="col-span-3 text-sm">{getLevelLabel(item.speaking_level) || "-"}</div>
                                <div className="col-span-1 flex items-center justify-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => handleEdit(index)}
                                        className="text-blue-500 hover:text-blue-700 text-sm p-1"
                                    >
                                        ✎
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(index)}
                                        className="text-red-500 hover:text-red-700 text-sm p-1"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg">
                    <p>هیچ زبانی ثبت نشده است</p>
                    <p className="text-sm">با استفاده از فرم بالا زبان جدید اضافه کنید</p>
                </div>
            )}

            {/* ===== دکمه‌ها ===== */}
            <div className="flex justify-between items-center pt-4 border-t mt-6">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onPrev}
                    disabled={isFirst}
                    className="flex items-center gap-2"
                >
                    قبلی
                </Button>

                <Button
                    type="button"
                    onClick={handleSubmit}
                    isLoading={loading}
                    disabled={loading}
                    className="flex items-center gap-2"
                >
                    {isLast ? "ثبت نهایی" : "ذخیره و ادامه"}
                </Button>
            </div>
        </div>
    );
}