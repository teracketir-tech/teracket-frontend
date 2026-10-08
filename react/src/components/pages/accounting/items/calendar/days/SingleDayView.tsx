import ToolTip from "@/components/shared/ToolTip";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, formatDateToFa, formatNumber, truncateByWord } from "@/lib/utils";
import { Eye, LucideCheckCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface DayEvent {
    id: number;
    price: number;
    title: string;
    color?: string;
    contact: string;
    pay_items?: any;
    important?: boolean;
    description: string;
    accounting: any;
    accountingData?: string;
    accounting_data_id?: any;
    side_accounting_data: string;
    side_accounting_data_detail: string;
}

interface SingleDayViewProps {
    day: string;
    currentDate: string;
    currentPersianDate: string;
    weekDay?: string;
    isToday?: boolean;
    todayReport?: any;
    onViewClick?: () => void;
    events?: DayEvent[];
}

type SelectedTab = 1 | 2 | 3;

const tabs = [
    { value: 1, label: "جمع آیتم های پرداختنی و دریافتی" },
    { value: 2, label: "جمع دریافتنی های واقعی امروز" },
    { value: 3, label: "جمع پرداختنی های واقعی امروز" },
];

export default function SingleDayView({
    day,
    currentDate,
    currentPersianDate,
    weekDay = "",
    isToday = false,
    todayReport = {},
    onViewClick,
    events = [],
}: SingleDayViewProps) {
    const [selectedTab, setselectedTab] = useState<SelectedTab>(1);

    const isHoliday = weekDay === "جمعه";

    const originalTotal = events
        ?.filter((e: any) => e.is_original)
        ?.reduce((acc: number, item: DayEvent) => {
            if (item.accounting_data_id == 14) return acc + item.price;
            else return acc - item.price;
        }, 0);

    const creditTotal = events?.filter((e: any) => !e.is_original && e.accounting_data_id == 2)?.reduce((acc: number, item: DayEvent) => acc + item.price, 0);

    const debitTotal = events?.filter((e: any) => !e.is_original && e.accounting_data_id == 14)?.reduce((acc: number, item: DayEvent) => acc + item.price, 0);

    return (
        <div className="py-4">
            <div
                className={cn(
                    "card border border-gray-300 rounded-md overflow-hidden",
                    originalTotal > 0 ? "bg-green-50" : originalTotal < 0 ? "bg-red-50" : "bg-white",
                )}
            >
                {/* Header */}
                <div className={cn("py-4 flex justify-between items-center border-b border-gray-300 mx-4", isHoliday ? "text-red-500" : "")}>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="font-bold text-6xl">{day}</h1>
                            {isToday && <span className="w-20 text-center rounded-lg bg-gray-400 text-white">امروز</span>}
                            {isHoliday && <span className="w-20 text-center rounded-lg bg-red-500 text-white">تعطیل</span>}
                        </div>

                        <div className="mt-2 flex items-center gap-5">
                            <div>{weekDay}</div>
                            <p className="text-gray-400">{currentPersianDate}</p>
                            <p className="text-gray-400">|</p>
                            <p className="text-gray-400">{currentDate}</p>
                        </div>
                    </div>

                    {/* Eye button */}
                    <button onClick={onViewClick} className="p-3 rounded-lg bg-white text-primary">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Eye className="size-5" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>جزییات آیتم های روز</p>
                            </TooltipContent>
                        </Tooltip>
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 text-sm">
                    {/* Events Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h5 className="font-bold mb-0">آیتم های این روز</h5>
                        <span className="px-3 py-0.5 rounded-lg bg-gray-100">{events.length} آیتم</span>
                    </div>

                    {/* tabs */}
                    <div className="my-6 flex gap-4 justify-center items-center">
                        <div className="flex gap-1 bg-gray-100 p-2 rounded-lg">
                            {tabs.map((tab: any) => (
                                <button
                                    key={tab.value}
                                    onClick={() => setselectedTab(tab.value)}
                                    className={cn(
                                        "cursor-pointer px-4 py-2 rounded text-sm font-medium transition-all duration-200",
                                        selectedTab === tab.value ? "bg-white text-primary shadow-md" : "text-gray-600 hover:text-gray-900 hover:bg-gray-200",
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Events */}
                    {events.length > 0 || isToday ? (
                        <div className="flex flex-col gap-3">
                            <div>
                                {events
                                    .filter(
                                        (e: any) =>
                                            (selectedTab === 1 && e.is_original) ||
                                            (selectedTab === 2 && !e.is_original && e.price < 0) ||
                                            (selectedTab === 3 && !e.is_original && e.price > 0),
                                    )
                                    .map((event: DayEvent) => (
                                        <Link
                                            to={`/accounting/items?accounting_id=${event.accounting.id}`}
                                            role="link"
                                            target="_blank"
                                            key={event.id}
                                            className={cn(
                                                "rounded-md px-2 h-20 truncate flex items-center justify-between gap-1 mb-2 cursor-pointer",
                                                event.color,
                                            )}
                                        >
                                            <div>
                                                <p className="flex items-center gap-2">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span>{truncateByWord(event.description, 40)}</span>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p className="flex items-center gap-3">
                                                                <span>{event.description}</span>
                                                                <span className="text-gray-300">|</span>
                                                                <span>{event?.accountingData}</span>
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>

                                                    {event?.pay_items?.total_paid && (
                                                        <>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <span className="flex items-center justify-center size-5 rounded-full bg-green-500 cursor-auto">
                                                                        <LucideCheckCircle size={16} className="text-white" />
                                                                    </span>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <span>تسویه شده</span>
                                                                </TooltipContent>
                                                            </Tooltip>

                                                            {event?.pay_items?.delay > 0 && (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <span className="flex items-center justify-center size-5 rounded-full bg-red-500 text-white text-xs cursor-default">
                                                                            {event?.pay_items?.delay}
                                                                        </span>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <span>{`${event?.pay_items?.delay} روز تاخیر`}</span>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                        </>
                                                    )}
                                                </p>
                                                <div className="flex flex-col gap-1.5 text-xs text-gray-500 mt-1.5">
                                                    <div className="flex items-center gap-1.5">
                                                        <p>
                                                            {event?.accountingData} - {event?.contact}
                                                        </p>
                                                        <p className="text-gray-400">/</p>
                                                        <p>
                                                            {event?.side_accounting_data}
                                                            {event?.side_accounting_data_detail ? ` - ${event?.side_accounting_data_detail}` : ""}
                                                        </p>
                                                    </div>
                                                    <p>{formatDateToFa(event?.accounting?.date)}</p>
                                                </div>
                                            </div>
                                            <p>{formatNumber(event.price, true)}</p>
                                        </Link>
                                    ))}
                            </div>

                            {!events?.length && (
                                <div className="flex items-center justify-center text-gray-300 text-sm mb-8">هیچ آیتمی برای این روز ثبت نشده</div>
                            )}

                            {/* total prices */}
                            <>
                                <div className="w-full flex flex-col gap-1 text-sm">
                                    {events?.length > 0 && (
                                        <>
                                            {selectedTab === 1 && (
                                                <div className="h-14 rounded-md px-2 py-1 flex items-center justify-between gap-1 bg-gray-200">
                                                    <p className="flex items-center justify-between">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span>{truncateByWord("جمع آیتم های پرداختنی و دریافتی", 40)}</span>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <span>جمع آیتم های پرداختنی و دریافتی</span>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </p>
                                                    <p className={cn(originalTotal > 0 ? "text-green-600" : originalTotal < 0 ? "text-red-600" : "")}>
                                                        {formatNumber(originalTotal, true)}
                                                    </p>
                                                </div>
                                            )}

                                            {selectedTab === 2 && (
                                                <div className="h-14 rounded-md px-2 py-1 flex items-center justify-between gap-1 bg-gray-200">
                                                    <p className="flex items-center justify-between">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span>{truncateByWord("جمع دریافتنی های واقعی امروز", 40)}</span>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <span>جمع دریافتنی های واقعی امروز</span>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </p>
                                                    <p className="text-green-600">{formatNumber(debitTotal, true)}</p>
                                                </div>
                                            )}

                                            {selectedTab === 3 && (
                                                <div className="h-14 rounded-md px-2 py-1 flex items-center justify-between gap-1 bg-gray-200">
                                                    <p className="flex items-center justify-between">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span>{truncateByWord("جمع پرداختنی های واقعی امروز", 40)}</span>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <span>جمع پرداختنی های واقعی امروز</span>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </p>
                                                    <p className="text-red-600">{formatNumber(creditTotal, true)}</p>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    <div className="flex flex-col gap-1">
                                        {isToday && (
                                            <>
                                                <div className="w-full rounded-md px-2 h-14 flex items-center justify-between gap-1 bg-green-300">
                                                    <ToolTip
                                                        triger={
                                                            <div className="flex items-center gap-2">
                                                                <p>جمع آیتم های دریافت نشده</p>
                                                                <p className="bg-white size-6 rounded-full flex items-center justify-center text-red-600">
                                                                    {formatNumber(todayReport?.debit?.count)}
                                                                </p>
                                                            </div>
                                                        }
                                                        text="جمع آیتم های دریافت نشده"
                                                    />
                                                    <p>{formatNumber(todayReport?.debit?.total, true)}</p>
                                                </div>

                                                <div className="w-full rounded-md px-2 h-14 flex items-center justify-between gap-1 bg-red-300">
                                                    <ToolTip
                                                        triger={
                                                            <div className="flex items-center gap-2">
                                                                <p>جمع آیتم های پرداخت نشده</p>
                                                                <p className="bg-white size-6 rounded-full flex items-center justify-center text-red-600">
                                                                    {formatNumber(todayReport?.credit?.count)}
                                                                </p>
                                                            </div>
                                                        }
                                                        text="جمع آیتم های پرداخت نشده"
                                                    />
                                                    <p>{formatNumber(todayReport?.credit?.total, true)}</p>
                                                </div>

                                                <div className="w-full rounded-md px-2 h-14 flex items-center justify-between gap-1 bg-gray-300">
                                                    <ToolTip triger="جمع کل روز" text="جمع کل روز" />
                                                    <p>{formatNumber(todayReport?.debit?.total - todayReport?.credit?.total, true)}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-5">هیچ آیتمی برای این روز ثبت نشده</div>
                    )}
                </div>
            </div>
        </div>
    );
}
