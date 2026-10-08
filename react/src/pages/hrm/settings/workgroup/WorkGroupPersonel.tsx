// src/pages/hrm/settings/workgroup/WorkGroupPersonel.jsx

import { useFormik } from "formik";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import Button from "@/components/shared/Button";
import Select from "@/components/shared/inputs/Select";
import Loading from "@/components/shared/Loading";
import Empty from "@/components/shared/Empty";
import Pagination from "@/components/shared/Pagination";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Trash2Icon, CheckCircle, XCircle, Search, X, UserPlus, User, Save } from "lucide-react";
import Confirm from "@/components/ui/confirm";
import { checkAccess } from "@/lib/utils";

const validationSchema = yup.object({
    workgroup_id: yup.string().required("انتخاب گروه کاری الزامی است"),
    bakhsh_id: yup.string().required("انتخاب بخش الزامی است"),
    ghesmat_id: yup.string().required("انتخاب قسمت الزامی است"),
    onvan_id: yup.string().required("انتخاب عنوان الزامی است"),
});

export default function WorkGroupPersonel() {
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [contracts, setContracts] = useState([]);
    const [users, setUsers] = useState([]);
    const [workgroups, setWorkgroups] = useState([]);
    const [bakhshs, setBakhshs] = useState([]);
    const [ghesmats, setGhesmats] = useState([]);
    const [onvans, setOnvans] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedContract, setSelectedContract] = useState(null);
    const [editingContractId, setEditingContractId] = useState(null);
    const [selectedWorkgroup, setSelectedWorkgroup] = useState("");
    const [selectedBakhsh, setSelectedBakhsh] = useState("");
    const [selectedGhesmat, setSelectedGhesmat] = useState("");
    const [personnelCodeSearch, setPersonnelCodeSearch] = useState("");
    const [loadingOptions, setLoadingOptions] = useState(true);

    // ===== دریافت لیست کاربران =====
    const fetchUsers = async () => {
        try {
            const res = await api("user?per-page=100", "GET");
            if (res?.data) {
                setUsers(res.data);
                console.log("✅ Users loaded:", res.data.length);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("خطا در دریافت لیست کاربران");
        }
    };

    // ===== دریافت لیست گروه‌های کاری =====
    const fetchWorkgroups = async () => {
        try {
            const res = await api("hrm-workgroup/items", "GET");
            if (res?.success) {
                setWorkgroups(res.data);
                console.log("✅ Workgroups loaded:", res.data.length);
            }
        } catch (error) {
            console.error("Error fetching workgroups:", error);
            toast.error("خطا در دریافت لیست گروه‌های کاری");
        }
    };

    // ===== بارگذاری اولیه =====
    useEffect(() => {
        const loadInitialData = async () => {
            setLoadingOptions(true);
            await Promise.all([fetchUsers(), fetchWorkgroups()]);
            setLoadingOptions(false);
        };
        loadInitialData();
    }, []);

    // ===== دریافت بخش‌ها =====
    const fetchBakhshs = async (workgroupId) => {
        if (!workgroupId) {
            setBakhshs([]);
            return;
        }
        try {
            const res = await api(`hrm-workgroup-bakhsh/items?workgroupId=${workgroupId}`, "GET");
            if (res?.success) setBakhshs(res.data);
        } catch (error) {
            console.error("Error fetching bakhshs:", error);
        }
    };

    // ===== دریافت قسمت‌ها =====
    const fetchGhesmats = async (bakhshId) => {
        if (!bakhshId) {
            setGhesmats([]);
            return;
        }
        try {
            const res = await api(`hrm-workgroup-ghesmat/items?bakhshId=${bakhshId}`, "GET");
            if (res?.success) setGhesmats(res.data);
        } catch (error) {
            console.error("Error fetching ghesmats:", error);
        }
    };

    // ===== دریافت عناوین =====
    const fetchOnvans = async (ghesmatId) => {
        if (!ghesmatId) {
            setOnvans([]);
            return;
        }
        try {
            const res = await api(`hrm-workgroup-onvan/items?ghesmatId=${ghesmatId}`, "GET");
            if (res?.success) setOnvans(res.data);
        } catch (error) {
            console.error("Error fetching onvans:", error);
        }
    };

    // ===== دریافت قراردادهای کاربر =====
    const fetchUserContracts = async (userId) => {
        if (!userId) {
            setContracts([]);
            return;
        }
        try {
            setListLoading(true);
            const res = await api(`hrm-contract?user_id=${userId}`, "GET");
            if (res?.data) {
                setContracts(res.data);
                console.log("✅ Contracts loaded:", res.data.length);
            } else {
                setContracts([]);
            }
        } catch (error) {
            console.error("Error fetching contracts:", error);
            setContracts([]);
            toast.error("خطا در دریافت قراردادها");
        } finally {
            setListLoading(false);
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
                formik.setFieldValue("personnel_code", user.personnel_code || personnelCodeSearch);
                await fetchUserContracts(user.id);
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
                        formik.setFieldValue("personnel_code", personnelCodeSearch);
                        await fetchUserContracts(user.id);
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

    // ===== دریافت اطلاعات کاربر برای کد پرسنلی =====
    const fetchUserPersonnelCode = async (userId) => {
        if (!userId) return null;
        
        try {
            const user = users.find(u => String(u.id) === userId);
            if (user?.personnel_code) {
                return user.personnel_code;
            }
            
            const res = await api(`hrm-personnel-basic/get-by-user?userId=${userId}`, "GET");
            if (res?.success && res?.data?.personnel_code) {
                return res.data.personnel_code;
            }
            
            return null;
        } catch (error) {
            console.error("Error fetching personnel code:", error);
            return null;
        }
    };

    // ===== انتخاب کاربر از لیست =====
    const handleUserSelect = async (selectedOption) => {
        const userId = selectedOption || "";
        formik.setFieldValue("user_id", userId);
        
        if (userId) {
            const user = users.find(u => String(u.id) === userId);
            setSelectedUser(user);
            if (user?.personnel_code) {
                formik.setFieldValue("personnel_code", user.personnel_code);
                setPersonnelCodeSearch(user.personnel_code);
            }
            await fetchUserContracts(userId);
        } else {
            setSelectedUser(null);
            setContracts([]);
            formik.setFieldValue("personnel_code", "");
            setPersonnelCodeSearch("");
        }
        // ریست فرم انتخاب گروه کاری
        setSelectedContract(null);
        setEditingContractId(null);
        formik.setFieldValue("workgroup_id", "");
        formik.setFieldValue("bakhsh_id", "");
        formik.setFieldValue("ghesmat_id", "");
        formik.setFieldValue("onvan_id", "");
        setSelectedWorkgroup("");
        setSelectedBakhsh("");
        setSelectedGhesmat("");
    };

    // ===== تغییر دستی کد پرسنلی =====
    const handlePersonnelCodeChange = (e) => {
        const value = e.target.value;
        setPersonnelCodeSearch(value);
        formik.setFieldValue("personnel_code", value);
        
        if (selectedUser) {
            setSelectedUser(null);
            setContracts([]);
            formik.setFieldValue("user_id", "");
        }
    };

    // ===== انتخاب قرارداد برای ویرایش گروه کاری =====
    const handleSelectContract = (contract) => {
        setSelectedContract(contract);
        setEditingContractId(contract.id);
        
        formik.setValues({
            ...formik.values,
            workgroup_id: contract.workgroup_id || "",
            bakhsh_id: contract.bakhsh_id || "",
            ghesmat_id: contract.ghesmat_id || "",
            onvan_id: contract.onvan_id || "",
        });
        
        // بارگذاری بخش‌ها، قسمت‌ها و عناوین مربوطه
        if (contract.workgroup_id) {
            setSelectedWorkgroup(String(contract.workgroup_id));
            fetchBakhshs(contract.workgroup_id);
        } else {
            setSelectedWorkgroup("");
            setBakhshs([]);
        }
        if (contract.bakhsh_id) {
            setSelectedBakhsh(String(contract.bakhsh_id));
            fetchGhesmats(contract.bakhsh_id);
        } else {
            setSelectedBakhsh("");
            setGhesmats([]);
        }
        if (contract.ghesmat_id) {
            setSelectedGhesmat(String(contract.ghesmat_id));
            fetchOnvans(contract.ghesmat_id);
        } else {
            setSelectedGhesmat("");
            setOnvans([]);
        }
    };

    const formik = useFormik({
        initialValues: {
            user_id: "",
            personnel_code: "",
            workgroup_id: "",
            bakhsh_id: "",
            ghesmat_id: "",
            onvan_id: "",
        },
        validationSchema,
        onSubmit: handleSubmit,
    });

    // ===== ذخیره گروه کاری برای قرارداد =====
    async function handleSubmit(values) {
        if (!selectedContract) {
            toast.warning("لطفاً ابتدا یک قرارداد را انتخاب کنید");
            return;
        }

        setLoading(true);

        const res = await api(`hrm-contract/${selectedContract.id}/update-work-group`, "POST", {
            workgroup_id: parseInt(values.workgroup_id) || null,
            bakhsh_id: parseInt(values.bakhsh_id) || null,
            ghesmat_id: parseInt(values.ghesmat_id) || null,
            onvan_id: parseInt(values.onvan_id) || null,
        });

        setLoading(false);

        if (res?.success) {
            toast.success("گروه کاری با موفقیت به قرارداد اختصاص یافت");
            // به‌روزرسانی لیست قراردادها
            if (selectedUser) {
                await fetchUserContracts(selectedUser.id);
            }
            setEditingContractId(null);
            setSelectedContract(null);
            formik.setValues({
                ...formik.values,
                workgroup_id: "",
                bakhsh_id: "",
                ghesmat_id: "",
                onvan_id: "",
            });
            setSelectedWorkgroup("");
            setSelectedBakhsh("");
            setSelectedGhesmat("");
        } else {
            toast.error(res?.message || "خطا در ثبت اطلاعات");
        }
    }

    const userOptions = users.map((item) => ({
        value: String(item.id),
        label: `${item.first_name || ""} ${item.last_name || ""} (${item.phone_number || ""})`,
    }));

    const workgroupOptions = workgroups.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    const bakhshOptions = bakhshs.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    const ghesmatOptions = ghesmats.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    const onvanOptions = onvans.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    const columns = ["ردیف", "شماره قرارداد", "تاریخ شروع", "تاریخ پایان", "تاریخ قطع همکاری", "گروه کاری", "بخش", "قسمت", "عنوان", "عملیات"];

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
                            <span>کد پرسنلی: {formik.values.personnel_code || "---"}</span>
                            <span>موبایل: {selectedUser.phone_number || "---"}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loadingOptions) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loading />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* ===== بخش انتخاب پرسنل ===== */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    انتخاب پرسنل
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                    برای اختصاص گروه کاری به قرارداد، ابتدا پرسنل را پیدا کنید
                </p>

                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-[2]">
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

            {/* ===== لیست قراردادهای کاربر ===== */}
            {selectedUser && (
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-3 py-2 border-b">
                        <span className="text-sm font-semibold">
                            لیست قراردادهای {selectedUser.first_name || ""} {selectedUser.last_name || ""}
                        </span>
                        <span className="text-xs text-gray-500 mr-2">({contracts.length} قرارداد)</span>
                    </div>

                    {listLoading ? (
                        <div className="flex justify-center py-10">
                            <Loading />
                        </div>
                    ) : contracts.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm">
                            <p>هیچ قراردادی برای این کاربر یافت نشد</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <div className="min-w-[1000px]">
                                <div className="grid grid-cols-10 gap-2 px-3 py-2 bg-gray-50 text-xs font-bold text-gray-600 border-b">
                                    {columns.map((col, i) => (
                                        <div key={i} className="flex items-center justify-center">{col}</div>
                                    ))}
                                </div>
                                {contracts.map((contract, index) => {
                                    const isEditing = editingContractId === contract.id;
                                    return (
                                        <div key={contract.id} className={`grid grid-cols-10 gap-2 px-3 py-2 border-b hover:bg-gray-50 ${isEditing ? 'bg-blue-50' : ''}`}>
                                            <div className="flex items-center justify-center text-xs">{index + 1}</div>
                                            <div className="flex items-center justify-center text-xs font-medium">{contract.id}</div>
                                            <div className="flex items-center justify-center text-xs">{contract.contract_from_date_persian || "-"}</div>
                                            <div className="flex items-center justify-center text-xs">{contract.contract_to_date_persian || "-"}</div>
                                            <div className="flex items-center justify-center text-xs">{contract.termination_date_persian || "-"}</div>
                                            <div className="flex items-center justify-center text-xs">{contract.workgroup?.name || "-"}</div>
                                            <div className="flex items-center justify-center text-xs">{contract.bakhsh?.name || "-"}</div>
                                            <div className="flex items-center justify-center text-xs">{contract.ghesmat?.name || "-"}</div>
                                            <div className="flex items-center justify-center text-xs">{contract.onvan?.name || "-"}</div>
                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={() => handleSelectContract(contract)}
                                                    className={`text-xs px-2 py-1 rounded ${isEditing ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                                                >
                                                    {isEditing ? 'در حال ویرایش' : 'انتخاب'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ===== فرم اختصاص گروه کاری به قرارداد ===== */}
            {selectedContract && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="text-sm font-bold text-blue-700 mb-3 flex items-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        اختصاص گروه کاری به قرارداد #{selectedContract.id}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Select
                            name="workgroup_id"
                            title="گروه کاری"
                            formik={formik}
                            options={workgroupOptions}
                            placeholder="انتخاب گروه کاری"
                            required
                            onChange={(selectedOption) => {
                                const value = selectedOption || "";
                                formik.setFieldValue("workgroup_id", value);
                                formik.setFieldValue("bakhsh_id", "");
                                formik.setFieldValue("ghesmat_id", "");
                                formik.setFieldValue("onvan_id", "");
                                setSelectedWorkgroup(value);
                                setSelectedBakhsh("");
                                setSelectedGhesmat("");
                                if (value) {
                                    fetchBakhshs(value);
                                } else {
                                    setBakhshs([]);
                                    setGhesmats([]);
                                    setOnvans([]);
                                }
                            }}
                        />
                        <Select
                            name="bakhsh_id"
                            title="بخش"
                            formik={formik}
                            options={bakhshOptions}
                            placeholder="انتخاب بخش"
                            required
                            onChange={(selectedOption) => {
                                const value = selectedOption || "";
                                formik.setFieldValue("bakhsh_id", value);
                                formik.setFieldValue("ghesmat_id", "");
                                formik.setFieldValue("onvan_id", "");
                                setSelectedBakhsh(value);
                                setSelectedGhesmat("");
                                if (value) {
                                    fetchGhesmats(value);
                                } else {
                                    setGhesmats([]);
                                    setOnvans([]);
                                }
                            }}
                        />
                        <Select
                            name="ghesmat_id"
                            title="قسمت"
                            formik={formik}
                            options={ghesmatOptions}
                            placeholder="انتخاب قسمت"
                            required
                            onChange={(selectedOption) => {
                                const value = selectedOption || "";
                                formik.setFieldValue("ghesmat_id", value);
                                formik.setFieldValue("onvan_id", "");
                                setSelectedGhesmat(value);
                                if (value) {
                                    fetchOnvans(value);
                                } else {
                                    setOnvans([]);
                                }
                            }}
                        />
                        <Select
                            name="onvan_id"
                            title="عنوان (سمت شغلی)"
                            formik={formik}
                            options={onvanOptions}
                            placeholder="انتخاب عنوان"
                            required
                            onChange={(selectedOption) => {
                                formik.setFieldValue("onvan_id", selectedOption || "");
                            }}
                        />
                    </div>
                    <div className="mt-3 flex gap-3">
                        <Button
                            onClick={formik.handleSubmit}
                            isLoading={loading}
                            disabled={!formik.isValid || loading}
                            className="flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            ذخیره گروه کاری
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setEditingContractId(null);
                                setSelectedContract(null);
                                setSelectedWorkgroup("");
                                setSelectedBakhsh("");
                                setSelectedGhesmat("");
                                formik.setValues({
                                    ...formik.values,
                                    workgroup_id: "",
                                    bakhsh_id: "",
                                    ghesmat_id: "",
                                    onvan_id: "",
                                });
                            }}
                        >
                            انصراف
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}