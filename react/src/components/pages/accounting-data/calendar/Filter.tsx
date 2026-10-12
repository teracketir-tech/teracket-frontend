import CompanySelect from "@/components/shared/CompanySelect";
import ContactSelect from "@/components/shared/ContactSelect";
import Filters from "@/components/shared/Filters";
import Input from "@/components/shared/inputs";
import DateInput from "@/components/shared/inputs/Date";
import Select from "@/components/shared/inputs/Select";
import { AccountingDataIds } from "@/lib/utils";
import { useEffect, useState } from "react";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { DateObject } from "react-multi-date-picker";
import { useSearchParams } from "react-router-dom";

export default function FilterForm({ formik, loading, setCurrentDate }: { formik: any; loading: boolean; setCurrentDate: any }) {
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
        <Filters open={open} setOpen={setOpen} loading={loading} formik={formik}>
            <form className="w-full grid grid-cols-5 gap-5">
                <CompanySelect formik={formik} />
                <Select
                    name="accounting_data_id"
                    title="حساب"
                    required={false}
                    formik={formik}
                    options={[
                        { label: "اسناد پرداختنی", value: AccountingDataIds.PAYABLE },
                        { label: "اسناد دریافتنی", value: AccountingDataIds.RECEIVABLE },
                    ]}
                />
                <ContactSelect formik={formik} type={0} />

                <DateInput
                    name="date"
                    title="سال / ماه"
                    formik={formik}
                    required={false}
                    monthPicker={true}
                    onChange={(e: string) => {
                        const date = new DateObject({
                            date: e,
                            calendar: gregorian,
                        }).convert(persian, persian_fa);

                        setCurrentDate(date);
                        formik.setFieldValue("specific_date", "");
                    }}
                />
                <DateInput
                    name="specific_date"
                    title="روز"
                    formik={formik}
                    required={false}
                    onChange={(e: string) => {
                        formik.setFieldValue("date", "");

                        if (!e) {
                            const params = new URLSearchParams(searchParams.toString());
                            params.delete("specific_date");
                            setSearchParams(params);
                        }
                    }}
                />
                <Input name="description" title="توضیحات" required={false} formik={formik} />
            </form>
        </Filters>
    );
}
