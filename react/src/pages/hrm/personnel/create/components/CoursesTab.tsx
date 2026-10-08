// src/pages/hrm/personnel/create/components/CoursesTab.jsx

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import Button from "@/components/shared/Button";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Plus, Trash2 } from "lucide-react";

// ============== گزینه‌های Select ==============
const DURATION_UNIT_OPTIONS = [
    { value: "hour", label: "ساعت" },
    { value: "day", label: "روز" },
    { value: "week", label: "هفته" },
    { value: "month", label: "ماه" },
    { value: "year", label: "سال" },
];

const CERTIFICATE_OPTIONS = [
    { value: "0", label: "ندارد" },
    { value: "1", label: "دارد" },
];

// ============== کامپوننت اصلی ==============
export default function CoursesTab({ user, onNext, onPrev, isFirst, isLast }) {
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [courseList, setCourseList] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);

    const [formData, setFormData] = useState({
        institution_name: "",
        course_name: "",
        start_date: "",
        end_date: "",
        duration: "",
        duration_unit: "",
        has_certificate: "0",
    });

    // ============== بارگذاری اطلاعات ==============
    useEffect(() => {
        if (user?.id) {
            loadUserData(user.id);
        } else {
            setCourseList([]);
        }
    }, [user]);

    const loadUserData = async (userId) => {
        setLoadingData(true);
        try {
            const res = await api(`hrm-personnel-course/get-by-user?userId=${userId}`, "GET");
            
            if (res?.success && res?.data) {
                setCourseList(res.data.map(item => ({
                    ...item,
                    start_date: item.start_date_persian || "",
                    end_date: item.end_date_persian || "",
                })));
            } else {
                setCourseList([]);
            }
        } catch (error) {
            console.error("Error loading data:", error);
            setCourseList([]);
        }
        setLoadingData(false);
    };

    // ============== مدیریت فرم ==============
    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddOrUpdate = () => {
        if (!formData.institution_name || !formData.course_name) {
            toast.error("نام موسسه و نام دوره الزامی است");
            return;
        }

        if (editingIndex !== null) {
            const updatedList = [...courseList];
            updatedList[editingIndex] = { ...formData };
            setCourseList(updatedList);
            setEditingIndex(null);
            toast.success("دوره با موفقیت ویرایش شد");
        } else {
            setCourseList([...courseList, { ...formData, id: Date.now() }]);
            toast.success("دوره با موفقیت اضافه شد");
        }

        setFormData({
            institution_name: "",
            course_name: "",
            start_date: "",
            end_date: "",
            duration: "",
            duration_unit: "",
            has_certificate: "0",
        });
    };

    const handleEdit = (index) => {
        setEditingIndex(index);
        setFormData(courseList[index]);
    };

    const handleDelete = (index) => {
        if (window.confirm("آیا از حذف این دوره اطمینان دارید؟")) {
            const newList = courseList.filter((_, i) => i !== index);
            setCourseList(newList);
            if (editingIndex === index) {
                setEditingIndex(null);
                setFormData({
                    institution_name: "",
                    course_name: "",
                    start_date: "",
                    end_date: "",
                    duration: "",
                    duration_unit: "",
                    has_certificate: "0",
                });
            }
            toast.success("دوره با موفقیت حذف شد");
        }
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setFormData({
            institution_name: "",
            course_name: "",
            start_date: "",
            end_date: "",
            duration: "",
            duration_unit: "",
            has_certificate: "0",
        });
    };

    // ============== ذخیره نهایی ==============
    const handleSubmit = async () => {
        setLoading(true);
        
        try {
            const payload = {
                user_id: user?.id,
                items: courseList.map(item => ({
                    institution_name: item.institution_name,
                    course_name: item.course_name,
                    start_date: item.start_date || null,
                    end_date: item.end_date || null,
                    duration: item.duration || null,
                    duration_unit: item.duration_unit || null,
                    has_certificate: item.has_certificate || 0,
                })),
            };

            const res = await api("hrm-personnel-course/save-all", "POST", payload);
            
            if (res?.success) {
                toast.success("دوره‌های آموزشی با موفقیت ذخیره شد");
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

    const getDurationUnitLabel = (value) => {
        const found = DURATION_UNIT_OPTIONS.find(opt => opt.value === value);
        return found?.label || value;
    };

    const getCertificateLabel = (value) => {
        const found = CERTIFICATE_OPTIONS.find(opt => opt.value === String(value));
        return found?.label || "نامشخص";
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
                    {editingIndex !== null ? "ویرایش دوره" : "افزودن دوره جدید"}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* نام موسسه */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">نام موسسه</label>
                        <input
                            type="text"
                            value={formData.institution_name}
                            onChange={(e) => handleFormChange("institution_name", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="نام موسسه"
                        />
                    </div>

                    {/* نام دوره */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">نام دوره</label>
                        <input
                            type="text"
                            value={formData.course_name}
                            onChange={(e) => handleFormChange("course_name", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="نام دوره"
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

                    {/* مدت دوره */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">مدت دوره</label>
                        <input
                            type="number"
                            value={formData.duration}
                            onChange={(e) => handleFormChange("duration", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="مثلاً: ۳"
                            min={0}
                        />
                    </div>

                    {/* واحد مدت */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">واحد مدت</label>
                        <select
                            value={formData.duration_unit}
                            onChange={(e) => handleFormChange("duration_unit", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                        >
                            <option value="">انتخاب واحد</option>
                            {DURATION_UNIT_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* گواهینامه */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">گواهینامه</label>
                        <select
                            value={formData.has_certificate}
                            onChange={(e) => handleFormChange("has_certificate", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                        >
                            {CERTIFICATE_OPTIONS.map(opt => (
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

            {/* ===== لیست دوره‌ها ===== */}
            {courseList.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 grid grid-cols-12 gap-2 text-xs font-bold text-gray-600">
                        <div className="col-span-2">موسسه</div>
                        <div className="col-span-2">دوره</div>
                        <div className="col-span-2">شروع</div>
                        <div className="col-span-2">پایان</div>
                        <div className="col-span-2">مدت</div>
                        <div className="col-span-1">گواهی</div>
                        <div className="col-span-1 text-center">عملیات</div>
                    </div>
                    
                    {courseList.map((item, index) => (
                        <div key={item.id || index} className="px-4 py-3 border-b last:border-b-0 grid grid-cols-12 gap-2 hover:bg-gray-50 items-center">
                            <div className="col-span-2 text-sm truncate">{item.institution_name}</div>
                            <div className="col-span-2 text-sm truncate">{item.course_name}</div>
                            <div className="col-span-2 text-sm">{item.start_date || "-"}</div>
                            <div className="col-span-2 text-sm">{item.end_date || "-"}</div>
                            <div className="col-span-2 text-sm">
                                {item.duration ? `${item.duration} ${getDurationUnitLabel(item.duration_unit)}` : "-"}
                            </div>
                            <div className="col-span-1 text-sm">{getCertificateLabel(item.has_certificate)}</div>
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
                    <p>هیچ دوره‌ای ثبت نشده است</p>
                    <p className="text-sm">با استفاده از فرم بالا دوره جدید اضافه کنید</p>
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