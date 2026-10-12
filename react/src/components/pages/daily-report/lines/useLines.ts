import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { LINE_CONFIGS } from "./config";
import { pickEditable, type ApiResponse, type LineKind, type LineRow, type LineValues } from "./types";

/**
 * Issue 1: the timesheet is no longer `daily-report-timesheets` — it is the
 * shared `users_logs` log, so its routes are that table's own CRUD routes.
 * The other four line kinds keep their own prefixes.
 */
const RESOURCE: Record<LineKind, string> = {
    manpower: "daily-report-manpower",
    equipment: "daily-report-equipment",
    materials: "daily-report-materials",
    deliveries: "daily-report-deliveries",
    timesheets: "users-log",
};

/**
 * ردیف‌های یک زیرمجموعه + ذخیره‌ی همان لحظه‌ای — الگوی اثبات‌شده‌ی ایشوی ۸.
 *
 * ایشوی ۱۰: مالکیت ردیف «فعالیت» است نه گزارش. پس هم فهرست با
 * `daily_report_activity_id` فیلتر می‌شود و هم افزودن روی
 * `daily-report/activity/{activityId}/{kind}` می‌رود؛ گزارش از روی فعالیت
 * استخراج می‌شود و کلاینت دیگر آن را نمی‌فرستد.
 *
 * هر ردیف بلافاصله روی سرور می‌نشیند و سپس لیست دوباره خوانده می‌شود؛
 * بنابراین جابه‌جایی بین تب‌ها هیچ ورودی‌ای را از بین نمی‌برد.
 */
export default function useLines(kind: LineKind, activityId: number | string | null) {
    const { entity, fields, release } = LINE_CONFIGS[kind];
    const resource = RESOURCE[kind];
    const [rows, setRows] = useState<LineRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const loadRows = useCallback(async () => {
        if (!activityId) {
            setRows([]);
            return;
        }

        setLoading(true);
        const res = await api(`${resource}?daily_report_activity_id=${activityId}&per-page=0`).catch(() => null);
        setRows(res?.data ?? []);
        setLoading(false);
    }, [resource, activityId]);

    useEffect(() => {
        loadRows();
    }, [loadRows]);

    /** افزودن یا ویرایش؛ پاسخِ سرور (با `errors` احتمالی) برای نمایش روی فرم برمی‌گردد */
    const save = useCallback(
        async (values: LineValues): Promise<ApiResponse | null> => {
            if (!activityId) return null;

            const editing = !!values.id;
            setSaving(true);

            try {
                const url = editing ? `${resource}/${values.id}` : `daily-report/activity/${activityId}/${kind}`;
                const res = await api(url, editing ? "PATCH" : "POST", pickEditable(fields, values));

                if (res?.success) {
                    toast.success(editing ? `${entity} بروزرسانی شد.` : `${entity} به فعالیت اضافه شد.`);
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
        [entity, fields, resource, kind, activityId, loadRows],
    );

    const remove = useCallback(
        async (id: number | string) => {
            const res = await api(`${resource}/${id}`, "DELETE").catch(() => null);

            if (res?.success) {
                // Feedback 1: "deleting" a timesheet really is a release — the
                // device row survives and only its stamps are taken off.
                toast.success(release ? `${entity} از فعالیت آزاد شد (رکورد لاگ پاک نشد).` : `${entity} از فعالیت حذف شد.`);
                await loadRows();
                return true;
            }

            if (res) toast.error(res.message || `${release ? "آزادسازی" : "حذف"} ${entity} انجام نشد.`);
            return false;
        },
        [entity, resource, release, loadRows],
    );

    return { rows, loading, saving, save, remove, reload: loadRows };
}
