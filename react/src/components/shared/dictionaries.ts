import { api } from "@/lib/axios";

/**
 * واژه‌نامه‌ی سلکت‌های مرجع — ایشوی ۹ و ۱۵.
 *
 * منبع، یک درخواستِ `GET hq/daily-report/dictionaries` است و نتیجه برای همان
 * شرکت نگه داشته می‌شود: تب‌های زیرمجموعه، تبِ پیش‌نمایش و تبِ «عوامل انحراف»
 * و همچنین فرم/فیلتر «عوامل انحراف پروژه» همین لیست‌ها را می‌خواهند و نباید
 * هر بار دوباره خوانده شوند.
 *
 * `company_id` (ایشوی ۱): سربرگِ گزارش اول شرکت را انتخاب می‌کند و واژه‌نامه هم
 * به همان شرکت می‌رود؛ بدونِ شرکت، دیتایِ همه‌ی شرکت‌ها می‌آید. کش «کلید»
 * دارد چون تغییرِ شرکت باید لیستِ تازه بیاورد ولی رفت‌وبرگشتِ همان شرکت
 * دوباره‌خوانی نشود.
 *
 * `value` همیشه رشته است چون `Select` با رشته مقایسه می‌کند.
 */
export interface DictOption {
    value: string;
    label: string;
    /**
     * گروهِ منشاء انحراف (۱ داخلی / ۲ خارجی) — فقط `deviationSources` دارد و
     * همان است که سلکتِ منشاء را به سلکتِ گروه وصل می‌کند (ایشوی ۱۶)
     */
    factor_group?: string;
    /**
     * Position of the contact (`contact.position_id`) — only `contacts` carries
     * it and it is what cuts the person options of the report form (issue 2.3)
     */
    position?: string;
    /** واحدِ کالا — فقط `products` این را دارد (ایشوی ۹: برچسبِ «مقدار (واحد)») */
    unit_id?: string;
}

export interface Dictionaries {
    units: DictOption[];
    equipmentTypes: DictOption[];
    products: DictOption[];
    /** دلایل انحراف — تبِ «عوامل انحراف» دیالوگِ فعالیت (ایشوی ۱۲) */
    deviationReasons: DictOption[];
    /** گروه — فرم و فیلتر عوامل انحراف پروژه (ایشوی ۱۵) */
    groups: DictOption[];
    /** دو گروهِ عامل: داخلی / خارجی (ایشوی ۱۶) */
    factorGroups: DictOption[];
    /** بیست منشاء انحراف با `factor_group` */
    deviationSources: DictOption[];
    /** سه اثر غالب: زمان / هزینه / کیفیت */
    effects: DictOption[];
}

export const EMPTY_DICTIONARIES: Dictionaries = {
    units: [],
    equipmentTypes: [],
    products: [],
    deviationReasons: [],
    groups: [],
    factorGroups: [],
    deviationSources: [],
    effects: [],
};

let cache: { key: string; promise: Promise<Dictionaries> } | null = null;

interface DictRow {
    id?: number | string | null;
    name?: string | null;
    factor_group?: number | string | null;
    /** ایشوی ۹ — فقط محصولات این را دارند (واحدِ کالا کنار «مقدار») */
    unit_id?: number | string | null;
}

const asOptions = (rows: DictRow[] | null | undefined, withId: boolean): DictOption[] =>
    (rows ?? [])
        .filter((row) => row?.id !== undefined && row?.id !== null)
        .map((row) => ({
            value: String(row.id),
            label: withId ? `${row.id}- ${row.name ?? ""}` : String(row.name ?? "—"),
            ...(row.factor_group === undefined || row.factor_group === null ? {} : { factor_group: String(row.factor_group) }),
            ...(row.unit_id === undefined || row.unit_id === null ? {} : { unit_id: String(row.unit_id) }),
        }));

/**
 * واژه‌نامه‌ی همه‌ی سلکت‌ها — برای هر شرکت یک درخواست.
 * در صورت شکست، دفعه‌ی بعد دوباره تلاش می‌شود (کش باطل می‌شود).
 */
export function loadDictionaries(companyId?: string | number | null): Promise<Dictionaries> {
    const key = companyId === undefined || companyId === null ? "" : String(companyId);

    if (!cache || cache.key !== key) {
        // کلیدهای پاسخ عین نام ستون‌های دیتابیساند (`units`, `equipment_types`,
        // `products`, `deviation_reasons`, `groups`, `factor_groups`,
        // `deviation_sources`, `effects`)؛ نامتقارن‌خواندنِ هر کدام بی‌صدا
        // سلکت را خالی می‌کند.
        const promise = api(`daily-report/dictionaries${key ? `?company_id=${key}` : ""}`)
            .then((res) => ({
                units: asOptions(res?.units, false),
                equipmentTypes: asOptions(res?.equipment_types, false),
                products: asOptions(res?.products, true),
                deviationReasons: asOptions(res?.deviation_reasons, false),
                groups: asOptions(res?.groups, false),
                factorGroups: asOptions(res?.factor_groups, false),
                deviationSources: asOptions(res?.deviation_sources, false),
                effects: asOptions(res?.effects, false),
            }))
            .catch(() => {
                if (cache && cache.promise === promise) cache = null;
                return EMPTY_DICTIONARIES;
            });

        cache = { key, promise };
    }

    return cache.promise;
}

/** نگاشت `value` → برچسب برای رندر سلول‌های جدول بدون جستجوی خطی */
export function toMap(options: DictOption[]): Record<string, string> {
    return options.reduce<Record<string, string>>((map, option) => {
        map[option.value] = option.label;
        return map;
    }, {});
}
