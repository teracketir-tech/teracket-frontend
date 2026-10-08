import Pagination from "@/components/shared/Pagination";
import { api } from "@/lib/axios";
import { checkAccess, cn } from "@/lib/utils";
import { PenBox, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Confirm from "@/components/ui/confirm";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import Empty from "@/components/shared/Empty";
import Loading from "@/components/shared/Loading";
import FilterForm from "@/components/pages/contact/Filter";

export default function ContactList() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [contacts, setContacts] = useState<any>({});
    const [loading, setLoading] = useState<any>(true);

    const fetchContacts = async () => {
        const params = new URLSearchParams(searchParams.toString());
        const query = params.toString();

        setLoading(true);

        const res = await api(`contact?${query ? `${query}&` : ""}expand=company`, "GET");

        setContacts(res);
        setLoading(false);
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
                            <div key={contact.id} className="w-full grid grid-cols-7 justify-between gap-4 px-4 py-1 hover:bg-gray-50 border-b">
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
                                    <span className="text-xs text-center">{contact.mobile}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{contact?.company?.name || "---"}</span>
                                </div>
                                <div className="flex flex-wrap items-center justify-center py-4 gap-3">
                                    {checkAccess([403]) && (
                                        <button className="cursor-pointer" onClick={() => navigate(`/contact/edit/${contact.id}`)}>
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
    const list = ["ردیف", "شناسه", "نام", "نام خانوادگی", "موبایل", "شرکت", "عملیات"];

    return (
        <div className="w-full justify-between gap-4 p-4 bg-secondary rounded-t-md grid grid-cols-7">
            {list.map((l: string, i: number) => (
                <div key={i} className={cn("flex items-center justify-center")}>
                    <span className="text-xs font-bold text-[#777777]">{l}</span>
                </div>
            ))}
        </div>
    );
}
