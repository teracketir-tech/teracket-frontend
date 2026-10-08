// src/pages/hrm/personnel/create/components/EducationTab.jsx

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/inputs";
import Select from "@/components/shared/inputs/Select";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { formatDateToEn, formatDateToFa } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";

// ============== گزینه‌های Select ==============
const DEGREE_OPTIONS = [
    { value: "1", label: "سیکل" },
    { value: "2", label: "دیپلم" },
    { value: "3", label: "فوق دیپلم" },
    { value: "4", label: "لیسانس" },
    { value: "5", label: "فوق لیسانس" },
    { value: "6", label: "دکترا" },
    { value: "7", label: "فوق دکترا" },
    { value: "8", label: "بی سواد" },
];

// ============== کامپوننت اصلی ==============
export default function EducationTab({ user, onNext, onPrev, isFirst, isLast }) {
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [educationList, setEducationList] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);

    // فرم جدید - با useState معمولی
    const [formData, setFormData] = useState({
        institution_name: "",
        degree: "",
        field_of_study: "",
        orientation: "",
        start_date: "",
        end_date: "",
        gpa: "",
    });

    // ============== بارگذاری اطلاعات ==============
    useEffect(() => {
        if (user?.id) {
            loadUserData(user.id);
        } else {
            setEducationList([]);
        }
    }, [user]);

    const loadUserData = async (userId) => {
        setLoadingData(true);
        try {
            const res = await api(`hrm-personnel-education/get-by-user?userId=${userId}`, "GET");
            
            if (res?.success && res?.data) {
                setEducationList(res.data.map(item => ({
                    ...item,
                    start_date: item.start_date_persian || "",
                    end_date: item.end_date_persian || "",
                })));
            } else {
                setEducationList([]);
            }
        } catch (error) {
            console.error("Error loading data:", error);
            setEducationList([]);
        }
        setLoadingData(false);
    };

    // ============== مدیریت فرم ==============
    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddOrUpdate = () => {
        if (!formData.institution_name || !formData.degree) {
            toast.error("نام مرکز آموزشی و مدرک تحصیلی الزامی است");
            return;
        }

        if (editingIndex !== null) {
            const updatedList = [...educationList];
            updatedList[editingIndex] = { ...formData };
            setEducationList(updatedList);
            setEditingIndex(null);
            toast.success("مدرک با موفقیت ویرایش شد");
        } else {
            setEducationList([...educationList, { ...formData, id: Date.now() }]);
            toast.success("مدرک با موفقیت اضافه شد");
        }

        setFormData({
            institution_name: "",
            degree: "",
            field_of_study: "",
            orientation: "",
            start_date: "",
            end_date: "",
            gpa: "",
        });
    };

    const handleEdit = (index) => {
        setEditingIndex(index);
        setFormData(educationList[index]);
    };

    const handleDelete = (index) => {
        if (window.confirm("آیا از حذف این مدرک اطمینان دارید؟")) {
            const newList = educationList.filter((_, i) => i !== index);
            setEducationList(newList);
            if (editingIndex === index) {
                setEditingIndex(null);
                setFormData({
                    institution_name: "",
                    degree: "",
                    field_of_study: "",
                    orientation: "",
                    start_date: "",
                    end_date: "",
                    gpa: "",
                });
            }
            toast.success("مدرک با موفقیت حذف شد");
        }
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setFormData({
            institution_name: "",
            degree: "",
            field_of_study: "",
            orientation: "",
            start_date: "",
            end_date: "",
            gpa: "",
        });
    };

    // ============== ذخیره نهایی ==============
    const handleSubmit = async () => {
        setLoading(true);
        
        try {
            const payload = {
                user_id: user?.id,
                items: educationList.map(item => ({
                    institution_name: item.institution_name,
                    degree: item.degree,
                    field_of_study: item.field_of_study || "",
                    orientation: item.orientation || "",
                    start_date: item.start_date || null,
                    end_date: item.end_date || null,
                    gpa: item.gpa || null,
                })),
            };

            const res = await api("hrm-personnel-education/save-all", "POST", payload);
            
            if (res?.success) {
                toast.success("سوابق تحصیلی با موفقیت ذخیره شد");
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

    const getDegreeLabel = (value) => {
        const found = DEGREE_OPTIONS.find(opt => opt.value === String(value));
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
                    {editingIndex !== null ? "ویرایش مدرک" : "افزودن مدرک جدید"}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* نام مرکز آموزشی */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">نام مرکز آموزشی</label>
                        <input
                            type="text"
                            value={formData.institution_name}
                            onChange={(e) => handleFormChange("institution_name", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="نام مرکز آموزشی"
                        />
                    </div>

                    {/* مدرک تحصیلی */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">مدرک تحصیلی</label>
                        <select
                            value={formData.degree}
                            onChange={(e) => handleFormChange("degree", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                        >
                            <option value="">انتخاب مدرک</option>
                            {DEGREE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* رشته تحصیلی */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">رشته تحصیلی</label>
                        <input
                            type="text"
                            value={formData.field_of_study}
                            onChange={(e) => handleFormChange("field_of_study", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="رشته تحصیلی"
                        />
                    </div>

                    {/* گرایش */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">گرایش</label>
                        <input
                            type="text"
                            value={formData.orientation}
                            onChange={(e) => handleFormChange("orientation", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="گرایش"
                        />
                    </div>

                    {/* تاریخ شروع */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">تاریخ شروع</label>
                        <DatePicker
                            calendar={persian}
                            locale={persian_fa}
                            value={formData.start_date}
                            onChange={(date) => handleFormChange("start_date", date?.format() || "")}
                            format="YYYY/MM/DD"
                            className="w-full"
                            inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                            placeholder="انتخاب تاریخ"
                        />
                    </div>

                    {/* تاریخ پایان */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">تاریخ پایان</label>
                        <DatePicker
                            calendar={persian}
                            locale={persian_fa}
                            value={formData.end_date}
                            onChange={(date) => handleFormChange("end_date", date?.format() || "")}
                            format="YYYY/MM/DD"
                            className="w-full"
                            inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                            placeholder="انتخاب تاریخ"
                        />
                    </div>

                    {/* معدل */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">معدل</label>
                        <input
                            type="number"
                            value={formData.gpa}
                            onChange={(e) => handleFormChange("gpa", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="معدل (۰ تا ۲۰)"
                            min={0}
                            max={20}
                            step={0.01}
                        />
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

            {/* ===== لیست مدارک ===== */}
            {educationList.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 grid grid-cols-12 gap-2 text-xs font-bold text-gray-600">
                        <div className="col-span-3">مرکز آموزشی</div>
                        <div className="col-span-2">مدرک</div>
                        <div className="col-span-2">رشته</div>
                        <div className="col-span-2">تاریخ شروع</div>
                        <div className="col-span-2">تاریخ پایان</div>
                        <div className="col-span-1 text-center">عملیات</div>
                    </div>
                    
                    {educationList.map((item, index) => (
                        <div key={item.id || index} className="px-4 py-3 border-b last:border-b-0 grid grid-cols-12 gap-2 hover:bg-gray-50 items-center">
                            <div className="col-span-3 text-sm truncate">{item.institution_name}</div>
                            <div className="col-span-2 text-sm">{getDegreeLabel(item.degree)}</div>
                            <div className="col-span-2 text-sm truncate">{item.field_of_study || "-"}</div>
                            <div className="col-span-2 text-sm">{item.start_date || "-"}</div>
                            <div className="col-span-2 text-sm">{item.end_date || "-"}</div>
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
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg">
                    <p>هیچ مدرکی ثبت نشده است</p>
                    <p className="text-sm">با استفاده از فرم بالا مدرک جدید اضافه کنید</p>
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