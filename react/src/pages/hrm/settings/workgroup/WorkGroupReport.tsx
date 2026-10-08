// src/pages/hrm/settings/workgroup/WorkGroupReport.jsx

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/inputs";
import Select from "@/components/shared/inputs/Select";
import Loading from "@/components/shared/Loading";
import Empty from "@/components/shared/Empty";
import Pagination from "@/components/shared/Pagination";
import { Search, X, FileText } from "lucide-react";

export default function WorkGroupReport() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({ data: [], pages: 0, totalCount: 0 });
    const [users, setUsers] = useState([]);
    const [workgroups, setWorkgroups] = useState([]);
    const [bakhshs, setBakhshs] = useState([]);
    const [ghesmats, setGhesmats] = useState([]);
    const [onvans, setOnvans] = useState([]);
    const [contractTypes, setContractTypes] = useState([]);
    const [filters, setFilters] = useState({
        personnel_code: "",
        user_id: "",
        national_code: "",
        contract_type: "",
        workgroup_id: "",
        bakhsh_id: "",
        ghesmat_id: "",
        onvan_id: "",
    });
    const [perPage, setPerPage] = useState("50");
    const [selectedWorkgroup, setSelectedWorkgroup] = useState("");
    const [selectedBakhsh, setSelectedBakhsh] = useState("");
    const [selectedGhesmat, setSelectedGhesmat] = useState("");

    const fetchOptions = async () => {
        try {
            const [usersRes, workgroupsRes, contractTypesRes] = await Promise.all([
                api("user?per-page=100", "GET"),
                api("hrm-workgroup/items", "GET"),
                api("hrm-contract/types", "GET"),
            ]);

            if (usersRes?.data) setUsers(usersRes.data);
            if (workgroupsRes?.success) setWorkgroups(workgroupsRes.data);
            if (contractTypesRes?.data) setContractTypes(contractTypesRes.data);
        } catch (error) {
            console.error("Error fetching options:", error);
            toast.error("خطا در دریافت اطلاعات");
        }
    };

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

    useEffect(() => {
        fetchOptions();
    }, []);

    useEffect(() => {
        if (selectedWorkgroup) {
            fetchBakhshs(selectedWorkgroup);
        } else {
            setBakhshs([]);
            setGhesmats([]);
            setOnvans([]);
        }
    }, [selectedWorkgroup]);

    useEffect(() => {
        if (selectedBakhsh) {
            fetchGhesmats(selectedBakhsh);
        } else {
            setGhesmats([]);
            setOnvans([]);
        }
    }, [selectedBakhsh]);

    useEffect(() => {
        if (selectedGhesmat) {
            fetchOnvans(selectedGhesmat);
        } else {
            setOnvans([]);
        }
    }, [selectedGhesmat]);

    const handleSearch = async () => {
        const params = new URLSearchParams();
        if (filters.personnel_code) params.set("personnel_code", filters.personnel_code);
        if (filters.user_id) params.set("user_id", filters.user_id);
        if (filters.national_code) params.set("national_code", filters.national_code);
        if (filters.contract_type) params.set("contract_type", filters.contract_type);
        if (filters.workgroup_id) params.set("workgroup_id", filters.workgroup_id);
        if (filters.bakhsh_id) params.set("bakhsh_id", filters.bakhsh_id);
        if (filters.ghesmat_id) params.set("ghesmat_id", filters.ghesmat_id);
        if (filters.onvan_id) params.set("onvan_id", filters.onvan_id);
        if (perPage !== "-1") params.set("per-page", perPage);

        setLoading(true);
        try {
            const res = await api(`hrm-workgroup-report?${params.toString()}`, "GET");
            setData(res || { data: [], pages: 0 });
        } catch (error) {
            console.error("Error fetching report:", error);
            toast.error("خطا در دریافت گزارش");
        }
        setLoading(false);
    };

    const handleClearFilters = () => {
        setFilters({
            personnel_code: "",
            user_id: "",
            national_code: "",
            contract_type: "",
            workgroup_id: "",
            bakhsh_id: "",
            ghesmat_id: "",
            onvan_id: "",
        });
        setSelectedWorkgroup("");
        setSelectedBakhsh("");
        setSelectedGhesmat("");
        setData({ data: [], pages: 0, totalCount: 0 });
    };

    // ===== گزینه‌ها =====
    const userOptions = users.map((item) => ({
        value: String(item.id),
        label: `${item.first_name || ""} ${item.last_name || ""}`.trim() || item.phone_number || `کاربر ${item.id}`,
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

    const contractTypeOptions = contractTypes.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));

    const perPageOptions = [
        { value: "-1", label: "همه سطرها" },
        { value: "50", label: "50" },
        { value: "100", label: "100" },
        { value: "200", label: "200" },
        { value: "500", label: "500" },
    ];

    const columns = ["ردیف", "شماره قرارداد", "کد پرسنلی", "نام و نام خانوادگی", "کد ملی", "نوع قرارداد", "گروه کاری", "بخش", "قسمت", "عنوان"];

    return (
        <div className="space-y-4">
            {/* فیلترهای جستجو */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    جستجوی گروه کاری پرسنل
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* کد پرسنلی */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">کد پرسنلی</label>
                        <input
                            type="text"
                            name="personnel_code"
                            value={filters.personnel_code || ""}
                            onChange={(e) => setFilters({ ...filters, personnel_code: e.target.value })}
                            placeholder="کد پرسنلی"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                    </div>

                    {/* نام کارمند */}
                    <Select
                        name="user_id"
                        title="نام کارمند"
                        value={userOptions.find(opt => opt.value === filters.user_id) || null}
                        onChange={(opt) => setFilters({ ...filters, user_id: opt || "" })}
                        options={userOptions}
                        placeholder="همه کارمندان"
                        isClearable
                    />

                    {/* کد ملی */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">کد ملی</label>
                        <input
                            type="text"
                            name="national_code"
                            value={filters.national_code || ""}
                            onChange={(e) => setFilters({ ...filters, national_code: e.target.value })}
                            placeholder="کد ملی"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                    </div>

                    {/* نوع قرارداد */}
                    <Select
                        name="contract_type"
                        title="نوع قرارداد"
                        value={contractTypeOptions.find(opt => opt.value === filters.contract_type) || null}
                        onChange={(opt) => setFilters({ ...filters, contract_type: opt|| "" })}
                        options={contractTypeOptions}
                        placeholder="همه انواع"
                        isClearable
                    />

                    {/* گروه کاری */}
                    <Select
                        name="workgroup_id"
                        title="گروه کاری"
                        value={workgroupOptions.find(opt => opt.value === filters.workgroup_id) || null}
                        onChange={(opt) => {
                            const value = opt|| "";
                            setFilters({ ...filters, workgroup_id: value, bakhsh_id: "", ghesmat_id: "", onvan_id: "" });
                            setSelectedWorkgroup(value);
                            setSelectedBakhsh("");
                            setSelectedGhesmat("");
                        }}
                        options={workgroupOptions}
                        placeholder="همه گروه‌ها"
                        isClearable
                    />

                    {/* بخش گروه کاری */}
                    <Select
                        name="bakhsh_id"
                        title="بخش گروه کاری"
                        value={bakhshOptions.find(opt => opt.value === filters.bakhsh_id) || null}
                        onChange={(opt) => {
                            const value = opt|| "";
                            setFilters({ ...filters, bakhsh_id: value, ghesmat_id: "", onvan_id: "" });
                            setSelectedBakhsh(value);
                            setSelectedGhesmat("");
                        }}
                        options={bakhshOptions}
                        placeholder="همه بخش‌ها"
                        isClearable
                    />

                    {/* قسمت گروه کاری */}
                    <Select
                        name="ghesmat_id"
                        title="قسمت گروه کاری"
                        value={ghesmatOptions.find(opt => opt.value === filters.ghesmat_id) || null}
                        onChange={(opt) => {
                            const value = opt|| "";
                            setFilters({ ...filters, ghesmat_id: value, onvan_id: "" });
                            setSelectedGhesmat(value);
                        }}
                        options={ghesmatOptions}
                        placeholder="همه قسمت‌ها"
                        isClearable
                    />

                    {/* عنوان گروه کاری */}
                    <Select
                        name="onvan_id"
                        title="عنوان گروه کاری"
                        value={onvanOptions.find(opt => opt.value === filters.onvan_id) || null}
                        onChange={(opt) => setFilters({ ...filters, onvan_id: opt|| "" })}
                        options={onvanOptions}
                        placeholder="همه عناوین"
                        isClearable
                    />

                    {/* تعداد نمایش */}
                    <Select
                        name="per_page"
                        title="تعداد نمایش"
                        value={perPageOptions.find(opt => opt.value === perPage) || null}
                        onChange={(opt) => setPerPage(opt|| "50")}
                        options={perPageOptions}
                        placeholder="تعداد نمایش"
                    />
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
            </div>

            {/* نتیجه گزارش */}
            <div className="text-xs text-gray-500 text-left">
                * مرتب سازی براساس کد پرسنلی می باشد
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <Loading />
                </div>
            ) : data?.data?.length === 0 ? (
                <Empty message="هیچ نتیجه‌ای یافت نشد" />
            ) : (
                <>
                    <div className="w-full overflow-x-auto">
                        <div className="min-w-[1000px]">
                            <div className="w-full grid grid-cols-10 gap-2 p-3 bg-gray-100 rounded-t-md">
                                {columns.map((col, i) => (
                                    <div key={i} className="flex items-center justify-center">
                                        <span className="text-xs font-bold text-gray-600">{col}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col border-x border-b rounded-b-md">
                                {data.data.map((item, index) => (
                                    <div
                                        key={item.id || index}
                                        className="w-full grid grid-cols-10 gap-2 px-3 py-3 hover:bg-gray-50 border-b last:border-b-0"
                                    >
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs">{index + 1}</span>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs">{item.contract_id || "-"}</span>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs">{item.personnel_code || "-"}</span>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs">
                                                {item.first_name || ""} {item.last_name || ""}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs">{item.national_code || "-"}</span>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs">{item.contract_type_label || "-"}</span>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs">{item.workgroup_name || "-"}</span>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs">{item.bakhsh_name || "-"}</span>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs">{item.ghesmat_name || "-"}</span>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <span className="text-xs font-bold text-blue-600">
                                                {item.onvan_name || "-"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Pagination totalPage={data.pages} />
                </>
            )}
        </div>
    );
}