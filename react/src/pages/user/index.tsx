import Pagination from "@/components/shared/Pagination";
import { api } from "@/lib/axios";
import { checkAccess, cn, formatDateToFa } from "@/lib/utils";
import { Info, LogOut, MonitorSmartphone, PenBox, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Confirm from "@/components/ui/confirm";
import { toast } from "sonner";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Empty from "@/components/shared/Empty";
import Loading from "@/components/shared/Loading";
import FilterForm from "@/components/pages/user/index/Filter";
import ToolTip from "@/components/shared/ToolTip";
import Modal from "@/components/shared/Modal";
import Button from "@/components/shared/Button";

export default function UserList() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [users, setUsers] = useState<any>({});
    const [activeLog, setActiveLog] = useState({});
    const [loading, setLoading] = useState<any>(true);
    const [showActiveModal, setShowAvtiveModal] = useState(false);

    const fetchUsers = async (loading = true) => {
        const params = new URLSearchParams(searchParams.toString());
        const query = params.toString();

        if (loading) setLoading(true);

        const res = await api(`user?${query ? `${query}&` : ""}expand=company, group`, "GET");

        setUsers(res);
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        setLoading(true);

        const res = await api(`user/${id}`, "DELETE");

        if (res?.success) {
            fetchUsers();
            toast.success("کاربر با موفقیت حذف شد.");
        }
    };

    const handleLogoutAll = async () => {
        setLoading(true);

        const res = await api("login-log/logout-all", "POST");

        if (res?.success) {
            fetchUsers(false);
            toast.success(res.message);

            //
        } else {
            toast.error(res?.message || "خطایی رخ داده است");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [searchParams]);

    const isOnline = (logs: any) => logs?.sort((a: any, b: any) => b.id - a.id)?.some((l: any) => l.active == 1);

    const handleShowActiveLog = (user: any) => {
        const active = user?.logs.find((l: any) => l.active == 1);

        setActiveLog({ ...active, user: `${user.first_name} ${user.last_name}` });
        setShowAvtiveModal(true);
    };

    return (
        <div className="w-full">
            <FilterForm loading={loading} />

            <Confirm title="آفلاین کردن تمام دستگاه ها" onConfirm={handleLogoutAll}>
                <Button className="w-auto! mb-4">
                    <LogOut size={17} />
                    <span>آفلاین کردن تمام دستگاه ها</span>
                </Button>
            </Confirm>

            <>
                <Title />

                {loading ? (
                    <div className="w-full flex items-center justify-center py-5">
                        <Loading />
                    </div>
                ) : users?.data?.length == 0 ? (
                    <Empty />
                ) : (
                    <div className="flex flex-col gap-1 border">
                        {users?.data?.map((user: any, i: number) => (
                            <div key={user.id} className="w-full grid grid-cols-8 justify-between gap-4 px-4 py-1 hover:bg-gray-50 border-b">
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{i + 1}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{user.id}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{user.first_name}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{user.last_name}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{user?.company?.name || "---"}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{user?.group?.name || "---"}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    {isOnline(user?.logs) ? (
                                        <ToolTip triger={<p className="size-2 rounded-full bg-green-500"></p>} text="آنلاین" />
                                    ) : (
                                        <ToolTip triger={<p className="size-2 rounded-full bg-red-500"></p>} text="آفلاین" />
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center justify-center py-4 gap-3">
                                    {checkAccess([703]) && (
                                        <Link to={`/user/${user.id}/login-log`} role="link">
                                            <ToolTip triger={<Info className="size-3.5" />} text="لاگ ورود" />
                                        </Link>
                                    )}

                                    {checkAccess([703]) && isOnline(user?.logs) && (
                                        <button className="cursor-pointer" onClick={() => handleShowActiveLog(user)}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <MonitorSmartphone className="size-4" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>دستگاه فعال</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </button>
                                    )}

                                    {checkAccess([703]) && user.company_id != 1 && (
                                        <button className="cursor-pointer" onClick={() => navigate(`/user/edit/${user.id}`)}>
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

                                    {checkAccess([704]) && (
                                        <Confirm title="حذف کاربر" onConfirm={() => handleDelete(user.id)}>
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

                <Pagination totalPage={users.pages} />
                <ActiveDevice open={showActiveModal} setOpen={setShowAvtiveModal} log={activeLog} fetchUsers={fetchUsers} />
            </>
        </div>
    );
}

function Title() {
    const list = ["ردیف", "شناسه", "نام", "نام خانوادگی", "شرکت", "گروه", "وضعیت", "عملیات"];

    return (
        <div className="w-full justify-between gap-4 p-4 bg-secondary rounded-t-md grid grid-cols-8">
            {list.map((l: string, i: number) => (
                <div key={i} className={cn("flex items-center justify-center")}>
                    <span className="text-xs font-bold text-[#777777]">{l}</span>
                </div>
            ))}
        </div>
    );
}

function ActiveDevice({ open, setOpen, log, fetchUsers }: { open: boolean; setOpen: any; log: any; fetchUsers: any }) {
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);

        const res = await api(`login-log/logout/${log.id}`, "POST");

        if (res?.success) {
            toast.success(res.message);
            fetchUsers(false);
            setOpen(false);

            //
        } else {
            toast.error(res?.message || "خطایی رخ داده است");
        }

        setLoading(false);
    };

    return (
        <Modal open={open} setOpen={setOpen} title={`دستگاه فعال : ${log?.user}`} className="w-full">
            <div className="w-full flex flex-col text-[0.8rem]! border rounded-t-md">
                <div className="w-full justify-between gap-4 p-4 bg-secondary rounded-t-md grid grid-cols-4">
                    <p className="text-center text-[#777777]">دستگاه</p>
                    <p className="text-center text-[#777777]">آی پی</p>
                    <p className="text-center text-[#777777]">زمان</p>
                    <p className="text-center text-[#777777]">عملیات</p>
                </div>

                <div className="grid grid-cols-4 items-center p-3">
                    <p className="text-center">{log?.os}</p>
                    <p className="text-center">{log?.ip}</p>
                    <p className="text-center">{formatDateToFa(log?.created_at, true)}</p>
                    <p className="text-center">
                        <ToolTip
                            triger={
                                <button className="cursor-pointer" onClick={handleLogout}>
                                    {loading ? (
                                        <p className="size-4 rounded-full border border-red-500 border-l-transparent animate-spin" />
                                    ) : (
                                        <LogOut className="size-3.5 text-red-500" />
                                    )}
                                </button>
                            }
                            text="خروج"
                        />
                    </p>
                </div>
            </div>
        </Modal>
    );
}
