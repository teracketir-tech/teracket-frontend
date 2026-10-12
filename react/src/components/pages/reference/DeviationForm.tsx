import { useEffect, useState } from "react";
import CompanySelect from "@/components/shared/CompanySelect";
import { EMPTY_DICTIONARIES, loadDictionaries, type Dictionaries } from "@/components/shared/dictionaries";
import Input from "@/components/shared/inputs";
import Select from "@/components/shared/inputs/Select";
import { useAuth } from "@/context/AuthContext";
import ReferenceForm from "./ReferenceForm";
import { byGroup, clearStaleSource } from "./options";
import { deviationSchema } from "./schema";

/**
 * فرمِ «عوامل انحراف» — ایشوی ۱۵ و ۱۶، پنج فیلد:
 * شرکت (`company_id`، تنها فیلدِ اختیاری)، گروه (`factor_group_id` با دو گزینه
 * ثابتِ داخلی/خارجی)، منشاء انحراف (عددیِ ۱..۲۰ که به گروهِ خودش وصل است)،
 * دلیل انحراف (متن) و اثر غالب (سلکتِ مالتیِ ۱..۳). «ترتیب نمایش» حذف شد.
 *
 * گزینه‌ها از واژه‌نامه می‌آیند نه از `GET group` (پشتِ نقش 1202 است و 401
 * نشست را به ورود می‌برد) و نه از کانستانتِ فرانت؛ سرور همان «عنوان و مقدار»
 * را یک‌جا می‌دهد (ایشوی ۱۶). `setState` داخلِ کالبکِ پرامیس می‌نشیند نه بدنه‌ی
 * افکت (قاعده‌ی `react-hooks/set-state-in-effect`).
 */
export default function DeviationForm({ editMode = 0 }: { editMode?: number }) {
    const { auth } = useAuth();
    const [dictionaries, setDictionaries] = useState<Dictionaries>(EMPTY_DICTIONARIES);

    useEffect(() => {
        loadDictionaries().then((value) => setDictionaries(value));
    }, []);

    return (
        <ReferenceForm
            endpoint="daily-report-deviation-reason"
            basePath="/deviation-reason"
            title="عوامل انحراف"
            schema={deviationSchema}
            defaults={{ company_id: auth?.company_id || "", factor_group_id: "", deviation_source: "", name: "", effect_ids: [] }}
            editMode={editMode}
        >
            {(formik) => (
                <>
                    <CompanySelect formik={formik} />

                    <Select
                        name="factor_group_id"
                        title="گروه"
                        options={dictionaries.factorGroups}
                        formik={formik}
                        onChange={(group) => clearStaleSource(formik, group, dictionaries.deviationSources)}
                    />

                    <Select
                        name="deviation_source"
                        title="منشاء انحراف"
                        options={byGroup(dictionaries.deviationSources, formik.values.factor_group_id)}
                        formik={formik}
                    />

                    <Input type="text" name="name" title="دلیل انحراف" formik={formik} autoComplete="off" />

                    <Select name="effect_ids" title="اثر غالب" options={dictionaries.effects} formik={formik} isMulti />
                </>
            )}
        </ReferenceForm>
    );
}
