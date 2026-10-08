interface Props {
    title?: string;
    placeholder?: string;
    name: string;
    ltrInput?: boolean;
    autoFocus?: boolean;
    formik: any;
    noErrorText?: boolean;
    required?: boolean;
    disabled?: boolean;
    isLoading?: boolean;
    className?: string;
}

const Textarea = ({
    title,
    name,
    placeholder = "",
    ltrInput = false,
    autoFocus = false,
    formik,
    noErrorText = false,
    required = true,
    disabled = false,
    isLoading = false,
}: Props) => {
    const classes = `${formik.errors[name] && formik.touched[name] ? "border-[#ff4d4f]" : "border-[#dddddd] focus:border-[#2ba968]"} border focus:shadow rounded px-2 py-1.5 outline-none w-full bg-white transition-all min-h-14 max-h-42 disabled:opacity-50 text-[0.8rem]!`;

    return (
        <div className={`flex flex-col gap-2 ${isLoading ? "animate-pulse" : ""}`}>
            {title && (
                <label htmlFor={name} className="text-[0.8rem]! text-[#000000e0] font-bold">
                    {required ? <span className="text-red-500">* </span> : null}
                    {title}
                </label>
            )}

            <textarea
                className={classes}
                autoFocus={autoFocus}
                dir={ltrInput ? "ltr" : "rtl"}
                placeholder={placeholder}
                {...formik.getFieldProps(name)}
                rows={4}
                disabled={disabled}
                name={name}
            />

            {!noErrorText && formik.errors[name] && formik.touched[name] && <p className="text-red-500 text-xs">{formik.errors[name]}</p>}
        </div>
    );
};

export default Textarea;
