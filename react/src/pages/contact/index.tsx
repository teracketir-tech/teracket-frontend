import Pagination from "@/components/shared/Pagination";
import { api } from "@/lib/axios";
import { positionLabel } from "@/lib/positions";
import { checkAccess, cn, exportContacts } from "@/lib/utils";
import { FileSpreadsheet, PenBox, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Confirm from "@/components/ui/confirm";
import { toast } from "sonner";
import { Link, useSearchParams } from "react-router-dom";
import Empty from "@/components/shared/Empty";
import Loading from "@/components/shared/Loading";
import FilterForm from "@/components/pages/contact/Filter";
import Button from "@/components/shared/Button";

export default function ContactList() {
    const [searchParams] = useSearchParams();
    const [contacts, setContacts] = useState<any>({});
    const [loading, setLoading] = useState<any>(true);
    const [exportLoading, setExportLoading] = useState<any>(false);

    const fetchContacts = async (excel?: boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        const query = params.toString();

        if (excel) setExportLoading(true);
        else setLoading(true);

        const res = await api(`contact?${query ? `${query}&` : ""}${excel ? `excel=${excel}&` : ""}`);

        if (excel) {
            return res;

            //
        } else {
            setContacts(res);
            setLoading(false);
        }
    };

    const handleExport = async () => {
        const res = await fetchContacts(true);

        await exportContacts(res.data);

        setExportLoading(false);
    };

    const handleDelete = async (id: number) => {
        setLoading(true);

        const res = await api(`contact/${id}`, "DELETE");

        if (res?.success) {
            fetchContacts();
            toast.success("شخص با موفقیت حذف شد.");
        }
    };

    useEffect(() => {
        fetchContacts();
    }, [searchParams]);

    return (
        <div className="w-full">
            <FilterForm loading={loading} />

            {/* excel export */}
            <Button className="mb-4 w-48! flex items-center gap-1" isLoading={exportLoading} onClick={handleExport}>
                <FileSpreadsheet size={17} />
                <span>خروجی اکسل</span>
            </Button>

            <>
                <Title />

                {loading ? (
                    <div className="w-full flex items-center justify-center py-5">
                        <Loading />
                    </div>
                ) : contacts?.data?.length == 0 ? (
                    <Empty />
                ) : (
                    <div className="flex flex-col gap-1 border">
                        {contacts?.data?.map((contact: any, i: number) => (
                            <div key={contact.id} className="w-full grid grid-cols-9 justify-between gap-4 px-4 py-1 hover:bg-gray-50 border-b">
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{i + 1}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{contact.id}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{contact.fname}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{contact?.lname || ""}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    {/* issue 2.2: the position column, bound to contact.position_id */}
                                    <span className="text-xs text-center">{positionLabel(contact.position_id)}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{contact.mobile}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{contact?.company?.name || "---"}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">
                                        {contact?.creator ? `${contact?.creator?.first_name} ${contact?.creator?.last_name}` : "---"}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center justify-center py-4 gap-3">
                                    {checkAccess([403]) && (
                                        <Link to={`/contact/edit/${contact.id}`} className="cursor-pointer" role="link">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <PenBox className="w-3.5 h-3.5" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>ویرایش</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </Link>
                                    )}

                                    {checkAccess([404]) && (
                                        <Confirm title="حذف شخص" onConfirm={() => handleDelete(contact.id)}>
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

                <Pagination totalPage={contacts.pages} />
            </>
        </div>
    );
}

function Title() {
    // Column order — issue 2.1/2.2: "type" then "position", both after the last name
    const list = ["ردیف", "شناسه", "نام", "نام خانوادگی", "سمت", "موبایل", "شرکت", "کاربر ثبت کننده", "عملیات"];

    return (
        <div className="w-full justify-between gap-4 p-4 bg-secondary rounded-t-md grid grid-cols-9">
            {list.map((l: string, i: number) => (
                <div key={i} className={cn("flex items-center justify-center")}>
                    <span className="text-xs font-bold text-[#777777]">{l}</span>
                </div>
            ))}
        </div>
    );
}
