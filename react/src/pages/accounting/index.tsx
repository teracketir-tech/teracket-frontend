import Pagination from "@/components/shared/Pagination";
import { api } from "@/lib/axios";
import { checkAccess, cn, exportAccounting, formatDateToFa, formatNumber, truncateByWord } from "@/lib/utils";
import { CheckCircle, DownloadCloudIcon, Eye, FileDownIcon, FileSpreadsheet, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Confirm from "@/components/ui/confirm";
import { toast } from "sonner";
import Empty from "@/components/shared/Empty";
import Loading from "@/components/shared/Loading";
import { Link, useSearchParams } from "react-router-dom";
import FilterForm from "@/components/pages/accounting/index/Filter";
import Button from "@/components/shared/Button";
import Modal from "@/components/shared/Modal";
import ToolTip from "@/components/shared/ToolTip";

export default function AccountingList() {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState<any>(true);
    const [accounting, setAccounting] = useState<any>({});
    const [selectedItem, setSelectedItem] = useState<any>({});
    const [openImagesModal, setOpenImagesModal] = useState(false);
    const [exportLoading, setExportLoading] = useState<any>(false);

    const fetchAccounting = async (excel?: boolean, loading = true) => {
        const params = new URLSearchParams(searchParams.toString());
        const query = params.toString();

        if (excel) setExportLoading(true);
        else if (loading) setLoading(true);

        const res = await api(`accounting?${query ? `${query}&` : ""}${excel ? `excel=${excel}` : ""}`);

        if (excel) {
            return res;

            //
        } else {
            setAccounting(res);
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        setLoading(true);

        const res = await api(`accounting/${id}`, "DELETE");

        if (res?.success) {
            fetchAccounting();
            toast.success("سند با موفقیت حذف شد.");
        }
    };

    const handleApprove = async (id: number) => {
        setLoading(true);

        const res = await api(`accounting/${id}/approve`, "POST");

        if (res?.success) {
            fetchAccounting();
            toast.success("سند با موفقیت تایید شد.");
        }
    };

    const collectParents = (id: number, byId: Record<number, any>): string[] => {
        const node = byId[id];

        if (!node || node.parent_id == null) return [];

        return [byId[node.parent_id].title, ...collectParents(node.parent_id, byId)];
    };

    const handleExport = async () => {
        const res = await fetchAccounting(true);

        const byId = Object.fromEntries(res.accounting_data_list.map((ad: any) => [ad.id, ad]));

        const data = res.data.map((ac: any) => ({
            ...ac,
            items: ac.items.map((ai: any) => ({ ...ai, parents: collectParents(ai.accounting_data_id, byId) })),
        }));

        await exportAccounting(data);

        setExportLoading(false);
    };

    const handleShowImages = (item: any) => {
        const images = !item?.image ? [] : item?.image?.includes("[") ? JSON.parse(item?.image || "[]") : [item?.image];

        setSelectedItem({ ...item, images });
        setOpenImagesModal(true);
    };

    useEffect(() => {
        fetchAccounting();
    }, [searchParams]);

    const getDetail = (item: any) => {
        const accountingData = item?.accountingData?.title || "";
        let detail = null;

        if (item?.contact_id) {
            detail = item?.contact?.alias;
        }

        if (item?.bank_id) {
            detail = item?.bank?.name || item?.bank?.bankName?.name;
        }

        return `${accountingData}${detail ? ` - ${detail}` : ""}`;
    };

    return (
        <div className="w-full">
            <FilterForm loading={loading} />

            <div className="flex items-center gap-5">
                {/* excel export */}
                <Button className="mb-4 w-48! flex items-center gap-1" isLoading={exportLoading} onClick={handleExport}>
                    <FileSpreadsheet size={17} />
                    <span>خروجی اکسل</span>
                </Button>
            </div>

            <>
                <Title />

                {loading ? (
                    <div className="w-full flex items-center justify-center py-5">
                        <Loading />
                    </div>
                ) : accounting?.data?.length == 0 ? (
                    <Empty />
                ) : (
                    <div className="flex flex-col gap-1 border">
                        {accounting?.data?.map((acc: any, i: number) => (
                            <div key={acc.id} className="w-full grid grid-cols-17 justify-between gap-4 px-4 py-1 hover:bg-gray-50 border-b">
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{i + 1}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{acc.id}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">
                                        {acc?.flag == 1 ? <p className="size-2 rounded-full bg-red-500"></p> : <>---</>}
                                    </span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{formatDateToFa(acc.created_at)}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{formatDateToFa(acc.date)}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{acc?.approve_date ? formatDateToFa(acc.approve_date) : "---"}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span>{truncateByWord(acc.description)}</span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{acc.description}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{formatNumber(acc.total_debit, true)}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{formatNumber(acc.total_credit, true)}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{acc.status == 1 ? "پیش‌نویس" : "تایید شده"}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center py-4 text-xs">
                                    <p className="w-full text-center pb-1 mb-1 border-b">{getDetail(acc?.items?.[0])}</p>
                                    <p className="w-full text-center">{getDetail(acc?.items?.[1])}</p>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{acc?.project?.name || "---"}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{acc?.company?.name || "---"}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{acc?.user ? `${acc?.user?.first_name} ${acc?.user?.last_name}` : "---"}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{acc?.user_os || "---"}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{acc?.user_ip || "---"}</span>
                                </div>
                                <div className="flex flex-wrap items-center justify-center py-4 gap-3">
                                    {checkAccess([603]) && acc?.status == 1 && (
                                        <Confirm title="تایید سند" onConfirm={() => handleApprove(acc.id)}>
                                            <button className="cursor-pointer">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <CheckCircle className="size-4" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>تایید</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </button>
                                        </Confirm>
                                    )}

                                    {checkAccess([603]) && (
                                        <Link to={`items?accounting_id=${acc.id}`} className="cursor-pointer" role="link">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Eye className="size-4" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>مشاهده چزییات</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </Link>
                                    )}

                                    {checkAccess([603]) && acc?.image && (
                                        <button className="cursor-pointer" onClick={() => handleShowImages(acc)}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <DownloadCloudIcon className="size-4" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>مشاهده فایل</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </button>
                                    )}

                                    {checkAccess([604]) && (
                                        <Confirm title="حذف سند" onConfirm={() => handleDelete(acc.id)}>
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
                        ))}
                    </div>
                )}

                {!loading && <Pagination totalPage={accounting.pages} />}
                <DownloadModal open={openImagesModal} setOpen={setOpenImagesModal} images={selectedItem.images} id={selectedItem.id} />
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
        "تاریخ تایید",
        "شرح",
        "مبلغ بدهکار",
        "مبلغ بستانکار",
        "وضعیت",
        "حساب / تفصیل",
        "پروژه",
        "شرکت",
        "نام ثبت کننده",
        "سیستم عامل",
        "آی پی",
        "عملیات",
    ];

    return (
        <div className="w-full justify-between gap-4 p-4 bg-secondary rounded-t-md grid grid-cols-17">
            {list.map((l: string, i: number) => (
                <div key={i} className={cn("flex items-center justify-center")}>
                    <span className="text-xs font-bold text-[#777777]">{l}</span>
                </div>
            ))}
        </div>
    );
}

function DownloadModal({ open, setOpen, images, id }: { open: boolean; setOpen: any; images: any; id: number }) {
    return (
        <Modal open={open} setOpen={setOpen} title={`فایل های سند : ${id}`}>
            <div className="grid grid-cols-3 gap-5">
                {images?.map((img: string, i: number) => (
                    <Link key={i} to={img} className="cursor-pointer" role="link" target="_blank">
                        <ToolTip
                            triger={
                                <div className="flex flex-col gap-2 border rounded-md p-2">
                                    <div className="flex items-center justify-center border-b border-gray-100 pb-2">
                                        <FileDownIcon size={40} className="text-gray-300" />
                                    </div>
                                    <div dir="ltr">{truncateByWord(img, 20)}</div>
                                </div>
                            }
                            text="برای مشاهده، کلیک کنید"
                        />
                    </Link>
                ))}
            </div>
        </Modal>
    );
}
