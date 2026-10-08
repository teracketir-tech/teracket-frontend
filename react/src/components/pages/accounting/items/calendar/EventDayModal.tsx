import ToolTip from "@/components/shared/ToolTip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, formatDateToFa, formatNumber, truncateByWord } from "@/lib/utils";
import { LucideCheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface DayEvent {
    id: number;
    price: number;
    title: string;
    color: string;
    contact: string;
    pay_items?: any;
    accounting: any;
    important?: boolean;
    description: string;
    accountingData?: string;
    accounting_data_id?: any;
    side_accounting_data: string;
    side_accounting_data_detail: string;
}

interface EventDayModalProps {
    open: boolean;
    setOpen: (status: boolean) => any;
    fullDate: any;
    isToday?: boolean;
    events: DayEvent[];
    todayReport?: any;
    goToDate?: any;
}

type SelectedTab = 1 | 2 | 3;

const tabs = [
    { value: 1, label: "جمع آیتم های پرداختنی و دریافتی" },
    { value: 2, label: "جمع دریافتنی های واقعی امروز" },
    { value: 3, label: "جمع پرداختنی های واقعی امروز" },
];

export default function EventDayModal({ open, setOpen, fullDate, events, isToday = false, todayReport = {}, goToDate }: EventDayModalProps) {
    const [selectedTab, setselectedTab] = useState<SelectedTab>(1);

    const originalTotal = events
        ?.filter((e: any) => e.is_original)
        ?.reduce((acc: number, item: DayEvent) => {
            if (item.accounting_data_id == 14) return acc + item.price;
            else return acc - item.price;
        }, 0);

    const creditTotal = events?.filter((e: any) => !e.is_original && e.accounting_data_id == 2)?.reduce((acc: number, item: DayEvent) => acc + item.price, 0);

    const debitTotal = events?.filter((e: any) => !e.is_original && e.accounting_data_id == 14)?.reduce((acc: number, item: DayEvent) => acc + item.price, 0);

    const diffDays = (date: any) => {
        date = new Date(date).getTime();
        const today = new Date().getTime();

        const diff = formatNumber(Math.ceil((today - date) / 86400000), false, 0);

        return diff;
    };

    useEffect(() => {
        if (open) setselectedTab(1);
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-3xl! max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>جزییات آیتم های : {`${fullDate.weekDayName}، ${fullDate.persianDate}`}</DialogTitle>
                </DialogHeader>

                {/* tabs */}
                <div className="w-full mt-5 mb-3 flex items-center justify-between gap-1 bg-gray-100 p-2 rounded-lg">
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

                <div>
                    {events?.length > 0 || isToday ? (
                        <div className="flex flex-col gap-3 text-[0.85rem]">
                            <div>
                                {events
                                    .filter(
                                        (e: any) =>
                                            (selectedTab === 1 && e.is_original) ||
                                            (selectedTab === 2 && !e.is_original && e.accounting_data_id == 14) ||
                                            (selectedTab === 3 && !e.is_original && e.accounting_data_id == 2),
                                    )
                                    .map((event) => (
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
                                                            <span className="flex items-center gap-2">{truncateByWord(event.title, 100)}</span>
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
                                                                        <button
                                                                            className="flex items-center justify-center h-5 min-w-5 rounded-full bg-red-500 text-white text-xs cursor-pointer!"
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
                                                <div className="flex flex-col gap-1.5 text-xs text-gray-500 mt-1.5">
                                                    <div className="flex items-center gap-1.5">
                                                        <p>
                                                            {event?.accountingData} - {event?.contact}
                                                        </p>
                                                        <p className="text-gray-400">/</p>
                                                        <p className="w-full text-center">
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

                            {!events?.length && <div className="text-center text-sm text-gray-400 py-5">هیچ آیتمی برای این روز ثبت نشده</div>}

                            {/* total prices */}
                            <>
                                <div className="w-full flex flex-col gap-1 text-sm">
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

                            {/* remaining items */}
                            {isToday && (
                                <>
                                    {todayReport?.credit?.items?.length > 0 && (
                                        <div className="flex flex-col gap-1 mt-5">
                                            <p className="mb-2 text-base">لیست اسناد پرداخت نشده تا امروز</p>

                                            {todayReport.credit.items?.map((c: any) => (
                                                <Link
                                                    to={`/accounting/items?accounting_id=${c?.accounting?.id}`}
                                                    role="link"
                                                    target="_blank"
                                                    key={c.id}
                                                    className={cn("rounded-md px-2 h-14 truncate flex items-center justify-between gap-1 mb-2 bg-red-50")}
                                                >
                                                    <div className="flex flex-col gap-2">
                                                        <p className="flex items-center gap-2">
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <p className="flex items-center gap-2">
                                                                        <span className="flex items-center gap-2">
                                                                            {truncateByWord(`${c.id}- ${c.description}`, 50)}
                                                                        </span>
                                                                    </p>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <span>{c.description}</span>
                                                                </TooltipContent>
                                                            </Tooltip>

                                                            {diffDays(c?.accounting?.date) && (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <button
                                                                            className="flex items-center justify-center px-2 py-0.5 rounded-full bg-red-500 text-white text-xs cursor-pointer!"
                                                                            onClick={(e: any) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                goToDate(c?.accounting?.date);
                                                                            }}
                                                                        >
                                                                            {diffDays(c?.accounting?.date)}
                                                                        </button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p className="flex items-center gap-1">
                                                                            <span>{`${diffDays(c?.accounting?.date)} روز تاخیر`}</span>
                                                                            <span>( {formatDateToFa(c?.accounting?.date)} )</span>
                                                                        </p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-gray-500 flex items-center gap-3">
                                                            <span>{c?.contact?.alias || "---"}</span>
                                                            <span className="text-gray-300">|</span>
                                                            <span>{formatDateToFa(c?.accounting?.date)}</span>
                                                            <span className="text-gray-300">|</span>
                                                            <span>{c?.accountingData?.title}</span>
                                                        </p>
                                                    </div>
                                                    <p>{formatNumber(c.credit, true)}</p>
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {todayReport?.debit?.items?.length > 0 && (
                                        <div className="flex flex-col gap-1 mt-5">
                                            <p className="mb-2 text-base">لیست اسناد دریافت نشده تا امروز</p>

                                            {todayReport.debit.items?.map((d: any) => (
                                                <Link
                                                    to={`/accounting/items?accounting_id=${d?.accounting?.id}`}
                                                    role="link"
                                                    target="_blank"
                                                    key={d.id}
                                                    className={cn("rounded-md px-2 h-14 truncate flex items-center justify-between gap-1 mb-2 bg-green-50")}
                                                >
                                                    <div className="flex flex-col gap-2">
                                                        <p className="flex items-center gap-2">
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <p className="flex items-center gap-2">
                                                                        <span className="flex items-center gap-2">
                                                                            {truncateByWord(`${d.id}- ${d.description}`, 50)}
                                                                        </span>
                                                                    </p>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <span>{d.description}</span>
                                                                </TooltipContent>
                                                            </Tooltip>

                                                            {diffDays(d?.accounting?.date) && (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <button
                                                                            className="flex items-center justify-center px-2 py-0.5 rounded-full bg-red-500 text-white text-xs cursor-pointer!"
                                                                            onClick={(e: any) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                goToDate(d?.accounting?.date);
                                                                            }}
                                                                        >
                                                                            {diffDays(d?.accounting?.date)}
                                                                        </button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p className="flex items-center gap-1">
                                                                            <span>{`${diffDays(d?.accounting?.date)} روز تاخیر`}</span>
                                                                            <span>( {formatDateToFa(d?.accounting?.date)} )</span>
                                                                        </p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-gray-500 flex items-center gap-3">
                                                            <span>{d?.contact?.alias || "---"}</span>
                                                            <span className="text-gray-300">|</span>
                                                            <span>{formatDateToFa(d?.accounting?.date)}</span>
                                                            <span className="text-gray-300">|</span>
                                                            <span>{d?.accountingData?.title}</span>
                                                        </p>
                                                    </div>
                                                    <p>{formatNumber(d.debit, true)}</p>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-sm text-gray-400 py-5">هیچ آیتمی برای این روز ثبت نشده</div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
