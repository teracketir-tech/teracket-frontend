import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/axios";
import { loadContactOptions, type ContactOption } from "@/lib/contacts";
import type { Num, ReportableTask } from "../activities/types";
import { EMPTY_DICTIONARIES, loadDictionaries, toMap, type Dictionaries } from "@/components/shared/dictionaries";
import type { OptionSource } from "./types";

/** لیست‌های پایدارِ خالی، تا هنگامِ بارگذاری `useMemo`ها بی‌جهت بازمحاسبه نشوند */
const NO_TASKS: ReportableTask[] = [];
const NO_CONTACTS: ContactOption[] = [];

/**
 * منبعِ گزینه‌ها و برچسبِ سلول‌های جدولِ زیرمجموعه‌ها — ایشوی ۹ و ۱.
 *
 * هر پنج تب به همین پنج فهرست نیاز دارند: اشخاص، تسک‌های قابل گزارشِ پروژه و
 * واژه‌نامه (واحد / نوع ماشین‌آلات / مصالح / دلیل انحراف). بارگذاری یک‌جا و
 * نگاشتِ `id → برچسب` در یک map، تا رندر جدول جستجوی خطی نکند.
 *
 * `projectId` از سربرگ می‌آید؛ اگر خالی باشد فقط تسک‌ها خالی می‌مانند و بقیه
 * (که به پروژه وابسته نیستند) همچنان پر می‌شوند.
 *
 * `companyId` (ایشوی ۱): شرکتِ سربرگ روی واژه‌نامه و اشخاص هم اثر می‌گذارد.
 * اشخاصِ اینجا «همه‌ی سمت‌ها» را می‌آورند چون هر فیلدِ فرم سمتِ خودش را
 * دارد (ایشوی ۲.۱) و فیلتر سمت سمتی روی همان لیست انجام می‌شود.
 */
export default function useLookups(projectId: string, companyId: string = "") {
    /** واژه‌نامه/اشخاصِ بارگذاری‌شده برای همین شرکت — تا عوض‌شدن دوباره نخواند */
    const [source, setSource] = useState<{ companyId: string; rows: ContactOption[]; value: Dictionaries } | null>(null);
    /**
     * تسک‌ها به همراه پروژه‌ای که از آن خوانده شده‌اند نگه داشته می‌شوند؛ اگر
     * پروژه عوض (یا پاک) شود، همان `projectId` دیگر نمی‌خواند پس لیستِ قدیمی
     * استفاده نمی‌شود — بی‌نیاز از setStateِ همزمان در افکت.
     */
    const [taskSource, setTaskSource] = useState<{ projectId: string; rows: ReportableTask[]; unit: Num } | null>(null);

    /**
     * اشخاص و واژه‌نامه با هم و برای یک شرکت خوانده می‌شوند (ایشوی ۱).
     * ترکیب در یک state عمداً است: اگر شرکت عوض شود، لیستِ کهنه‌ی اشخاص
     * کنارِ واژه‌نامه‌ی تازه نماند و سلکتی که اشتباه سمت/شرکت را نشان می‌دهد
     * ساخته نشود.
     */
    useEffect(() => {
        let alive = true;

        Promise.all([loadContactOptions(null, companyId), loadDictionaries(companyId)]).then(([rows, value]) => {
            if (alive) setSource({ companyId, rows, value });
        });

        return () => {
            alive = false;
        };
    }, [companyId]);

    const loadedSource = source?.companyId === companyId ? source : null;
    const contacts = loadedSource?.rows ?? NO_CONTACTS;
    const dicts = loadedSource?.value ?? EMPTY_DICTIONARIES;

    useEffect(() => {
        if (!projectId) return;

        let alive = true;

        api(`project/${projectId}/reportable-tasks`)
            .then((res) => {
                if (alive) setTaskSource({ projectId, rows: res?.data ?? [], unit: res?.cpm?.unit ?? null });
            })
            .catch(() => {
                if (alive) setTaskSource({ projectId, rows: [], unit: null });
            });

        return () => {
            alive = false;
        };
    }, [projectId]);

    const fresh = taskSource?.projectId === projectId ? taskSource : null;
    const tasks = fresh?.rows ?? NO_TASKS;
    const baseUnit = fresh?.unit ?? null;

    const taskOptions = useMemo(
        () => tasks.map((task) => ({ value: String(task.id), label: `${task.wbs_code || "-"} — ${task.name || ""}` })),
        [tasks],
    );

    const options = useMemo(
        () => ({
            contacts,
            tasks: taskOptions,
            products: dicts.products,
            units: dicts.units,
            equipmentTypes: dicts.equipmentTypes,
            deviationReasons: dicts.deviationReasons,
        }),
        [contacts, taskOptions, dicts],
    );

    const maps = useMemo(
        () => ({
            contacts: toMap(options.contacts),
            tasks: toMap(options.tasks),
            products: toMap(options.products),
            units: toMap(options.units),
            equipmentTypes: toMap(options.equipmentTypes),
            deviationReasons: toMap(options.deviationReasons),
        }),
        [options],
    );

    /** برچسبِ یک شناسه در جدول — ناشناخته بودن یعنی داده‌ی قدیمی؛ همان عدد نمایش داده می‌شود */
    const label = (source: OptionSource, id?: string | number | null) => {
        if (id === null || id === undefined || id === "") return "—";
        return maps[source][String(id)] ?? String(id);
    };

    return { options, label, tasks, baseUnit };
}
