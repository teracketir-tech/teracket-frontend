import CompanySelect from "@/components/shared/CompanySelect";
import Input from "@/components/shared/inputs";
import { useAuth } from "@/context/AuthContext";
import ReferenceFilter from "./ReferenceFilter";
import ReferenceList, { type ReferenceColumn } from "./ReferenceList";

const equipmentColumns = (): ReferenceColumn[] => [
    { title: "نام", cell: (row) => row.name },
    { title: "شرکت", cell: (row) => row.company_name || "—" },
];

/**
 * فهرستِ «ماشین‌آلات» — ایشوی ۱۵: بلاکِ فیلتر مثل بقیه‌ی صفحه‌ها با فیلترِ
 * شرکت / شناسه / نام، و ستونِ «ترتیب نمایش» جای خودش را به «شرکت» داده است
 * (چون ترتیب دیگر از فرم قابل ویرایش نیست).
 */
export default function EquipmentList() {
    const { auth } = useAuth();

    return (
        <ReferenceList
            endpoint="daily-report-equipment-type"
            basePath="/equipment-type"
            title="ماشین‌آلات"
            columns={equipmentColumns}
            editRole={[2503]}
            deleteRole={[2504]}
            filter={(loading) => (
                <ReferenceFilter loading={loading} cols={3} defaults={{ id: "", name: "", company_id: auth?.company_id || "" }}>
                    {(formik) => (
                        <>
                            <CompanySelect formik={formik} required={false} />
                            <Input name="id" title="شناسه" formik={formik} required={false} />
                            <Input name="name" title="نام" formik={formik} required={false} />
                        </>
                    )}
                </ReferenceFilter>
            )}
        />
    );
}
