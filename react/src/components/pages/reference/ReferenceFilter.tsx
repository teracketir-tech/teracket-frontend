import { useMemo, useState, type ReactNode } from "react";
import { useFormik, type FormikProps } from "formik";
import { useSearchParams } from "react-router-dom";
import Filters from "@/components/shared/Filters";

interface Props {
    /** بارگذاریِ فهرستِ پشتِ بلاک، برای دکمه‌ی «جستجو» */
    loading: boolean;
    /** مقادیر اولیه — کلیدها همان پارامترهای GET که سرور می‌شناسد */
    defaults: Record<string, unknown>;
    /** شمار ستون‌های grid برابر با تعداد فیلترها */
    cols: number;
    children: (formik: FormikProps<Record<string, unknown>>) => ReactNode;
}

/**
 * بلاکِ فیلترِ مشترکِ دو لیستِ مرجع — الگوی صفحه‌ی «کالاها» (ایشوی ۱۵).
 *
 * نوشتنِ URL را خودِ `Filters` انجام می‌دهد (`value.toString()` که آرایه‌ی
 * سلکتِ مالتی را «1,2» می‌کند)؛ اینجا فقط فرمیک داریم. مقادیر از query خوانده
 * می‌شوند تا صفحه‌ای که با `?name=…` باز شده سلکت‌هایش پُر باشد — محاسبه داخلِ
 * رندر است نه افکت، پس نه `set-state-in-effect` می‌گیرد نه `exhaustive-deps`.
 */
export default function ReferenceFilter({ loading, defaults, cols, children }: Props) {
    const [open, setOpen] = useState(false);
    const [searchParams] = useSearchParams();

    const initialValues = useMemo(() => {
        const base: Record<string, unknown> = { ...defaults };

        Object.keys(defaults).forEach((key) => {
            const from = searchParams.get(key);

            if (from) base[key] = from;
        });

        return base;
    }, [defaults, searchParams]);

    const formik = useFormik<Record<string, unknown>>({
        initialValues,
        validationSchema: false,
        // «جستجو» را خودِ `Filters` با `value.toString()` روی URL می‌نشاند؛
        // formik فقط نگهدارنده‌ی مقادیر است پس اینجا کاری برای انجام نیست.
        onSubmit: () => undefined,
    });

    return (
        <Filters open={open} setOpen={setOpen} loading={loading} formik={formik} onReset={() => formik.setValues(defaults)}>
            <form className="w-full gap-5" style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                {children(formik)}
            </form>
        </Filters>
    );
}
