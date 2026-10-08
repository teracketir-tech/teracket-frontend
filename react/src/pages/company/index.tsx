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
import FilterForm from "@/components/pages/company/Filter";

export default function CompanyList() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [companies, setCompanies] = useState<any>({});
    const [loading, setLoading] = useState<any>(true);

    const fetchCompanies = async () => {
        const params = new URLSearchParams(searchParams.toString());
        const query = params.toString();

        setLoading(true);

        const res = await api(`company?${query ? `${query}` : ""}`, "GET");

        setCompanies(res);
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        setLoading(true);

        const res = await api(`company/${id}`, "DELETE");

        if (res?.success) {
            fetchCompanies();
            toast.success("شرکت با موفقیت حذف شد.");
        }
    };

    useEffect(() => {
        fetchCompanies();
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
                ) : companies?.data?.length == 0 ? (
                    <Empty />
                ) : (
                    <div className="flex flex-col gap-1 border">
                        {companies?.data?.map((company: any, i: number) => (
                            <div key={company.id} className="w-full grid grid-cols-4 justify-between gap-4 px-4 py-1 hover:bg-gray-50 border-b">
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{i + 1}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{company.id}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{company.name}</span>
                                </div>
                                <div className="flex flex-wrap items-center justify-center py-4 gap-3">
                                    {checkAccess([103]) && (
                                        <button className="cursor-pointer" onClick={() => navigate(`/company/edit/${company.id}`)}>
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

                                    {checkAccess([104]) && (
                                        <Confirm title="حذف شرکت" onConfirm={() => handleDelete(company.id)}>
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

                <Pagination totalPage={companies.pages} />
            </>
        </div>
    );
}

function Title() {
    const list = ["ردیف", "شناسه", "نام", "عملیات"];

    return (
        <div className="w-full justify-between gap-4 p-4 bg-secondary rounded-t-md grid grid-cols-4">
            {list.map((l: string, i: number) => (
                <div key={i} className={cn("flex items-center justify-center")}>
                    <span className="text-xs font-bold text-[#777777]">{l}</span>
                </div>
            ))}
        </div>
    );
}
