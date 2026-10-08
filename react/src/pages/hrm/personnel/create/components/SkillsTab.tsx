// src/pages/hrm/personnel/create/components/SkillsTab.jsx

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import Button from "@/components/shared/Button";
import { Plus, Trash2 } from "lucide-react";

const LEVEL_OPTIONS = [
    { value: "excellent", label: "عالی" },
    { value: "good", label: "خوب" },
    { value: "average", label: "متوسط" },
    { value: "weak", label: "ضعیف" },
];

export default function SkillsTab({ user, onNext, onPrev, isFirst, isLast }) {
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [skillList, setSkillList] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);

    const [formData, setFormData] = useState({
        skill_title: "",
        skill_level: "",
        skill_description: "",
    });

    useEffect(() => {
        if (user?.id) {
            loadUserData(user.id);
        } else {
            setSkillList([]);
        }
    }, [user]);

    const loadUserData = async (userId) => {
        setLoadingData(true);
        try {
            const res = await api(`hrm-personnel-skill/get-by-user?userId=${userId}`, "GET");
            if (res?.success && res?.data) {
                setSkillList(res.data);
            } else {
                setSkillList([]);
            }
        } catch (error) {
            console.error("Error loading data:", error);
            setSkillList([]);
        }
        setLoadingData(false);
    };

    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddOrUpdate = () => {
        if (!formData.skill_title) {
            toast.error("عنوان مهارت الزامی است");
            return;
        }

        if (editingIndex !== null) {
            const updatedList = [...skillList];
            updatedList[editingIndex] = { ...formData };
            setSkillList(updatedList);
            setEditingIndex(null);
            toast.success("مهارت با موفقیت ویرایش شد");
        } else {
            setSkillList([...skillList, { ...formData, id: Date.now() }]);
            toast.success("مهارت با موفقیت اضافه شد");
        }

        setFormData({
            skill_title: "",
            skill_level: "",
            skill_description: "",
        });
    };

    const handleEdit = (index) => {
        setEditingIndex(index);
        setFormData(skillList[index]);
    };

    const handleDelete = (index) => {
        if (window.confirm("آیا از حذف این مهارت اطمینان دارید؟")) {
            const newList = skillList.filter((_, i) => i !== index);
            setSkillList(newList);
            if (editingIndex === index) {
                setEditingIndex(null);
                setFormData({
                    skill_title: "",
                    skill_level: "",
                    skill_description: "",
                });
            }
            toast.success("مهارت با موفقیت حذف شد");
        }
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setFormData({
            skill_title: "",
            skill_level: "",
            skill_description: "",
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                user_id: user?.id,
                items: skillList.map(item => ({
                    skill_title: item.skill_title,
                    skill_level: item.skill_level || null,
                    skill_description: item.skill_description || null,
                })),
            };

            const res = await api("hrm-personnel-skill/save-all", "POST", payload);
            
            if (res?.success) {
                toast.success("توانایی و مهارت با موفقیت ذخیره شد");
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
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-700 mb-4">
                    {editingIndex !== null ? "ویرایش مهارت" : "افزودن مهارت جدید"}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">عنوان مهارت</label>
                        <input
                            type="text"
                            value={formData.skill_title}
                            onChange={(e) => handleFormChange("skill_title", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="عنوان مهارت"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">سطح مهارت</label>
                        <select
                            value={formData.skill_level}
                            onChange={(e) => handleFormChange("skill_level", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                        >
                            <option value="">انتخاب سطح</option>
                            {LEVEL_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-span-full flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">توضیح مهارت</label>
                        <textarea
                            value={formData.skill_description}
                            onChange={(e) => handleFormChange("skill_description", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="توضیح مهارت (اختیاری)"
                            rows={2}
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

            {skillList.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 grid grid-cols-12 gap-2 text-xs font-bold text-gray-600">
                        <div className="col-span-4">عنوان مهارت</div>
                        <div className="col-span-3">سطح</div>
                        <div className="col-span-4">توضیح</div>
                        <div className="col-span-1 text-center">عملیات</div>
                    </div>
                    
                    {skillList.map((item, index) => (
                        <div key={item.id || index} className="px-4 py-3 border-b last:border-b-0 grid grid-cols-12 gap-2 hover:bg-gray-50 items-center">
                            <div className="col-span-4 text-sm font-medium">{item.skill_title}</div>
                            <div className="col-span-3 text-sm">{getLevelLabel(item.skill_level) || "-"}</div>
                            <div className="col-span-4 text-sm truncate">{item.skill_description || "-"}</div>
                            <div className="col-span-1 flex items-center justify-center gap-1">
                                <button onClick={() => handleEdit(index)} className="text-blue-500 hover:text-blue-700 text-sm p-1">✎</button>
                                <button onClick={() => handleDelete(index)} className="text-red-500 hover:text-red-700 text-sm p-1">✕</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg">
                    <p>هیچ مهارتی ثبت نشده است</p>
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