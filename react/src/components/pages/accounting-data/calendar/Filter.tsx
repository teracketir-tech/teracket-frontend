import CompanySelect from "@/components/shared/CompanySelect";
import Filters from "@/components/shared/Filters";
import Input from "@/components/shared/inputs";
import DateInput from "@/components/shared/inputs/Date";
import Select from "@/components/shared/inputs/Select";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function FilterForm({
    formik,
    loading,
    currentDate,
    monthOptions,
    yearOptions,
    changeMonthBySelect,
    changeYear,
    fetchAccountingItems,
}: {
    formik: any;
    loading: boolean;
    currentDate: any;
    monthOptions: any;
    yearOptions: any;
    changeMonthBySelect: any;
    changeYear: any;
    fetchAccountingItems: any;
}) {
    const [open, setOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (open) {
            Object.entries(formik.values).forEach(([key]) => {
                if (searchParams.get(key)) formik.setFieldValue(key, searchParams.get(key)?.toString());
            });
        }
    }, [open]);

    return (
        <Filters
            open={open}
            setOpen={setOpen}
            loading={loading}
            onReset={() => {
                setOpen(false);
                formik.resetForm();
                fetchAccountingItems();
                setSearchParams({}, { replace: true });
            }}
            onOk={() => formik.submitForm()}
        >
            <form className="w-full grid grid-cols-5 gap-5">
                <CompanySelect formik={formik} />
                <Select
                    name="accounting_data_id"
                    title="حساب"
                    required={false}
                    formik={formik}
                    options={[
                        { label: "اسناد پرداختنی", value: "2" },
                        { label: "اسناد دریافتنی", value: "14" },
                    ]}
                />
                <Select
                    name="year"
                    title="سال"
                    required={false}
                    options={yearOptions}
                    value={currentDate.year}
                    onChange={(e: string) => changeYear(Number(e))}
                />
                <Select
                    name="month"
                    title="ماه"
                    required={false}
                    options={monthOptions}
                    value={currentDate.month.index + 1}
                    onChange={(e: string) => changeMonthBySelect(Number(e))}
                />
                <DateInput name="date" title="روز" formik={formik} required={false} />
                <Input name="description" title="توضیحات" required={false} formik={formik} />
            </form>
        </Filters>
    );
}
