import { TreeSelect } from "antd";

interface Props {
    name: string;
    formik?: any;
    title?: string;
    options: any;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    isLoading?: boolean;
    value?: any;
    onChange?: any;
    isMulti?: boolean;
}

const Tree = ({
    name,
    title,
    options,
    placeholder = "انتخاب کنید",
    required = true,
    disabled = false,
    isLoading = false,
    formik,
    value = "",
    onChange,
    isMulti = false,
}: Props) => {
    return (
        <div className={`w-full flex flex-col gap-2 ${isLoading ? "animate-pulse" : ""}`}>
            {title && (
                <label htmlFor={name} className="text-[0.8rem] text-[#000000e0] font-bold">
                    {required ? <span className="text-red-500">* </span> : null}
                    {title}
                </label>
            )}
            <TreeSelect
                className={`*:bg-white! shadow-white! text-[0.8rem]! h-9.5! overflow-auto rounded ${formik && formik.errors[name] && formik.touched[name] ? "*:border-[#ff4d4f]!" : "*:border-[#dddddd]!"} active:*:shadow-primary! active:*:border-primary! ${disabled ? "opacity-50" : ""}`}
                value={value || formik?.values?.[name]}
                treeData={options}
                placeholder={placeholder}
                onChange={(e: any, v: any, o: any) => {
                    let value = e;
                    const selectedOption = o?.triggerNode?.props || {};

                    if (isMulti) {
                        const ids = o?.children?.map((ch: any) => ch.value);

                        if (ids?.length > 0) value = ids;
                    }

                    console.log(v);

                    onChange && onChange(value, selectedOption);
                    formik && formik.setFieldValue(name, value);
                }}
                multiple={isMulti}
                treeCheckable={isMulti}
                allowClear
                showSearch
                filterTreeNode={(inputValue: any, treeNode: any) => treeNode?.value?.toString()?.includes(inputValue) || treeNode?.title?.includes(inputValue)}
            />
        </div>
    );
};

export default Tree;
