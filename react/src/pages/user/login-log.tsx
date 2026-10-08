import Pagination from "@/components/shared/Pagination";
import { api } from "@/lib/axios";
import { checkAccess, cn, formatDateToFa } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import Confirm from "@/components/ui/confirm";
import { toast } from "sonner";
import { useParams, useSearchParams } from "react-router-dom";
import Empty from "@/components/shared/Empty";
import Loading from "@/components/shared/Loading";
import ToolTip from "@/components/shared/ToolTip";
import FilterForm from "@/components/pages/user/login-log/Filter";

export default function UserLoginLogList() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const [logs, setLogs] = useState<any>({});
    const [loading, setLoading] = useState<any>(true);

    const fetchLogs = async () => {
        const params = new URLSearchParams(searchParams.toString());
        const query = params.toString();

        setLoading(true);

        const res = await api(`user-login-log/user/${id}${query ? `?${query}` : ""}`, "GET");

        setLogs(res);
        setLoading(false);
    };

    const handleLogout = async (id: number) => {
        setLoading(true);

        const res = await api(`user-login-log/logout/${id}`, "POST");

        if (res?.success) {
            fetchLogs();
            toast.success(res.message);

            //
        } else {
            toast.error(res?.message || "خطایی رخ داده است");
        }
    };

    useEffect(() => {
        fetchLogs();
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
                ) : logs?.data?.length == 0 ? (
                    <Empty />
                ) : (
                    <div className="flex flex-col gap-1 border">
                        {logs?.data?.map((log: any, i: number) => (
                            <div key={log.id} className="w-full grid grid-cols-7 justify-between gap-4 px-4 py-1 hover:bg-gray-50 border-b">
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{i + 1}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">
                                        {logs?.user?.first_name} {logs?.user?.last_name}
                                    </span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{log.os}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{log?.ip}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{formatDateToFa(log?.created_at, true)}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    {log?.active == 1 ? (
                                        <ToolTip triger={<p className="size-2 rounded-full bg-green-500"></p>} text="آنلاین" />
                                    ) : (
                                        <ToolTip triger={<p className="size-2 rounded-full bg-red-500"></p>} text="آفلاین" />
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center justify-center py-4 gap-3">
                                    {checkAccess([704]) && log?.active == 1 ? (
                                        <Confirm title="خروج" onConfirm={() => handleLogout(log.id)}>
                                            <button className="cursor-pointer">
                                                <ToolTip triger={<LogOut className="size-3.5 text-red-500" />} text="خروج" />
                                            </button>
                                        </Confirm>
                                    ) : (
                                        <p>---</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Pagination totalPage={logs.pages} />
            </>
        </div>
    );
}

function Title() {
    const list = ["ردیف", "کاربر", "دستگاه", "آی پی", "زمان", "وضعیت", "عملیات"];

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
