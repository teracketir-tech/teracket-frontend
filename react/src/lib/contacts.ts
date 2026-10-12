import { api } from "@/lib/axios";

export interface ContactOption {
    label: string;
    value: string;
    /** Position (`contact.position_id`) — what the daily-report selects filter on (issue 2.3) */
    position?: string;
}

/**
 * Options of the "contacts" list — the single source for every Select and for
 * the executor/supervisor name columns of the daily report, so the
 * `<id>- <alias>` label is built in exactly one place.
 *
 * Kept apart from `ContactSelect` so the component file only exports
 * components (`react-refresh/only-export-components`) and a page that already
 * holds the list does not fetch it twice.
 *
 * @param type      "type" (`contact.type`) filter kept for the accounting pages.
 *                  `null` means no type filter at all.
 * @param companyId restricts the list to one company; empty means no company was
 *                  picked and data of every company must show (issue 1).
 * @param position  position (`contact.position_id`) filter of the daily report
 *                  (issue 2.3). When set it replaces the type filter: `type` and
 *                  `position_id` are separate columns now.
 */
export async function loadContactOptions(
    type: number | null = 1,
    companyId?: string | number,
    position: number | null = null,
): Promise<ContactOption[]> {
    const personFilter = position === null ? (type === null ? "" : `type=${type}`) : `position_id=${position}`;
    const parts = [companyId ? `company_id=${companyId}` : "", personFilter, "per-page=5000"].filter(Boolean);
    const res = await api(`contact?${parts.join("&")}`).catch(() => null);

    return (res?.data || []).map((row: { id: number | string; alias: string; position_id?: number | string | null }) => ({
        label: `${row.id}- ${row.alias}`,
        value: row.id.toString(),
        ...(row.position_id === undefined || row.position_id === null ? {} : { position: String(row.position_id) }),
    }));
}
