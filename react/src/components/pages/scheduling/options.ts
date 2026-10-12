/**
 * ثابت‌ها و ابزارهای مشترک دامنه‌ی زمان‌بندی (لیست‌ها، فیلترها و فرم‌ها)
 */

export const UNIT_DAY = "1";
export const UNIT_HOUR = "2";

export const durationUnitOptions = [
    { value: UNIT_DAY, label: "روز" },
    { value: UNIT_HOUR, label: "ساعت" },
];

export const relationTypeOptions = [
    { value: "FS", label: "FS — پایان به شروع" },
    { value: "SS", label: "SS — شروع به شروع" },
    { value: "FF", label: "FF — پایان به پایان" },
    { value: "SF", label: "SF — شروع به پایان" },
];

/**
 * شکلِ بجِ بحرانی — هم‌شکل بج «دریافت شده/پرداخت نشده» صفحه‌ی دریافت‌ها.
 * رنگِ متن عمداً اینجا نیست و مصرف‌کننده تعیین می‌کند: ستون «بحرانی» قرمز،
 * بج‌های فهرست «مسیر بحرانی» مشکی. دایره‌ی نشانگر را هم خودِ مصرف‌کننده می‌گذارد.
 */
export const criticalBadge = "py-1 px-2 rounded-full text-xs bg-red-50";

/** مرتب‌سازی سلسله‌مراتبی کدهای WBS: 1 ، 1.2 ، 1.2.1 ، 2 */
export const byWbs = (a: any, b: any) => {
    const pa = String(a?.wbs_code ?? "").split(".");
    const pb = String(b?.wbs_code ?? "").split(".");
    const len = Math.max(pa.length, pb.length);

    for (let i = 0; i < len; i++) {
        const na = Number(pa[i] ?? -1);
        const nb = Number(pb[i] ?? -1);
        if (na !== nb) return na - nb;
    }

    return 0;
};

/** کد WBS گرهٔ پروژه — تنها ردیفِ ریشه؛ فرزندانش 1 ، 1.1 می‌گیرند */
export const ROOT_WBS_CODE = "0";

/**
 * عمق ردیف در درخت WBS (گرهٔ پروژه = 0).
 *
 * کدهای فرزندان دیگر پیشوندِ صفر ندارند، پس عمقِ هر ردیفِ غیر از گره تعداد
 * بخش‌های کدِ آن است (1 → عمق ۱ ، 1.1 → عمق ۲).
 */
export const depthOf = (task: any) => {
    const parts = String(task?.wbs_code ?? "").split(".");
    if (parts[0] === "") return 0;

    return parts[0] === ROOT_WBS_CODE ? 0 : parts.length;
};

/** برچسب تسک برای انتخاب‌گرها: «1.2 — نام تسک» */
export const taskLabel = (task: any) => (task ? `${task.wbs_code ? task.wbs_code + " — " : ""}${task.name}` : "");

/** گزینه‌های انتخاب‌گر تسک‌ها، به ترتیب سلسله‌مراتبی WBS */
export const toTaskOptions = (tasks: any[]) => [...tasks].sort(byWbs).map((task: any) => ({ value: String(task.id), label: taskLabel(task) }));

/** برچسب نوع رابطه (FS/SS/FF/SF) */
export const typeLabel = (type: string) => relationTypeOptions.find((o) => o.value === type)?.label ?? type;

/**
 * Feedback 4: the Persian equivalent of Lead / Lag. Positive means "تاخیر"
 * (the successor starts later), negative means "پیش افتادگی" (earlier).
 */
export const lagLabel = (relation: any) => {
    const value = Number(relation.lag || 0);
    const unit = Number(relation.lag_unit) === 2 ? "ساعت" : "روز";

    if (value === 0) return `0 ${unit}`;
    return `${value > 0 ? "تاخیر" : "پیش افتادگی"} ${Math.abs(value)} ${unit}`;
};

/**
 * خودِ تسک و همه زیرمجموعه‌هایش نمی‌توانند والد آن شوند
 * تا حلقه درختی ساخته نشود.
 */
export const excludedSubtree = (task: any, tasks: any[]) => {
    const ids = new Set<string>();
    if (!task) return ids;

    ids.add(String(task.id));

    for (let changed = true; changed; ) {
        changed = false;
        tasks.forEach((t: any) => {
            if (t.parent_id && ids.has(String(t.parent_id)) && !ids.has(String(t.id))) {
                ids.add(String(t.id));
                changed = true;
            }
        });
    }

    return ids;
};

/** تسک جدید باید بعد از خواهر و برادرهای خود قرار بگیرد، نه ابتدای فهرست */
export const nextSortOrder = (tasks: any[], parentId: any) => {
    const key = parentId ? String(parentId) : "";
    return tasks.filter((t: any) => (t.parent_id ? String(t.parent_id) : "") === key).length + 1;
};
