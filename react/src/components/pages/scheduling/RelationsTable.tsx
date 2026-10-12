import Confirm from "@/components/ui/confirm";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { checkAccess } from "@/lib/utils";
import { PenBox, Trash2Icon } from "lucide-react";
import Empty from "@/components/shared/Empty";
import Loading from "@/components/shared/Loading";
import { Link } from "react-router-dom";
import { lagLabel, taskLabel, typeLabel } from "./options";

interface Props {
    relations: any[];
    loading: boolean;
    onDelete: (relation: any) => void;
}

/**
 * Feedback 4: the "Lag / Lead" column is now the Persian "پیش افتادگی / تاخیر"
 */
const COLUMNS = ["ردیف", "پروژه", "تسک مقدم", "نوع رابطه", "تسک وابسته", "پیش افتادگی / تاخیر", "عملیات"];

/** گروهِ یک «رابطهٔ چندتسکی» — همان پنج ستونی که سرور هنگام ثبت کنار هم نوشته */
const groupKey = (r: any) => [r.project_id, r.predecessor_task_id, r.relation_type, r.lag, r.lag_unit].join("|");

/** ایشوی ۶: ثبتِ چندتسکی ردیف‌های جدا می‌سازد، ولی لیست باید همه را یک سطر ببیند */
function groupRelations(rows: any[]) {
    const ordered = new Map<string, any[]>();

    rows.forEach((row) => {
        const key = groupKey(row);
        const bucket = ordered.get(key);
        if (bucket) bucket.push(row);
        else ordered.set(key, [row]);
    });

    return [...ordered.values()].map((bucket) => ({ head: bucket[0], successors: bucket }));
}

export default function RelationsTable({ relations, loading, onDelete }: Props) {
    const groups = groupRelations(relations);

    return (
        <div className="flex flex-col">
            <div className="w-full justify-between gap-4 p-4 bg-secondary rounded-t-md grid grid-cols-7">
                {COLUMNS.map((l: string) => (
                    <div key={l} className="flex items-center justify-center">
                        <span className="text-xs font-bold text-[#777777]">{l}</span>
                    </div>
                ))}
            </div>

            {loading ? (
                <div className="w-full flex items-center justify-center py-5">
                    <Loading />
                </div>
            ) : groups.length === 0 ? (
                <Empty />
            ) : (
                <div className="flex flex-col gap-1 border border-t-0">
                    {groups.map(({ head, successors }, i: number) => (
                        <div key={head.id} className="w-full grid grid-cols-7 justify-between gap-4 px-4 py-1 hover:bg-gray-50 border-b">
                            <Cell>{i + 1}</Cell>
                            <Cell>{head?.project?.name || "-"}</Cell>
                            <Cell>{taskLabel(head?.predecessor) || `#${head.predecessor_task_id}`}</Cell>
                            <Cell>
                                <span className="font-bold">{typeLabel(head.relation_type)}</span>
                            </Cell>
                            <Cell>
                                {successors.map((relation: any) => taskLabel(relation?.successor) || `#${relation.successor_task_id}`).join("، ")}
                            </Cell>
                            <Cell>{lagLabel(head)}</Cell>

                            <div className="flex flex-wrap items-center justify-center py-3 gap-3">
                                {checkAccess([2407]) && (
                                    <Link to={`/task-relation/edit/${head.id}`} className="cursor-pointer" role="link" aria-label="ویرایش">
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

                                {checkAccess([2408]) && (
                                    <Confirm title="حذف رابطه" onConfirm={() => onDelete(head)}>
                                        <button className="cursor-pointer" aria-label="حذف">
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
        </div>
    );
}

function Cell({ children }: { children: any }) {
    return (
        <div className="flex items-center justify-center py-3">
            <span className="text-xs text-center">{children}</span>
        </div>
    );
}
