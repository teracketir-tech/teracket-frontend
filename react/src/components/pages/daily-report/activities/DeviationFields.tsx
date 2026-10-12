import type { FormikProps } from "formik";
import Select from "@/components/shared/inputs/Select";
import type { DictOption } from "@/components/shared/dictionaries";
import type { ActivityValues } from "./types";

interface Props {
    formik: FormikProps<ActivityValues>;
    /** دلایلِ انحراف از همان واژه‌نامه‌ی فرم گزارش (ایشوی ۱۲) */
    options: DictOption[];
}

/**
 * سلکتِ مالتی «عوامل انحراف» — ایشوی ۴.
 *
 * زمانی تبِ جدا بود (ایشوی ۱۲) و حالا داخلِ «مشخصات فعالیت» نشسته چون فیلدِ
 * فعالیت و دلایلِ انحرافِ آن یکجا دیده می‌شوند. چندتایی است: مقدار یک آرایه
 * از شناسه‌هاست و سرور همان را با `sync` در جدول رابطه
 * `daily_report_activity_deviation` می‌نویسد (ستونِ تکی حذف شده).
 *
 * فهرستِ گزینه‌ها از واژه‌نامه می‌آید و خودِ فهرست از همین دیالوگ ساخته
 * نمی‌شود — لینکِ راهنما کاربر را به «پروژه ← عوامل انحراف» می‌برد.
 */
export default function DeviationFields({ formik, options }: Props) {
    const empty = options.length === 0;

    return (
        <>
            <Select
                name="deviation_reason_ids"
                title="عوامل انحراف"
                formik={formik}
                options={options}
                isMulti
                required={false}
                placeholder={empty ? "موردی ثبت نشده است" : "چند مورد را می‌توانید انتخاب کنید"}
            />

            <div className="rounded-md border bg-secondary/50 p-3">
                <p className="text-[0.75rem] leading-6 text-[#777777]">
                    {empty
                        ? "هنوز عامل انحرافی ثبت نشده است؛ از منوی «پروژه ← عوامل انحراف ← عامل انحراف جدید» فهرست را کامل کنید."
                        : "اگر این فعالیت از برنامه منحرف شده، دلایلش را انتخاب کنید (چند مورد مجاز است). انتخاب‌ها همراه با خودِ فعالیت ذخیره می‌شوند و در فهرست گزارش هم دیده می‌شوند."}
                </p>
            </div>
        </>
    );
}
