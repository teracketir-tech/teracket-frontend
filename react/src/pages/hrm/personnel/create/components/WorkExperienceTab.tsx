// src/pages/hrm/personnel/create/components/WorkExperienceTab.jsx

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import Button from "@/components/shared/Button";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Plus, Trash2 } from "lucide-react";

export default function WorkExperienceTab({ user, onNext, onPrev, isFirst, isLast }) {
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [experienceList, setExperienceList] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);

    const [formData, setFormData] = useState({
        company_name: "",
        position: "",
        start_date: "",
        end_date: "",
        job_description: "",
    });

    useEffect(() => {
        if (user?.id) {
            loadUserData(user.id);
        } else {
            setExperienceList([]);
        }
    }, [user]);

    const loadUserData = async (userId) => {
        setLoadingData(true);
        try {
            const res = await api(`hrm-personnel-work-experience/get-by-user?userId=${userId}`, "GET");
            if (res?.success && res?.data) {
                setExperienceList(res.data.map(item => ({
                    ...item,
                    start_date: item.start_date_persian || "",
                    end_date: item.end_date_persian || "",
                })));
            } else {
                setExperienceList([]);
            }
        } catch (error) {
            console.error("Error loading data:", error);
            setExperienceList([]);
        }
        setLoadingData(false);
    };

    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddOrUpdate = () => {
        if (!formData.company_name || !formData.position) {
            toast.error("نام محل خدمت و سمت الزامی است");
            return;
        }

        if (editingIndex !== null) {
            const updatedList = [...experienceList];
            updatedList[editingIndex] = { ...formData };
            setExperienceList(updatedList);
            setEditingIndex(null);
            toast.success("سابقه کار با موفقیت ویرایش شد");
        } else {
            setExperienceList([...experienceList, { ...formData, id: Date.now() }]);
            toast.success("سابقه کار با موفقیت اضافه شد");
        }

        setFormData({
            company_name: "",
            position: "",
            start_date: "",
            end_date: "",
            job_description: "",
        });
    };

    const handleEdit = (index) => {
        setEditingIndex(index);
        setFormData(experienceList[index]);
    };

    const handleDelete = (index) => {
        if (window.confirm("آیا از حذف این سابقه کار اطمینان دارید؟")) {
            const newList = experienceList.filter((_, i) => i !== index);
            setExperienceList(newList);
            if (editingIndex === index) {
                setEditingIndex(null);
                setFormData({
                    company_name: "",
                    position: "",
                    start_date: "",
                    end_date: "",
                    job_description: "",
                });
            }
            toast.success("سابقه کار با موفقیت حذف شد");
        }
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setFormData({
            company_name: "",
            position: "",
            start_date: "",
            end_date: "",
            job_description: "",
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                user_id: user?.id,
                items: experienceList.map(item => ({
                    company_name: item.company_name,
                    position: item.position,
                    start_date: item.start_date || null,
                    end_date: item.end_date || null,
                    job_description: item.job_description || null,
                })),
            };

            const res = await api("hrm-personnel-work-experience/save-all", "POST", payload);
            
            if (res?.success) {
                toast.success("سوابق کار با موفقیت ذخیره شد");
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
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-700 mb-4">
                    {editingIndex !== null ? "ویرایش سابقه کار" : "افزودن سابقه کار جدید"}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">نام محل خدمت</label>
                        <input
                            type="text"
                            value={formData.company_name}
                            onChange={(e) => handleFormChange("company_name", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="نام محل خدمت"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">سمت</label>
                        <input
                            type="text"
                            value={formData.position}
                            onChange={(e) => handleFormChange("position", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="سمت"
                        />
                    </div>

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

                    <div className="col-span-full flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">شرح وظیفه</label>
                        <textarea
                            value={formData.job_description}
                            onChange={(e) => handleFormChange("job_description", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="شرح وظیفه (اختیاری)"
                            rows={3}
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-4">
                    <Button type="button" onClick={handleAddOrUpdate} className="flex items-center gap-2">
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

            {experienceList.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 grid grid-cols-12 gap-2 text-xs font-bold text-gray-600">
                        <div className="col-span-3">محل خدمت</div>
                        <div className="col-span-2">سمت</div>
                        <div className="col-span-2">شروع</div>
                        <div className="col-span-2">پایان</div>
                        <div className="col-span-2">شرح وظیفه</div>
                        <div className="col-span-1 text-center">عملیات</div>
                    </div>
                    
                    {experienceList.map((item, index) => (
                        <div key={item.id || index} className="px-4 py-3 border-b last:border-b-0 grid grid-cols-12 gap-2 hover:bg-gray-50 items-center">
                            <div className="col-span-3 text-sm">{item.company_name}</div>
                            <div className="col-span-2 text-sm">{item.position}</div>
                            <div className="col-span-2 text-sm">{item.start_date || "-"}</div>
                            <div className="col-span-2 text-sm">{item.end_date || "-"}</div>
                            <div className="col-span-2 text-sm truncate">{item.job_description || "-"}</div>
                            <div className="col-span-1 flex items-center justify-center gap-1">
                                <button onClick={() => handleEdit(index)} className="text-blue-500 hover:text-blue-700 text-sm p-1">✎</button>
                                <button onClick={() => handleDelete(index)} className="text-red-500 hover:text-red-700 text-sm p-1">✕</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg">
                    <p>هیچ سابقه کاری ثبت نشده است</p>
                </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t mt-6">
                <Button type="button" variant="secondary" onClick={onPrev} disabled={isFirst} className="flex items-center gap-2">قبلی</Button>
                <Button type="button" onClick={handleSubmit} isLoading={loading} disabled={loading} className="flex items-center gap-2">
                    {isLast ? "ثبت نهایی" : "ذخیره و ادامه"}
                </Button>
            </div>
        </div>
    );
}