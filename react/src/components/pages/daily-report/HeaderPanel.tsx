import Input from "@/components/shared/inputs";
import Select from "@/components/shared/inputs/Select";
import DateInput from "@/components/shared/inputs/Date";
import Textarea from "@/components/shared/inputs/Textarea";
import CompanySelect from "@/components/shared/CompanySelect";
import ProjectSelect from "@/components/shared/ProjectSelect";
import ContactSelect from "@/components/shared/ContactSelect";
import { SITE_INACTIVE, SITE_STATUS, WEATHER, toOptions } from "@/lib/report-rules";
import { POSITION_MANAGER, POSITION_SUPERVISOR } from "@/lib/positions";

const WEATHER_OPTIONS = toOptions(WEATHER);
const SITE_OPTIONS = toOptions(SITE_STATUS);

/**
 * فیلدهایی که به شرکتِ سربرگ وابسته‌اند — با عوض‌شدنِ شرکت باید خالی شوند
 * چون انتخابِ قبلی مالِ شرکتِ دیگری است (ایشوی ۱).
 */
const COMPANY_DEPENDENT = ["project_id", "project_manager_id", "site_supervisor_id"];

interface Props {
    formik: any;
    /** بعد از ثبت نهایی یا زمانی که گزارش قفل است */
    locked?: boolean;
}

/**
 * سربرگ گزارش روزانه — سند فاز ۲ بخش ۳ + ایشوی ۱.
 *
 * «شرکت» نخستین فیلد است و همه‌ی سلکت‌هایِ بعدی (پروژه، اشخاص و از طریق
 * `useLookups` مصالح/ماشین‌آلات/عوامل انحراف/نیروها) بر اساس آن فیلتر
 * می‌شوند؛ شرکتِ خالی یعنی همه‌ی شرکت‌ها.
 *
 * الزامی‌ها طبق بند ۱۷ فقط `project_id` و `report_date` هستند؛ بقیه‌ی فیلدها
 * در دیتابیس nullableاند. «دلیل غیرفعالی» فقط وقتی وضعیت کارگاه «غیرفعال»
 * شود ظاهر و الزامی می‌شود.
 */
export default function HeaderPanel({ formik, locked = false }: Props) {
    const siteInactive = Number(formik.values.site_status) === SITE_INACTIVE;

    const onCompanyChange = () => {
        COMPANY_DEPENDENT.forEach((name) => formik.setFieldValue(name, ""));
    };

    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <CompanySelect formik={formik} disabled={locked} onChange={onCompanyChange} />
            <ProjectSelect formik={formik} required disabled={locked} />
            <DateInput name="report_date" title="تاریخ تنظیم فرم" formik={formik} disabled={locked} />

            <Select name="weather_status" title="وضعیت آب و هوا" formik={formik} options={WEATHER_OPTIONS} required={false} disabled={locked} />
            {/* ایشوی ۱۸: توضیح آب و هوا دو ستون را می‌گیرد تا متنِ بلند جا شود */}
            <div className="md:col-span-2">
                <Input type="text" name="weather_note" title="توضیح آب و هوا (در صورت نیاز)" formik={formik} required={false} disabled={locked} autoComplete="off" />
            </div>

            <ContactSelect name="project_manager_id" title="مدیر پروژه" position={POSITION_MANAGER} formik={formik} disabled={locked} />
            <ContactSelect name="site_supervisor_id" title="سرپرست کارگاه" position={POSITION_SUPERVISOR} formik={formik} disabled={locked} />
            {/* ایشوی ۱۸: «تنظیم‌کننده فرم» از فرم حذف شد؛ سرور آن را با شناسه‌ی کاربرِ ثبت‌کننده پر می‌کند */}

            <Select name="site_status" title="وضعیت کارگاه" formik={formik} options={SITE_OPTIONS} required={false} disabled={locked} />
            <Input type="text" name="document_no" title="شماره مدرک" formik={formik} required={false} disabled={locked} autoComplete="off" />
            {/* ایشوی ۱۸: فیلد «ویرایش» فعلاً کامنت شد (بعداً دوباره برگردانده می‌شود) */}
            {/* <Input type="text" name="revision" title="ویرایش" formik={formik} required={false} disabled={locked} autoComplete="off" /> */}

            {siteInactive && (
                <div className="md:col-span-3">
                    <Textarea name="inactive_reason" title="دلیل غیرفعال بودن کارگاه" formik={formik} disabled={locked} />
                </div>
            )}
        </div>
    );
}
