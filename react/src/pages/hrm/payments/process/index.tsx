import { useCallback, useEffect, useState } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import { api } from "@/lib/axios";
import { toast } from "sonner";

import {
    Calculator,
    CheckCircle,
    Download,
    History,
    RefreshCw,
    Search,
    Trash2,
    Upload,
    Users,
    X,
} from "lucide-react";

type TabType = "process" | "calculate" | "history" | "personnel";

interface ProcessItem {
    id: number;
    process_id?: number;
    user_id: number;
    year?: number;
    month?: number;
    count?: number;
    unit_price?: number;
    total_amount?: number;
    amount?: number;
    status?: number;
    date_paid?: string;
    created_at?: string;

    user?: {
        id?: number;
        first_name?: string;
        last_name?: string;
        personnel_code?: string;
        national_id?: string;
        workgroup_name?: string;
    };

    workgroup?: {
        name?: string;
    };
}

interface ListResponse {
    data: ProcessItem[];
    pages: number;
    totalCount: number;
}

const months = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
];

const currentYear = 1405;

const years = Array.from(
    { length: 31 },
    (_, index) => String(currentYear - 15 + index)
);

const numberFormat = (value?: number) =>
    new Intl.NumberFormat("fa-IR").format(value ?? 0);

const getMonthName = (month?: number) =>
    month && month >= 1 && month <= 12
        ? months[month - 1]
        : "-";

const emptyList: ListResponse = {
    data: [],
    pages: 0,
    totalCount: 0,
};

