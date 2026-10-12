import Pagination from "@/components/shared/Pagination";
import { api } from "@/lib/axios";
import { AccountingDataIds, checkAccess, cn, formatDateToFa, formatNumber, truncateByWord } from "@/lib/utils";
import { useEffect, useState } from "react";
import Empty from "@/components/shared/Empty";
import Loading from "@/components/shared/Loading";
import { useSearchParams } from "react-router-dom";
import ToolTip from "@/components/shared/ToolTip";
import { CircleDollarSignIcon } from "lucide-react";
import FilterForm from "@/components/pages/accounting/payments/Filter";
import PayModal from "./pay";

export default function PaymentList() {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState<any>(true);
    const [openPayModal, setOpenPayModal] = useState(false);
    const [itemLoading, setItemLoading] = useState<any>({});
    const [selectedItem, setSelectedItem] = useState<any>({});
    const [accountingItems, setAccountingItems] = useState<any>({});

    const fetchProducts = async () => {
        const res = await api(`product?per-page=5000`);

        if (res?.data)
            setProducts(
                res?.data?.map((d: any) => ({
                    label: `${d.id}- ${d?.name}`,
                    value: d.id.toString(),
                    accounting_data_id: d.accounting_data_id,
                    company_id: d.company_id,
                })),
            );
    };

    const fetchMaterials = async () => {
        const res = await api(`material?material_type=1&per-page=5000`);

        if (res?.data) setMaterials(res?.data?.map((d: any) => ({ label: `${d.id}- ${d?.name}`, value: d.id.toString(), company_id: d.company_id })));
    };

    const fetchAccountingItems = async (loading = true) => {
        const params = new URLSearchParams(searchParams.toString());
        const query = params.toString();

        setLoading(loading);

        const res = await api(
            `accounting-item?${query ? `${query}&` : ""}accounting_data_id=${AccountingDataIds.PAYABLE}&debit=0&sum=1&expand=company, accountingData, accounting, contact, bank`,
            "GET",
        );

        setAccountingItems(res);
        setLoading(false);
    };

    const collectParents = (id: number, byId: Record<number, any>): string[] => {
        const node = byId[id];

        if (!node || node.parent_id == null) return [];

        return [byId[node.parent_id].title, ...collectParents(node.parent_id, byId)];
    };

    useEffect(() => {
        fetchProducts();
        fetchMaterials();
    }, []);

    useEffect(() => {
        fetchAccountingItems();
    }, [searchParams]);

    const remainingCredit = (item: any) => {
        const paid = item?.paidItems?.reduce((acc: number, p: any) => acc + Number(p?.price), 0);
        return Math.trunc(Number(item.credit) - paid);
    };

    const remainingTotalCredit = (index: number) => {
        const total = accountingItems?.data.slice(0, index + 1).reduce((acc: number, item: any) => {
            const paid = item?.paidItems?.reduce((acc: number, p: any) => acc + Number(p?.price), 0);

            const credit = Number(item.credit);
            const rowTotal = credit - paid;

            acc += rowTotal;

            return acc;
        }, 0);

        return Math.trunc(total);
    };

    const handlePay = (item: any) => {
        setItemLoading((prev: any) => ({ ...prev, [item.id]: true }));
        setSelectedItem({ ...item, remaining_credit: remainingCredit(item) });
        setOpenPayModal(true);
    };

    return (
        <div className="w-full">
            <FilterForm loading={loading} />

            {accountingItems?.data?.length && (
                <div className="w-full grid grid-cols-16 items-start py-4 rounded-md mb-3 bg-gray-50 text-[0.8rem] text-black font-bold">
                    <p className="col-span-14 flex items-center justify-center">جمع مانده کل</p>
                    <p className="col-span-2">{formatNumber(accountingItems?.total, true)}</p>
                </div>
            )}

            <div className="overflow-x-auto">
                <div className="w-576">
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
                                        <ToolTip triger={<p className="text-xs!">{truncateByWord(item.description)}</p>} text={item.description} />
                                    </div>
                                    <div className="flex items-center justify-center py-4">
                                        <span className="text-xs text-center">{item?.contact?.alias || "---"}</span>
                                    </div>
                                    <div className="flex items-center justify-center py-4">
                                        <span className="text-xs text-center">{item?.accounting?.project?.name || "---"}</span>
                                    </div>
                                    <div className="flex items-center justify-center py-4">
                                        {item?.paid_or_received ? (
                                            <div className="flex items-center gap-1.5 py-1 px-3 rounded-full text-xs bg-green-50">
                                                <p className="size-1.5 rounded-full bg-green-500"></p>
                                                <p className="text-green-500">پرداخت شده</p>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 py-1 px-3 rounded-full text-xs bg-red-50">
                                                <p className="size-1.5 rounded-full bg-red-500"></p>
                                                <p className="text-red-500">پرداخت نشده</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-center py-4">
                                        <span className="text-xs text-center">{item?.company?.name || "---"}</span>
                                    </div>
                                    <div className="flex items-center justify-center py-4">
                                        <span className="text-xs text-center">{formatNumber(item.credit, true)}</span>
                                    </div>
                                    <div className="flex items-center justify-center py-4">
                                        <span className="text-xs text-center">{formatNumber(remainingCredit(item), true)}</span>
                                    </div>
                                    <div className="flex items-center justify-center py-4">
                                        <span className="text-xs text-center">{formatNumber(remainingTotalCredit(i), true)}</span>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-center py-4 gap-3">
                                        {checkAccess([603]) && !item?.paid_or_received ? (
                                            <ToolTip
                                                triger={
                                                    <button className="cursor-pointer" onClick={() => handlePay(item)}>
                                                        {itemLoading?.[item?.id] ? (
                                                            <p className="size-4 rounded-full border border-gray-400 border-l-transparent animate-spin" />
                                                        ) : (
                                                            <CircleDollarSignIcon size={16} />
                                                        )}
                                                    </button>
                                                }
                                                text="پرداخت"
                                            />
                                        ) : (
                                            <p>---</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Pagination totalPage={accountingItems.pages} />
            <PayModal
                open={openPayModal}
                setOpen={setOpenPayModal}
                item={selectedItem}
                products={products}
                materials={materials}
                onOk={() => fetchAccountingItems(false)}
                onLoaded={() => setItemLoading((prev: any) => ({ ...prev, [selectedItem.id]: false }))}
            />
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
        "نام شخص",
        "پروژه",
        "وضعیت پرداخت",
        "شرکت",
        "مبلغ سند",
        "مبلغ مانده",
        "مجموع مانده ها",
        "عملیات",
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
