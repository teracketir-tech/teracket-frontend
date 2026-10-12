import type { FormikProps } from "formik";
import Input from "@/components/shared/inputs";
import Select from "@/components/shared/inputs/Select";
import DateInput from "@/components/shared/inputs/Date";
import Textarea from "@/components/shared/inputs/Textarea";
import ContactSelect from "@/components/shared/ContactSelect";
import DeviationFields from "./DeviationFields";
import type { ContactOption } from "@/lib/contacts";
import type { DictOption } from "@/components/shared/dictionaries";
import { dateLabel, durationLabel, slackLabel } from "@/lib/labels";
import { ACTIVITY_STATUS, toOptions } from "@/lib/report-rules";
import { POSITION_EXECUTOR, POSITION_SUPERVISOR_ACTIVITY } from "@/lib/positions";
import ProgressField from "./ProgressField";
import { baseOf, type ProgressTask } from "./progress";
import { plannedOf, selectableTasks, type ActivityRow, type ActivityValues, type Num, type PlannedInfo } from "./types";

const STATUS_OPTIONS = toOptions(ACTIVITY_STATUS);

interface Props {
    formik: FormikProps<ActivityValues>;
    /**
     * شناسه‌ی فعالیتِ ذخیره‌شده. تا وقتی `null` است فعالیت ساخته نشده و سلکت
     * باید همه‌ی تسک‌های آزاد را نشان دهد؛ پس از ذخیره، فقط تسکِ همین ردیف
     * می‌ماند (وگرنه ذخیره‌ی دوم فعالیتِ تکراری می‌ساخت).
     */
    activityId: number | string | null;
    /** ردیفِ در حال ویرایش — برای نامِ تسک وقتی دیگر در `tasks` نیست */
    initial: ActivityValues | null;
    /** تسک‌ها همراهِ `previous_progress` می‌آیند تا نوار از سابقه ادامه یابد */
    tasks: ProgressTask[];
    rows: ActivityRow[];
    contacts: ContactOption[];
    /** دلایل انحراف از واژه‌نامه — سلکتِ مالتیِ «عوامل انحراف» (ایشوی ۴) */
    deviationReasons: DictOption[];
    baseUnit: Num;
}

/**
 * فیلدهای تبِ «مشخصات فعالیت» — از دیالوگ جدا شد تا پوسته‌ی شش‌تبِ ایشوی ۱۰
 * زیر ۲۰۰ خط بماند؛ کلِ داده و منطق اینجاست و دیالوگ فقط تب‌ها را می‌چیند.
 */
export default function ActivityFields({ formik, activityId, initial, tasks, rows, contacts, deviationReasons, baseUnit }: Props) {
    const selected = tasks.find((task) => String(task.id) === String(formik.values.task_id));
    const planned = plannedOf(selected);

    /**
     * فیلترِ سمت (ایشوی ۲.۱): اشخاصِ سربرگ با سمتِ همان فیلد. لیست `contacts`
     * از سربرگِ گزارش می‌آید (همه‌ی سمت‌ها، محدود به شرکت) و اینجا فقط سمتِ
     * لازم نگه داشته می‌شود — رفت‌وبرگشتِ درخواستِ تازه لازم نیست.
     */
    const byPosition = (position: number) => contacts.filter((contact) => contact.position === String(position));
    /** پیمانکار بدونِ فیلترِ سمت (ایشوی ۲.۱): هر شخصی می‌تواند پیمانکار باشد */

    const option = (value: string | number, wbsCode?: string | null, name?: string | null) => ({
        value: String(value),
        label: `${wbsCode || "-"} — ${name || ""}`,
    });

    // در ویرایش تسک عوض نمی‌شود، ولی سلکت باید «فوکوس‌پذیر» بماند: Radix هنگام
    // باز شدن دیالوگ روی اولین فوکوس‌پذیر می‌نشیند و اگر disabled باشد، فوکوس
    // روی فیلد تاریخ می‌افتد و react-multi-date-picker با فوکوس روی مقدار خالی
    // امروز را واردِ فرم می‌کند (تاریخِ پیش‌بینی بدون اراده‌ی کاربر پر می‌شد).
    const options = activityId
        ? [option(formik.values.task_id, selected?.wbs_code ?? initial?.wbs_code, selected?.name ?? initial?.task_name)]
        : selectableTasks(tasks, rows, activityId ?? undefined).map((task) => option(task.id, task.wbs_code, task.name));

    return (
        <div className="max-h-[52vh] overflow-y-auto pl-1 flex flex-col gap-5">
            <Select
                name="task_id"
                title="کد / عنوان فعالیت"
                formik={formik}
                options={options}
                disabled={options.length === 0}
                placeholder={options.length ? "انتخاب کنید" : "تسکی برای این پروژه ثبت نشده است"}
            />

            {selected && <PlannedBox planned={planned} baseUnit={baseUnit} />}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <DateInput name="supervisor_forecast_date" title="تاریخ پیش‌بینی سرپرست" formik={formik} required={false} />
                <ContactSelect name="executor_id" title="مسئول اجرای فعالیت" formik={formik} options={byPosition(POSITION_EXECUTOR)} required={false} />
                <ContactSelect name="supervisor_id" title="مسئول نظارت فعالیت" formik={formik} options={byPosition(POSITION_SUPERVISOR_ACTIVITY)} required={false} />

                <Input type="number" name="work_hours" title="میزان زمان صرف شده (ساعت)" formik={formik} required={false} />
                <ProgressField name="daily_progress" title="درصد پیشرفت فعالیت" formik={formik} base={baseOf(selected)} required />
                <ProgressField name="quality_percent" title="کیفیت انجام فعالیت (درصد)" formik={formik} required={false} />

                {/* ایشوی ۳: تنها جایِ پیمانکار در کلِ فرمِ گزارش */}
                <ContactSelect name="contractor_id" title="پیمانکار" formik={formik} options={contacts} required={false} />

                <Select name="status" title="وضعیت فعلی" formik={formik} options={STATUS_OPTIONS} required={false} />
            </div>

            {/* ایشوی ۴: جایگزینِ تبِ «عوامل انحراف» */}
            <DeviationFields formik={formik} options={deviationReasons} />

            <Textarea name="description" title="توضیحات" formik={formik} required={false} />
            <Textarea name="risks" title="مخاطرات یا ریسک‌های انجام فعالیت" formik={formik} required={false} />
        </div>
    );
}

/** کادرِ readOnlyِ اطلاعات برنامه‌ای — از CPM همان تسک، نه از ورودی ناظر */
function PlannedBox({ planned, baseUnit }: { planned: PlannedInfo; baseUnit: Num }) {
    const items: [string, string][] = [
        ["مدت فعالیت", durationLabel(planned.duration, planned.unit)],
        ["شروع برنامه‌ای", dateLabel(planned.start_date)],
        ["پایان برنامه‌ای", dateLabel(planned.finish_date)],
        ["شناوری آزاد", slackLabel(planned.free_float, baseUnit)],
        ["دیرترین پایان ممکن", dateLabel(planned.late_finish_date)],
    ];

    return (
        <div className="rounded-md border bg-secondary/50 p-3">
            <p className="mb-2 text-[0.75rem] font-bold text-[#777777]">اطلاعات برنامه‌ای (غیرقابل ویرایش)</p>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                {items.map(([label, value]) => (
                    <div key={label} className="flex flex-col gap-1 rounded bg-white px-2 py-1.5">
                        <span className="text-[0.65rem] text-[#777777]">{label}</span>
                        <span className="text-[0.75rem] font-medium">{value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
