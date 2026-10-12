import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { loadContactOptions, type ContactOption } from "@/lib/contacts";
import { loadDictionaries, type DictOption } from "@/components/shared/dictionaries";
import type { ActivityRow, ActivityValues, ApiResponse, Num, ReportableTask } from "./types";
import { joinedLabels } from "@/lib/labels";
import { pickEditable } from "./values";
import { withPrevious } from "./progress";

interface Params {
    /** شناسه‌ی گزارش ذخیره‌شده — بدون آن هیچ ردیفی خواندنی/نوشتنی نیست */
    reportId: number | null;
    projectId: string;
    /** شرکتِ سربرگ (ایشوی ۱) — روی اشخاص و واژه‌نامه اثر می‌گذارد */
    companyId?: string;
    /**
     * روزِ گزارش، میلادی ISO. سرور فقط فعالیت‌هایِ برگی را برمی‌گرداند که
     * پنجره‌ی CPMِ آن روز را در بر بگیرد (ایشوی ۳).
     */
    reportDate?: string;
}

/**
 * داده‌ی تب «فعالیت‌ها»: تسک‌های قابل گزارشِ همین روز از پروژه (همراهِ پیشرفتِ
 * قبلی‌شان)، ردیف‌های ثبت‌شده‌ی همین گزارش و نامِ اشخاص برای ستون‌های اجرا/نظارت.
 *
 * هر ذخیره بلافاصله روی سرور می‌نشیند (POST تو در تو یا PATCH) و سپس لیستِ
 * ردیف‌ها دوباره خوانده می‌شود تا `cumulative_progress` که Backend حساب می‌کند
 * به‌روز نمایش داده شود (سند فاز ۲ بند ۱۵).
 */
export default function useActivities({ reportId, projectId, companyId = "", reportDate = "" }: Params) {
    const [tasks, setTasks] = useState<ReportableTask[]>([]);
    const [rows, setRows] = useState<ActivityRow[]>([]);
    const [contacts, setContacts] = useState<ContactOption[]>([]);
    /** دلایل انحراف — سلکتِ تبِ «عوامل انحراف» و برچسبِ ستونِ جدول (ایشوی ۱۲) */
    const [deviationReasons, setDeviationReasons] = useState<DictOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    /** واحدِ پایه‌ی CPM پروژه — شناوری آزاد در همین واحد است نه در واحدِ خودِ تسک */
    const [baseUnit, setBaseUnit] = useState<Num>(null);

    const loadTasks = useCallback(async () => {
        if (!projectId || !reportDate) {
            setTasks([]);
            return;
        }

        // تسک‌ها و سابقه‌ی پیشرفت با هم خوانده می‌شوند تا نوارِ «درصد پیشرفت»
        // از ادامه‌ی همان عدد بیاید. endpoint سابقه تا وقتی گزارش ذخیره نشده
        // خوانده نمی‌شود؛ پاسخِ خالی یعنی سابقه‌ای نیست و نوار از صفر شروع
        // می‌شود. تاریخِ گزارش را خودِ سرور از ردیفِ ذخیره‌شده می‌خواند.
        //
        // report_date هم می‌رود تا سرور فعالیت‌های همین روز را برگرداند، نه همه
        // را؛ خالی‌بودن یعنی «هیچ فعالیتی این روز برنامه‌ریزی نشده» نه «پروژه
        // تسک ندارد». بدونِ آن، فهرست قدیمی و بی‌روز می‌شود پس همیشه می‌رود.
        const [res, progress] = await Promise.all([
            api(`project/${projectId}/reportable-tasks?report_date=${encodeURIComponent(reportDate)}`).catch(() => null),
            reportId ? api(`daily-report/${reportId}/task-progress`).catch(() => null) : Promise.resolve(null),
        ]);

        setTasks(withPrevious(res?.data ?? [], progress?.data ?? {}));
        setBaseUnit(res?.cpm?.unit ?? null);
    }, [projectId, reportId, reportDate]);

    // Force re-fetch when projectId or reportDate become available after initial mount
    useEffect(() => {
        if (projectId && reportDate) {
            loadTasks();
        }
    }, [projectId, reportDate, loadTasks]);

    const loadRows = useCallback(async () => {
        if (!reportId) {
            setRows([]);
            return;
        }

        setLoading(true);
        const res = await api(`daily-report-activity?daily_report_id=${reportId}&per-page=0`).catch(() => null);
        setRows(res?.data ?? []);
        setLoading(false);
    }, [reportId]);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    useEffect(() => {
        loadRows();
    }, [loadRows]);

    useEffect(() => {
        let alive = true;
        // اشخاصِ اینجا همه‌ی سمت‌ها را می‌آورند چون هر فیلد فرمِ فعالیت سمتِ
        // خودش را دارد (ایشوی ۲.۱) و شرکتِ سربرگ روی همه اثر می‌گذارد (ایشوی ۱).
        loadContactOptions(null, companyId).then((list) => alive && setContacts(list));
        // واژه‌نامه‌ی مشترکِ پنج تبِ زیرمجموعه (کِشِ ماژول به ازای هر شرکت)؛
        // تبِ «عوامل انحراف» همان درخواست را دوباره نمی‌زند چون promise کش‌شده است.
        loadDictionaries(companyId).then((dicts) => alive && setDeviationReasons(dicts.deviationReasons));
        return () => {
            alive = false;
        };
    }, [companyId]);

    /** افزودن یا ویرایش؛ پاسخِ سرور (با `errors` احتمالی) برای نمایش روی فرم برمی‌گردد */
    const save = useCallback(
        async (values: ActivityValues): Promise<ApiResponse | null> => {
            if (!reportId) return null;

            const editing = !!values.id;
            setSaving(true);

            try {
                const url = editing ? `daily-report-activity/${values.id}` : `daily-report/${reportId}/activities`;
                const res = await api(url, editing ? "PATCH" : "POST", pickEditable(values));

                if (res?.success) {
                    toast.success(editing ? "فعالیت بروزرسانی شد." : "فعالیت به گزارش اضافه شد.");
                    await loadRows();
                }

                return res;
            } catch {
                // `api` خودش toast زده است
                return null;
            } finally {
                setSaving(false);
            }
        },
        [reportId, loadRows],
    );

    const remove = useCallback(
        async (id: number | string) => {
            const res = await api(`daily-report-activity/${id}`, "DELETE").catch(() => null);

            if (res?.success) {
                toast.success("فعالیت از گزارش حذف شد.");
                await loadRows();
                return true;
            }

            if (res) toast.error(res.message || "حذف فعالیت انجام نشد.");
            return false;
        },
        [loadRows],
    );

    const contactName = (id?: Num) => (id ? (contacts.find((contact) => contact.value == id)?.label ?? String(id)) : "—");

    /**
     * برچسبِ عوامل انحرافِ چندتاییِ یک ردیف (ایشوی ۴) — ردیفِ خالی «—» است و
     * بقیه با «،» از هم جدا می‌شوند تا در ستونِ باریک جدول خوانا بمانند.
     */
    const reasonName = (ids?: (number | string)[]) =>
        joinedLabels(ids, (id) => deviationReasons.find((reason) => reason.value == id)?.label ?? String(id));

    return {
        tasks,
        rows,
        contacts,
        contactName,
        deviationReasons,
        reasonName,
        baseUnit,
        loading,
        saving,
        save,
        remove,
        reload: loadRows,
    };
}
