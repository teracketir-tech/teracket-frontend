import ReactSelect from "react-select";

interface Props {
    name: string;
    formik?: any;
    title?: string;
    options: any;
    setValue?: (text: string) => void;
    placeholder?: string;
    defaultValue?: {
        value: string;
        label: string;
    };
    className?: string;
    classNameTitle?: string;
    value?: any;
    onChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    isLoading?: boolean;
    isMulti?: boolean;
}

const Select = ({
    name,
    title,
    options,
    setValue,
    placeholder = "انتخاب کنید",
    defaultValue,
    className = "",
    classNameTitle = "",
    value = "",
    onChange,
    required = true,
    disabled = false,
    isLoading = false,
    formik,
    isMulti = false,
}: Props) => {
    // مقدار Select همیشه باید primitive باشد؛ بعضی فرم‌ها قبلاً خودِ option را
    // به prop مقدار می‌دادند و در نتیجه react-select نمی‌توانست گزینه را پیدا کند.
    const rawValue =
        value !== undefined && value !== null && value !== ""
            ? value
            : formik?.values?.[name] ?? "";

    const activeValue =
        rawValue && typeof rawValue === "object" && "value" in rawValue
            ? rawValue.value
            : rawValue;

    const selectedOption = () => {
        try {
            return options?.find(
                (option: any) => String(option.value) === String(activeValue)
            ) ?? null;
        } catch {
            return null;
        }
    };

    return (
        <div className={`w-full flex flex-col gap-2 ${isLoading ? "animate-pulse" : ""}`}>
            {title && (
                <label htmlFor={name} className={`text-[0.8rem] text-[#000000e0] font-bold ${classNameTitle}`}>
                    {required ? <span className="text-red-500">* </span> : null}
                    {title}
                </label>
            )}

            <ReactSelect
                isMulti={isMulti}
                value={selectedOption()}
                onChange={(e: any) => {
                    const value = isMulti
                        ? (e || []).map((option: any) => option.value)
                        : (e?.value ?? "");

                    setValue && setValue(value);
                    onChange && onChange(value);

                    formik && formik.setFieldValue(name, value);
                }}
                isClearable
                options={options}
                placeholder={placeholder}
                defaultValue={defaultValue}
                className={`*:bg-white! shadow-white! text-[0.8rem]! h-10! ${formik && formik?.errors?.[name] && formik?.touched?.[name] ? "*:border-[#ff4d4f]!" : "*:border-[#dddddd]!"} active:*:shadow-primary! active:*:border-primary! ${disabled ? "opacity-50" : ""} ${className}`}
                noOptionsMessage={() => "موردی پیدا نشد"}
                loadingMessage={() => "در حال بروزرسانی"}
                isDisabled={disabled}
                isLoading={isLoading}
            />

            {formik && formik?.errors?.[name] && formik?.touched?.[name] && <p className="text-red-500 text-xs">{formik?.errors?.[name]}</p>}
        </div>
    );
};

export default Select;
