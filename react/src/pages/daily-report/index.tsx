import ReportFilter from "@/components/pages/daily-report/ReportFilter";
import ReportsTable, { type ReportRow } from "@/components/pages/daily-report/ReportsTable";
import Pagination from "@/components/shared/Pagination";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

/**
 * لیست گزارش‌های روزانه (نقش 2422) — سند فاز ۲.
 *
 * هر ردیف به فرمِ همان گزارش می‌رود (`/daily-report/edit/:id`) که سربرگ و همه‌ی
 * تب‌ها را از `GET hq/daily-report/{id}` پر می‌کند.
 */
/** شکل پاسخِ لیستِ صفحه‌بندی‌شده‌ی سرویس‌های hq */
interface ReportsResponse {
    data?: ReportRow[];
    pages?: number;
    totalCount?: number;
}

export default function DailyReportList() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [reports, setReports] = useState<ReportsResponse>({});
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        const query = searchParams.toString();

        setLoading(true);

        try {
            const res = await api(`daily-report?${query}`, "GET");
            setReports(res);
        } catch {
            // api() خودش پیام خطا را نمایش داده است
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (report: ReportRow) => {
        const res = await api(`daily-report/${report.id}`, "DELETE");

        if (res?.success) {
            toast.success("گزارش روزانه با زیرمجموعه‌هایش حذف شد.");
            fetchReports();
        }
    };

    useEffect(() => {
        fetchReports();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    return (
        <div className="w-full">
            <ReportFilter loading={loading} />

            <ReportsTable
                rows={reports?.data ?? []}
                loading={loading}
                onView={(row) =>
                    navigate(
                        `/daily-report/view/${row.id}?${new URLSearchParams({
                            project_id: String(row.project_id ?? ""),
                            company_id: String(row.company_id ?? ""),
                        })}`,
                    )
                }
                onEdit={(row) => navigate(`/daily-report/edit/${row.id}`)}
                onDelete={handleDelete}
            />

            <Pagination totalPage={reports.pages ?? 0} defaultPerPage="20" />
        </div>
    );
}
