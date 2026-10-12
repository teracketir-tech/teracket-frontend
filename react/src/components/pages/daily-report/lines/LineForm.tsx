import { useFormik, type FormikProps } from "formik";
import Button from "@/components/shared/Button";
import Modal from "@/components/shared/Modal";
import Input from "@/components/shared/inputs";
import Select from "@/components/shared/inputs/Select";
import Textarea from "@/components/shared/inputs/Textarea";
import { applyApiErrors } from "@/lib/apiErrors";
import { toOptions } from "@/lib/report-rules";
import type { DictOption } from "@/components/shared/dictionaries";
import { lineSchema } from "./schema";
import { emptyValues, type ApiResponse, type LineConfig, type LineField, type LineValues, type OptionSource } from "./types";

const ghostButton =
    "h-10 px-5 rounded border border-secondary bg-white text-foreground text-sm transition-all hover:bg-secondary disabled:opacity-50 cursor-pointer";

/**
 * ایشوی ۱۸ (مورد ۹): فقط تحویل کالا و تایم‌شیت (ستونِ زیاد) تمام‌عرض می‌مانند.
 *
 * بند ۵: سه دیالوگِ نیروی انسانی/ماشین‌آلات/مصالح کمی بازتر از پیش‌فرضِ
 * `max-w-lg` می‌شوند (`max-w-2xl`) چون فیلدهایشان دوتایی‌اند و فضا کم می‌آید.
 * `DialogContent` با `cn` رندر می‌شود پس `max-w-2xl` بر پیش‌فرض می‌چربد.
 */
const isWide = (config: LineConfig) => config.kind === "deliveries" || config.kind === "timesheets";

interface Props {
    config: LineConfig;
    open: boolean;
    onClose: () => void;
    /** گزینه‌های هر منبع از `useLookups` می‌آیند تا هر سلکت جدا نخواند */
    options: Record<OptionSource, DictOption[]>;
    /** `null` یعنی افزودن؛ در غیر این صورت مقادیر ردیفِ در حال ویرایش */
    initial: LineValues | null;
    saving: boolean;
    onSave: (values: LineValues) => Promise<ApiResponse | null>;
}

/**
 * دیالوگ افزودن/ویرایش یک ردیف زیرمجموعه — فیلدها از `config.ts` می‌آیند پس
 * پنج دیالوگِ کپی‌شده نداریم (ایشوی ۹، همان الگوی دیالوگ فعالیت‌ها).
 *
 * ایشوی ۱۰: این دیالوگ حالا رویِ دیالوگِ فعالیت باز می‌شود و مالکیتِ ردیف از
 * `activityId` می‌آید؛ خودش دیگر «گزارش» را نمی‌شناسد. گِیتِ شرطی هم خارج
 * شد چون والد (LinesPanel) وقتی مالک نباشد اصلاً رندرش نمی‌کند.
 */
export default function LineForm({ config, open, onClose, options, initial, saving, onSave }: Props) {
    const formik = useFormik({
        initialValues: initial ?? emptyValues(config.fields),
        validationSchema: lineSchema(config.kind),
        validateOnChange: true,
        validateOnMount: true,
        enableReinitialize: true,
        onSubmit: async (values, helpers) => {
            const res = await onSave(values);

            if (res?.success) {
                onClose();
                return;
            }

            if (res) applyApiErrors(res, helpers);
        },
    });

    return (
        <Modal
            title={initial?.id ? `ویرایش ${config.entity}` : `افزودن ${config.entity}`}
            open={open}
            setOpen={(value) => !value && onClose()}
            className={isWide(config) ? "w-11/12 sm:max-w-none" : "sm:max-w-2xl"}
        >
            <form onSubmit={formik.handleSubmit} className="flex min-w-0 flex-col gap-5">
                <div className={`max-h-[62vh] overflow-y-auto pl-1 grid grid-cols-1 gap-4 ${isWide(config) ? "md:grid-cols-3" : "sm:grid-cols-2"}`}>
                    {config.fields.map((field) => (
                        <div key={field.name} className={field.kind === "textarea" ? `${isWide(config) ? "md:col-span-3" : "sm:col-span-2"} flex flex-col gap-2` : ""}>
                            {renderField(field, formik, options)}
                            {field.hint && <p className="text-xs text-[#777777]">{field.hint}</p>}
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-end gap-3 border-t pt-3">
                    <button type="button" className={ghostButton} onClick={onClose}>
                        انصراف
                    </button>
                    <div className="w-44">
                        <Button type="submit" isLoading={saving} disabled={!formik.isValid}>
                            ذخیره
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}

/** سلکتِ enum سمت سرور یا واژه‌نامه؛ ورودی‌های عددی/متنی/ساعت از همان `Input` مشترک */
function renderField(field: LineField, formik: FormikProps<LineValues>, options: Record<OptionSource, DictOption[]>) {
    // برچسبِ دینامیک (ایشوی ۹): «مقدار (واحد)» از محصولِ انتخاب‌شده می‌آید
    const title = field.titleOf ? field.titleOf(formik.values, options) : field.title;
    const common = { name: field.name, title, formik, required: field.required ?? true };

    if (field.kind === "select") {
        const base: DictOption[] = field.list ? toOptions(field.list) : (options[field.source as OptionSource] ?? []);
        /** ایشوی ۲.۱: اشخاصِ سلکت، همان سمتِ انتخاب‌شده در فیلدِ بالایی‌اند */
        const source = field.filterBy ? base.filter((option) => option.position === String(formik.values[field.filterBy ?? ""] ?? "")) : base;

        return (
            <Select
                {...common}
                formik={field.multi ? multiFormik(formik, field.name) : formik}
                options={source}
                isMulti={field.multi}
                isClearable={field.required !== true}
                // react-select خودش `touched` را ست نمی‌کند؛ بدون این، پیام خطای
                // سلکت هرگز دیده نمی‌شود (همان باگِ پیش‌تر رفع‌شده روی Input عددی)
                onChange={() => formik.setFieldTouched(field.name, true)}
            />
        );
    }

    if (field.kind === "textarea") return <Textarea {...common} required={field.required ?? false} />;

    if (field.kind === "number") return <Input {...common} type="number" required={field.required ?? false} />;

    if (field.kind === "time") return <Input {...common} type="time" ltrInput required={field.required ?? false} />;

    return <Input {...common} type="text" required={field.required ?? false} autoComplete="off" />;
}

/**
 * پوششِ Formik برای سلکتِ مالتی (ایشوی ۲.۳).
 *
 * `Select` در حالتِ مالتی مقدار را آرایه می‌دهد، ولی مقادیرِ فرمِ زیرمجموعه‌ها
 * همه‌ رشته‌اند (`LineValues`) تا payload یک‌دست بماند. این پوشش هنگامِ نوشتن
 * آرایه را به رشته‌ی «۱،۲» بدل می‌کند و هنگامِ خواندن همان رشته را برمی‌گرداند؛
 * بقیه‌ی رفتارِ Formik (errors / touched / setFieldTouched) دست‌نخورده می‌ماند.
 */
function multiFormik(formik: FormikProps<LineValues>, name: string) {
    return {
        ...formik,
        values: { ...formik.values, [name]: String(formik.values[name] ?? "") },
        setFieldValue: (field: string, value: unknown) => formik.setFieldValue(field, Array.isArray(value) ? value.join(",") : value),
    };
}
