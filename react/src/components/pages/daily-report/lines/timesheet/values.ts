/**
 * Value helpers for the timesheet tab — issue 1.
 *
 * The tab edits `users_logs`, whose stamps are full datetimes, while the form
 * only ever asks for a time of day: the date half always comes from the report
 * header. These two converters are the only place that translation happens, so
 * the form and the payload can never disagree about it.
 */

/** `2026-10-09` + `08:30` → `2026-10-09 08:30`; anything missing → empty */
export function combineDateTime(date: string, time: string): string {
    const day = String(date ?? "").trim();
    const clock = String(time ?? "").trim();

    if (!day || !clock) return "";

    return `${day} ${clock}`;
}

/** `2026-10-09 08:30:00` → `08:30` — what the time input can hold */
export function timeOnly(value: unknown): string {
    const text = String(value ?? "");

    if (!text.includes(" ")) return text;

    return text.slice(text.indexOf(" ") + 1, text.indexOf(" ") + 6);
}
