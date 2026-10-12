import type { FormikProps } from "formik";
import { Slider, SliderRange, SliderThumb, SliderTrack } from "@/components/ui/slider";
import { percentOf } from "./progress";
import type { ActivityValues } from "./types";

interface Props {
    name: "daily_progress" | "quality_percent";
    title: string;
    formik: FormikProps<ActivityValues>;
    /** سابقه‌ی این تسک در پروژه — فقط «درصد پیشرفت» مقدارِ غیرصفر دارد */
    base?: number;
    required?: boolean;
}

/**
 * فیلدِ درصد با اسلایدر — ایشوی ۱۱ و ۵.
 *
 * ایشوی ۵ (تک‌خطی): نوارِ جداِ زیرین حذف شد و خودِ اسلایدر تجمعی نشان
 * می‌دهد؛ `min = سابقه` تا بخشِ خاکستریِ چپ همان «قبلاً انجام شده» باشد و
 * بخشِ رنگی فقط پیشرفتِ همین گزارش. مقدارِ نوشته‌شده در فرم همچنان **delta**
 * است (`اسلایدر − سابقه`) چون `daily_progress` پیشرفتِ همین گزارش است (بند ۲۱۰)
 * و `cumulative_progress` را Backend جمع می‌زند.
 *
 * ایشوی ۱۱: نوار عمداً از سابقه شروع می‌شود تا هنگام انتخاب تسک دیده شود
 * قبلاً چقدر پیش رفته و مقدار جدید از کجا ادامه می‌یابد.
 *
 * خطای سرور بدون قیدِ `touched` نمایش داده می‌شود چون `applyApiErrors` فقط
 * `setFieldError` می‌زند؛ وگرنه پیامِ مهمِ «تجمعی بیش از ۱۰۰ درصد» که Backend
 * روی همین فیلد می‌گذارد نامرئی می‌ماند.
 */
export default function ProgressField({ name, title, formik, base = 0, required = false }: Props) {
    const isProgress = name === "daily_progress";
    const value = percentOf(formik.values[name]);
    const before = percentOf(base);
    /** رسیدنِ سابقه به ۱۰۰ یعنی جایی برای پیشرفت نمانده؛ اسلایدر قفل می‌شود */
    const done = isProgress && before >= 100;
    /** روی اسلایدر مقدارِ تجمعی می‌نشیند؛ فرم همان delta را نگه می‌دارد */
    const total = done ? 100 : isProgress ? Math.min(100, before + value) : value;
    const sliderMin = isProgress && !done ? before : 0;
    const error = formik.errors[name];

    const onSlide = (next: number[]) => {
        const shown = next[0] ?? 0;
        formik.setFieldValue(name, isProgress && !done ? Math.max(0, shown - before) : shown);
    };

    return (
        <div className="flex w-full flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
                <label htmlFor={name} className="flex items-center gap-0.5 text-[0.8rem]! text-[#000000e0] font-bold">
                    {required && <span className="text-red-500">* </span>}
                    {title}
                </label>
                <span className="rounded bg-secondary px-2 py-0.5 text-[0.75rem] font-bold tabular-nums">مجموع {total}٪</span>
            </div>

            <Slider
                value={[total]}
                onValueChange={onSlide}
                min={sliderMin}
                max={100}
                step={1}
                disabled={done}
                aria-label={`${title} — مجموع`}
            >
                <SliderTrack className="bg-muted">
                    {/* ایشوی ۸: نوارِ کیفیت هم همان رنگِ نوارِ درصد پیشرفت است */}
                    <SliderRange className="bg-primary" />
                </SliderTrack>
                <SliderThumb id={name} aria-label={title} />
            </Slider>

            <div className="flex items-center justify-between gap-2 text-[0.65rem] text-[#777777]">
                {done ? (
                    <span className="font-medium text-foreground">پیشرفتِ این تسک به ۱۰۰٪ رسیده است</span>
                ) : before > 0 ? (
                    <>
                        <span>قبلاً {before}٪</span>
                        <span className="font-medium text-foreground">+{value}٪ این گزارش</span>
                        <span className="font-bold">مجموع {total}٪</span>
                    </>
                ) : (
                    <>
                        <span>{isProgress ? "بدون سابقه در این پروژه" : "کیفیتِ همین گزارش"}</span>
                        <span className="font-bold">{value}٪</span>
                    </>
                )}
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
    );
}