const datePickerInputClass =
    "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export default function ProcessManagement() {
    const [tab, setTab] = useState<TabType>("process");

    const [data, setData] = useState<ListResponse>(emptyList);
    const [selected, setSelected] = useState<number[]>([]);

    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [perPage] = useState(10);

    const [filters, setFilters] = useState({
        personnel_code: "",
        national_code: "",
        workgroup_id: "",
        month: "",
        year: "",
    });

    const [uploadForm, setUploadForm] = useState({
        month: "",
        year: String(currentYear),
        date_from: "",
        date_to: "",
    });

    const [file, setFile] = useState<File | null>(null);

    const [workgroups, setWorkgroups] = useState<
        { id: number; name: string }[]
    >([]);

    const updateFilter = (name: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const updateUploadForm = (name: string, value: string) => {
        setUploadForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const fetchWorkgroups = useCallback(async () => {
        try {
            const response = await api("hrm-workgroup/items", "GET");

            if (response?.success) {
                setWorkgroups(response.data ?? []);
            }
        } catch {
            toast.error("دریافت گروه‌های کاری ناموفق بود");
        }
    }, []);

    const fetchData = useCallback(async () => {
        setListLoading(true);

        try {
            const params = new URLSearchParams();

            Object.entries(filters).forEach(([key, value]) => {
                if (value) {
                    params.set(key, value);
                }
            });

            params.set("page", String(page));
            params.set("per-page", String(perPage));

            const endpoints: Record<TabType, string> = {
                process: "hrm-process",
                calculate: "hrm-process/calculate-list",
                history: "hrm-process/history",
                personnel: "hrm-process/personnel-list",
            };

            const response = await api(
                `${endpoints[tab]}?${params.toString()}`,
                "GET"
            );

            const result: ListResponse = {
                data: response?.data ?? [],
                pages: Number(response?.pages ?? 0),
                totalCount: Number(response?.totalCount ?? 0),
            };

            setData(result);
            setSelected([]);
        } catch {
            setData(emptyList);
            toast.error("دریافت اطلاعات ناموفق بود");
        } finally {
            setListLoading(false);
        }
    }, [filters, page, perPage, tab]);

    useEffect(() => {
        fetchWorkgroups();
    }, [fetchWorkgroups]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const changeTab = (nextTab: TabType) => {
        setTab(nextTab);
        setSelected([]);
        setPage(1);
    };

    const toggleSelected = (id: number) => {
        setSelected((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (selected.length === data.data.length) {
            setSelected([]);
        } else {
            setSelected(data.data.map((item) => item.id));
        }
    };

    const postAction = async (
        endpoint: string,
        payload: Record<string, unknown>,
        confirmMessage?: string
    ) => {
        if (loading) return;

        if (confirmMessage && !window.confirm(confirmMessage)) {
            return;
        }

        setLoading(true);

        try {
            const response = await api(endpoint, "POST", payload);

            if (!response?.success) {
                toast.error(response?.message || "عملیات ناموفق بود");
                return;
            }

            toast.success(
                response.message || "عملیات با موفقیت انجام شد"
            );

            setSelected([]);
            await fetchData();
        } catch {
            toast.error("ارتباط با سرور ناموفق بود");
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.warning("فایل اکسل را انتخاب کنید");
            return;
        }

        if (!uploadForm.month || !uploadForm.year) {
            toast.warning("سال و ماه را انتخاب کنید");
            return;
        }

        if (!uploadForm.date_from || !uploadForm.date_to) {
            toast.warning("بازه تاریخ را وارد کنید");
            return;
        }

        if (uploadForm.date_from > uploadForm.date_to) {
            toast.warning("تاریخ شروع نمی‌تواند بعد از تاریخ پایان باشد");
            return;
        }

        const formData = new FormData();

        formData.append("file", file);
        formData.append("month", uploadForm.month);
        formData.append("year", uploadForm.year);
        formData.append("date_from", uploadForm.date_from);
        formData.append("date_to", uploadForm.date_to);

        setLoading(true);

        try {
            const response = await api(
                "hrm-process/upload",
                "POST",
                formData,
                false
            );

            if (!response?.success) {
                toast.error(response?.message || "آپلود ناموفق بود");
                return;
            }

            toast.success(response.message || "فایل پردازش شد");

            (response.errors ?? [])
                .slice(0, 5)
                .forEach((error: string) => toast.warning(error));

            setFile(null);

            const input = document.getElementById(
                "process-excel"
            ) as HTMLInputElement | null;

            if (input) {
                input.value = "";
            }

            setTab("process");
            setPage(1);

            await fetchData();
        } catch {
            toast.error("آپلود فایل ناموفق بود");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        if (!selected.length) {
            toast.warning("حداقل یک مورد را انتخاب کنید");
            return;
        }

        const type =
            tab === "history"
                ? "history"
                : tab === "personnel"
                  ? "personnel"
                  : "calculate";

        const payload: Record<string, unknown> =
            type === "personnel"
                ? {
                      type,
                      user_ids: data.data
                          .filter((item) => selected.includes(item.id))
                          .map((item) => item.user_id),
                  }
                : {
                      type,
                      ids: selected,
                  };

        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const baseURL = String(
                import.meta.env.VITE_API_URL || ""
            ).replace(/\/$/, "");

            const response = await fetch(
                `${baseURL}/hrm-process/export-excel`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token
                            ? { Authorization: `Bearer ${token}` }
                            : {}),
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                throw new Error("Export failed");
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `process-${type}-${Date.now()}.xlsx`;

            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();

            URL.revokeObjectURL(url);

            toast.success("فایل اکسل آماده شد");
        } catch {
            toast.error("خروجی اکسل ناموفق بود");
        } finally {
            setLoading(false);
        }
    };

    const handleClearWork = async () => {
        if (!selected.length) {
            toast.warning("پرسنل موردنظر را انتخاب کنید");
            return;
        }

        if (!filters.year || !filters.month) {
            toast.warning(
                "برای صفر کردن کارکرد، سال و ماه را فیلتر کنید"
            );
            return;
        }

        const userIds = data.data
            .filter((item) => selected.includes(item.id))
            .map((item) => item.user_id);

        await postAction(
            "hrm-process/clear-work",
            {
                user_ids: userIds,
                year: filters.year,
                month: filters.month,
            },
            `کارکرد ${userIds.length} پرسنل برای ماه انتخاب‌شده صفر شود؟`
        );
    };

    const clearFilters = () => {
        setFilters({
            personnel_code: "",
            national_code: "",
            workgroup_id: "",
            month: "",
            year: "",
        });

        setPage(1);
    };

    const tabClass = (value: TabType) =>
        `inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
            tab === value
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        }`;

    const buttonClass =
        "inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50";

    /**
     * تبدیل تاریخ انتخاب‌شده به رشته شمسی.
     * مقدار ذخیره‌شده در state با فرمت YYYY/MM/DD است.
     */
    const updateJalaliDate = (
        field: "date_from" | "date_to",
        date: { format: (pattern: string) => string } | null
    ) => {
        updateUploadForm(
            field,
            date ? date.format("YYYY/MM/DD") : ""
        );
    };

    const renderTable = () => (
        <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[900px] border-collapse text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border-b px-3 py-3">
                            <input
                                type="checkbox"
                                checked={
                                    data.data.length > 0 &&
                                    selected.length === data.data.length
                                }
                                onChange={toggleAll}
                            />
                        </th>

                        {[
                            "ردیف",
                            "کد پرسنلی",
                            "نام و نام خانوادگی",
                            "گروه کاری",
                            "ماه",
                            "سال",
                            "تعداد",
                            "قیمت واحد",
                            "مبلغ کل",
                            "وضعیت",
                        ].map((heading) => (
                            <th
                                key={heading}
                                className="whitespace-nowrap border-b px-3 py-3"
                            >
                                {heading}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data.data.map((item, index) => {
                        const amount =
                            item.total_amount ??
                            item.amount ??
                            Number(item.count ?? 0) *
                                Number(item.unit_price ?? 0);

                        return (
                            <tr
                                key={item.id}
                                className="border-b hover:bg-gray-50"
                            >
                                <td className="px-3 py-3 text-center">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(item.id)}
                                        onChange={() =>
                                            toggleSelected(item.id)
                                        }
                                    />
                                </td>

                                <td className="px-3 py-3 text-center">
                                    {numberFormat(
                                        (page - 1) * perPage + index + 1
                                    )}
                                </td>

                                <td className="px-3 py-3 text-center">
                                    {item.user?.personnel_code ?? "-"}
                                </td>

                                <td className="whitespace-nowrap px-3 py-3 text-center">
                                    {item.user?.first_name ?? ""}{" "}
                                    {item.user?.last_name ?? ""}
                                </td>

                                <td className="px-3 py-3 text-center">
                                    {item.user?.workgroup_name ??
                                        item.workgroup?.name ??
                                        "-"}
                                </td>

                                <td className="px-3 py-3 text-center">
                                    {getMonthName(item.month)}
                                </td>

                                <td className="px-3 py-3 text-center">
                                    {item.year ?? "-"}
                                </td>

                                <td className="px-3 py-3 text-center">
                                    {numberFormat(item.count)}
                                </td>

                                <td className="whitespace-nowrap px-3 py-3 text-center">
                                    {numberFormat(item.unit_price)}
                                </td>

                                <td className="whitespace-nowrap px-3 py-3 text-center">
                                    {numberFormat(amount)}
                                </td>

                                <td className="px-3 py-3 text-center">
                                    {tab === "personnel"
                                        ? "-"
                                        : item.status === 1
                                          ? "ثبت نهایی"
                                          : tab === "process"
                                            ? "آماده محاسبه"
                                            : "پیش‌ثبت"}
                                </td>
                            </tr>
                        );
                    })}

                    {!listLoading && data.data.length === 0 && (
                        <tr>
                            <td
                                colSpan={11}
                                className="px-3 py-10 text-center text-gray-500"
                            >
                                اطلاعاتی برای نمایش وجود ندارد
                            </td>
                        </tr>
                    )}

                    {listLoading && (
                        <tr>
                            <td
                                colSpan={11}
                                className="px-3 py-10 text-center"
                            >
                                در حال دریافت اطلاعات...
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="w-full space-y-5" dir="rtl">
            <div className="flex items-center gap-2">
                <Calculator className="h-6 w-6" />
                <h1 className="text-xl font-semibold">محاسبه فرآیند</h1>
            </div>

            <div className="flex flex-wrap gap-2 border-b pb-3">
                <button
                    className={tabClass("process")}
                    onClick={() => changeTab("process")}
                >
                    <Upload size={16} />
                    فرآیندهای بارگذاری‌شده
                </button>

                <button
                    className={tabClass("calculate")}
                    onClick={() => changeTab("calculate")}
                >
                    <Calculator size={16} />
                    پیش‌ثبت‌ها
                </button>

                <button
                    className={tabClass("history")}
                    onClick={() => changeTab("history")}
                >
                    <History size={16} />
                    سابقه واریز
                </button>

                <button
                    className={tabClass("personnel")}
                    onClick={() => changeTab("personnel")}
                >
                    <Users size={16} />
                    پرسنل فرآیندی
                </button>
            </div>

            {/* بارگذاری فایل فرآیند */}
            <section className="space-y-4 rounded-lg border bg-white p-4">
                <h2 className="font-semibold">بارگذاری فایل فرآیند</h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <label className="flex flex-col gap-1 text-sm">
                        ماه

                        <select
                            className="rounded-md border p-2"
                            value={uploadForm.month}
                            onChange={(event) =>
                                updateUploadForm(
                                    "month",
                                    event.target.value
                                )
                            }
                        >
                            <option value="">انتخاب ماه</option>

                            {months.map((month, index) => (
                                <option key={month} value={index + 1}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                        سال

                        <select
                            className="rounded-md border p-2"
                            value={uploadForm.year}
                            onChange={(event) =>
                                updateUploadForm(
                                    "year",
                                    event.target.value
                                )
                            }
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                        فایل اکسل

                        <input
                            id="process-excel"
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            className="rounded-md border p-2"
                            onChange={(event) =>
                                setFile(event.target.files?.[0] ?? null)
                            }
                        />
                    </label>

                    {/* دیت‌پیکر شمسی تاریخ شروع */}
                    <div className="flex flex-col gap-1 text-sm">
                        <label htmlFor="process-date-from">
                            از تاریخ
                        </label>

                        <DatePicker
                            id="process-date-from"
                            value={uploadForm.date_from}
                            onChange={(date) =>
                                updateJalaliDate("date_from", date)
                            }
                            calendar={persian}
                            locale={persian_fa}
                            calendarPosition="bottom-right"
                            format="YYYY/MM/DD"
                            inputClass={datePickerInputClass}
                            placeholder="انتخاب تاریخ شروع"
                            editable={false}
                            clearable
                        />
                    </div>

                    {/* دیت‌پیکر شمسی تاریخ پایان */}
                    <div className="flex flex-col gap-1 text-sm">
                        <label htmlFor="process-date-to">
                            تا تاریخ
                        </label>

                        <DatePicker
                            id="process-date-to"
                            value={uploadForm.date_to}
                            onChange={(date) =>
                                updateJalaliDate("date_to", date)
                            }
                            calendar={persian}
                            locale={persian_fa}
                            calendarPosition="bottom-right"
                            format="YYYY/MM/DD"
                            inputClass={datePickerInputClass}
                            placeholder="انتخاب تاریخ پایان"
                            editable={false}
                            clearable
                            minDate={
                                uploadForm.date_from || undefined
                            }
                        />
                    </div>
                </div>

                <button
                    className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-700`}
                    disabled={loading}
                    onClick={handleUpload}
                >
                    <Upload size={16} />
                    {loading
                        ? "در حال پردازش..."
                        : "بارگذاری فرآیندها"}
                </button>
            </section>

            {/* فیلترها */}
            <section className="space-y-4 rounded-lg border bg-white p-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-5">
                    <label className="flex flex-col gap-1 text-sm">
                        کد پرسنلی

                        <input
                            className="rounded-md border p-2"
                            value={filters.personnel_code}
                            onChange={(event) =>
                                updateFilter(
                                    "personnel_code",
                                    event.target.value
                                )
                            }
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                        کد ملی

                        <input
                            className="rounded-md border p-2"
                            value={filters.national_code}
                            onChange={(event) =>
                                updateFilter(
                                    "national_code",
                                    event.target.value
                                )
                            }
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                        گروه کاری

                        <select
                            className="rounded-md border p-2"
                            value={filters.workgroup_id}
                            onChange={(event) =>
                                updateFilter(
                                    "workgroup_id",
                                    event.target.value
                                )
                            }
                        >
                            <option value="">همه گروه‌ها</option>

                            {workgroups.map((workgroup) => (
                                <option
                                    key={workgroup.id}
                                    value={workgroup.id}
                                >
                                    {workgroup.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                        ماه

                        <select
                            className="rounded-md border p-2"
                            value={filters.month}
                            onChange={(event) =>
                                updateFilter("month", event.target.value)
                            }
                        >
                            <option value="">همه ماه‌ها</option>

                            {months.map((month, index) => (
                                <option key={month} value={index + 1}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                        سال

                        <select
                            className="rounded-md border p-2"
                            value={filters.year}
                            onChange={(event) =>
                                updateFilter("year", event.target.value)
                            }
                        >
                            <option value="">همه سال‌ها</option>

                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        className={buttonClass}
                        onClick={() => {
                            setPage(1);
                            fetchData();
                        }}
                    >
                        <Search size={16} />
                        جستجو
                    </button>

                    <button
                        className={buttonClass}
                        onClick={clearFilters}
                    >
                        <X size={16} />
                        پاک کردن فیلترها
                    </button>

                    <button
                        className={buttonClass}
                        onClick={fetchData}
                        disabled={listLoading}
                    >
                        <RefreshCw size={16} />
                        به‌روزرسانی
                    </button>
                </div>
            </section>

            {/* جدول اطلاعات */}
            <section className="space-y-4 rounded-lg border bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-semibold">
                        {tab === "process" &&
                            "فرآیندهای بارگذاری‌شده"}

                        {tab === "calculate" && "لیست پیش‌ثبت‌ها"}

                        {tab === "history" && "سابقه واریز فرآیند"}

                        {tab === "personnel" &&
                            "لیست پرسنل فرآیندی"}

                        <span className="mr-2 text-sm font-normal text-gray-500">
                            ({numberFormat(data.totalCount)} رکورد)
                        </span>
                    </h2>

                    <span className="text-sm text-gray-500">
                        {numberFormat(selected.length)} مورد انتخاب‌شده
                    </span>
                </div>

                {renderTable()}

                <div className="flex flex-wrap gap-2 border-t pt-4">
                    {tab === "process" && (
                        <>
                            <button
                                className={buttonClass}
                                disabled={loading || !selected.length}
                                onClick={() =>
                                    postAction(
                                        "hrm-process/pre-submit",
                                        { ids: selected },
                                        `آیا ${selected.length} فرآیند پیش‌ثبت شود؟`
                                    )
                                }
                            >
                                <Calculator size={16} />
                                پیش‌ثبت
                            </button>

                            <button
                                className={`${buttonClass} text-red-600`}
                                disabled={loading || !selected.length}
                                onClick={() =>
                                    postAction(
                                        "hrm-process/delete-processes",
                                        { ids: selected },
                                        `آیا ${selected.length} فرآیند حذف شود؟`
                                    )
                                }
                            >
                                <Trash2 size={16} />
                                حذف فرآیند
                            </button>
                        </>
                    )}

                    {tab === "calculate" && (
                        <>
                            <button
                                className={buttonClass}
                                disabled={loading || !selected.length}
                                onClick={() =>
                                    postAction(
                                        "hrm-process/recalculate",
                                        { ids: selected },
                                        "محاسبه مجدد پیش‌ثبت‌های انتخاب‌شده انجام شود؟"
                                    )
                                }
                            >
                                <RefreshCw size={16} />
                                محاسبه مجدد
                            </button>

                            <button
                                className={buttonClass}
                                disabled={loading || !selected.length}
                                onClick={() =>
                                    postAction(
                                        "hrm-process/final-submit",
                                        { ids: selected },
                                        `ثبت نهایی ${selected.length} مورد انجام شود؟`
                                    )
                                }
                            >
                                <CheckCircle size={16} />
                                ثبت نهایی
                            </button>

                            <button
                                className={`${buttonClass} text-red-600`}
                                disabled={loading || !selected.length}
                                onClick={() =>
                                    postAction(
                                        "hrm-process/delete-calcs",
                                        { ids: selected },
                                        `پیش‌ثبت ${selected.length} مورد حذف شود؟`
                                    )
                                }
                            >
                                <Trash2 size={16} />
                                حذف پیش‌ثبت
                            </button>
                        </>
                    )}

                    {tab === "history" && (
                        <span className="text-sm text-gray-500">
                            حذف سوابق ثبت نهایی از این صفحه غیرفعال است.
                        </span>
                    )}

                    {tab === "personnel" && (
                        <button
                            className={buttonClass}
                            disabled={loading || !selected.length}
                            onClick={handleClearWork}
                        >
                            <X size={16} />
                            صفر کردن کارکرد
                        </button>
                    )}

                    <button
                        className={buttonClass}
                        disabled={loading || !selected.length}
                        onClick={handleExport}
                    >
                        <Download size={16} />
                        خروجی اکسل
                    </button>
                </div>

                {/* صفحه‌بندی */}
                <div className="flex items-center justify-between border-t pt-4">
                    <button
                        className={buttonClass}
                        disabled={page <= 1 || listLoading}
                        onClick={() =>
                            setPage((prev) => Math.max(1, prev - 1))
                        }
                    >
                        صفحه قبل
                    </button>

                    <span className="text-sm">
                        صفحه {numberFormat(page)} از{" "}
                        {numberFormat(Math.max(1, data.pages))}
                    </span>

                    <button
                        className={buttonClass}
                        disabled={page >= data.pages || listLoading}
                        onClick={() =>
                            setPage((prev) =>
                                Math.min(
                                    Math.max(1, data.pages),
                                    prev + 1
                                )
                            )
                        }
                    >
                        صفحه بعد
                    </button>
                </div>
            </section>
        </div>
    );
}