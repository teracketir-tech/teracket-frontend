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

export default function PayModal({
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
        },
        onSubmit,
        validationSchema,
        validateOnChange: true,
        enableReinitialize: true,
        validateOnMount: true,
    });

    function onSubmit(data: any) {
        if (Number(data.price) > Number(item?.remaining_credit)) {
            toast.error("مبلغ وارد شده بیشتر از مبلغ مانده است");
            return;
        }

        setLoading(true);

        api("accounting-item/pay", "POST", { ...data, id: item.id })
            .then((res) => {
                if (res?.success) {
                    toast.success("پرداخت با موفقیت ثبت شد.");
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
        const res = await api(`accounting/get-related-banks?company_id=${item?.company_id}&project_id=${item?.accounting?.project_id}`);

        if (res?.data?.length > 0) {
            setRelatedBanks(
                res?.data?.map((b: any) => ({
                    label: `${b.id}- ${b?.name || b?.bankName?.name || ""} (${formatNumber(b.balance, true)})`,
                    value: b.id.toString(),
                })) || [],
            );
        } else {
            toast.error("هیچ بانکی برای این پروژه موجودی ندارد");
            setOpen(false);
        }

        setBankLoading(false);
        onLoaded();
    };

    useEffect(() => {
        if (open) {
            fetchRelatedBanks();
            formik.setFieldValue("price", item.remaining_credit);
        } else {
            formik.resetForm();
            setRelatedBanks([]);
        }
    }, [open]);

    return (
        <Modal open={open && relatedBanks?.length > 0} setOpen={setOpen} title={`پرداخت آیتم : ${item.id}`}>
            <form className="flex flex-col gap-2" onSubmit={() => formik.submitForm()}>
                <Input type="number" name="price" title="مبلغ (ریال)" formik={formik} />
                <Select name="bank_id" title="بانک" formik={formik} options={relatedBanks} isLoading={bankLoading} />

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
