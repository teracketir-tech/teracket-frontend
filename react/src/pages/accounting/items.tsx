import Pagination from "@/components/shared/Pagination";
import { api } from "@/lib/axios";
import { cn, exportAccountingItems, formatDateToFa, formatNumber, truncateByWord } from "@/lib/utils";
import { useEffect, useState } from "react";
import Empty from "@/components/shared/Empty";
import Loading from "@/components/shared/Loading";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSearchParams } from "react-router-dom";
import FilterForm from "@/components/pages/accounting/items/Filter";
import Button from "@/components/shared/Button";
import { FileSpreadsheet } from "lucide-react";

export default function AccountingItemList() {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState<any>(true);
    const [exportLoading, setExportLoading] = useState<any>(false);
    const [accountingItems, setAccountingItems] = useState<any>({});

    const fetchAccountingItems = async (excel?: boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        const query = params.toString();

        if (excel) setExportLoading(true);
        else setLoading(true);

        const res = await api(`accounting-item?${query ? `${query}&` : ""}${excel ? `excel=${excel}&` : ""}`);

        if (excel) {
            return res;

            //
        } else {
            setAccountingItems(res);
            setLoading(false);
        }
    };

    const collectParents = (id: number, byId: Record<number, any>): string[] => {
        const node = byId[id];

        if (!node || node.parent_id == null) return [];

        return [byId[node.parent_id].title, ...collectParents(node.parent_id, byId)];
    };

    const handleExport = async () => {
        const res = await fetchAccountingItems(true);

        const byId = Object.fromEntries(res.accounting_data_list.map((ad: any) => [ad.id, ad]));

        const data = res.data.map((item: any) => {
            const currentRowIndex = res?.data?.findIndex((i: any) => i.id === item.id);

            const total = res.data.slice(0, currentRowIndex + 1).reduce((acc: number, i: any) => {
                const debit = Number(i.debit);
                const credit = Number(i.credit);
                const rowTotal = credit - debit;

                return (acc += rowTotal);
            }, 0);

            const parents = collectParents(item.accounting_data_id, byId);

            return {
                ...item,
                accountingData: {
                    ...item.accountingData,
                    title: `${parents?.length > 0 ? parents.reverse().join(", ") + ", " : ""}${item.accountingData.title}`,
                },
                debit: `${formatNumber(item.debit, true)}`,
                credit: `${formatNumber(item.credit, true)}`,
                total: `${formatNumber(total, true)}`,
            };
        });

        await exportAccountingItems(data);

        setExportLoading(false);
    };

    useEffect(() => {
        fetchAccountingItems();
    }, [searchParams]);

    const totalPrices = accountingItems?.data?.reduce(
        (acc: any, item: any) => {
            const debit = Number(item.debit);
            const credit = Number(item.credit);
            const rowTotal = credit - debit;

            acc.debit += debit;
            acc.credit += credit;
            acc.total += rowTotal;

            return acc;
        },
        {
            debit: 0,
            credit: 0,
            total: 0,
        },
    );

    const rowTotal = (index: number) => {
        return accountingItems.data.slice(0, index + 1).reduce((acc: number, item: any) => {
            const debit = Number(item.debit);
            const credit = Number(item.credit);
            const rowTotal = credit - debit;

            acc += rowTotal;

            return acc;
        }, 0);
    };

    return (
        <div className="w-full">
            <FilterForm loading={loading} />

            {/* excel export */}
            <Button className="mb-4 w-48! flex items-center gap-1" isLoading={exportLoading} onClick={handleExport}>
                <FileSpreadsheet size={17} />
                <span>خروجی اکسل</span>
            </Button>

            {accountingItems?.data?.length && (
                <div className="w-full grid grid-cols-13 items-start py-4 rounded-md mb-3 bg-gray-50 text-[0.8rem] text-black font-bold">
                    <p className="col-span-7 flex items-center justify-center">مجموع</p>
                    <p className="flex items-center justify-center gap-1.5 col-span-2">
                        <span>بدهکار</span>
                        <span>:</span>
                        <span>{formatNumber(totalPrices?.debit, true)}</span>
                    </p>
                    <p className="flex items-center justify-center gap-1.5 col-span-2">
                        <span>بستانکار</span>
                        <span>:</span>
                        <span>{formatNumber(totalPrices?.credit, true)}</span>
                    </p>
                    <p className="flex items-center justify-center gap-1.5 col-span-2">
                        <span>مجموع</span>
                        <span>:</span>
                        <span>{formatNumber(totalPrices?.total, true)}</span>
                    </p>
                </div>
            )}

            <>
                <Title />

                {loading ? (
                    <div className="w-full flex items-center justify-center py-5">
                        <Loading />
                    </div>
                ) : accountingItems?.data?.length == 0 ? (
                    <Empty />
                ) : (
                    <div className="flex flex-col gap-1 border">
                        {accountingItems?.data?.map((item: any, i: number) => (
                            <div key={item.id} className="w-full grid grid-cols-16 justify-between gap-4 px-4 py-1 hover:bg-gray-50 border-b">
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{i + 1}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{item.id}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">
                                        {item?.accounting?.flag == 1 ? <p className="size-2 rounded-full bg-red-500"></p> : <>---</>}
                                    </span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{formatDateToFa(item?.accounting?.created_at)}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{formatDateToFa(item?.accounting?.date)}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{item?.accounting?.id}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{item?.accountingData?.title}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span>{truncateByWord(item.description)}</span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{item.description}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{item?.bank?.name || item?.bank?.bankName?.name || "---"}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{item?.contact?.alias || "---"}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{item?.accounting?.project?.name || "---"}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{item?.company?.name || "---"}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">
                                        {item?.accounting?.user ? `${item?.accounting?.user?.first_name} ${item?.accounting?.user?.last_name}` : "---"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{formatNumber(item.debit, true)}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{formatNumber(item.credit, true)}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{formatNumber(rowTotal(i), true)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Pagination totalPage={accountingItems.pages} />
            </>
        </div>
    );
}

function Title() {
    const list = [
        "ردیف",
        "شناسه",
        "عدم تطابق تاریخ",
        "تاریخ روز",
        "تاریخ سند",
        "شناسه سند",
        "حساب",
        "شرح",
        "نام بانک",
        "نام شخص",
        "پروژه",
        "شرکت",
        "نام ثبت کننده",
        "مبلغ بدهکار",
        "مبلغ بستانکار",
        "مجموع",
    ];

    return (
        <div className="w-full justify-between gap-4 p-4 bg-secondary rounded-t-md grid grid-cols-16">
            {list.map((l: string, i: number) => (
                <div key={i} className={cn("flex items-center justify-center")}>
                    <span className="text-xs font-bold text-[#777777]">{l}</span>
                </div>
            ))}
        </div>
    );
}
