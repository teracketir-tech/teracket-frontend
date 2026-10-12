import Pagination from "@/components/shared/Pagination";
import { api } from "@/lib/axios";
import { checkAccess, cn } from "@/lib/utils";
import { CalendarRangeIcon, PenBox, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Confirm from "@/components/ui/confirm";
import { toast } from "sonner";
import { Link, useSearchParams } from "react-router-dom";
import Empty from "@/components/shared/Empty";
import Loading from "@/components/shared/Loading";
import FilterForm from "@/components/pages/project/Filter";
import { dateLabel } from "@/lib/labels";

export default function ProjectList() {
    const [searchParams] = useSearchParams();
    const [projects, setProjects] = useState<any>({});
    const [loading, setLoading] = useState<any>(true);

    const fetchProjects = async () => {
        const params = new URLSearchParams(searchParams.toString());
        const query = params.toString();

        setLoading(true);

        const res = await api(`project?${query ? `${query}&` : ""}expand=company`, "GET");

        setProjects(res);
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        setLoading(true);

        const res = await api(`project/${id}`, "DELETE");

        if (res?.success) {
            fetchProjects();
            toast.success("پروژه با موفقیت حذف شد.");
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [searchParams]);

    return (
        <div className="w-full">
            <FilterForm loading={loading} />

            <>
                <Title />

                {loading ? (
                    <div className="w-full flex items-center justify-center py-5">
                        <Loading />
                    </div>
                ) : projects?.data?.length == 0 ? (
                    <Empty />
                ) : (
                    <div className="flex flex-col gap-1 border">
                        {projects?.data?.map((project: any, i: number) => (
                            <div key={project.id} className="w-full grid grid-cols-6 justify-between gap-4 px-4 py-1 hover:bg-gray-50 border-b">
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{i + 1}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{project.id}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{project.name}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{project?.company?.name}</span>
                                </div>
                                {/* ایشوی ۱: ستونِ تاریخ شروع — همان لنگرِ زمان‌بندی، شمسی برای نمایش */}
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{dateLabel(project.start_date)}</span>
                                </div>
                                <div className="flex flex-wrap items-center justify-center py-4 gap-3">
                                    {checkAccess([2402]) && (
                                        <Link to={`/task?project_id=${project.id}`} className="cursor-pointer" role="link">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <CalendarRangeIcon className="w-3.5 h-3.5" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>لیست تسک ها (WBS)</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </Link>
                                    )}

                                    {checkAccess([203]) && (
                                        <Link to={`/project/edit/${project.id}`} className="cursor-pointer" role="link">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <PenBox className="w-3.5 h-3.5" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>ویرایش</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </Link>
                                    )}

                                    {checkAccess([204]) && (
                                        <Confirm title="حذف پروژه" onConfirm={() => handleDelete(project.id)}>
                                            <button className="cursor-pointer">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Trash2Icon className="w-4 h-4 text-red-500" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>حذف</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </button>
                                        </Confirm>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Pagination totalPage={projects.pages} />
            </>
        </div>
    );
}

function Title() {
    const list = ["ردیف", "شناسه", "نام", "شرکت", "تاریخ شروع", "عملیات"];

    return (
        <div className="w-full justify-between gap-4 p-4 bg-secondary rounded-t-md grid grid-cols-6">
            {list.map((l: string, i: number) => (
                <div key={i} className={cn("flex items-center justify-center")}>
                    <span className="text-xs font-bold text-[#777777]">{l}</span>
                </div>
            ))}
        </div>
    );
}
