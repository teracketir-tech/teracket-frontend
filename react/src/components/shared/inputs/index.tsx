import { persianNumberToEn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

interface Props {
    title?: any;
    placeholder?: string;
    name: string;
    inputMode?: "numeric" | "text";
    ltrInput?: boolean;
    autoFocus?: boolean;
    type?: "number" | "text" | "password" | "file" | "time";
    formik?: any;
    noErrorText?: boolean;
    required?: boolean;
    disabled?: boolean;
    isLoading?: boolean;
    autoComplete?: string;
    value?: any;
    onChange?: any;
}

/**
 * عددِ ورودی را با جداکننده‌ی هزارگان نشان می‌دهد بی‌آنکه رقم اعشار را حذف کند.
 *
 * `formatNumber` اینجا به درد نمی‌خورد: پیش‌فرضِ آن صفر رقم اعشار است (پارامترِ
 * `fixed` حتی با مقدارِ صریحِ `undefined` هم به پیش‌فرض برمی‌گردد) و باعث می‌شد
 * مقدارِ نمایش‌داده‌شده با مقدارِ واقعیِ فورم فرق کند؛ مثلاً ۱٫۵ ساعت اضافه‌کاری
 * «۲» نشان داده می‌شد ولی همان ۱٫۵ ذخیره می‌شد.
 */
const formatEditableNumber = (value: string | number) => {
    const [int, dec] = value.toString().split(".");

    return `${Number(int || 0).toLocaleString()}${dec === undefined ? "" : `.${dec}`}`;
};

const Input = ({
    title,
    inputMode = "text",
    name,
    placeholder = "",
    ltrInput = false,
    autoFocus = false,
    type = "text",
    formik,
    noErrorText = false,
    required = true,
    disabled = false,
    isLoading = false,
    autoComplete = "true",
    value = "",
    onChange = () => {},
}: Props) => {
    const classes = `${
        formik?.errors?.[name] && formik?.touched?.[name] ? "border-[#ff4d4f]" : "border-secondary focus:border-primary"
    } border focus:shadow rounded px-2 py-1.5 outline-none w-full h-[2.35rem]! bg-white transition-all disabled:opacity-50 placeholder:text-right text-[0.8rem] ${
        type == "password" ? "pl-11" : ""
    }`;

    const [showPass, setShowPass] = useState(false);
    const activeValue = value || formik?.values?.[name] || "";

    const isNumber = (e: any) => !isNaN(e) && !e?.toString()?.endsWith(".");

    return (
        <>
            {type === "number" ? (
                <div className={`w-full flex flex-col gap-2 ${isLoading ? "animate-pulse" : ""}`}>
                    {title && (
                        <label htmlFor={name} className="flex items-center gap-0.5 text-[0.8rem]! text-[#000000e0] font-bold">
                            {required ? <span className="text-red-500">* </span> : null}
                            {title}
                        </label>
                    )}
                    <div className="w-full relative">
                        <input
                            type="text"
                            inputMode="text"
                            className={classes}
                            id={name}
                            autoFocus={autoFocus}
                            dir="ltr"
                            placeholder={placeholder}
                            disabled={disabled}
                            // اینجا از formatNumber استفاده نمی‌شود چون پیش‌فرضِ آن صفر رقم
                            // اعشار است و عددِ نمایش‌داده‌شده با مقدار واقعیِ فورم فرق می‌کرد
                            // (مثلاً ۱٫۵ ساعت اضافه‌کاری که «۲» نشان داده می‌شد)
                            value={isNumber(activeValue) ? formatEditableNumber(activeValue) : activeValue}
                            onChange={(e: any) => {
                                const v = e.target.value.replaceAll(",", "");
                                const value = isNumber(v) ? persianNumberToEn(v) : v;

                                onChange && onChange(value);
                                formik && formik?.setFieldValue(name, value);
                            }}
                            // شاخه‌ی text از getFieldProps استفاده می‌کند و onBlur دارد؛ بدون این خط
                            // فیلدهای عددی هیچ‌وقت touched نمی‌شوند و پیام خطا هرگز دیده نمی‌شود
                            onBlur={() => formik?.setFieldTouched(name, true)}
                        />
                    </div>
                    {!noErrorText && formik?.errors?.[name] && formik?.touched?.[name] && <p className="text-red-500 text-xs">{formik?.errors?.[name]}</p>}
                </div>
            ) : type === "file" ? (
                <div className={`w-full flex flex-col gap-2 ${isLoading ? "animate-pulse" : ""}`}>
                    {title && (
                        <label htmlFor={name} className="flex items-center gap-0.5 text-[0.8rem]! text-[#000000e0] font-bold">
                            {required ? <span className="text-red-500">* </span> : null}
                            {title}
                        </label>
                    )}
                    <div className="w-full relative">
                        <input
                            name={name}
                            className={classes}
                            id={name}
                            type={type}
                            autoFocus={autoFocus}
                            inputMode={inputMode}
                            dir={ltrInput ? "ltr" : "rtl"}
                            placeholder={placeholder}
                            disabled={disabled}
                            autoComplete={autoComplete}
                            onChange={(e) => formik?.setFieldValue(name, e.target?.files?.[0] || null)}
                        />
                    </div>

                    {!noErrorText && formik?.errors?.[name] && formik?.touched?.[name] && <p className="text-red-500 text-xs">{formik?.errors?.[name]}</p>}
                </div>
            ) : (
                <div className={`w-full flex flex-col gap-2 ${isLoading ? "animate-pulse" : ""}`}>
                    {title && (
                        <label htmlFor={name} className="flex items-center gap-0.5 text-[0.8rem]! text-[#000000e0] font-bold">
                            {required ? <span className="text-red-500">* </span> : null}
                            {title}
                        </label>
                    )}
                    <div className="w-full relative">
                        <input
                            {...formik?.getFieldProps(name)}
                            value={activeValue}
                            onChange={(e: any) => {
                                onChange && onChange(e.target.value);
                                formik?.setFieldValue(name, e.target.value);
                            }}
                            className={classes}
                            id={name}
                            type={showPass ? "text" : type}
                            autoFocus={autoFocus}
                            inputMode={inputMode}
                            dir={ltrInput ? "ltr" : "rtl"}
                            placeholder={placeholder}
                            disabled={disabled}
                            autoComplete={autoComplete}
                        />

                        {type == "password" && (
                            <button type="button" onClick={() => setShowPass(!showPass)}>
                                {showPass ? (
                                    <EyeOffIcon className="size-5 absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer" />
                                ) : (
                                    <EyeIcon className="size-5 absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer" />
                                )}
                            </button>
                        )}
                    </div>

                    {!noErrorText && formik?.errors?.[name] && formik?.touched?.[name] && <p className="text-red-500 text-xs">{formik?.errors?.[name]}</p>}
                </div>
            )}
        </>
    );
};

export default Input;
