import { useState } from "react";
import Button from "@/components/shared/Button";
import Notice from "../Notice";
import { LINE_CONFIGS } from "./config";
import LineForm from "./LineForm";
import LineTable from "./LineTable";
import useLines from "./useLines";
import useLookups from "./useLookups";
import { emptyValues, toValues, type LineKind, type LineRow, type LineValues } from "./types";

interface Props {
    kind: LineKind;
    /** مالکِ ردیف‌ها — ایشوی ۱۰: ردیفِ زیرمجموعه فقط به یک فعالیت تعلق دارد */
    activityId: number | string | null;
    /** `project_id` سربرگ برای واژه‌نامه (کالا / واحد / اشخاص / نوع ماشین) */
    projectId: string;
    /** `company_id` سربرگ (ایشوی ۱) — واژه‌نامه و اشخاص به شرکت می‌روند */
    companyId?: string;
    locked?: boolean;
}

/**
 * بدنه‌ی یکی از پنج زیرمجموعه (نیرو / ماشین‌آلات / مصالح / تحویل / تایم‌شیت)
 * داخلِ دیالوگِ فعالیت — سند فاز ۲ بندهای ۸ تا ۱۲ + ایشوی ۱۰.
 *
 * فقط توصیفِ داده بین پنج تب فرق دارد (`config.ts`)؛ بارگذاری، ذخیره‌ی همان
 * لحظه‌ای، جدول و دیالوگ همگی مشترک‌اند (ایشوی ۸/۹). ذخیره فوری است پس
 * جابه‌جایی بین تب‌ها هیچ ورودی‌ای را از بین نمی‌برد.
 *
 * داشتنِ ردیف در هر پنج بخش «الزامی» نیست (ایشوی ۱۰-C)؛ فقط مالکیت اجباری
 * است. پس بخشِ خالی فقط پیام می‌دهد و چیزی را قفل نمی‌کند.
 */
export default function LinesPanel({ kind, activityId, projectId, companyId = "", locked = false }: Props) {
    const config = LINE_CONFIGS[kind];
    const lookups = useLookups(projectId, companyId);
    const { rows, loading, saving, save, remove } = useLines(kind, activityId);

    const [open, setOpen] = useState(false);
    const [initial, setInitial] = useState<LineValues | null>(null);

    if (!activityId) {
        return <Notice text={`ابتدا مشخصات این فعالیت را ذخیره کنید تا امکان ثبت «${config.entity}» فراهم شود.`} />;
    }

    const add = () => {
        setInitial(emptyValues(config.fields));
        setOpen(true);
    };

    const edit = (row: LineRow) => {
        setInitial(toValues(config.fields, row));
        setOpen(true);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold">{config.title}</p>
                    <p className="text-xs text-[#777777]">{config.subtitle}</p>
                </div>

                <div className="w-52">
                    <Button onClick={add} disabled={locked}>
                        افزودن {config.entity}
                    </Button>
                </div>
            </div>

            <LineTable config={config} rows={rows} loading={loading} label={lookups.label} readonly={locked} onEdit={edit} onDelete={(row) => remove(row.id)} />

            <LineForm config={config} open={open} onClose={() => setOpen(false)} options={lookups.options} initial={initial} saving={saving} onSave={save} />
        </div>
    );
}
