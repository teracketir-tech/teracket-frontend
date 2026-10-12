import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import type { LineRow } from "../types";

/**
 * One attendance row of the report day, enriched by the server with the
 * contact alias and position so the picker can show who is who.
 */
export interface LogRow extends LineRow {
    /** `contact.alias` — filled in by `by-date`, absent on plain CRUD rows */
    person_name: string | null;
    /** `contact.position_id` — so the picker can show the person's position */
    person_position: string | null;
}

interface Props {
    /** `report_date` of the header — the picker reads one day */
    reportDate: string;
    /** Lets the server return the rows this report already owns */
    reportId: number | null;
}

/**
 * The fingerprint rows of the report day + the call that stamps them.
 *
 * `by-date` is read-only and returns nothing that another report has claimed;
 * writing happens only through `attach`, which is the single place where
 * `daily_report_id` / `daily_report_activity_id` / `company_id` land (issue
 * 1.5).
 */
export default function useTimesheetLogs({ reportDate, reportId }: Props) {
    const [rows, setRows] = useState<LogRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        if (!reportDate) {
            setRows([]);
            return;
        }

        const owner = reportId ? `&daily_report_id=${reportId}` : "";

        setLoading(true);
        const res = await api(`users-log/by-date?date=${reportDate}${owner}`).catch(() => null);
        setRows(res?.data ?? []);
        setLoading(false);
    }, [reportDate, reportId]);

    useEffect(() => {
        load();
    }, [load]);

    /** Tick rows → one POST; the server stamps them all or refuses them all */
    const attach = useCallback(
        async (activityId: number | string, ids: (number | string)[]): Promise<boolean> => {
            if (!ids.length) return false;

            setSaving(true);

            try {
                const res = await api(`daily-report/activity/${activityId}/timesheets`, "POST", { log_ids: ids });

                if (res?.success) {
                    toast.success(`${res.attached ?? ids.length} ردیف به تایم‌شیت اضافه شد.`);
                    await load();
                    return true;
                }

                if (res) {
                    const first = res.errors ? Object.values(res.errors)[0] : null;
                    toast.error(typeof first === "string" ? first : res.message || "افزودن رکوردها انجام نشد.");
                }

                return false;
            } catch {
                // `api` already toasted the failure
                return false;
            } finally {
                setSaving(false);
            }
        },
        [load],
    );

    return { rows, loading, saving, attach, reload: load };
}
