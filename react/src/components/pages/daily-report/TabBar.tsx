import { Fragment } from "react";
import { Check } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { REPORT_TABS, type ReportTab } from "./tabs";

interface Props {
    value: string;
    onChange: (id: string) => void;
    /** کلید تب‌هایی که بخش‌شان کامل شده — برای تیک */
    completed?: string[];
    /**
     * فهرست تب‌ها. پیش‌فرض تب‌هایِ فرمِ اصلی است؛ دیالوگِ ثبتِ فعالیت (ایشوی ۱۰)
     * شش تبِ خودش را می‌دهد تا نوار تب دومی ساخته نشود (DRY).
     */
    tabs?: ReportTab[];
}

/**
 * نوار تب‌های فرم با ظاهر «پیمایش مرحله‌ای».
 *
 * مرجعِ کارفرما `Stepper` پنل seal بود. تفاوت اینجا این است که برخلاف stepper،
 * هیچ مرحله‌ای قفل نیست و همه کلیک‌پذیرند؛ شماره‌ی حلقه، تیکِ بخشِ کامل‌شده و
 * خط رابط بین حلقه‌ها همان زبان بصری را نگه می‌دارند. در موبایل نوار افقی
 * اسکرول می‌شود (تصمیم responsive).
 */
export default function TabBar({ value, onChange, completed = [], tabs = REPORT_TABS }: Props) {
    return (
        <div className="w-full overflow-x-auto pb-1">
            <TabsList className="h-auto w-full justify-start gap-0 rounded-none bg-transparent p-0">
                {tabs.map((tab, index) => {
                    const isDone = completed.includes(tab.id);
                    const isActive = value === tab.id;

                    return (
                        <Fragment key={tab.id}>
                            <TabsTrigger
                                value={tab.id}
                                onClick={() => onChange(tab.id)}
                                // بند ۷: تبِ انتخاب‌نشده بوردرِ secondary می‌گیرد؛ تبِ فعال همان بوردر را
                                // شفاف می‌کند تا اندازه‌‌ی تب‌ها هنگام جابه‌جایی جابه‌جا نشود
                                className={cn(
                                    "flex min-w-[5.5rem] flex-1 flex-col items-center gap-1.5 rounded-lg border border-secondary px-2 py-2 transition-colors hover:bg-secondary/70 data-[state=active]:border-transparent data-[state=active]:bg-secondary",
                                )}
                            >
                                <span
                                    className={cn(
                                        "grid size-7 place-items-center rounded-full border-2 text-[0.7rem] font-bold transition-colors",
                                        isDone && "border-primary bg-primary text-white",
                                        !isDone && isActive && "border-primary text-primary",
                                        !isDone && !isActive && "border-gray-300 bg-white text-[#777777]",
                                    )}
                                >
                                    {isDone ? <Check className="size-3.5" /> : index + 1}
                                </span>

                                <span className={cn("whitespace-nowrap text-xs", isActive ? "font-medium text-foreground" : isDone ? "text-primary" : "text-[#777777]")}>{tab.title}</span>
                            </TabsTrigger>

                            {index < tabs.length - 1 && <span aria-hidden className="mt-3.5 h-0.5 w-5 shrink-0 rounded-full bg-border" />}
                        </Fragment>
                    );
                })}
            </TabsList>
        </div>
    );
}
