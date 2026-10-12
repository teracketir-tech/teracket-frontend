import { useState } from "react";
import { toast } from "sonner";
import Button from "@/components/shared/Button";
import Loading from "@/components/shared/Loading";
import ActivitiesTable from "../activities/ActivitiesTable";
import Notice from "../Notice";
import { LINE_CONFIGS } from "../lines/config";
import LineTable from "../lines/LineTable";
import usePreview from "./usePreview";
import { groupByActivity } from "./groupLines";
import { HEADER_FIELDS, type HeaderContext } from "./headerFields";
import { REPORT_STATUS } from "@/lib/report-rules";
import { joinedLabels } from "@/lib/labels";
import { exportReport, reportFileName } from "./exportReport";

interface Props {
    /** کلِ فرم Formik — `values` برای سربرگ و `setFieldError` برای خطاهای submit */
    formik: { values: Record<string, string>; setFieldError: (field: string, message?: string) => void };
    reportId: number | null;
    locked?: boolean;
    /**
     * ایشوی ۱۸ (مورد ۱۱): `view` حالتِ صفحه‌ی «نمایش گزارش» از لیست است —
     * دکمه‌ی «خروجی اکسل» همین‌جا می‌ماند.
     *
     * بند ۶: در حالتِ فرم، «ثبت نهایی گزارش» به نوارِ پایینِ فرم رفته تا کنارِ
     * «ذخیره پیش‌نویس» بنشیند؛ پس اینجا فقط چاپِ وضعیت می‌ماند.
     */
    mode?: "form" | "view";
}

/**
 * تب «پیش‌نمایش» — سربرگ + فعالیت‌ها + پنج زیرمجموعه یکجا، فقط‌خواندنی
 * (درخواست کارفرما: تبِ آخر فرم، پیش از «ثبت نهایی» همه‌چیز را نشان دهد).
 *
 * ایشوی ۱۰: زیرمجموعه‌ها دیگر پنج جدولِ سراسری نیستند؛ هر فعالیت بلوکِ خودش
 * را دارد و ردیف‌های نیرو/ماشین/مصالح/تحویل/تایم‌شیتِ همان فعالیت زیر آن
 * می‌نشینند (`groupLines`) تا ناظر ببیند هر عملکردِ متعلق به کدام Task است.
 */
export default function PreviewPanel({ formik, reportId, locked = false, mode = "form" }: Props) {
    const [exporting, setExporting] = useState(false);
    const { report, loading, label, baseUnit } = usePreview(reportId, formik.values.project_id, formik.values.company_id);

    if (!reportId) {
        return <Notice text="ابتدا سربرگ گزارش را ذخیره کنید تا پیش‌نمایش گزارش نمایش داده شود." />;
    }

    if (loading && !report) {
        return <Loading />;
    }

    if (!report) {
        return <Notice text="این گزارش پیدا نشد؛ به صفحه‌ی لیست گزارش‌ها برگردید." />;
    }

    const ctx: HeaderContext = { contact: (id) => label("contacts", id) };
    const contactName = (id?: number | string | null) => label("contacts", id);
    const reasonName = (ids?: (number | string)[]) => joinedLabels(ids, (id) => label("deviationReasons", id));
    /**
     * بند ۶: دکمه‌ی «ثبت نهایی» حالا در نوارِ پایینِ فرم است و صفحه بعد از
     * موفقیت `locked` را روشن می‌کند؛ `report.status` تا رفرشِ بعدی عقب می‌ماند،
     * پس وضعیت از همان `locked` خوانده می‌شود تا اینجا «پیش‌نویس» دروغ نگوید.
     */
    const status = locked ? 1 : Number(report.status);
    const submitted = status === 1;

    /** خروجی اکسلِ عینِ همین صفحه — ایشوی ۱۸ (مورد ۱۱) */
    const download = async () => {
        if (!report) return;

        setExporting(true);

        try {
            await exportReport(report, ctx, label, contactName, reasonName, baseUnit, reportFileName(report));
            toast.success("فایل اکسل گزارش آماده شد.");
        } catch {
            toast.error("خروجی اکسل ساخته نشد.");
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <Section title="سربرگ">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                    {HEADER_FIELDS.map((field) => (
                        <div key={field.title} className="flex flex-col gap-1 rounded border bg-secondary/50 px-2 py-1.5">
                            <span className="text-[0.65rem] text-[#777777]">{field.title}</span>
                            <span className="text-[0.75rem] font-medium break-words">{field.value(report, ctx)}</span>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="فعالیت‌های انجام شده">
                <ActivitiesTable
                    rows={report.activities ?? []}
                    loading={loading}
                    baseUnit={baseUnit}
                    contactName={contactName}
                    reasonName={reasonName}
                    readonly
                    onEdit={() => {}}
                    onDelete={() => {}}
                />
            </Section>

            {groupByActivity(report).map((block) => (
                <Section key={block.key} title={`فعالیت ${block.title} — ${block.count} ردیف زیرمجموعه`}>
                    {block.parts.length === 0 ? (
                        <Notice text="برای این فعالیت در پنج بخش زیرمجموعه ردیفی ثبت نشده است." />
                    ) : (
                        // ایشوی ۱۸ (مورد ۱۰): بالای هر جدول عنوانِ همان بخش تا
                        // مشخص شود جدول به چه چیزی مربوط است
                        block.parts.map(({ kind, rows }) => (
                            <div key={kind} className="flex flex-col gap-2">
                                <p className="text-xs font-bold text-[#777777]">{LINE_CONFIGS[kind].title}</p>
                                <LineTable config={LINE_CONFIGS[kind]} rows={rows} loading={loading} label={label} readonly />
                            </div>
                        ))
                    )}
                </Section>
            ))}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                <span className={`text-xs font-bold ${submitted ? "text-green-600" : "text-[#777777]"}`}>
                    وضعیت: {REPORT_STATUS[status] ?? "—"}
                </span>

                {mode === "view" && (
                    <div className="w-44">
                        <Button onClick={download} isLoading={exporting}>
                            خروجی اکسل
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="flex flex-col gap-3">
            <p className="text-sm font-bold">{title}</p>
            {children}
        </section>
    );
}
