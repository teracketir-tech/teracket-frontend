import Pagination from "@/components/shared/Pagination";
import { api } from "@/lib/axios";
import { checkAccess, cn, formatNumber } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Empty from "@/components/shared/Empty";
import Loading from "@/components/shared/Loading";
import FilterForm from "@/components/pages/exchange-data/Filter";
import Button from "@/components/shared/Button";
import { DownloadCloudIcon, FileSpreadsheet } from "lucide-react";
import Modal from "@/components/shared/Modal";
import Input from "@/components/shared/inputs";
import { useFormik } from "formik";
import { toast } from "sonner";

export default function ExchangeData() {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState<any>(true);
    const [showImportModal, setShowImportModal] = useState(false);

    const fetchData = async () => {
        const params = new URLSearchParams(searchParams.toString());
        const query = params.toString();

        setLoading(true);

        const res = await api(`exchange-data?${query ? `${query}` : ""}`);

        setData(res);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [searchParams]);

    return (
        <div className="w-full">
            <FilterForm loading={loading} />

            {checkAccess([1002]) && (
                <Button className="mb-4 w-56! flex items-center gap-1" onClick={() => setShowImportModal(true)}>
                    <FileSpreadsheet size={17} />
                    <span>بروزرسانی قیمت ها با اکسل</span>
                </Button>
            )}

            <>
                <Title />

                {loading ? (
                    <div className="w-full flex items-center justify-center py-5">
                        <Loading />
                    </div>
                ) : data?.data?.length == 0 ? (
                    <Empty />
                ) : (
                    <div className="flex flex-col gap-1 border">
                        {data?.data?.map((item: any, i: number) => (
                            <div key={item.id} className="w-full grid grid-cols-5 justify-between gap-4 px-4 py-1 hover:bg-gray-50 border-b">
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{i + 1}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{formatNumber(item.usd)}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{formatNumber(item.gold)}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{formatNumber(item.aed)}</span>
                                </div>
                                <div className="flex items-center justify-center py-4">
                                    <span className="text-xs text-center">{item?.fa_date?.replaceAll("-", "/")}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Pagination totalPage={data.pages} />

                <ImportModal open={showImportModal} setOpen={setShowImportModal} onOk={fetchData} />
            </>
        </div>
    );
}

function Title() {
    const list = ["ردیف", "دلار", "طلا", "درهم", "تاریخ"];

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

function ImportModal({ open, setOpen, onOk }: { open: boolean; setOpen: (open: boolean) => void; onOk: () => void }) {
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            file: "",
        },
        onSubmit,
        validationSchema: false,
    });

    async function onSubmit(data: object) {
        setLoading(true);

        const res = await api("exchange-data/import-by-excel", "POST", data, false, "json", "multipart/form-data");

        if (res?.success) {
            onOk();
            toast.success("با موفقیت انجام شد.");
            setOpen(false);

            //
        } else toast.error(res?.message || "خطایی رخ داده است");

        setLoading(false);
    }

    return (
        <Modal open={open} setOpen={setOpen} title="بروزرسانی قیمت ها با اکسل" className="max-w-xl! max-h-[85vh]! overflow-y-auto">
            <form className="flex flex-col gap-10">
                <div className="flex flex-col gap-5">
                    <Link
                        to="/ExchangeDataSample.xlsx"
                        target="_blank"
                        role="link"
                        className="w-32! bg-amber-100 flex items-center py-1 pr-1 rounded gap-2 text-[0.8rem]"
                    >
                        <DownloadCloudIcon size={16} />
                        <span>دانلود نمونه فایل</span>
                    </Link>
                    <Input type="file" name="file" title="آپلود فایل اکسل" formik={formik} />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <Button className="bg-transparent! text-[#222529]! border-2 border-[#222529]!" onClick={() => setOpen(false)}>
                        لغو
                    </Button>
                    <Button onClick={formik.handleSubmit} isLoading={loading} disabled={!formik.values.file}>
                        ثبت
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
