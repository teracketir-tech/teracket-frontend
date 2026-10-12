/**
 * ریشه‌ی پورتالِ منوی سلکت + رفعِ نشدنِ اسکرولِ منو با موس داخلِ مودال
 * (ایشوی ۱۸، موردِ ۲ گزارشِ پس از تحویل).
 *
 * چرا منو با موس اسکرول نمی‌شد: منو در `body` پورتال می‌شود تا در `overflow`
 * مودال (و جدول‌های اسکرول‌خور) گیر نکند، اما `body` خارج از دامنه‌ی قفلِ
 * اسکرولِ Radix است. `react-remove-scroll` هر `wheel` که به `document` برسد و
 * هدفش بیرون از دیالوگ باشد را `preventDefault` می‌کند → همه‌ی چرخِ ماوس
 * داخلِ منو لغو می‌شد.
 *
 * راه‌حل: منو داخلِ یک `div` مشترک پورتال می‌شود و رویِ همان `div` (والدِ
 * مستقیمِ `listbox`، فرزندِ `body`) یک‌بار `stopPropagation` می‌زنیم؛ رویداد
 * به `document` نمی‌رسد پس لغو نمی‌شود و چون `preventDefault` نمی‌کنیم، همان
 * رویدادِ بومیِ مرورگر منو را می‌چرخاند. ترتیبِ عمقی هم تضمین می‌کند شنونده‌ی
 * `listbox`ِ react-select (عمیق‌تر) زودتر اجرا شود و محدودیتِ انتهایِ منو را
 * همچنان خودش اداره کند.
 *
 * ریشه در نخستین رندر ساخته می‌شود (نه در `effect`) تا پیش از باز شدنِ هر
 * منویی در جا باشد و `setState`-در-`effect` هم لازم نشود.
 */

let portalRoot: HTMLDivElement | null = null;

const getPortalRoot = (): HTMLDivElement | null => {
    if (typeof document === "undefined") return null;
    if (portalRoot?.isConnected) return portalRoot;

    const el = document.createElement("div");
    el.setAttribute("data-select-menu-portal", "");
    // منو بیرونِ از کانتینرِ سلکت پورتال می‌شود و از `text-[0.8rem]!` رویِ کانتینر
    // ارث نمی‌برد؛ بدونِ این کلاس، آیتم‌ها با اندازه‌ی `body` (16px) رندر می‌شدند.
    el.className = "text-[0.8rem]!";
    document.body.appendChild(el);
    el.addEventListener("wheel", (event) => event.stopPropagation());
    portalRoot = el;
    return el;
};

export const useMenuWheelGuard = getPortalRoot;
