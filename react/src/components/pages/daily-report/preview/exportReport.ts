import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { ACTIVITY_STATUS } from "@/lib/report-rules";
import { dateLabel, durationLabel, slackLabel } from "@/lib/labels";
import { LINE_CONFIGS, LINE_KINDS } from "../lines/config";
import { cellText, type Labeler } from "../lines/cells";
import type { LineKind } from "../lines/types";
import type { Num } from "../activities/types";
import { groupByActivity, type ActivityBlock } from "./groupLines";
import { HEADER_FIELDS, type HeaderContext } from "./headerFields";
import type { ReportData } from "../report";

/** یک شیتِ اکسل: سرستون + ردیف‌های متنی */
interface Sheet {
    name: string;
    head: string[];
    rows: string[][];
}

type ContactName = (id?: Num) => string;
type ReasonName = (ids?: (number | string)[]) => string;

const dash = (value: unknown) => (value === null || value === undefined || value === "" ? "—" : String(value));
const percent = (value?: Num) => (value === null || value === undefined || value === "" ? "—" : `${Number(value).toLocaleString()}%`);
const number = (value?: Num) => (value === null || value === undefined || value === "" ? "—" : Number(value).toLocaleString());

/** ستون‌های جدولِ «فعالیت‌ها» عین تبِ پیش‌نمایش، بدونِ ستونِ «عملیات» */
const activitySheet = (report: ReportData, contactName: ContactName, reasonName: ReasonName, baseUnit: Num): Sheet => ({
    name: "فعالیت‌ها",
    head: ["ردیف", "کد فعالیت", "عنوان فعالیت", "مدت", "شروع برنامه", "پایان برنامه", "شناوری آزاد", "دیرترین پایان", "پیش‌بینی سرپرست", "مسئول اجرا", "مسئول نظارت", "ساعت", "پیشرفت امروز", "پیشرفت تجمعی", "کیفیت", "وضعیت", "دلیل انحراف"],
    rows: (report.activities ?? []).map((row, index) => [
        String(index + 1),
        row.wbs_code || "—",
        row.task_name || "—",
        durationLabel(row.duration_value, row.duration_unit),
        dateLabel(row.planned_start),
        dateLabel(row.planned_finish),
        slackLabel(row.free_float, baseUnit),
        dateLabel(row.latest_finish),
        dateLabel(row.supervisor_forecast_date),
        contactName(row.executor_id),
        contactName(row.supervisor_id),
        number(row.work_hours),
        percent(row.daily_progress),
        percent(row.cumulative_progress),
        percent(row.quality_percent),
        ACTIVITY_STATUS[Number(row.status)] ?? "—",
        reasonName(row.deviation_reason_ids),
    ]),
});

/** هر زیرمجموعه یک شیت با ستونِ «فعالیت» جلوتر از ستون‌های خودش */
const lineSheet = (kind: LineKind, blocks: ActivityBlock[], label: Labeler): Sheet => {
    const config = LINE_CONFIGS[kind];
    const rows: string[][] = [];

    blocks.forEach((block) => {
        const part = block.parts.find((item) => item.kind === kind);
        if (!part) return;

        part.rows.forEach((row, index) => rows.push([block.title, ...config.columns.map((column) => cellText(column, row, label, index))]));
    });

    return { name: config.entity, head: ["فعالیت", ...config.columns.map((column) => column.title)], rows };
};

/** عرضِ ستون از بلندترین سلولِ همان ستون، با سقف تا صفحه شلوگ نشود */
const widths = (head: string[], rows: string[][]) =>
    head.map((title, column) => Math.min(34, Math.max(title.length + 4, ...rows.slice(0, 300).map((row) => String(row[column] ?? "").length + 4))));

/**
 * خروجی اکسلِ کاملِ گزارش — ایشوی ۱۸ (مورد ۱۱).
 *
 * یک فایل با هفت شیت: سربرگ، فعالیت‌ها و پنج زیرمجموعه؛ ستون‌ها و برچسب‌ها
 * همان‌هایی‌اند که تبِ پیش‌نمایش نشان می‌دهد (از `HEADER_FIELDS` و
 * `LINE_CONFIGS` خوانده می‌شوند پس دوباره تعریف نشده‌اند — DRY).
 */
export async function exportReport(report: ReportData, ctx: HeaderContext, label: Labeler, contactName: ContactName, reasonName: ReasonName, baseUnit: Num, fileName: string) {
    const blocks = groupByActivity(report);
    const sheets: Sheet[] = [
        { name: "سربرگ", head: ["عنوان", "مقدار"], rows: HEADER_FIELDS.map((field) => [field.title, field.value(report, ctx)]) },
        activitySheet(report, contactName, reasonName, baseUnit),
        ...LINE_KINDS.map((kind) => lineSheet(kind, blocks, label)).filter((sheet) => sheet.rows.length > 0),
    ];

    const workbook = new ExcelJS.Workbook();

    sheets.forEach(({ name, head, rows }) => {
        const worksheet = workbook.addWorksheet(name);
        const columnWidths = widths(head, rows);

        worksheet.columns = head.map((title, column) => ({ header: title, key: `${column}`, width: columnWidths[column] }));

        rows.forEach((row) => worksheet.addRow(row));

        worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
        worksheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4CAF50" } };
        worksheet.views = [{ state: "frozen", ySplit: 1 }];
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), fileName);
}

/** نامِ فایل: شماره مدرک یا شناسه + تاریخ گزارش، بدونِ کاراکترِ ممنوع */
export const reportFileName = (report: ReportData) => {
    const part = String(report.document_no || report.id || "report").replace(/[\\/:*?"<>|]/g, "-");
    return `DailyReport_${part}_${dash(report.report_date)}.xlsx`;
};
