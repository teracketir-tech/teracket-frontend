import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { formatDateToEn, formatDateToFa } from "@/lib/utils";
import TimePicker from "react-multi-date-picker/plugins/time_picker";

interface Props {
    title?: string;
    placeholder?: string;
    name: string;
    formik?: any;
    noErrorText?: boolean;
    onChange?: any;
    required?: boolean;
    disabled?: boolean;
    isLoading?: boolean;
    value?: any;
    minDate?: any;
    time?: any;
    isRange?: boolean;
}

const DateInput = ({
    title,
    name,
    formik,
    onChange,
    noErrorText = false,
    placeholder = "",
    required = true,
    disabled = false,
    isLoading = false,
    value,
    minDate,
    time = false,
    isRange = false,
}: Props) => {
    const classes = `${
        formik?.errors?.[name] && formik?.touched?.[name] ? "border-[#ff4d4f]" : "border-[#dddddd] focus:border-[#2ba968]"
    } border focus:shadow rounded px-2 py-1.5 outline-none w-full h-[2.35rem]! bg-white transition-all disabled:opacity-50 placeholder:text-right text-[0.8rem] text-left`;

    return (
        <div className={`flex flex-col gap-2 ${isLoading ? "animate-pulse" : ""}`}>
            {title && (
                <label htmlFor={name} className="text-[0.8rem] text-[#000000e0] font-bold">
                    {required ? <span className="text-red-500">* </span> : null}
                    {title}
                </label>
            )}

            <DatePicker
                value={isRange ? null : value ? formatDateToFa(value, time) : formik?.values?.[name] ? formatDateToFa(formik?.values?.[name], time) : ""}
                disabled={disabled}
                inputClass={classes}
                calendar={persian}
                locale={persian_fa}
                format={time ? "YYYY/MM/DD HH:mm" : "YYYY/MM/DD"}
                fixMainPosition={true}
                calendarPosition="bottom"
                placeholder={placeholder}
                minDate={minDate || null}
                onChange={(date: any) => {
                    let value = date;

                    if (isRange) {
                        if (Object.values(date).length === 2) value = date.map((d: any) => formatDateToEn(d)).join(",");

                        //
                    } else {
                        value = formatDateToEn(value, time);
                    }

                    onChange && onChange(value);
                    formik && formik.setFieldValue(name, value);
                }}
                className="black"
                plugins={time ? [<TimePicker hideSeconds />] : []}
                range={isRange}
            />

            {!noErrorText && formik?.errors?.[name] && formik?.touched?.[name] && <p className="text-red-500 text-xs">{formik?.errors?.[name]}</p>}
        </div>
    );
};

export default DateInput;
