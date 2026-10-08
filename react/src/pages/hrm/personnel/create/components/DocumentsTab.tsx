// src/pages/hrm/personnel/create/components/DocumentsTab.jsx

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import Button from "@/components/shared/Button";
import { Plus, Trash2, Upload, File, Eye } from "lucide-react";

// ============== فیلدهای استاندارد ==============
const STANDARD_FIELDS = [
    { key: "photo", label: "عکس پرسنلی", accept: "image/*" },
    { key: "signature", label: "امضای الکترونیکی", accept: "image/*" },
    { key: "birth_certificate", label: "شناسنامه", accept: "image/*,application/pdf" },
    { key: "national_card", label: "کارت ملی", accept: "image/*,application/pdf" },
    { key: "health_certificate", label: "گواهی سلامت", accept: "image/*,application/pdf" },
    { key: "education_document_1", label: "مدرک تحصیلی (پیام نور)", accept: "image/*,application/pdf" },
    { key: "education_document_2", label: "مدرک تحصیلی (علم و صنعت)", accept: "image/*,application/pdf" },
];

// ============== کامپوننت اصلی ==============
export default function DocumentsTab({ user, onNext, onPrev, isFirst, isLast }) {
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [documents, setDocuments] = useState({});
    const [customDocuments, setCustomDocuments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [newCustomTitle, setNewCustomTitle] = useState("");
    const fileInputRef = useRef(null);

    // ============== بارگذاری اطلاعات ==============
    useEffect(() => {
        if (user?.id) {
            loadUserData(user.id);
        } else {
            setDocuments({});
            setCustomDocuments([]);
        }
    }, [user]);

    const loadUserData = async (userId) => {
        setLoadingData(true);
        try {
            const res = await api(`hrm-personnel-document/get-by-user?userId=${userId}`, "GET");
            
            if (res?.success && res?.data) {
                const data = res.data;
                const standardDocs = {};
                STANDARD_FIELDS.forEach(field => {
                    standardDocs[field.key] = data[field.key] || null;
                });
                setDocuments(standardDocs);
                setCustomDocuments(data.custom_documents || []);
            } else {
                setDocuments({});
                setCustomDocuments([]);
            }
        } catch (error) {
            console.error("Error loading data:", error);
            setDocuments({});
            setCustomDocuments([]);
        }
        setLoadingData(false);
    };

    // ============== آپلود فایل ==============
    const handleUpload = async (field, file) => {
        if (!user?.id) {
            toast.error("لطفاً ابتدا یک پرسنل انتخاب کنید");
            return;
        }

        if (!file) {
            toast.error("فایلی انتخاب نشده است");
            return;
        }

        setUploading(true);
        
        const formData = new FormData();
        formData.append("user_id", user.id);
        formData.append("field", field);
        formData.append("file", file);

        try {
            // ✅ ارسال FormData با api - نیازی به تنظیم contentType نیست
            const res = await api(
                "hrm-personnel-document/upload",
                "POST",
                formData,
                false, // fullUrl
                undefined, // responseType
                undefined // contentType - اینجا undefined باشه تا axios خودش تنظیم کنه
            );

            if (res?.success) {
                setDocuments(prev => ({ ...prev, [field]: res.data.file }));
                toast.success(`${STANDARD_FIELDS.find(f => f.key === field)?.label} با موفقیت آپلود شد`);
            } else {
                toast.error(res?.message || "خطا در آپلود فایل");
            }
        } catch (error) {
            console.error("Error uploading:", error);
            toast.error(error?.message || "خطا در آپلود فایل");
        }

        setUploading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // ============== حذف فایل ==============
    const handleDeleteFile = async (field) => {
        if (!window.confirm("آیا از حذف این فایل اطمینان دارید؟")) return;

        try {
            const res = await api("hrm-personnel-document/delete-file", "POST", {
                user_id: user?.id,
                field: field,
            });

            if (res?.success) {
                setDocuments(prev => ({ ...prev, [field]: null }));
                toast.success("فایل با موفقیت حذف شد");
            } else {
                toast.error(res?.message || "خطا در حذف فایل");
            }
        } catch (error) {
            console.error("Error deleting:", error);
            toast.error("خطا در حذف فایل");
        }
    };

    // ============== مدیریت مدارک سفارشی ==============
    const handleAddCustomDocument = () => {
        if (!newCustomTitle.trim()) {
            toast.error("عنوان مدرک را وارد کنید");
            return;
        }

        // ایجاد input file
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,application/pdf';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                handleCustomUpload(file, newCustomTitle);
            }
        };
        input.click();
    };

    const handleCustomUpload = async (file, title) => {
        if (!user?.id) {
            toast.error("لطفاً ابتدا یک پرسنل انتخاب کنید");
            return;
        }

        setUploading(true);
        
        const formData = new FormData();
        formData.append("user_id", user.id);
        formData.append("field", "custom_documents");
        formData.append("file", file);
        formData.append("title", title);

        try {
            const res = await api(
                "hrm-personnel-document/upload",
                "POST",
                formData,
                false,
                undefined,
                undefined // برای FormData contentType نباید تنظیم شود
            );

            if (res?.success) {
                const newDoc = {
                    id: Date.now(),
                    title: title,
                    file: res.data.file,
                };
                setCustomDocuments(prev => [...prev, newDoc]);
                setNewCustomTitle("");
                toast.success("مدرک سفارشی با موفقیت اضافه شد");
            } else {
                toast.error(res?.message || "خطا در آپلود فایل");
            }
        } catch (error) {
            console.error("Error uploading custom:", error);
            toast.error("خطا در آپلود فایل");
        }

        setUploading(false);
    };

    const handleDeleteCustom = async (index) => {
        if (!window.confirm("آیا از حذف این مدرک اطمینان دارید؟")) return;
        
        const newList = customDocuments.filter((_, i) => i !== index);
        setCustomDocuments(newList);
        toast.success("مدرک سفارشی با موفقیت حذف شد");
    };

    // ============== ذخیره نهایی ==============
    const handleSubmit = async () => {
        setLoading(true);
        
        try {
            const payload = {
                user_id: user?.id,
                ...documents,
                custom_documents: customDocuments,
            };

            const res = await api("hrm-personnel-document", "POST", payload);
            
            if (res?.success) {
                toast.success("مدارک با موفقیت ذخیره شد");
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

    // ============== آدرس فایل ==============
    const getFileUrl = (filename) => {
        const baseUrl = import.meta.env.VITE_API_URL || "";
        // حذف /api از انتهای آدرس
        const baseWithoutApi = baseUrl.replace('/hq/', '');
        return `${baseWithoutApi}/uploads/personnel/${filename}`;
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
            {/* ===== مدارک استاندارد ===== */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-700 mb-4">مدارک استاندارد</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {STANDARD_FIELDS.map((field) => (
                        <div key={field.key} className="border rounded-lg p-3 bg-white">
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                                {field.label}
                            </label>
                            
                            {documents[field.key] ? (
                                <div className="flex items-center gap-2">
                                    <div>
                                        <a 
                                        href={getFileUrl(documents[field.key])} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1"
                                    >
                                        <Eye className="w-4 h-4" />
                                        مشاهده  
                                    </a> <br/>
                                    <button
                                        type="button"
                                        style={{cursor:'pointer'}}
                                        onClick={() => handleDeleteFile(field.key)}
                                        className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        حذف
                                    </button>
                                        </div>
                                    <div>
                                        <img src={getFileUrl(documents[field.key])} />
                                      </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept={field.accept}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                handleUpload(field.key, file);
                                            }
                                        }}
                                        className="hidden"
                                        id={`upload_${field.key}`}
                                    />
                                    <label
                                        htmlFor={`upload_${field.key}`}
                                        className="cursor-pointer text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1"
                                    >
                                        <Upload className="w-4 h-4" />
                                        انتخاب فایل
                                    </label>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== مدارک سفارشی ===== */}
            <div className="border rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-700 mb-4">مدارک سفارشی</h4>
                

                {customDocuments.length > 0 ? (
                    <div className="space-y-2">
                        {customDocuments.map((doc, index) => (
                            <div key={doc.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <File className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium">{doc.title}</span>
                                    <a 
                                        href={getFileUrl(doc.file)} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:text-blue-700 text-sm"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </a>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteCustom(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 text-gray-400 text-sm">
                        هیچ مدرک سفارشی ثبت نشده است
                    </div>
                )}
            </div>

            {/* ===== دکمه‌ها ===== */}
            <div className="flex justify-between items-center pt-4 border-t">
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
                    disabled={loading || uploading}
                    className="flex items-center gap-2"
                >
                    {isLast ? "ثبت نهایی" : "ذخیره و ادامه"}
                </Button>
            </div>
        </div>
    );
}