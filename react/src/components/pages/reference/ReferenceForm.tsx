import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useFormik, type FormikProps } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import type { AnyObjectSchema } from "yup";
import Button from "@/components/shared/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/axios";

interface Props {
    /** پیشوندِ endpoint — `daily-report-equipment-type` یا `daily-report-deviation-reason` */
    endpoint: string;
    /** مسیرِ فهرست، مقصدِ پس از ذخیره‌ی موفق */
    basePath: string;
    /** نامِ نمایشیِ همان لیست در پیام‌ها */
    title: string;
    /** قواعدِ اعتبارسنجی — از `schema.ts` می‌آید */
    schema: AnyObjectSchema;
    /** مقادیر اولیه‌ی حالتِ افزودن؛ در حالتِ ویرایش با ردیفِ خوانده‌شده پر می‌شود */
    defaults: Record<string, unknown>;
    editMode?: number;
    /** فیلدهای فرم — هر لیست چیدمانِ خودش را می‌سازد */
    children: (formik: FormikProps<Record<string, unknown>>) => ReactNode;
}

/**
 * فرمِ افزودن/ویرایشِ یک لیستِ مرجع — ایشوی ۱۲ و ۱۵، الگوی صفحه‌ی «کالاها».
 *
 * بدنه‌ی فرم از بیرون می‌آید (render prop) چون عوامل انحراف پنج فیلد دارد و
 * ماشین‌آلات دو تای؛ پوسته (کارت، دکمه‌ها، خواندنِ ردیف، ذخیره) یکی است و
 * نباید دو بار نوشته شود (DRY). «ترتیب نمایش» دیگر فیلد نیست: ایشوی ۱۵ آن را
 * از فرم حذف کرد و ترتیب از `id` می‌آید.
 *
 * مقدارِ خوانده‌شده از `initialValues` می‌آید نه `setValues`، تا `enableReinitialize`
 * خودش مقادیر را بنشاند (فرمِ عمیقاً برابر reset نمی‌شود و تایپ کاربر گم نمی‌شود).
 */
export default function ReferenceForm({ endpoint, basePath, title, schema, defaults, editMode = 0, children }: Props) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    /**
     * ردیفِ در حال ویرایش. `undefined` یعنی هنوز نخوانده‌ایم (بارگذاری)، `null`
     * یعنی چیزی پیدا نشد. حالتِ افزودن هرگز نمی‌خواند پس همان `undefined` می‌ماند
     * و بارگذاری فقط در حالتِ ویرایش معنا دارد — `setState` هم مستقیم داخلِ بدنه‌ی
     * افکت زده نمی‌شود (قاعده‌ی `react-hooks/set-state-in-effect`).
     */
    const [row, setRow] = useState<Record<string, unknown> | null | undefined>(undefined);

    useEffect(() => {
        if (!editMode || !id) return;

        let alive = true;

        api(`${endpoint}/${id}`)
            .then((res) => {
                if (alive) setRow(res?.success ? (res.data ?? null) : null);
            })
            .catch(() => {
                // `api` خودش toast زده است؛ فرم خالی می‌ماند
                if (alive) setRow(null);
            });

        return () => {
            alive = false;
        };
    }, [editMode, id, endpoint]);

    const loading = editMode ? row === undefined : false;

    /** حالتِ افزودن: `defaults`؛ حالتِ ویرایش: همان کلیدها از روی ردیفِ خوانده‌شده */
    const initialValues = useMemo(() => {
        const base: Record<string, unknown> = { ...defaults };

        if (!row) return base;

        Object.keys(defaults).forEach((key) => {
            if (!(key in row)) return;

            const value = row[key];

            base[key] = Array.isArray(defaults[key]) ? (Array.isArray(value) ? value : []) : (value ?? "");
        });

        return base;
    }, [defaults, row]);

    const formik = useFormik<Record<string, unknown>>({
        initialValues,
        validationSchema: schema,
        validateOnChange: true,
        validateOnMount: true,
        enableReinitialize: true,
        onSubmit: async (values) => {
            setSubmitting(true);

            try {
                const res = await api(editMode && id ? `${endpoint}/${id}` : endpoint, editMode ? "PATCH" : "POST", values);

                if (res?.success) {
                    toast.success(editMode ? `${title} بروزرسانی شد.` : `${title} اضافه شد.`);
                    navigate(basePath);
                }
            } catch {
                // `api` خودش toast زده است
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <Card className="w-full">
            <CardHeader className="mb-5">
                <CardTitle>{editMode ? `ویرایش ${title}` : `افزودن ${title}`}</CardTitle>
                <CardDescription>تکمیل فیلدهایی که با * مشخص شده اند الزامی می باشد</CardDescription>
            </CardHeader>

            <CardContent>
                <form className="w-full grid grid-cols-3 gap-5 mb-5">{children(formik)}</form>
            </CardContent>

            <CardFooter className="gap-3">
                <Button onClick={formik.handleSubmit} className="mt-5" isLoading={loading || submitting} disabled={!formik.isValid}>
                    ثبت
                </Button>

                <Button onClick={() => navigate(basePath)} className="mt-5 bg-transparent! text-[#222529]! border-2 border-[#222529]!">
                    بازگشت
                </Button>
            </CardFooter>
        </Card>
    );
}
