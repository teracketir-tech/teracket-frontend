import { api } from "@/lib/axios";
import { cn, formatNumber } from "@/lib/utils";
import { MinusCircle, PlusCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Empty from "@/components/shared/Empty";
import Loading from "@/components/shared/Loading";
import { useSearchParams } from "react-router-dom";
import FilterForm from "@/components/pages/accounting-data/report/Filter";

export default function AccountingDataReport() {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState<any>(false);
    const [accountingData, setAccountingData] = useState<any>([]);
    const [selectedAccounts, setSelectedAccounts] = useState<any>({});

    const fetchAccountingDataReport = async () => {
        const params = new URLSearchParams(searchParams.toString());
        const query = params.toString();

        setLoading(true);

        const res = await api(`accounting-data/report${query ? `?${query}&` : "?"}expand=parent, company`, "GET");

        setAccountingData(res?.data?.filter((d: any) => d?.report?.debit || d?.report?.credit));
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        setLoading(true);

        const res = await api(`accounting-data/${id}`, "DELETE");

        if (res?.success) {
            fetchAccountingDataReport();
            toast.success("حساب با موفقیت حذف شد.");
        }
    };

    useEffect(() => {
        fetchAccountingDataReport();
    }, [searchParams]);

    const getDetailName = (detail: any) => {
        let name = "---";

        switch (detail) {
            case "contact_id":
                name = "شخص";
                break;

            case "account_id":
                name = "حساب";
                break;

            case "bank_id":
                name = "بانک";
                break;

            default:
                break;
        }

        return name;
    };

    const isOpen = (id: number) => Object.keys(selectedAccounts).includes(id.toString());

    const handleSelectAccount = (account: any) => {
        if (isOpen(account.id)) {
            const newList = {} as any;
            Object.entries(selectedAccounts)
                .filter(([key]: [any, any]) => key != account.id)
                .forEach(([k, v]: [any, any]) => (newList[k] = v));

            setSelectedAccounts(newList);
            return;
        }

        const children = accountingData?.filter((ad: any) => ad.parent_id == account.id);

        if (["bank_id", "contact_id"].includes(account?.detail_name)) {
            account?.items?.forEach((it: any) =>
                children.push({
                    id: it.id,
                    title: account?.detail_name === "bank_id" ? it?.bank?.name || "---" : it?.contact?.alias || "---",
                    detail_name: account?.detail_name,
                    report: { debit: it.total_debit, credit: it.total_credit, total: it.total_credit - it.total_debit },
                }),
            );
        }

        setSelectedAccounts((prev: any) => ({ ...prev, [account.id.toString()]: { ...account, children } }));
    };

    const allowOpen = (id: number) => {
        if (isOpen(id)) return true;

        const childrenIds = accountingData?.filter((ad: any) => ad.parent_id == id)?.map((ch: any) => ch.id) || [];

        return childrenIds?.includes(id);
    };

    const selectedChildren = (id: number) => selectedAccounts?.[id.toString()]?.children || [];

    const totalPrices = accountingData?.reduce(
        (acc: any, item: any) => {
            const debit = Number(item?.report?.debit || 0);
            const credit = Number(item?.report?.credit || 0);
            const rowTotal = Number(item?.report?.total || 0);

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
        <div className="w-full">
            <FilterForm loading={loading} />

            <>
                <Title />

                {loading ? (
                    <div className="w-full flex items-center justify-center py-5">
                        <Loading />
                    </div>
                ) : !accountingData || accountingData?.length == 0 ? (
                    <Empty />
                ) : (
                    <div className="flex flex-col gap-1 border">
                        {accountingData?.map((acc: any) => (
                            <>
                                <AccountingDataRow
                                    item={acc}
                                    handleSelectAccount={handleSelectAccount}
                                    isOpen={isOpen}
                                    allowOpen={allowOpen}
                                    getDetailName={getDetailName}
                                    handleDelete={handleDelete}
                                    selectedChildren={selectedChildren}
                                />
                            </>
                        ))}

                        <div className="w-full grid grid-cols-6 justify-between gap-4 px-4 hover:bg-gray-50 border-b bg-gray-50 text-[0.8rem] py-4">
                            <p className="col-span-2 flex items-center justify-center">جمع کل</p>
                            <p className="flex items-center justify-center">{formatNumber(totalPrices?.debit, true)}</p>
                            <p className="flex items-center justify-center">{formatNumber(totalPrices?.credit, true)}</p>
                            <p className="flex items-center justify-center">{formatNumber(totalPrices?.total, true)}</p>
                            <p className="flex items-center justify-center"></p>
                        </div>
                    </div>
                )}
            </>
        </div>
    );
}

function Title() {
    const list = ["حساب", "تفصیل", "بدهکار", "بستانکار", "مجموع", "مجموع بر اساس متراژ"];

    return (
        <div className="w-full justify-between gap-4 p-4 bg-secondary rounded-t-md grid grid-cols-6">
            {list.map((l: string, i: number) => (
                <div key={i} className={cn("flex items-center", i > 0 ? "justify-center" : "pr-7")}>
                    <span className="text-xs font-bold text-[#777777]">{l}</span>
                </div>
            ))}
        </div>
    );
}

function AccountingDataRow({
    item,
    handleSelectAccount,
    isOpen,
    allowOpen,
    getDetailName,
    handleDelete,
    selectedChildren,
    indent = 0,
}: {
    item: any;
    handleSelectAccount: any;
    isOpen: any;
    allowOpen: any;
    getDetailName: any;
    handleDelete: any;
    selectedChildren: any;
    indent?: number;
}) {
    const rowColor = ["", "bg-gray-50", "bg-blue-50", "bg-red-50", "bg-green-50", "bg-amber-50", "bg-purple-50"];

    return (
        <>
            <div key={item.id} className={cn("w-full grid grid-cols-6 justify-between gap-4 px-4 py-1 hover:bg-gray-100 border-b", rowColor[indent])}>
                <div className="flex items-center justify-center py-4" style={{ paddingRight: `${indent * 30}px` }}>
                    <p className="w-full text-xs flex items-center gap-3">
                        <button
                            className={cn("text-xs text-center", item?.items?.length > 0 ? "cursor-pointer" : "opacity-0")}
                            onClick={() => {
                                if (item?.items?.length > 0) handleSelectAccount(item);
                            }}
                        >
                            {isOpen(item.id) ? <MinusCircle size={18} /> : <PlusCircleIcon size={18} />}
                        </button>
                        <span>{item.title}</span>
                    </p>
                </div>
                <div className="flex items-center justify-center py-4">
                    <span className="text-xs text-center">{getDetailName(item.detail_name)}</span>
                </div>
                <div className="flex items-center justify-center py-4">
                    <span className="text-xs text-center">{formatNumber(item?.report?.debit, true)}</span>
                </div>
                <div className="flex items-center justify-center py-4">
                    <span className="text-xs text-center">{formatNumber(item?.report?.credit, true)}</span>
                </div>
                <div className="flex items-center justify-center py-4">
                    <span className="text-xs text-center">{formatNumber(item?.report?.total, true)}</span>
                </div>
                <div className="flex items-center justify-center py-4">
                    <span className="text-xs text-center">{formatNumber(0)}</span>
                </div>
            </div>

            {allowOpen(item.id) &&
                selectedChildren(item.id)?.map((ch: any) => (
                    <AccountingDataRow
                        item={ch}
                        handleSelectAccount={handleSelectAccount}
                        isOpen={isOpen}
                        allowOpen={allowOpen}
                        getDetailName={getDetailName}
                        handleDelete={handleDelete}
                        selectedChildren={selectedChildren}
                        indent={indent + 1}
                    />
                ))}
        </>
    );
}
