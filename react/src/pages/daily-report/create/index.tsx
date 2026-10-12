import { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Button from "@/components/shared/Button";
import Loading from "@/components/shared/Loading";
import { api } from "@/lib/axios";
import { applyApiErrors } from "@/lib/apiErrors";
import { useAuth } from "@/context/AuthContext";
import TabBar from "@/components/pages/daily-report/TabBar";
import ReportPanel from "@/components/pages/daily-report/panels";
import type { ReportData } from "@/components/pages/daily-report/report";
import { FIRST_TAB, LAST_TAB, REPORT_TABS, nextTab, prevTab, tabTitle } from "@/components/pages/daily-report/tabs";
import validationSchema from "./validationSchema";

const INITIAL_VALUES = {
    /** ایشوی ۱: شرکتِ سربرگ — فیلترِ همه‌ی سلکت‌های تا پایان ثبت گزارش */
    company_id: "",
    project_id: "",
    report_date: "",
    weather_status: "",
    weather_note: "",
    site_status: "",
    inactive_reason: "",
    document_no: "",
    revision: "",
    project_manager_id: "",
    site_supervisor_id: "",
    /** ایشوی ۱۸: «تنظیم‌کننده فرم» حذف شد؛ سرور آن را با کاربرِ ثبت‌کننده پر می‌کند */
};

const navButton =
    "h-10 px-5 rounded bg-secondary text-foreground text-sm transition-all hover:bg-gray-200 disabled:opacity-50 cursor-pointer disabled:cursor-default";

/**
 * بند ۶: «ذخیره پیش‌نویس» در تبِ پیش‌نمایش بدونِ پس‌زمینه است و با بوردرِ
 * دوتاییِ primary و متنِ primary دیده می‌شود تا از «ثبت نهایی» کنارش متمایز
 * بماند. اینجا `<Button>` استفاده نمی‌شود چون کلاس‌هایش را merge نمی‌کند و
 * `bg-[#222529]` بر `bg-transparent` می‌چربید.
 */
const outlineButton =
    "h-10 px-5 rounded border-2 border-primary bg-transparent text-primary text-sm transition-all hover:bg-primary/10 disabled:opacity-50 cursor-pointer disabled:cursor-default";

/** سربرگِ خوانده‌شده از سرور → مقادیر رشته‌ایِ Formik */
function toHeaderValues(report: ReportData): typeof INITIAL_VALUES {
    const str = (value: unknown) => (value === null || value === undefined ? "" : String(value));

    return {
        company_id: str(report.company_id),
        project_id: str(report.project_id),
        report_date: str(report.report_date),
        weather_status: str(report.weather_status),
        weather_note: str(report.weather_note),
        site_status: str(report.site_status),
        inactive_reason: str(report.inactive_reason),
        document_no: str(report.document_no),
        revision: str(report.revision),
        project_manager_id: str(report.project_manager_id),
        site_supervisor_id: str(report.site_supervisor_id),
    };
}

/**
 * فرم گزارش روزانه — ایشوی ۷ (زیرساخت) و ایشوی ۹ (پنج تبِ زیرمجموعه،
 * پیش‌نمایش، ثبت نهایی و حالت ویرایش).
 *
 * `editMode=1` یعنی `/daily-report/edit/:id`: سربرگ از `GET hq/daily-report/{id}`
 * پر می‌شود و همه‌ی تب‌ها همان گزارش را می‌بینند. state فرم در سطح صفحه می‌ماند
 * تا جابه‌جایی بین تب‌ها هیچ ورودی‌ای را پاک نکند.
 */
export default function CreateDailyReport({ editMode = 0 }: { editMode?: number }) {
    const { id } = useParams();
    const { auth } = useAuth();
    const [tab, setTab] = useState(FIRST_TAB);
    const [loading, setLoading] = useState(false);
    const [booting, setBooting] = useState(false);
    const [reportId, setReportId] = useState<number | null>(null);
    /** بعد از «ثبت نهایی» فرم قفل می‌شود (سند فاز ۲ بند ۳۵۷) */
    const [submitted, setSubmitted] = useState(false);
    /** بند ۳: شمارشِ فعالیت‌ها برای مسدود کردن رفتن به «پیش‌نمایشِ» خالی */
    const [activities, setActivities] = useState({ count: 0, loading: false });
    /** بند ۶: بارِ ثبتِ نهایی — دکمه حالا اینجا و کنارِ «ذخیره پیش‌نویس» است */
    const [submitting, setSubmitting] = useState(false);

    const formik = useFormik({
        /**
         * کاربرِ وابسته به شرکت، شرکتِ خودش را از پیش دارد و سلکت هم پنهان
         * می‌شود (ایشوی ۱)؛ بقیه از صفر شروع می‌کنند و دیتای همه‌ی شرکت‌ها
         * می‌آید تا خودشان شرکت را انتخاب کنند.
         */
        initialValues: { ...INITIAL_VALUES, company_id: auth?.company_id ? String(auth.company_id) : "" },
        validationSchema,
        validateOnChange: true,
        validateOnMount: true,
        onSubmit,
    });

    const currentIndex = REPORT_TABS.findIndex((t) => t.id === tab);
    /** تب‌هایی که کامل شده‌اند → تیک در نوار تب */
    const completed = formik.isValid ? ["header"] : [];

    /**
     * بند ۳: پنلِ فعالیت‌ها شمارش را گزارش می‌دهد. مقدارِ تکراری نادیده
     * گرفته می‌شود چون کالبکِ پایدار نیست وگرنه رندر در حلقه می‌افتاد.
     */
    const onActivitiesChange = useCallback((count: number, loading: boolean) => {
        setActivities((prev) => (prev.count === count && prev.loading === loading ? prev : { count, loading }));
    }, []);

    /**
     * بند ۳: در تبِ «فعالیت‌ها»، بدونِ هیچ فعالیتِ ثبت‌شده‌ای نمی‌توان به تبِ
     * «پیش‌نمایش» رفت. فقط از همین تب اعمال می‌شود چون شمارش را همان پنل
     * می‌دهد و در بقیه‌ی تب‌ها هنوز بارگذاری نشده است.
     */
    const goToTab = (next: string) => {
        const blocked = tab === "activities" && next === LAST_TAB && !activities.loading && activities.count === 0;

        if (blocked) {
            toast.error("برای رفتن به «پیش‌نمایش» ابتدا دست‌کم یک فعالیت ثبت کنید.");
            return;
        }

        setTab(next);
    };

    useEffect(() => {
        if (!editMode || !id) return;

        setBooting(true);

        api(`daily-report/${id}`, "GET")
            .then((res) => {
                if (!res?.success) return;

                setReportId(Number(res.data.id));
                setSubmitted(Number(res.data.status) === 1);
                setTab(FIRST_TAB);
                formik.setValues(toHeaderValues(res.data));
            })
            .finally(() => setBooting(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, editMode]);

    function onSubmit(values: typeof INITIAL_VALUES) {
        setLoading(true);

        api(reportId ? `daily-report/${reportId}` : "daily-report", reportId ? "PATCH" : "POST", values)
            .then((res) => {
                if (res?.success) {
                    if (!reportId) setReportId(res?.data?.id);
                    if (tab !== LAST_TAB) goToTab(nextTab(tab));
                    toast.success(reportId ? "گزارش روزانه بروزرسانی شد." : "پیش‌نویس گزارش ذخیره شد.");
                    return;
                }

                applyApiErrors(res, formik);
            })
            .finally(() => setLoading(false));
    }

    /**
     * بند ۶: «ثبت نهایی» از تبِ پیش‌نمایش به نوارِ پایینِ فرم آمده تا کنارِ
     * «ذخیره پیش‌نویس» باشد؛ رفتارش همانِ رفتارِ قبلیِ پنل است.
     */
    async function submitReport() {
        if (!reportId) return;

        setSubmitting(true);

        try {
            const res = await api(`daily-report/${reportId}/submit`, "POST", formik.values);

            if (res?.success) {
                toast.success("گزارش روزانه ثبت نهایی شد.");
                setSubmitted(true);
                return;
            }

            if (res) {
                toast.error(res.message || "ثبت نهایی انجام نشد؛ خطاهای فرم را بررسی کنید.");
                applyApiErrors(res, formik);
            }
        } catch {
            // `api` خودش پیام خطا را نمایش داده است
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Card className="w-full">
            <CardHeader className="mb-5">
                {/* بند ۲: تیتر فقط به مسیر بستگی دارد؛ ذخیره‌ی پیش‌نویس آن را عوض نمی‌کند */}
                <CardTitle>{editMode ? "ویرایش گزارش روزانه" : "گزارش روزانه جدید"}</CardTitle>
                <CardDescription>جابه‌جایی بین تب‌ها آزاد است؛ تیک یعنی آن بخش کامل شده است</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-6">
                {booting ? (
                    <Loading />
                ) : (
                    <Tabs value={tab} onValueChange={goToTab}>
                        <TabBar value={tab} onChange={goToTab} completed={completed} />

                        {REPORT_TABS.map((reportTab) => (
                            <TabsContent key={reportTab.id} value={reportTab.id} forceMount>
                                <ReportPanel
                                    tab={reportTab.id}
                                    formik={formik}
                                    reportId={reportId}
                                    locked={submitted}
                                    onActivitiesChange={onActivitiesChange}
                                />
                            </TabsContent>
                        ))}
                    </Tabs>
                )}
            </CardContent>

            <CardFooter className="justify-between gap-3">
                <div className="flex items-center gap-3">
                    <button type="button" className={navButton} disabled={currentIndex === 0} onClick={() => goToTab(prevTab(tab))}>
                        قبلی
                    </button>
                    <button type="button" className={navButton} disabled={tab === LAST_TAB} onClick={() => goToTab(nextTab(tab))}>
                        بعدی
                    </button>
                </div>

                {submitted ? (
                    <p className="text-xs font-bold text-green-600">این گزارش ثبت نهایی شده و فقط‌خواندنی است</p>
                ) : tab === LAST_TAB ? (
                    /**
                     * بند ۶: «ثبت نهایی گزارش» کنارِ «ذخیره پیش‌نویس» آمده و هر
                     * کدام نصفِ همان فضایی را می‌گیرند که پیش‌تر دکمه‌ی ذخیره تنها
                     * داشت. `grid-cols-2` عمدی است: در flex هر فرزندِ `flex-1`
                     * از صفر شروع می‌شود ولی paddingِ دکمه روی همان صفر می‌نشیند
                     * و ستونِ خالیِ پهلو ۴۴px پهن‌تر می‌شد. ذخیره‌ی پیش‌نویس هم
                     * بدونِ پس‌زمینه، با بوردرِ دوتاییِ primary است.
                     */
                    <div className="grid flex-1 grid-cols-2 gap-3">
                        <button
                            type="button"
                            className={outlineButton}
                            // `handleSubmit` انتظار رویدادِ Formik دارد؛ اینجا رویدادِ ماوس نمی‌خواهد
                            onClick={() => formik.handleSubmit()}
                            disabled={loading || !formik.isValid || booting}
                        >
                            ذخیره پیش‌نویس
                        </button>
                        <div>
                            <Button onClick={submitReport} isLoading={submitting} disabled={!reportId || booting}>
                                ثبت نهایی گزارش
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Button onClick={formik.handleSubmit} isLoading={loading} disabled={!formik.isValid || booting}>
                        {`ذخیره و رفتن به «${tabTitle(nextTab(tab))}»`}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
