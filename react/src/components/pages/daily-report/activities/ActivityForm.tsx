import { useState } from "react";
import { useFormik } from "formik";
import Modal from "@/components/shared/Modal";
import Button from "@/components/shared/Button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import TabBar from "../TabBar";
import LinesPanel from "../lines/LinesPanel";
import TimesheetPanel from "../lines/timesheet/TimesheetPanel";
import ActivityFields from "./ActivityFields";
import { ACTIVITY_TAB, ACTIVITY_TABS, FIRST_LINE_TAB } from "./modalTabs";
import { applyApiErrors } from "@/lib/apiErrors";
import type { ContactOption } from "@/lib/contacts";
import type { DictOption } from "@/components/shared/dictionaries";
import { LINE_KINDS } from "../lines/config";
import { activitySchema } from "./schema";
import { emptyActivity } from "./values";
import type { ActivityRow, ActivityValues, ApiResponse, Num, ReportableTask } from "./types";

const ghostButton =
    "h-10 px-5 rounded border border-secondary bg-white text-foreground text-sm transition-all hover:bg-secondary disabled:opacity-50 cursor-pointer";

interface Props {
    open: boolean;
    onClose: () => void;
    reportId: number | null;
    /** `project_id` سربرگ — واژه‌نامه‌ی پنج تبِ زیرمجموعه */
    projectId: string;
    /** `company_id` سربرگ (ایشوی ۱) — واژه‌نامه و اشخاصِ زیرمجموعه‌ها */
    companyId: string;
    /**
     * The header `report_date` (Gregorian, ISO) — the timesheet tab reads this
     * very date from the attendance machine (issue 1.2).
     */
    reportDate: string;
    tasks: ReportableTask[];
    rows: ActivityRow[];
    contacts: ContactOption[];
    baseUnit: Num;
    /** `null` یعنی افزودن؛ در غیر این صورت مقادیر ردیفِ در حال ویرایش */
    initial: ActivityValues | null;
    saving: boolean;
    locked?: boolean;
    /** فهرست دلایل انحراف از واژه‌نامه — سلکتِ تبِ «عوامل انحراف» (ایشوی ۱۲) */
    deviationReasons: DictOption[];
    onSave: (values: ActivityValues) => Promise<ApiResponse | null>;
}

/**
 * دیالوگِ «ثبت فعالیت» با شش تب — ایشوی ۱۰ و ۴.
 *
 * تبِ اول مشخصات خودِ فعالیت است (فیلدها در `ActivityFields`، از جمله
 * «پیمانکار» و سلکتِ مالتیِ «عوامل انحراف» که ایشوی ۴ به همین‌جا آورد) و
 * پنج تبِ بعدی زیرمجموعه‌ها هستند که هر کدام فقط ردیف‌های همین فعالیت را
 * نشان می‌دهند.
 *
 * «افزودن» بعد از موفقیت می‌ماند و به اولین تبِ زیرمجموعه می‌رود، چون مالکِ
 * ردیف‌ها (شناسه‌ی فعالیت) تازه ساخته شده است؛ ضمناً `id` داخل فرم می‌نشیند تا
 * ذخیره‌ی بعدی به‌جای POST دوم (ردیفِ تکراری) PATCH شود. «ویرایش» همان‌طور
 * می‌بندد مثل قبل. پاک‌سازیِ حالت در `close` می‌نشیند نه در `useEffect` چون
 * setState داخلِ افکت (قاعده‌ی lint) ممنوع است.
 */
export default function ActivityForm({ open, onClose, reportId, projectId, companyId, reportDate, tasks, rows, contacts, baseUnit, initial, saving, locked = false, deviationReasons, onSave }: Props) {
    const [savedId, setSavedId] = useState("");
    const [tab, setTab] = useState(ACTIVITY_TAB);

    /**
     * شناسه‌ی مالکِ ردیف‌ها. با `||` نه `??` چون ردیفِ «افزودن» `id: ""` دارد و
     * nullish آن را رد می‌کند؛ در نتیجه `savedId` بعد از اولین ذخیره هرگز دیده
     * نمی‌شد و تب‌های زیرمجموعه پیامِ «ابتدا ذخیره کنید» می‌دادند.
     */
    const activityId = initial?.id || savedId || null;

    /** بستن + پاک کردن حالتِ «افزودنِ تازه‌ذخیره‌شده» تا بازِ بعدی، دوباره افزودن باشد */
    const close = () => {
        setSavedId("");
        setTab(ACTIVITY_TAB);
        onClose();
    };

    const formik = useFormik({
        initialValues: initial ?? emptyActivity(),
        validationSchema: activitySchema,
        validateOnChange: true,
        validateOnMount: true,
        enableReinitialize: true,
        onSubmit: async (values, helpers) => {
            const res = await onSave(values);

            if (!res?.success) {
                if (res) applyApiErrors(res, helpers);
                return;
            }

            const created = res.data?.id;
            if (created) await helpers.setFieldValue("id", String(created));

            /**
             * ایشوی ۹: ذخیره، مودال را نمی‌بندد تا تب‌های زیرمجموعه (نیرو،
             * مصالح، ماشین‌آلات، تحویل، تایم‌شیت) هم پر شوند. «افزودن» به
             * نخستین تبِ زیرمجموعه می‌رود، «ویرایش» سرِ همان تب می‌ماند.
             */
            setSavedId(String(created ?? ""));

            if (!values.id) setTab(FIRST_LINE_TAB);
        },
    });

    if (!reportId) return null;

    /** تیکِ تب فقط برای خودِ «مشخصات فعالیت» است؛ دلایل انحراف همان‌جاست (ایشوی ۴) */
    const completed = activityId ? [ACTIVITY_TAB] : [];

    /** فوترِ «انصراف / ذخیره» — هر دو تبِ فرم از همین یکی استفاده می‌کنند */
    const footer = (
        <div className="flex items-center justify-end gap-3 border-t pt-3">
            <button type="button" className={ghostButton} onClick={close}>
                انصراف
            </button>
            <div className="w-44">
                <Button type="submit" isLoading={saving} disabled={!formik.isValid}>
                    ذخیره
                </Button>
            </div>
        </div>
    );

    return (
        <Modal title={activityId ? "ویرایش فعالیت" : "افزودن فعالیت"} open={open} setOpen={(value) => !value && close()} className="w-11/12 sm:max-w-none">
            <Tabs value={tab} onValueChange={setTab} className="flex min-w-0 flex-col gap-4">
                <TabBar value={tab} onChange={setTab} tabs={ACTIVITY_TABS} completed={completed} />

                <TabsContent value={ACTIVITY_TAB} className="mt-0">
                    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
                        <ActivityFields
                            formik={formik}
                            activityId={activityId}
                            initial={initial}
                            tasks={tasks}
                            rows={rows}
                            contacts={contacts}
                            deviationReasons={deviationReasons}
                            baseUnit={baseUnit}
                        />

                        {footer}
                    </form>
                </TabsContent>

                {LINE_KINDS.map((kind) => (
                    <TabsContent key={kind} value={kind} className="mt-0">
                        {/* the timesheet wants its own panel: the day's log + manual entry */}
                        {kind === "timesheets" ? (
                            <TimesheetPanel
                                activityId={activityId}
                                projectId={projectId}
                                companyId={companyId}
                                reportId={reportId}
                                reportDate={reportDate}
                                locked={locked}
                            />
                        ) : (
                            <LinesPanel kind={kind} activityId={activityId} projectId={projectId} companyId={companyId} locked={locked} />
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </Modal>
    );
}
