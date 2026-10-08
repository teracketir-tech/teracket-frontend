// src/pages/hrm/finance/account/index.jsx

import { useFormik } from "formik";
import * as yup from "yup";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/inputs";
import Select from "@/components/shared/inputs/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/shared/Loading";
import Empty from "@/components/shared/Empty";
import Pagination from "@/components/shared/Pagination";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PenBox, Trash2Icon, Search, X, User, UserPlus } from "lucide-react";
import Confirm from "@/components/ui/confirm";
import { checkAccess } from "@/lib/utils";

const validationSchema = yup.object({
    user_id: yup.string().required("انتخاب کاربر الزامی است"),
    bank_id: yup.string().required("انتخاب بانک الزامی است"),
    account_number: yup.string().required("شماره حساب الزامی است"),
    sheba_1: yup.string().max(2, "حداکثر 2 کاراکتر"),
    sheba_2: yup.string().max(4, "حداکثر 4 کاراکتر"),
    sheba_3: yup.string().max(4, "حداکثر 4 کاراکتر"),
    sheba_4: yup.string().max(4, "حداکثر 4 کاراکتر"),
    sheba_5: yup.string().max(4, "حداکثر 4 کاراکتر"),
    sheba_6: yup.string().max(4, "حداکثر 4 کاراکتر"),
    sheba_7: yup.string().max(2, "حداکثر 2 کاراکتر"),
    card_1: yup.string().max(4, "حداکثر 4 کاراکتر"),
    card_2: yup.string().max(4, "حداکثر 4 کاراکتر"),
    card_3: yup.string().max(4, "حداکثر 4 کاراکتر"),
    card_4: yup.string().max(4, "حداکثر 4 کاراکتر"),
});

