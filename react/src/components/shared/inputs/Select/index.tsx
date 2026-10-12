import ReactSelect from "react-select";
import { useMenuWheelGuard } from "./useMenuWheelGuard";

interface Props {
    name: string;
    formik?: any;
    title?: any;
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
    isClearable?: boolean;
    onSearch?: (search: string) => void;
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
    isClearable = true,
    onSearch,
}: Props) => {
    const activeValue = value || formik?.values?.[name] || "";
    const menuPortalTarget = useMenuWheelGuard();

    const selectedOption = () => {
        try {
            if (isMulti)
                return (
                    options?.filter((o: any) =>
                        activeValue
                            ?.toString()
                            ?.split(",")
                            ?.some((av: any) => av == o.value),
                    ) ?? []
                );
            // `null` نه `undefined`: `useStateManager` ری‌اکت‌سِلکت برای `undefined`
            // به مقدارِ داخلیِ خودش (آخرین انتخاب) برمی‌گردد و سلکت بعد از خالی‌شدنِ
            // فرم (مثلاً با عوض‌شدنِ گروهِ عامل انحراف) همچنان برچسبِ کهنه را نشان می‌دهد.
            else return options?.find((o: any) => o.value == activeValue) ?? null;
        } catch (error) {
            return null;
        }
    };

    return (
        <div className={`w-full flex flex-col gap-2 ${isLoading ? "animate-pulse" : ""}`}>
            {title && (
                <label htmlFor={name} className={`flex items-center gap-1 text-[0.8rem]! text-[#000000e0] font-bold ${classNameTitle}`}>
                    {required ? <span className="text-red-500">* </span> : null}
                    {title}
                </label>
            )}

            <ReactSelect
                isMulti={isMulti}
                value={selectedOption()}
                onInputChange={(search: any) => {
                    onSearch && onSearch(search);
                }}
                onChange={(e: any) => {
                    const value = isMulti ? e.map((v: any) => v.value) : e?.value || "";

                    setValue && setValue(value);
                    onChange && onChange(value);

                    formik && formik.setFieldValue(name, value);
                }}
                isClearable={isClearable}
                options={options}
                placeholder={placeholder}
                defaultValue={defaultValue}
                className={`*:bg-white! shadow-white! text-[0.8rem]! min-h-10! ${formik && formik?.errors?.[name] && formik?.touched?.[name] ? "*:border-[#ff4d4f]!" : "*:border-[#dddddd]!"} active:*:shadow-primary! active:*:border-primary! ${disabled ? "opacity-50" : ""} ${className}`}
                noOptionsMessage={() => "موردی پیدا نشد"}
                loadingMessage={() => "در حال بروزرسانی"}
                isDisabled={disabled}
                isLoading={isLoading}
                autoFocus={false}
                menuPosition="absolute"
                menuPlacement="auto"
                /**
                 * ایشوی ۱۸ (مورد ۱۲): منوی سلکت در `body` رندر می‌شود تا داخلِ
                 * `overflow` مودال (و جدول‌های اسکرول‌خور) گیر نیفتد و روی مودالِ
                 * والد هم بیفتد. z-index بالاتر از دیالوگ (50) تا پنهان نشود.
                 *
                 * `pointerEvents: auto` هم لازم است: Radix هنگامِ باز بودنِ مودالِ
                 * modal دستورِ `pointer-events: none` روی `body` می‌دهد و از آنجا
                 * منوی پورتال‌شده «ارث» می‌برد؛ بدون این، گزینه‌ها دیده می‌شوند ولی
                 * کلیک از آن‌ها رد می‌شود و به لایه‌ی پس‌زمینه‌ی مودال می‌رسد.
                 */
                /**
                 * هدف، `div` مخصوصِ خود hook است (نه `body`) تا شنونده‌ی
                 * `stopPropagation` آن رویدادِ `wheel` را پیش از `document`
                 * نگه دارد؛ وگرنه قفلِ اسکرولِ Radix هر اسکرولِ منو را لغو می‌کرد.
                 */
                menuPortalTarget={menuPortalTarget}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 999, pointerEvents: "auto" as const }) }}
            />

            {formik && formik?.errors?.[name] && formik?.touched?.[name] && <p className="text-red-500 text-xs">{formik?.errors?.[name]}</p>}
        </div>
    );
};

export default Select;
