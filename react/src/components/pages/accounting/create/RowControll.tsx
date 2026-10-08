import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, formatNumber } from "@/lib/utils";
import { ChevronsUpDown, PlusCircleIcon } from "lucide-react";

export default function RowControll({
    inBalance,
    addRows,
    items,
    setItems,
}: {
    inBalance: () => number;
    addRows: (rows: number) => any;
    items: any;
    setItems: any;
}) {
    const totalPrices = items?.reduce(
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

    return (
        <div className="flex items-center gap-3">
            <div className={cn("w-full flex items-center justify-between p-2 rounded-md border", inBalance() ? "bg-red-100" : "bg-green-100")}>
                <div className="flex items-center justify-start gap-3.5 w-[10%]">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button type="button" className="cursor-pointer" onClick={() => setItems((prev: any) => [...prev, ...addRows(1)])}>
                                <p className="flex items-center gap-1">
                                    <PlusCircleIcon className="size-4" />
                                    <span className="text-sm">افزودن ردیف</span>
                                </p>
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>افزودن ردیف</p>
                        </TooltipContent>
                    </Tooltip>

                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className="w-8 flex items-center justify-center">
                                <SidebarMenuButton size="sm" className="">
                                    <ChevronsUpDown className="size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="bottom" align="end" sideOffset={4}>
                                <DropdownMenuGroup className="text-xs">
                                    <DropdownMenuItem className="border-b border-gray-100" onClick={() => setItems((prev: any) => [...prev, ...addRows(5)])}>
                                        افزودن 5 ردیف
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="border-b border-gray-100" onClick={() => setItems((prev: any) => [...prev, ...addRows(10)])}>
                                        افزودن 10 ردیف
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setItems((prev: any) => [...prev, ...addRows(20)])}>افزودن 20 ردیف</DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                </div>

                <div className="flex flex-col items-end justify-center gap-1 text-sm w-[90%]">
                    <p className="flex items-center gap-1">
                        <span>بدهکار</span>
                        <span>:</span>
                        <span>{formatNumber(totalPrices?.debit, true)}</span>
                    </p>
                    <p className="w-full border border-gray-300"></p>
                    <p className="flex items-center gap-1">
                        <span>بستانکار</span>
                        <span>:</span>
                        <span>{formatNumber(totalPrices?.credit, true)}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