export default function BankAccount() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [banks, setBanks] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [data, setData] = useState({ data: [], pages: 0, totalCount: 0 });
    const [selectedUser, setSelectedUser] = useState(null);
    const [personnelCodeSearch, setPersonnelCodeSearch] = useState("");
    const [filters, setFilters] = useState({
        user_id: searchParams.get("user_id") || "",
        personnel_code: searchParams.get("personnel_code") || "",
        national_code: searchParams.get("national_code") || "",
        bank_id: searchParams.get("bank_id") || "",
    });

    // Refs برای فوکوس خودکار
    const shebaRefs = {
        sheba_1: useRef(),
        sheba_2: useRef(),
        sheba_3: useRef(),
        sheba_4: useRef(),
        sheba_5: useRef(),
        sheba_6: useRef(),
        sheba_7: useRef(),
    };

    const cardRefs = {
        card_1: useRef(),
        card_2: useRef(),
        card_3: useRef(),
        card_4: useRef(),
    };

    const fetchData = async () => {
        const params = new URLSearchParams();
        
        if (filters.user_id) params.set("user_id", filters.user_id);
        if (filters.personnel_code) params.set("personnel_code", filters.personnel_code);
        if (filters.national_code) params.set("national_code", filters.national_code);
        if (filters.bank_id) params.set("bank_id", filters.bank_id);
        
        const page = searchParams.get("page");
        const perPage = searchParams.get("per-page");
        if (page) params.set("page", page);
        if (perPage) params.set("per-page", perPage);
        
        const query = params.toString();
        setListLoading(true);
        try {
            const res = await api(`hrm-bank-account?${query}`, "GET");
            setData(res || { data: [], pages: 0 });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setListLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [searchParams, filters]);

    useEffect(() => {
        fetchOptions();
    }, []);

    const fetchOptions = async () => {
        try {
            const [usersRes, banksRes] = await Promise.all([
                api("user?per-page=100", "GET"),
                api("bank-name?per-page=100", "GET"),
            ]);
            if (usersRes?.data) {
                setUsers(usersRes.data);
            }
            if (banksRes?.data) {
                setBanks(banksRes.data);
            }
        } catch (error) {
            console.error("Error fetching options:", error);
            toast.error("خطا در دریافت اطلاعات");
        }
    };

    // ===== جستجوی کاربر با کد پرسنلی =====
    const searchUserByPersonnelCode = async () => {
        if (!personnelCodeSearch.trim()) {
            toast.warning("لطفاً کد پرسنلی را وارد کنید");
            return;
        }

        try {
            const res = await api(`user?personnel_code=${personnelCodeSearch}`, "GET");
            
            if (res?.data && res.data.length > 0) {
                const user = res.data[0];
                setSelectedUser(user);
                formik.setFieldValue("user_id", String(user.id));
                toast.success(`کاربر ${user.first_name || ""} ${user.last_name || ""} پیدا شد`);
            } else {
                const personnelRes = await api(`hrm-personnel-basic?personnel_code=${personnelCodeSearch}`, "GET");
                if (personnelRes?.data && personnelRes.data.length > 0) {
                    const basic = personnelRes.data[0];
                    const userRes = await api(`user/${basic.user_id}`, "GET");
                    if (userRes?.success && userRes?.data) {
                        const user = userRes.data;
                        setSelectedUser(user);
                        formik.setFieldValue("user_id", String(user.id));
                        toast.success(`کاربر ${user.first_name || ""} ${user.last_name || ""} پیدا شد`);
                    }
                } else {
                    toast.warning("هیچ کاربری با این کد پرسنلی یافت نشد");
                }
            }
        } catch (error) {
            console.error("Error searching user:", error);
            toast.error("خطا در جستجوی کاربر");
        }
    };

    // ===== انتخاب کاربر از لیست =====
    const handleUserSelect = (selectedOption) => {
        const userId = selectedOption || "";
        formik.setFieldValue("user_id", userId);
        
        if (userId) {
            const user = users.find(u => String(u.id) === userId);
            setSelectedUser(user);
            if (user?.personnel_code) {
                setPersonnelCodeSearch(user.personnel_code);
            }
        } else {
            setSelectedUser(null);
            setPersonnelCodeSearch("");
        }
    };

    // ===== تغییر دستی کد پرسنلی =====
    const handlePersonnelCodeChange = (e) => {
        const value = e.target.value;
        setPersonnelCodeSearch(value);
        
        if (selectedUser) {
            setSelectedUser(null);
            formik.setFieldValue("user_id", "");
        }
    };

    // ============== تبدیل شبا به قطعه‌ها ==============
    const splitSheba = (sheba) => {
        if (!sheba) return { sheba_1: '', sheba_2: '', sheba_3: '', sheba_4: '', sheba_5: '', sheba_6: '', sheba_7: '' };
        const clean = sheba.replace(/IR/g, '').replace(/\s/g, '');
        return {
            sheba_1: 'IR',
            sheba_2: clean.substring(0, 4) || '',
            sheba_3: clean.substring(4, 8) || '',
            sheba_4: clean.substring(8, 12) || '',
            sheba_5: clean.substring(12, 16) || '',
            sheba_6: clean.substring(16, 20) || '',
            sheba_7: clean.substring(20, 22) || '',
        };
    };

    // ============== تبدیل قطعه‌های شبا به یک رشته ==============
    const joinSheba = (values) => {
        const parts = [
            values.sheba_2 || '',
            values.sheba_3 || '',
            values.sheba_4 || '',
            values.sheba_5 || '',
            values.sheba_6 || '',
            values.sheba_7 || '',
        ];
        return 'IR' + parts.join('');
    };

    // ============== تبدیل شماره کارت به قطعه‌ها ==============
    const splitCard = (card) => {
        if (!card) return { card_1: '', card_2: '', card_3: '', card_4: '' };
        const clean = card.replace(/\s/g, '');
        return {
            card_1: clean.substring(0, 4) || '',
            card_2: clean.substring(4, 8) || '',
            card_3: clean.substring(8, 12) || '',
            card_4: clean.substring(12, 16) || '',
        };
    };

    // ============== تبدیل قطعه‌های کارت به یک رشته ==============
    const joinCard = (values) => {
        const parts = [
            values.card_1 || '',
            values.card_2 || '',
            values.card_3 || '',
            values.card_4 || '',
        ];
        return parts.join('');
    };

    const formik = useFormik({
        initialValues: {
            user_id: "",
            bank_id: "",
            account_number: "",
            sheba_1: "IR",
            sheba_2: "",
            sheba_3: "",
            sheba_4: "",
            sheba_5: "",
            sheba_6: "",
            sheba_7: "",
            card_1: "",
            card_2: "",
            card_3: "",
            card_4: "",
        },
        validationSchema,
        onSubmit: handleSubmit,
        validateOnChange: true,
        validateOnMount: true,
    });

    // ============== مدیریت تغییرات فیلدهای شبا ==============
    const handleShebaChange = (e, field, nextField) => {
        const value = e.target.value.replace(/\D/g, '');
        const maxLength = field === 'sheba_1' || field === 'sheba_7' ? 2 : 4;
        
        if (value.length <= maxLength) {
            formik.setFieldValue(field, value);
            if (value.length === maxLength && nextField && shebaRefs[nextField]?.current) {
                shebaRefs[nextField].current.focus();
            }
        }
    };

    // ============== مدیریت تغییرات فیلدهای کارت ==============
    const handleCardChange = (e, field, nextField) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 4) {
            formik.setFieldValue(field, value);
            if (value.length === 4 && nextField && cardRefs[nextField]?.current) {
                cardRefs[nextField].current.focus();
            }
        }
    };

    // ============== مدیریت کیبورد (Backspace) ==============
    const handleKeyDown = (e, field, prevField) => {
        if (e.key === 'Backspace' && e.target.value === '' && prevField) {
            const refs = { ...shebaRefs, ...cardRefs };
            if (refs[prevField]?.current) {
                refs[prevField].current.focus();
            }
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        const shebaParts = splitSheba(item.sheba_number);
        const cardParts = splitCard(item.card_number);
        
        formik.setValues({
            user_id: item.user_id || "",
            bank_id: item.bank_id || "",
            account_number: item.account_number || "",
            sheba_1: shebaParts.sheba_1 || "IR",
            sheba_2: shebaParts.sheba_2 || "",
            sheba_3: shebaParts.sheba_3 || "",
            sheba_4: shebaParts.sheba_4 || "",
            sheba_5: shebaParts.sheba_5 || "",
            sheba_6: shebaParts.sheba_6 || "",
            sheba_7: shebaParts.sheba_7 || "",
            card_1: cardParts.card_1 || "",
            card_2: cardParts.card_2 || "",
            card_3: cardParts.card_3 || "",
            card_4: cardParts.card_4 || "",
        });
        
        // پیدا کردن کاربر انتخاب شده
        const user = users.find(u => String(u.id) === item.user_id);
        if (user) {
            setSelectedUser(user);
            if (user.personnel_code) {
                setPersonnelCodeSearch(user.personnel_code);
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        formik.resetForm();
        setSelectedUser(null);
        setPersonnelCodeSearch("");
    };

    async function handleSubmit(values) {
        setLoading(true);

        const shebaNumber = joinSheba(values);
        const cardNumber = joinCard(values);

        const url = editingItem 
            ? `hrm-bank-account/${editingItem.id}` 
            : "hrm-bank-account";

        const res = await api(url, editingItem ? "PATCH" : "POST", {
            user_id: parseInt(values.user_id),
            bank_id: parseInt(values.bank_id),
            account_number: values.account_number,
            sheba_number: shebaNumber,
            card_number: cardNumber,
        });

        setLoading(false);

        if (res?.success) {
            toast.success(editingItem ? "حساب بانکی با موفقیت ویرایش شد" : "حساب بانکی با موفقیت ثبت شد");
            setEditingItem(null);
            formik.resetForm();
            setSelectedUser(null);
            setPersonnelCodeSearch("");
            fetchData();
        } else {
            toast.error(res?.message || "خطا در ثبت اطلاعات");
        }
    }

    const handleDelete = async (id) => {
        const res = await api(`hrm-bank-account/${id}`, "DELETE");
        if (res?.success) {
            toast.success("حساب بانکی با موفقیت حذف شد");
            fetchData();
        } else {
            toast.error(res?.message || "خطا در حذف");
        }
    };

    // ============== مدیریت فیلترها ==============
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFilterSelectChange = (name, selectedOption) => {
        setFilters(prev => ({
            ...prev,
            [name]: selectedOption|| "",
        }));
    };

    const handleSearch = () => {
        fetchData();
    };

    const handleClearFilters = () => {
        setFilters({
            user_id: "",
            personnel_code: "",
            national_code: "",
            bank_id: "",
        });
        setSearchParams({});
    };

    const userOptions = users.map((item) => ({
        value: String(item.id),
        label: `${item.first_name || ""} ${item.last_name || ""}`.trim() || item.phone_number || `کاربر ${item.id}`,
    }));

    const bankOptions = banks.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    const columns = ["ردیف", "کد پرسنلی", "نام و نام خانوادگی", "گروه کاری", "نام بانک", "شماره حساب", "شماره شبا", "شماره کارت", "تاریخ ثبت"];

    const inputStyle = "px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-left bg-white";

    // ===== نمایش اطلاعات کاربر انتخاب شده =====
    const renderSelectedUser = () => {
        if (!selectedUser) return null;
        return (
            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">
                        {selectedUser.first_name?.[0] || selectedUser.last_name?.[0] || '?'}
                    </div>
                    <div>
                        <p className="font-medium text-green-800">
                            {selectedUser.first_name || ""} {selectedUser.last_name || ""}
                        </p>
                        <div className="flex gap-3 text-xs text-green-600">
                            <span>کد پرسنلی: {selectedUser.personnel_code || "---"}</span>
                            <span>موبایل: {selectedUser.phone_number || "---"}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full space-y-4">
            {/* فرم ثبت/ویرایش */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{editingItem ? "ویرایش حساب بانکی" : "ثبت حساب بانکی"}</CardTitle>
                </CardHeader>

                <CardContent>
                    {/* ===== بخش انتخاب پرسنل ===== */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-5">
                        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            انتخاب پرسنل
                        </h3>
                      
                        <div className="flex flex-col md:flex-row gap-3">
                         

                            <div className="flex-[2]">
                                     <p className="text-xs text-gray-500 mb-3">
                            پرسنل را با کد پرسنلی جستجو یا از لیست انتخاب کنید
                        </p>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={personnelCodeSearch}
                                            onChange={handlePersonnelCodeChange}
                                            placeholder="کد پرسنلی را وارد کنید..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <Button onClick={searchUserByPersonnelCode} className="flex items-center gap-2">
                                            <Search className="w-4 h-4" />
                                            جستجو
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-[3]">
                                <Select
                                    name="user_id"
                                    title="انتخاب کاربر از لیست"
                                    value={userOptions.find(opt => opt.value === formik.values.user_id) || null}
                                    onChange={handleUserSelect}
                                    options={userOptions}
                                    placeholder="انتخاب پرسنل"
                                    isClearable
                                />
                            </div>
                        </div>

                        {renderSelectedUser()}
                    </div>

                    {/* ===== اطلاعات بانکی ===== */}
                    {selectedUser && (
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Select
                                name="bank_id"
                                title="نام بانک"
                                formik={formik}
                                options={bankOptions}
                                placeholder="انتخاب بانک"
                                required
                            />

                            <Input
                                type="text"
                                name="account_number"
                                title="شماره حساب"
                                formik={formik}
                                placeholder="شماره حساب"
                                required
                            />

                            {/* ========== شماره شبا ========== */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    شماره شبا
                                </label>
                                <div style={{direction:'ltr'}} className="flex items-center gap-1">
                                    <span className="px-2 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm font-bold">IR</span>
                                    <span className="text-gray-400">-</span>
                                    <input ref={shebaRefs.sheba_2} type="text" value={formik.values.sheba_2} onChange={(e) => handleShebaChange(e, 'sheba_2', 'sheba_3')} onKeyDown={(e) => handleKeyDown(e, 'sheba_2', null)} maxLength="4" className={`${inputStyle} w-12 text-center`} placeholder="____" dir="ltr" />
                                    <span className="text-gray-400">-</span>
                                    <input ref={shebaRefs.sheba_3} type="text" value={formik.values.sheba_3} onChange={(e) => handleShebaChange(e, 'sheba_3', 'sheba_4')} onKeyDown={(e) => handleKeyDown(e, 'sheba_3', 'sheba_2')} maxLength="4" className={`${inputStyle} w-12 text-center`} placeholder="____" dir="ltr" />
                                    <span className="text-gray-400">-</span>
                                    <input ref={shebaRefs.sheba_4} type="text" value={formik.values.sheba_4} onChange={(e) => handleShebaChange(e, 'sheba_4', 'sheba_5')} onKeyDown={(e) => handleKeyDown(e, 'sheba_4', 'sheba_3')} maxLength="4" className={`${inputStyle} w-12 text-center`} placeholder="____" dir="ltr" />
                                    <span className="text-gray-400">-</span>
                                    <input ref={shebaRefs.sheba_5} type="text" value={formik.values.sheba_5} onChange={(e) => handleShebaChange(e, 'sheba_5', 'sheba_6')} onKeyDown={(e) => handleKeyDown(e, 'sheba_5', 'sheba_4')} maxLength="4" className={`${inputStyle} w-12 text-center`} placeholder="____" dir="ltr" />
                                    <span className="text-gray-400">-</span>
                                    <input ref={shebaRefs.sheba_6} type="text" value={formik.values.sheba_6} onChange={(e) => handleShebaChange(e, 'sheba_6', 'sheba_7')} onKeyDown={(e) => handleKeyDown(e, 'sheba_6', 'sheba_5')} maxLength="4" className={`${inputStyle} w-12 text-center`} placeholder="____" dir="ltr" />
                                    <span className="text-gray-400">-</span>
                                    <input ref={shebaRefs.sheba_7} type="text" value={formik.values.sheba_7} onChange={(e) => handleShebaChange(e, 'sheba_7', null)} onKeyDown={(e) => handleKeyDown(e, 'sheba_7', 'sheba_6')} maxLength="2" className={`${inputStyle} w-8 text-center`} placeholder="__" dir="ltr" />
                                </div>
                            </div>

                            {/* ========== شماره کارت ========== */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    شماره کارت
                                </label>
                                <div style={{direction:'ltr'}} className="flex items-center gap-1">
                                    <input ref={cardRefs.card_1} type="text" value={formik.values.card_1} onChange={(e) => handleCardChange(e, 'card_1', 'card_2')} onKeyDown={(e) => handleKeyDown(e, 'card_1', null)} maxLength="4" className={`${inputStyle} w-12 text-center`} placeholder="____" dir="ltr" />
                                    <span className="text-gray-400">-</span>
                                    <input ref={cardRefs.card_2} type="text" value={formik.values.card_2} onChange={(e) => handleCardChange(e, 'card_2', 'card_3')} onKeyDown={(e) => handleKeyDown(e, 'card_2', 'card_1')} maxLength="4" className={`${inputStyle} w-12 text-center`} placeholder="____" dir="ltr" />
                                    <span className="text-gray-400">-</span>
                                    <input ref={cardRefs.card_3} type="text" value={formik.values.card_3} onChange={(e) => handleCardChange(e, 'card_3', 'card_4')} onKeyDown={(e) => handleKeyDown(e, 'card_3', 'card_2')} maxLength="4" className={`${inputStyle} w-12 text-center`} placeholder="____" dir="ltr" />
                                    <span className="text-gray-400">-</span>
                                    <input ref={cardRefs.card_4} type="text" value={formik.values.card_4} onChange={(e) => handleCardChange(e, 'card_4', null)} onKeyDown={(e) => handleKeyDown(e, 'card_4', 'card_3')} maxLength="4" className={`${inputStyle} w-12 text-center`} placeholder="____" dir="ltr" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 mt-5">
                        <Button
                            onClick={formik.handleSubmit}
                            isLoading={loading}
                            disabled={!formik.isValid || loading || !selectedUser}
                        >
                            {editingItem ? "ویرایش" : "ثبت"}
                        </Button>
                        {editingItem && (
                            <Button variant="secondary" onClick={handleCancelEdit}>
                                انصراف
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* ============== فیلترها ============== */}
            <Card className="w-full">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">جستجو در حساب‌های بانکی</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                       
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                نام پرسنل
                            </label>
                            <Select
                                name="user_id"
                                value={userOptions.find(opt => opt.value === filters.user_id) || null}
                                onChange={(opt) => handleFilterSelectChange("user_id", opt)}
                                options={userOptions}
                                placeholder="همه پرسنل"
                                isClearable
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                کد پرسنلی
                            </label>
                            <input
                                type="text"
                                name="personnel_code"
                                value={filters.personnel_code || ""}
                                onChange={handleFilterChange}
                                placeholder="کد پرسنلی"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>


                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                کد ملی
                            </label>
                            <input
                                type="text"
                                name="national_code"
                                value={filters.national_code || ""}
                                onChange={handleFilterChange}
                                placeholder="کد ملی"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                نام بانک
                            </label>
                            <Select
                                name="bank_id"
                                value={bankOptions.find(opt => opt.value === filters.bank_id) || null}
                                onChange={(opt) => handleFilterSelectChange("bank_id", opt)}
                                options={bankOptions}
                                placeholder="همه بانک‌ها"
                                isClearable
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <Button onClick={handleSearch} className="flex items-center gap-2">
                            <Search className="w-4 h-4" />
                            جستجو
                        </Button>
                        <Button variant="secondary" onClick={handleClearFilters} className="flex items-center gap-2">
                            <X className="w-4 h-4" />
                            پاک کردن
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* ============== لیست ============== */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>لیست حساب‌های بانکی</CardTitle>
                </CardHeader>

                <CardContent>
                    {listLoading ? (
                        <div className="flex justify-center py-10">
                            <Loading />
                        </div>
                    ) : data?.data?.length === 0 ? (
                        <Empty />
                    ) : (
                        <>
                            <div className="w-full overflow-x-auto">
                                <div className="min-w-[1200px]">
                                    <div className="w-full grid grid-cols-9 gap-2 p-3 bg-gray-100 rounded-t-md">
                                        {columns.map((col, i) => (
                                            <div key={i} className="flex items-center justify-center">
                                                <span className="text-xs font-bold text-gray-600">{col}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col border-x border-b rounded-b-md">
                                        {data.data.map((item, index) => {
                                            const formatSheba = (sheba) => {
                                                if (!sheba) return "-";
                                                const clean = sheba.replace(/IR/g, '').replace(/\s/g, '');
                                                if (clean.length <= 2) return sheba;
                                                const parts = [];
                                                for (let i = 0; i < clean.length; i += 4) {
                                                    parts.push(clean.substring(i, i + 4));
                                                }
                                                return 'IR ' + parts.join(' ');
                                            };

                                            const formatCard = (card) => {
                                                if (!card) return "-";
                                                const clean = card.replace(/\s/g, '');
                                                if (clean.length !== 16) return card;
                                                const parts = [];
                                                for (let i = 0; i < clean.length; i += 4) {
                                                    parts.push(clean.substring(i, i + 4));
                                                }
                                                return parts.join(' ');
                                            };

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="w-full grid grid-cols-9 gap-2 px-3 py-3 hover:bg-gray-50 border-b last:border-b-0"
                                                >
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">{index + 1}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">{item?.user?.personnel_code || "-"}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs text-center">
                                                            {item?.user?.first_name || ""} {item?.user?.last_name || ""}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">-</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">{item?.bank?.name || "-"}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">{item.account_number}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs font-mono">{formatSheba(item.sheba_number)}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs font-mono">{formatCard(item.card_number)}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="text-xs">
                                                            {item.created_at ? new Date(item.created_at).toLocaleDateString('fa-IR') : "-"}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <Pagination totalPage={data.pages} />
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}