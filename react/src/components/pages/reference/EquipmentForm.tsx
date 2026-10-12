import CompanySelect from "@/components/shared/CompanySelect";
import Input from "@/components/shared/inputs";
import { useAuth } from "@/context/AuthContext";
import ReferenceForm from "./ReferenceForm";
import { referenceSchema } from "./schema";

/**
 * فرمِ «ماشین‌آلات» — ایشوی ۱۵: «ترتیب نمایش» حذف شد و سلکتِ شرکت
 * (`company_id`) اضافه شد. نام همچنان تنها فیلدِ الزامی است و ایشوی ۱۸
 * آن را به فیلدِ دوم برد تا «شرکت» نخست باشد.
 */
export default function EquipmentForm({ editMode = 0 }: { editMode?: number }) {
    const { auth } = useAuth();

    return (
        <ReferenceForm
            endpoint="daily-report-equipment-type"
            basePath="/equipment-type"
            title="ماشین‌آلات"
            schema={referenceSchema("نام ماشین‌آلات")}
            defaults={{ name: "", company_id: auth?.company_id || "" }}
            editMode={editMode}
        >
            {(formik) => (
                <>
                    {/* ایشوی ۱۸: «شرکت» نخستین فیلد است و بعد «نام ماشین‌آلات» */}
                    <CompanySelect formik={formik} />
                    <Input type="text" name="name" title="نام ماشین‌آلات" formik={formik} autoComplete="off" />
                </>
            )}
        </ReferenceForm>
    );
}
