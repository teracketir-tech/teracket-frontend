import HeaderPanel from "./HeaderPanel";
import ActivitiesPanel from "./activities/ActivitiesPanel";
import PreviewPanel from "./preview/PreviewPanel";
import PlaceholderPanel from "./PlaceholderPanel";
import { tabTitle } from "./tabs";

interface Props {
    tab: string;
    /** فقط بخشِ مقادیرِ Formik که پنل‌ها می‌خوانند؛ کلِ فرم در state صفحه است */
    formik: { values: Record<string, string>; setFieldError: (field: string, message?: string) => void };
    /** شناسه‌ی گزارشِ ذخیره‌شده — تب‌های زیرمجموعه به آن نیاز دارند */
    reportId?: number | null;
    locked?: boolean;
    /** بند ۳: شمارشِ فعالیت‌ها برای مسدود کردن رفتن به «پیش‌نمایش» */
    onActivitiesChange?: (count: number, loading: boolean) => void;
}

/**
 * انتخاب پنلِ تبِ فعال.
 *
 * ایشوی ۱۰: پنج تبِ زیرمجموعه از اینجا رفتند چون هر ردیفِ آنها به یک فعالیت
 * تعلق دارد و داخلِ دیالوگِ همان فعالیت ثبت می‌شود. پس فقط سربرگ، فعالیت‌ها
 * و پیش‌نمایش می‌مانند و هر تبِ ناشناخته (کلید قدیمی در URL یا لینک قدیمی)
 * به پیش‌فرض برمی‌گردد به‌جای خطای رندر.
 */
export default function ReportPanel({ tab, formik, reportId = null, locked = false, onActivitiesChange }: Props) {
    if (tab === "header") return <HeaderPanel formik={formik} locked={locked} />;

    if (tab === "activities") return <ActivitiesPanel formik={formik} reportId={reportId} locked={locked} onActivitiesChange={onActivitiesChange} />;

    if (tab === "preview") {
        return <PreviewPanel formik={formik} reportId={reportId} locked={locked} />;
    }

    return <PlaceholderPanel title={tabTitle(tab)} />;
}
