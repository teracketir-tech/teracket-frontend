import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, formatDateToFa, formatNumber, truncateByWord } from "@/lib/utils";
import { LucideCheckCircle } from "lucide-react";

interface DayEvent {
    id: number;
    price: number;
    title: string;
    color?: string;
    pay_items?: any;
    important?: boolean;
    description: string;
    is_original: boolean;
    accounting_data_id: number;
}

interface DefaultDayProps {
    day: string;
    loading: boolean;
    isToday?: boolean;
    holiday?: boolean;
    todayReport?: any;
    onViewClick?: () => void; // کلیک روی دکمه نمایش
    events?: DayEvent[];
    goToDate?: any;
}

export default function DefaultDay({ day, loading, isToday = false, holiday = false, todayReport = {}, onViewClick, events = [], goToDate }: DefaultDayProps) {
    const originalTotal = events
        ?.filter((e: any) => e.is_original)
        ?.reduce((acc: number, item: DayEvent) => {
            if (item.accounting_data_id == 14) return acc + item.price;
            else return acc - item.price;
        }, 0);

    const creditTotal = events?.filter((e: any) => !e.is_original && e.accounting_data_id == 2)?.reduce((acc: number, item: DayEvent) => acc + item.price, 0);

    const debitTotal = events?.filter((e: any) => !e.is_original && e.accounting_data_id == 14)?.reduce((acc: number, item: DayEvent) => acc + item.price, 0);

    return (
        <div
            className={cn(
                "relative h-72 rounded-xl p-2 transition-all duration-200 overflow-hidden",
                originalTotal > 0 ? "bg-green-50" : originalTotal < 0 ? "bg-red-50" : "bg-white",
            )}
            onClick={onViewClick}
        >
            {/* هدر */}
            <div className="flex items-center justify-between mb-1 h-8">
                <div className="w-full flex items-center gap-3">
                    <span className={cn("text-base font-bold", holiday ? "text-red-500" : "text-primary")}>{day}</span>

                    {/* تعداد آیتم */}
                    {events.length > 0 && <div className="text-[10px] text-gray-400">{events.length} آیتم</div>}
                </div>

                <div className="flex items-center gap-2" style={{ height: "32px" }}>
                    {/* امروز */}
                    {isToday && <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full">امروز</span>}
                </div>
            </div>

            {/* آیتم ها */}
            <div className="flex flex-col justify-between text-xs h-60">
                {events.length > 0 || isToday ? (
                    <div className="h-full flex flex-col justify-between pb-2">
                        <div>
                            {events
                                ?.filter((e: any) => e.is_original)
                                ?.slice(0, 3)
                                ?.map((event) => (
                                    <div key={event.id} className={cn("rounded-md p-1 h-6 flex items-center justify-between gap-1 mb-1", event.color)}>
                                        <p className="flex items-center justify-between gap-2">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span>{truncateByWord(event.title, 7)}</span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="flex items-center gap-2">
                                                        <span>{event.description}</span>
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>

                                            {event?.pay_items?.total_paid && (
                                                <>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span className="flex items-center justify-center size-4.5 rounded-full bg-green-500">
                                                                <LucideCheckCircle size={14} className="text-white" />
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <span>تسویه شده</span>
                                                        </TooltipContent>
                                                    </Tooltip>

                                                    {event?.pay_items?.delay > 0 && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <button
                                                                    className="flex items-center justify-center h-4.5 min-w-4.5 rounded-full bg-red-500 text-white text-[0.7rem] pt-1 cursor-pointer!"
                                                                    onClick={(e: any) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        goToDate(event?.pay_items?.items?.at(-1)?.accounting?.date);
                                                                    }}
                                                                >
                                                                    {event?.pay_items?.delay}
                                                                </button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p className="flex items-center ga-1">
                                                                    <span>{`${event?.pay_items?.delay} روز تاخیر`}</span>
                                                                    <span>( {formatDateToFa(event?.pay_items?.items?.at(-1)?.accounting?.date)} )</span>
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                </>
                                            )}
                                        </p>
                                        <p>{formatNumber(event.price)}</p>
                                    </div>
                                ))}

                            {!events?.filter((e: any) => e.is_original)?.length && (
                                <div className="h-28 flex items-center justify-center text-gray-300 text-xs">بدون آیتم</div>
                            )}

                            <div className=" rounded-md px-2 py-1 flex items-center justify-between gap-1 bg-gray-200">
                                <p className="flex items-center justify-between">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span>{truncateByWord("جمع آیتم های پرداختنی و دریافتی", 20)}</span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <span>جمع آیتم های پرداختنی و دریافتی</span>
                                        </TooltipContent>
                                    </Tooltip>
                                </p>
                                <p className={cn(originalTotal > 0 ? "text-green-600" : originalTotal < 0 ? "text-red-600" : "")}>
                                    {formatNumber(originalTotal)}
                                </p>
                            </div>
                        </div>

                        {/* <div>
                            {events?.filter((e: any) => e.is_original)?.length > 4 && (
                                <p className="flex flex-col items-center justify-center -mt-4">
                                    <span className="h-2">.</span>
                                    <span className="h-2">.</span>
                                    <span className="h-2">.</span>
                                </p>
                            )}
                        </div> */}

                        {/* total prices */}
                        <>
                            <div className="w-full flex flex-col gap-1 text-[0.7rem]">
                                <div className="flex flex-col gap-1">
                                    {isToday && (
                                        <>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="w-full rounded-md px-1 h-6 flex items-center justify-between gap-1 bg-green-300">
                                                        <p className="bg-white w-12 h-4 rounded-md flex items-center justify-center pt-1 text-red-600">
                                                            {formatNumber(todayReport?.debit?.count)}
                                                        </p>
                                                        <p className="pt-1">{formatNumber(todayReport?.debit?.total)}</p>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <span>جمع آیتم های دریافت نشده</span>
                                                </TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="w-full rounded-md px-1 h-6 flex items-center justify-between gap-1 bg-red-300">
                                                        <p className="bg-white w-12 h-4 rounded-md flex items-center justify-center pt-1 text-red-600">
                                                            {formatNumber(todayReport?.credit?.count)}
                                                        </p>
                                                        <p className="pt-1">{formatNumber(todayReport?.credit?.total)}</p>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <span>جمع آیتم های پرداخت نشده</span>
                                                </TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="w-full rounded-md px-1 h-6 flex items-center justify-between gap-1 bg-gray-200">
                                                        <span>جمع کل روز</span>
                                                        <p className="pt-1">{formatNumber(todayReport?.debit?.total - todayReport?.credit?.total)}</p>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <span>جمع کل روز</span>
                                                </TooltipContent>
                                            </Tooltip>
                                        </>
                                    )}
                                </div>

                                {events.length > 0 && (
                                    <>
                                        <div className=" rounded-md px-2 py-1 flex items-center justify-between gap-1 bg-gray-200">
                                            <p className="flex items-center justify-between">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span>{truncateByWord("جمع دریافتنی های واقعی امروز", 20)}</span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <span>جمع دریافتنی های واقعی امروز</span>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </p>
                                            <p className="text-green-600">{formatNumber(debitTotal)}</p>
                                        </div>

                                        <div className=" rounded-md px-2 py-1 flex items-center justify-between gap-1 bg-gray-200">
                                            <p className="flex items-center justify-between">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span>{truncateByWord("جمع پرداختنی های واقعی امروز", 20)}</span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <span>جمع پرداختنی های واقعی امروز</span>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </p>
                                            <p className="text-red-600">{formatNumber(creditTotal)}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    </div>
                ) : loading ? (
                    <div className="h-40 flex items-center justify-center text-gray-300 text-xs">در حال دریافت اطلاعات...</div>
                ) : (
                    <div className="h-40 flex items-center justify-center text-gray-300 text-xs">بدون آیتم</div>
                )}
            </div>
        </div>
    );
}
