import CompanySelect from "@/components/shared/CompanySelect";
import Input from "@/components/shared/inputs";
import Select from "@/components/shared/inputs/Select";
import { useAuth } from "@/context/AuthContext";
import ReferenceFilter from "./ReferenceFilter";
import ReferenceList, { type ReferenceColumn } from "./ReferenceList";
import { byGroup, clearStaleSource, optionLabel, optionsLabel, type FormData } from "./options";

/**
 * ستون‌های فهرست از روی `form_data` ساخته می‌شوند — ایشوی ۱۶: سرور همان
 * «عنوان و مقدار» را با پاسخِ فهرست می‌فرستد (الگوی جدول `order` در seal) پس
 * برچسبِ گروه/منشاء/اثر اینجا هاردکد نمی‌شود.
 */
const deviationColumns = (formData: FormData): ReferenceColumn[] => {
    const groups = formData.factor_group ?? [];
    const sources = formData.deviation_source ?? [];
    const effects = formData.effect ?? [];

    return [
        { title: "شرکت", cell: (row) => row.company_name || "—" },
        { title: "گروه", cell: (row) => optionLabel(groups, row.factor_group_id) },
        { title: "منشاء انحراف", cell: (row) => optionLabel(sources, row.deviation_source) },
        { title: "دلیل انحراف", cell: (row) => row.name },
        { title: "اثر غالب", cell: (row) => optionsLabel(effects, row.effect_ids) },
    ];
};

/**
 * فهرستِ «عوامل انحراف» — ایشوی ۱۵ و ۱۶: بلاکِ فیلتر روی همه‌ی ستون‌ها
 * (شرکت، شناسه، گروه، منشاء، دلیل، اثر غالب) و ستونِ «ترتیب نمایش» حذف شد.
 *
 * فیلترِ «منشاء» به فیلترِ «گروه» وصل است: داخلی = منشاء ۱..۱۳ و خارجی =
 * ۱۴..۲۰؛ با عوض‌شدنِ گروه، منشاءِ خارج از آن گروه پاک می‌شود.
 */
export default function DeviationList() {
    const { auth } = useAuth();

    return (
        <ReferenceList
            endpoint="daily-report-deviation-reason"
            basePath="/deviation-reason"
            title="عوامل انحراف"
            columns={deviationColumns}
            editRole={[2603]}
            deleteRole={[2604]}
            filter={(loading, formData) => (
                <ReferenceFilter
                    loading={loading}
                    cols={6}
                    defaults={{
                        company_id: auth?.company_id || "",
                        id: "",
                        factor_group_id: "",
                        deviation_source: "",
                        name: "",
                        effect_ids: "",
                    }}
                >
                    {(formik) => (
                        <>
                            <CompanySelect formik={formik} required={false} />
                            <Input name="id" title="شناسه" formik={formik} required={false} />
                            <Select
                                name="factor_group_id"
                                title="گروه"
                                options={formData.factor_group ?? []}
                                formik={formik}
                                required={false}
                                onChange={(group) => clearStaleSource(formik, group, formData.deviation_source ?? [])}
                            />
                            <Select
                                name="deviation_source"
                                title="منشاء انحراف"
                                options={byGroup(formData.deviation_source ?? [], formik.values.factor_group_id)}
                                formik={formik}
                                required={false}
                            />
                            <Input name="name" title="دلیل انحراف" formik={formik} required={false} />
                            <Select name="effect_ids" title="اثر غالب" options={formData.effect ?? []} formik={formik} isMulti required={false} />
                        </>
                    )}
                </ReferenceFilter>
            )}
        />
    );
}
