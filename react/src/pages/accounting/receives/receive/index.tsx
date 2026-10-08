import Modal from "@/components/shared/Modal";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { useFormik } from "formik";
import validationSchema from "./validationSchema";
import { toast } from "sonner";
import Input from "@/components/shared/inputs";
import Select from "@/components/shared/inputs/Select";
import Button from "@/components/shared/Button";
import { formatNumber } from "@/lib/utils";
import Checkbox from "@/components/shared/inputs/Checkbox";

export default function ReceiveModal({
    open,
    setOpen,
    item,
    onLoaded,
    onOk,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    item: any;
    onLoaded: () => void;
    onOk: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [relatedBanks, setRelatedBanks] = useState([]);
    const [bankLoading, setBankLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            price: "",
            bank_id: "",
            show_all: "",
        },
        onSubmit,
        validationSchema,
        validateOnChange: true,
        enableReinitialize: true,
        validateOnMount: true,
    });

    function onSubmit(data: any) {
        if (Number(data.price) > Number(item?.remaining_debit)) {
            toast.error("مبلغ وارد شده بیشتر از مبلغ مانده است");
            return;
        }

        setLoading(true);

        api("accounting-item/receive", "POST", { ...data, id: item.id })
            .then((res) => {
                if (res?.success) {
                    toast.success("دریافت با موفقیت ثبت شد.");
                    setOpen(false);
                    onOk();
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const fetchRelatedBanks = async () => {
        setBankLoading(true);

        const showAll = Number(formik.values.show_all);
        const projectId = showAll === 1 ? 0 : item?.accounting?.project_id;

        const res = await api(`accounting/get-related-banks?company_id=${item?.company_id}&project_id=${projectId}&show_all=${showAll}`);

        setRelatedBanks(
            res?.data?.map((b: any) => ({
                label: `${b.id}- ${b?.name || b?.bankName?.name || ""} (${formatNumber(b.balance, true)})`,
                value: b.id.toString(),
            })) || [],
        );

        setBankLoading(false);
        onLoaded();
    };

    useEffect(() => {
        if (open) {
            fetchRelatedBanks();
            formik.setFieldValue("price", item.remaining_debit);
        } else {
            formik.resetForm();
            setRelatedBanks([]);
        }
    }, [open]);

    useEffect(() => {
        if (open) fetchRelatedBanks();
    }, [formik.values.show_all]);

    return (
        <Modal open={open} setOpen={setOpen} title={`دریافت آیتم : ${item.id}`} className="">
            <form className="flex flex-col gap-2" onSubmit={() => formik.submitForm()}>
                <Input type="number" name="price" title="مبلغ (ریال)" formik={formik} />
                <Select name="bank_id" title="بانک" formik={formik} options={relatedBanks} isLoading={bankLoading} />
                <div className="mt-3">
                    <Checkbox name="show_all" title="نمایش تمام بانک ها" formik={formik} />
                </div>

                <div className="grid grid-cols-2 gap-5 mt-10">
                    <Button onClick={() => setOpen(false)} className="bg-transparent! border-2 border-primary text-primary!">
                        لغو
                    </Button>
                    <Button onClick={() => formik.submitForm()} isLoading={loading}>
                        ثبت
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
