import Empty from "@/components/shared/Empty";
import Loading from "@/components/shared/Loading";
import ToolTip from "@/components/shared/ToolTip";
import { dateLabel, durationLabel, percentLabel, slackLabel } from "@/lib/labels";
import { criticalBadge, depthOf } from "./options";
import RowOperations from "./RowOperations";

interface Props {
    tasks: any[];
    loading: boolean;
    /** واحد پایه‌ی CPM (`day`/`hour`) برای ستون‌های شناوری */
    unit: string;
    /** نام پروژه‌ی انتخاب‌شده — در لیست، همه‌ی ردیف‌ها یک پروژه‌اند */
    projectName: string;
    onAdd: (task: any) => void;
    onDelete: (task: any) => void;
}

const COLUMNS = [
    "ردیف",
    "پروژه",
    "کد WBS",
    "نام تسک",
    "والد",
    "مدت",
    "بحرانی",
    "شروع",
    "پایان",
    "دیرترین پایان",
    "شناوری کل",
    "شناوری آزاد",
    "درصد پیشرفت",
    "عملیات",
];

/**
 * ۱۴ ستون با عرضِ باز تا داده‌ها روی هم نروند (تاریخ‌ها، بج «بحرانی» و برچسب‌ها جا دارند)
 * و شکاف `8px` بین ستون‌ها نفس می‌کشد. جمع حداقل‌ها + شکاف‌ها ≈ ۱۱۲۰px؛ در پنجره‌های
 * کوچک‌تر جدول داخل `overflow-x-auto` اسکرول افقی می‌خورد. سه ستون متنی با `fr` رشد می‌کنند.
 */
// The operations column is 5.5rem (was 4rem): it now holds four icons —
// add / edit / graph / delete. 72rem is the matching horizontal floor.
const GRID =
    "grid grid-cols-[1.5rem_minmax(5.5rem,1.5fr)_2.5rem_minmax(8rem,2fr)_minmax(5.5rem,1.5fr)_4rem_5.5rem_5rem_5rem_5rem_4rem_4rem_2.75rem_5.5rem] gap-x-2";

export default function TaskTable({ tasks, loading, unit, projectName, onAdd, onDelete }: Props) {
    // عمق نسبی به کم‌عمق‌ترین ردیف همین صفحه، تا نتیجه‌ی فیلتر «والد» هم تورفتگی درست بدهد
    const baseDepth = tasks.length ? Math.min(...tasks.map(depthOf)) : 0;

    return (
        <div className="flex flex-col">
            <div className="w-full overflow-x-auto">
                <div className="min-w-[72rem] flex flex-col">
                    <div className={`${GRID} px-1.5 py-4 bg-secondary rounded-t-md`}>
                        {COLUMNS.map((label) => (
                            <div key={label} className="flex items-center justify-center min-w-0">
                                <span className="text-[0.65rem] font-bold text-[#777777] text-center">{label}</span>
                            </div>
                        ))}
                    </div>

                    {loading ? (
                        <div className="w-full flex items-center justify-center py-5">
                            <Loading />
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="border border-t-0">
                            <Empty />
                        </div>
                    ) : (
                        <div className="flex flex-col border border-t-0">
                            {tasks.map((task: any, i: number) => (
                                <TaskRow
                                    key={task.id}
                                    task={task}
                                    index={i}
                                    baseDepth={baseDepth}
                                    unit={unit}
                                    projectName={projectName}
                                    onAdd={onAdd}
                                    onDelete={onDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function TaskRow({ task, index, baseDepth, unit, projectName, onAdd, onDelete }: any) {
    const cpm = task.cpm;
    const critical = !!cpm?.is_critical;

    // پس‌زمینه‌ی سطر بحرانی حذف شد تا بجِ `bg-red-50` از دل سطر بیرون بزند
    return (
        <div className={`${GRID} px-1.5 py-1 border-b hover:bg-gray-50`}>
            <Cell>{index + 1}</Cell>
            <TextCell text={projectName}>{projectName || "—"}</TextCell>
            <Cell>
                <span className="font-bold">{task.wbs_code || "-"}</span>
            </Cell>

            <div
                className="flex items-center py-3 min-w-0"
                style={{ paddingInlineStart: `${Math.max(0, depthOf(task) - baseDepth) * 0.75}rem` }}
            >
                <span className={`text-[0.72rem] ${cpm?.is_summary ? "font-bold" : ""}`}>{task.name}</span>
            </div>

            <TextCell text={task.parent_name}>{task.parent_name || "—"}</TextCell>
            <Cell>{cpm ? durationLabel(cpm.duration, cpm.unit) : durationLabel(task.duration, task.duration_unit)}</Cell>
            <CriticalCell value={critical} />
            <Cell>{dateLabel(cpm?.start_date)}</Cell>
            <Cell>{dateLabel(cpm?.finish_date)}</Cell>
            <Cell>{dateLabel(cpm?.late_finish_date)}</Cell>
            <Cell>{cpm ? slackLabel(cpm.float, unit) : "—"}</Cell>
            <Cell>{cpm ? slackLabel(cpm.free_float, unit) : "—"}</Cell>
            {/* % Complete از فاز ۲ (گزارش روزانه) می‌آید؛ ردیف والدش rollup فرزندان است */}
            <Cell>{percentLabel(cpm?.progress)}</Cell>

            <RowOperations task={task} onAdd={onAdd} onDelete={onDelete} />
        </div>
    );
}

/** بج هم‌شکل بج «دریافت شده/پرداخت نشده» صفحه‌ی دریافت‌ها */
function CriticalCell({ value }: { value: boolean }) {
    if (!value) return <Cell>—</Cell>;

    return (
        <div className="flex items-center justify-center py-3">
            <div className={`flex items-center gap-1.5 ${criticalBadge} text-red-500`}>
                <p className="size-1.5 rounded-full bg-red-500"></p>
                <p>بحرانی</p>
            </div>
        </div>
    );
}

function Cell({ children }: { children: any }) {
    return (
        <div className="flex items-center justify-center py-3 min-w-0">
            <span className="text-[0.7rem] text-center">{children}</span>
        </div>
    );
}

/**
 * سلول متنی بلند (پروژه/والد): متن با الیپسیس کوتاه می‌شود و نام کامل با
 * کامپوننت مشترک `ToolTip` نشان داده می‌شود — درست مثل ستون «شرح» لیست اسناد.
 */
function TextCell({ children, text }: { children: any; text?: string }) {
    const body = (
        <p className="text-[0.7rem]! text-center truncate" dir="auto">
            {children}
        </p>
    );

    return (
        <div className="flex items-center justify-center py-3 min-w-0 px-0.5">
            <div className="min-w-0 max-w-full">{text ? <ToolTip triger={body} text={text} /> : body}</div>
        </div>
    );
}
