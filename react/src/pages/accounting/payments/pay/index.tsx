import Modal from "@/components/shared/Modal";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { useFormik } from "formik";
import validationSchema from "./validationSchema";
import { toast } from "sonner";
import Input from "@/components/shared/inputs";
import Select from "@/components/shared/inputs/Select";
import Button from "@/components/shared/Button";
import { AccountingDataIds, formatNumber } from "@/lib/utils";
import DateInput from "@/components/shared/inputs/Date";
import AccountingDataSelect from "@/components/shared/AccountingDataSelect";
import ContactSelect from "@/components/shared/ContactSelect";

export default function PayModal({
    open,
    setOpen,
    item,
    products,
    materials,
    onLoaded,
    onOk,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    item: any;
    products: any;
    materials: any;
    onLoaded: () => void;
    onOk: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [detailName, setDetailName] = useState("");
    const [relatedBanks, setRelatedBanks] = useState([]);
    const [bankLoading, setBankLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            company_id: item?.company_id || "",
            price: "",
            date: "",
            accounting_data_id: "",
            detail_id: "",
            pay_accounting_item_id: "",
        },
        onSubmit,
        validationSchema,
        validateOnChange: true,
        enableReinitialize: true,
        validateOnMount: true,
    });

    function onSubmit(data: any) {
        if (!formik.values.accounting_data_id) {
            toast.error("لطفا حساب را انتخاب کنید");
            return;
        }

        if (["bank_id", "contact_id", "product_id", "material_id"].includes(detailName) && !formik.values.detail_id) {
            toast.error("لطفا تفصیل را انتخاب کنید");
            return;
        }

        if (Number(data.price) > Number(item?.remaining_credit)) {
            toast.error("مبلغ وارد شده بیشتر از مبلغ مانده است");
            return;
        }

        setLoading(true);

        api("accounting-item/pay", "POST", { ...data, id: item.id, detail_name: detailName })
            .then((res) => {
                if (res?.success) {
                    toast.success("پرداخت با موفقیت ثبت شد.");
                    setOpen(false);
                    onOk();

                    //
                } else {
                    toast.error(res?.message || "خطایی رخ داده است.");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const fetchRelatedBanks = async () => {
        setBankLoading(true);
        const res = await api(`accounting/get-related-banks?company_id=${item?.company_id}&project_id=${item?.accounting?.project_id}`);

        let related = [] as any;

        if (res?.data?.length > 0) {
            related =
                res?.data
                    ?.filter((ba: any) => Math.abs(ba?.balance) >= Number(item?.remaining_credit))
                    ?.map((b: any) => ({
                        label: `${b.id}- ${b?.name || b?.bankName?.name || ""} (${formatNumber(b.balance, true)})`,
                        value: b.id.toString(),
                    })) || [];

            setRelatedBanks(related);
        }

        // if (!related?.length) {
        //     toast.error("هیچ بانکی برای این پروژه موجودی ندارد");
        //     setOpen(false);
        // }

        setBankLoading(false);
        onLoaded();
    };

    useEffect(() => {
        if (open) {
            fetchRelatedBanks();
            formik.setFieldValue("price", item.remaining_credit);
        } else {
            setDetailName("");
            formik.resetForm();
            setRelatedBanks([]);
        }
    }, [open]);

    return (
        <Modal open={open} setOpen={setOpen} title={`پرداخت آیتم : ${item.id}`}>
            <form className="flex flex-col gap-2.5" onSubmit={() => formik.submitForm()}>
                <AccountingDataSelect formik={formik} disableParent={true} required onChange={(_: any, acc: any) => setDetailName(acc?.detail_name)} />

                {detailName === "bank_id" ? (
                    <Select name="detail_id" title="تفصیل" formik={formik} options={relatedBanks} isLoading={bankLoading} />
                ) : detailName === "contact_id" ? (
                    <ContactSelect name="detail_id" title="تفصیل" formik={formik} required />
                ) : detailName === "product_id" ? (
                    <Select
                        name="detail_id"
                        title="تفصیل"
                        formik={formik}
                        options={products?.filter((p: any) => !item?.company_id || item.company_id == p.company_id)}
                    />
                ) : detailName === "material_id" ? (
                    <Select
                        name="detail_id"
                        title="تفصیل"
                        formik={formik}
                        options={materials?.filter((m: any) => !item?.company_id || item.company_id == m.company_id)}
                    />
                ) : (
                    ""
                )}

                {[AccountingDataIds.PAYABLE, AccountingDataIds.RECEIVABLE].includes(Number(formik.values.accounting_data_id)) && (
                    <Input name="pay_accounting_item_id" title="شناسه آیتم (پرداختنی / دریافتنی) اصلی" formik={formik} required={false} />
                )}

                <Input type="number" name="price" title="مبلغ (ریال)" formik={formik} />
                <DateInput name="date" title="تاریخ" formik={formik} />

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
