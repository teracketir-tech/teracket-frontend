import { api } from "@/lib/axios";
import { checkAccess, cn } from "@/lib/utils";
import { MinusCircle, PenBox, PlusCircleIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Confirm from "@/components/ui/confirm";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import Empty from "@/components/shared/Empty";
import Loading from "@/components/shared/Loading";
import FilterForm from "@/components/pages/accounting-data/index/Filter";

export default function AccountingDataList() {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState<any>(true);
    const [accountingData, setAccountingData] = useState<any>([]);
    const [selectedAccounts, setSelectedAccounts] = useState<any>({});

    const fetchAccountingData = async () => {
        const params = new URLSearchParams(searchParams.toString());
        const query = params.toString();

        setLoading(true);

        const res = await api(`accounting-data${query ? `?${query}&` : "?"}expand=parent, company`, "GET");

        setAccountingData(res?.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchAccountingData();
    }, []);

    const handleDelete = async (id: number) => {
        setLoading(true);

        const res = await api(`accounting-data/${id}`, "DELETE");

        if (res?.success) {
            fetchAccountingData();
            toast.success("حساب با موفقیت حذف شد.");
        }
    };

    useEffect(() => {
        fetchAccountingData();
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

        setSelectedAccounts((prev: any) => ({ ...prev, [account.id.toString()]: { ...account, children } }));
    };

    const allowOpen = (id: number) => {
        if (isOpen(id)) return true;

        const childrenIds = accountingData?.filter((ad: any) => ad.parent_id == id)?.map((ch: any) => ch.id) || [];

        return childrenIds?.includes(id);
    };

    const selectedChildren = (id: number) => selectedAccounts?.[id.toString()]?.children || [];

    return (
        <div className="w-full">
            <FilterForm loading={loading} />

            <>
                <Title />

                {loading ? (
                    <div className="w-full flex items-center justify-center py-5">
                        <Loading />
                    </div>
                ) : accountingData?.length == 0 ? (
                    <Empty />
                ) : (
                    <div className="flex flex-col gap-1 border">
                        {accountingData
                            ?.filter((a: any) => !a.parent_id)
                            ?.map((acc: any) => (
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
                    </div>
                )}
            </>
        </div>
    );
}

function Title() {
    const list = ["شناسه", "نام", "حساب مادر", "تفصیل", "عملیات"];

    return (
        <div className="w-full justify-between gap-4 p-4 bg-secondary rounded-t-md grid grid-cols-5">
            {list.map((l: string, i: number) => (
                <div key={i} className={cn("flex items-center justify-center")}>
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
    const navigate = useNavigate();

    const rowColor = ["", "bg-gray-100", "bg-blue-50", "bg-red-50", "bg-green-50", "bg-amber-50", "bg-purple-50"];

    return (
        <>
            <div key={item.id} className={cn("w-full grid grid-cols-5 justify-between gap-4 px-4 py-1 hover:bg-gray-50 border-b bg-pur", rowColor[indent])}>
                <div className="flex items-center justify-center py-4">
                    <span className="text-xs text-center">{item.id}</span>
                </div>
                <div className="flex items-center justify-center py-4" style={{ paddingRight: `${indent * 30}px` }}>
                    <p className="w-full text-xs flex items-center gap-3">
                        <button
                            className={cn("text-xs text-center", item.is_parent ? "cursor-pointer" : "opacity-0")}
                            onClick={() => {
                                if (item.is_parent) handleSelectAccount(item);
                            }}
                        >
                            {isOpen(item.id) ? <MinusCircle size={18} /> : <PlusCircleIcon size={18} />}
                        </button>
                        <span>{item.title}</span>
                    </p>
                </div>
                <div className="flex items-center justify-center py-4">
                    <span className="text-xs text-center">{item?.parent?.title || "---"}</span>
                </div>
                <div className="flex items-center justify-center py-4">
                    <span className="text-xs text-center">{getDetailName(item.detail_name)}</span>
                </div>
                <div className="flex flex-wrap items-center justify-center py-4 gap-3">
                    {checkAccess([503]) && item.id > 18 && (
                        <button className="cursor-pointer" onClick={() => navigate(`/accounting-data/edit/${item.id}`)}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <PenBox className="w-3.5 h-3.5" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>ویرایش</p>
                                </TooltipContent>
                            </Tooltip>
                        </button>
                    )}

                    {checkAccess([504]) && item.id > 18 && (
                        <Confirm title="حذف حساب" onConfirm={() => handleDelete(item.id)}>
                            <button className="cursor-pointer">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Trash2Icon className="w-4 h-4 text-red-500" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>حذف</p>
                                    </TooltipContent>
                                </Tooltip>
                            </button>
                        </Confirm>
                    )}
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
