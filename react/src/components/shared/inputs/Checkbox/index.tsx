import { cn } from "@/lib/utils";

interface Props {
    title: string;
    name: string;
    formik: any;
    disabled?: boolean;
    size?: string;
}

const Checkbox = ({ title, name, formik, disabled = false }: Props) => {
    return (
        <div className="flex items-center gap-2">
            <input
                type="checkbox"
                className={cn(
                    "appearance-none border border-gray-400 rounded-xs cursor-pointer bg-white checked:bg-blue-500 checked:border-blue-500 checked:before:content-['✓'] checked:before:text-white checked:before:flex checked:before:items-center checked:before:justify-center transition-all duration-200 disabled:opacity-50",
                    `size-5.5 checked:before:size-5.5`,
                )}
                name={name}
                id={name}
                disabled={disabled}
                checked={formik.values[name] == 1 || false}
                onChange={(e) => formik.setFieldValue(name, e.target.checked)}
            />
            <label htmlFor={name} className={cn("text-[#222529] text-[0.8rem]! font-bold cursor-pointer", disabled && "opacity-35")}>
                {title}
            </label>
        </div>
    );
};

export default Checkbox;
