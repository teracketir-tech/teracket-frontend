import CpmSummary from "@/components/pages/scheduling/CpmSummary";
import FilterForm from "@/components/pages/scheduling/Filter";
import TaskTable from "@/components/pages/scheduling/TaskTable";
import { exportWbs } from "@/components/pages/scheduling/exportWbs";
import Button from "@/components/shared/Button";
import Empty from "@/components/shared/Empty";
import Pagination from "@/components/shared/Pagination";
import { api } from "@/lib/axios";
import { checkAccess } from "@/lib/utils";
import { FileSpreadsheet, Network } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

/**
 * لیست تسک‌ها هم مانند لیست روابط و لیست اشخاص با ۱۰ ردیف در هر صفحه باز می‌شود؛
 * `Pagination` صفحه‌ی تکی را مخفی می‌کند پس اندازه‌ی صفحه را هم همان می‌خواند.
 */
const DEFAULT_PER_PAGE = "10";

export default function TaskList() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    // بدون پروژه‌ی انتخاب‌شده نه لیستی هست و نه CPM‌ای؛ درخواست هم نمی‌زنیم
    const projectId = searchParams.get("project_id") || "";

    const fetchTasks = async () => {
        const query = searchParams.toString();

        setLoading(true);

        try {
            // اگر خودِ کاربر در URL اندازه گذاشته باشد همان ملاک است
            const perPage = searchParams.has("per-page") ? "" : `per-page=${DEFAULT_PER_PAGE}`;
            const res = await api(`task?${[perPage, query].filter(Boolean).join("&")}`, "GET");
            setTasks(res);
        } catch {
            // api() خودش پیام خطا را نمایش داده است
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (task: any) => {
        const res = await api(`task/${task.id}`, "DELETE");

        if (res?.success) {
            toast.success("تسک با موفقیت حذف شد.");
            fetchTasks();
        }
    };

    /** خروجی همه‌ی ردیف‌های فیلترشده (بدون صفحه‌بندی) با ستون‌های شیت WBS فایل راهنما */
    const handleExport = async () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("page");
        params.set("per-page", "0");

        setExporting(true);

        try {
            const res: any = await api(`task?${params.toString()}`, "GET");
            const rows = res?.data ?? [];

            if (!rows.length) {
                toast.error("تسکی برای خروجی وجود ندارد.");
                return;
            }

            // نام پروژه از cpm می‌آید؛ ردیف‌ها پروژه را سریالایز نمی‌کنند
            await exportWbs(rows, res?.cpm?.unit ?? "day", res?.cpm?.project_name || projectId);
        } catch {
            // api() خودش پیام خطا را نمایش داده است
        } finally {
            setExporting(false);
        }
    };

    useEffect(() => {
        if (!projectId) {
            setTasks({});
            setLoading(false);
            return;
        }

        fetchTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, projectId]);

    return (
        <div className="w-full">
            <FilterForm loading={loading} />

            {projectId && (
                // ایشوی ۳: دکمه‌های «مشاهده گراف» و «خروجی اکسل» سمتِ راستِ لیست
                <div className="w-full flex items-center justify-start gap-2 mb-4">
                    {checkAccess([2402]) && (
                        <>
                            <Button className="w-auto! flex items-center gap-1" onClick={() => navigate(`/task/graph?project_id=${projectId}`)}>
                                <Network size={17} />
                                <span>مشاهده گراف</span>
                            </Button>

                            <Button className="w-auto! flex items-center gap-1" isLoading={exporting} onClick={handleExport}>
                                <FileSpreadsheet size={17} />
                                <span>خروجی اکسل</span>
                            </Button>
                        </>
                    )}
                </div>
            )}

            {!projectId ? (
                <Empty text="برای مشاهده زمان‌بندی، ابتدا پروژه را انتخاب کنید" />
            ) : (
                <>
                    <CpmSummary cpm={tasks?.cpm} />

                    <TaskTable
                        tasks={tasks?.data ?? []}
                        loading={loading}
                        unit={tasks?.cpm?.unit ?? "day"}
                        projectName={tasks?.cpm?.project_name ?? ""}
                        onAdd={(task) => navigate(`/task/create?project_id=${task.project_id}&parent_id=${task.id}`)}
                        onDelete={handleDelete}
                    />

                    <Pagination totalPage={tasks.pages} defaultPerPage={DEFAULT_PER_PAGE} />
                </>
            )}
        </div>
    );
}
