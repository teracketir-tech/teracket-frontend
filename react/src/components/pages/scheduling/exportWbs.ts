import { exportToExcel } from "@/lib/utils";
import { dateLabel, durationLabel, percentLabel, slackLabel } from "@/lib/labels";
import { depthOf } from "./options";

/**
 * خروجی اکسل زمان‌بندی، هم‌شکل شیت `WBS` فایل راهنما:
 * Task Name | WBS | % Complete | Critical | Duration | شروع | پایان | Total Slack | Free Slack | دیرترین پایان
 *
 * ردیفِ خودِ پروژه دیگر ساخته نمی‌شود: گرهٔ WBS با کد 0 خودِ یک ردیفِ واقعی است
 * و همان rollup (شروعِ کمینه، پایانِ بیشینه، میانگینِ پیشرفت) را می‌گیرد.
 */
const COLUMNS = [
    { header: "Task Name", key: "name", width: 45 },
    { header: "WBS", key: "wbs", width: 12 },
    { header: "% Complete", key: "progress", width: 12 },
    { header: "Critical", key: "critical", width: 12 },
    { header: "Duration", key: "duration", width: 14 },
    { header: "شروع", key: "start", width: 14 },
    { header: "پایان", key: "finish", width: 14 },
    { header: "Total Slack", key: "total_slack", width: 14 },
    { header: "Free Slack", key: "free_slack", width: 14 },
    { header: "دیرترین پایان", key: "late_finish", width: 14 },
];

/** نام تسک با تورفتگی سلسله‌مراتبی WBS، مثل فایل راهنما */
const indentedName = (task: any) => `${"   ".repeat(depthOf(task))}${task.name}`;

/** نام پروژه ممکن است نویسه‌ی ممنوعِ ویندوز (مثل `/`) داشته باشد */
const safeFileName = (projectName: any) => `WBS_${String(projectName || "").replace(/[\\/:*?"<>|]/g, "-").trim() || "tasks"}.xlsx`;

/** یک ردیفِ خروجی: خودِ تسک اگر CPM داشته باشد، وگرنه مقادیر خامش */
const outputRow = (task: any, unit: string) => {
    const cpm = task.cpm;

    return {
        name: indentedName(task),
        wbs: task.wbs_code || "",
        progress: percentLabel(cpm?.progress),
        critical: cpm?.is_critical ? "بحرانی" : "",
        duration: cpm ? durationLabel(cpm.duration, cpm.unit) : durationLabel(task.duration, task.duration_unit),
        start: dateLabel(cpm?.start_date),
        finish: dateLabel(cpm?.finish_date),
        total_slack: cpm ? slackLabel(cpm.float, unit) : "—",
        free_slack: cpm ? slackLabel(cpm.free_float, unit) : "—",
        late_finish: dateLabel(cpm?.late_finish_date),
    };
};

export const exportWbs = async (tasks: any[], unit: string, projectName: any) => {
    // arrow می‌خواهد نه تابعِ لخت، تا index آرایه به‌جای unit سر نشود.
    await exportToExcel(tasks.map((task) => outputRow(task, unit)), COLUMNS, "WBS", safeFileName(projectName));
};
