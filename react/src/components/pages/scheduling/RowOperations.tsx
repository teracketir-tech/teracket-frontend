import Confirm from "@/components/ui/confirm";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { checkAccess } from "@/lib/utils";
import { PenBox, Plus, Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
    task: any;
    onAdd: (task: any) => void;
    onDelete: (task: any) => void;
}

/**
 * آیکون‌های سمت چپ هر سطر؛ دسترسی با کد ۲۴۰۱/۲۴۰۳/۲۴۰۴ کنترل می‌شود.
 *
 * ایشوی ۲ (درخواست کارفرما): دکمهٔ «مشاهده گراف» از هر سطر حذف شد و فقط
 * دکمهٔ یکتایِ بالای لیست ماند؛ گرافِ تک‌تسک همان شبکهٔ پروژه بود با چند
 * گرهٔ کمتر، پس چیز تازه‌ای نشان نمی‌داد.
 */
export default function RowOperations({ task, onAdd, onDelete }: Props) {
    return (
        <div className="flex flex-wrap items-center justify-center py-3 gap-1.5">
            {checkAccess([2401]) && (
                <button className="cursor-pointer" onClick={() => onAdd(task)} aria-label="زیرمجموعه جدید">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Plus className="w-3.5 h-3.5" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>زیرمجموعه جدید</p>
                        </TooltipContent>
                    </Tooltip>
                </button>
            )}

            {checkAccess([2403]) && (
                <Link to={`/task/edit/${task.id}`} className="cursor-pointer" role="link" aria-label="ویرایش">
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

            {checkAccess([2404]) && (
                <Confirm title="حذف تسک" onConfirm={() => onDelete(task)}>
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
    );
}
