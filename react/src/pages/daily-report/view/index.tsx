import { ClipboardList } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PreviewPanel from "@/components/pages/daily-report/preview/PreviewPanel";

/**
 * صفحه‌ی «نمایش گزارش» — ایشوی ۱۸ (مورد ۱۱).
 *
 * دکمه‌ی «نمایش» لیست گزارش‌ها به همین‌جا می‌آید: همان محتوای تبِ پیش‌نمایش
 * (سربرگ + فعالیت‌ها + پنج زیرمجموعه) با دکمه‌ی «خروجی اکسل» به‌جای «ثبت
 * نهایی». داده را خودِ `PreviewPanel` می‌خواند؛ پروژه و شرکت هم از کوئری‌استرینگ
 * می‌آیند تا برچسب‌ها از همان اول درست بارگذاری شوند و اگر نبودند از خودِ
 * گزارش پر می‌شوند (`usePreview`).
 */
export default function ViewDailyReport() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    /** `setFieldError` اینجا کاری ندارد؛ فقط برای هم‌شکل بودن با فرم است */
    const formik = {
        values: {
            project_id: searchParams.get("project_id") ?? "",
            company_id: searchParams.get("company_id") ?? "",
        },
        setFieldError: () => {},
    };

    return (
        <div className="w-full flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <ClipboardList className="w-6 h-6" />
                    نمایش گزارش روزانه
                </h2>

                <button
                    type="button"
                    onClick={() => navigate("/daily-report")}
                    className="flex h-9 cursor-pointer items-center rounded border border-secondary bg-white px-4 text-sm transition-all hover:bg-secondary"
                >
                    بازگشت به لیست
                </button>
            </div>

            <PreviewPanel formik={formik} reportId={Number(id) || null} mode="view" />
        </div>
    );
}
