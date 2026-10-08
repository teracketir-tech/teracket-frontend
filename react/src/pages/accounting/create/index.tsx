import Button from "@/components/shared/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormik } from "formik";
import validationSchema from "./validationSchema";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Select from "@/components/shared/inputs/Select";
import DateInput from "@/components/shared/inputs/Date";
import Textarea from "@/components/shared/inputs/Textarea";
import uuid from "uuid-random";
import CompanySelect from "@/components/shared/CompanySelect";
import RowControll from "@/components/pages/accounting/create/RowControll";
import ItemTable from "@/components/pages/accounting/create/ItemTable";

export default function CreateAccounting() {
    const navigate = useNavigate();
    const [banks, setBanks] = useState([]);
    const [items, setItems] = useState<any>([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [contacts, setContacts] = useState([]);

    const addRows = (rows = 5) => {
        const array = [];

        for (let i = 0; i < rows; i++) {
            array.push({ id: uuid(), accounting_data_id: "", detail_id: "", description: "", debit: "", credit: "", details: [] });
        }

        return array;
    };

    const formik = useFormik({
        initialValues: {
            company_id: "",
            date: "",
            project_id: "",
            status: "1",
            description: "",
        },
        onSubmit,
        validationSchema,
        validateOnChange: true,
        enableReinitialize: true,
        validateOnMount: true,
    });

    const fetchProjects = async () => {
        const res = await api(`project?per-page=1000`);

        if (res?.data) setProjects(res?.data?.map((d: any) => ({ label: d.name, value: d.id.toString() })));
    };

    const fetchContacts = async () => {
        const res = await api(`contact?per-page=1000`);

        if (res?.data) setContacts(res?.data?.map((d: any) => ({ label: d.alias, value: d.id.toString() })));
    };

    const fetchBanks = async () => {
        const res = await api(`bank?per-page=1000`);

        if (res?.data) setBanks(res?.data?.map((d: any) => ({ label: d?.name || d?.bankName?.name, value: d.id.toString() })));
    };

    useEffect(() => {
        fetchProjects();
        fetchContacts();
        setItems(addRows());
        fetchBanks();
    }, []);

    function onSubmit(data: object) {
        setLoading(true);

        api("accounting", "POST", { ...data, items: filledItems })
            .then((res) => {
                if (res?.success) {
                    toast.success("سند با موفقیت ثبت شد.");
                    navigate("/accounting");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const inBalance = () => {
        const totalDebit = items?.reduce((acc: number, item: any) => acc + Number(item?.debit || 0), 0);
        const totalCredit = items?.reduce((acc: number, item: any) => acc + Number(item?.credit || 0), 0);

        return Math.abs(totalDebit - totalCredit);
    };

    const filledItems = items.filter((it: any) => it?.accounting_data_id || it?.debit || it?.credit);

    const itemsIsValid = () => {
        if (!filledItems?.length) return false;

        return filledItems.every((item: any) => item.accounting_data_id && (!item?.details?.length || item.detail_id) && (item.debit || item.credit));
    };

    const isValid = inBalance() == 0 && itemsIsValid();

    return (
        <Card className="w-full">
            <CardHeader className="mb-5">
                <CardTitle>ثبت سند جدید</CardTitle>
                <CardDescription>تکمیل فیلدهایی که با * مشخص شده اند الزامی می باشد</CardDescription>
            </CardHeader>

            <CardContent>
                <form className="w-full grid grid-cols-3 gap-5 mb-5">
                    <CompanySelect formik={formik} />
                    <DateInput name="date" title="تاریخ" formik={formik} onChange={(date: any) => formik.setFieldValue("date", date)} />
                    <Select name="project_id" title="پروژه" formik={formik} required={false} options={projects} />
                    <Select
                        name="status"
                        title="وضعیت"
                        formik={formik}
                        options={[
                            { label: "پیش نویس", value: "1" },
                            { label: "تایید شده", value: "2" },
                        ]}
                    />
                    <div className="col-span-3">
                        <Textarea name="description" title="شرح" formik={formik} />
                    </div>

                    <div className="flex flex-col gap-5 col-span-3">
                        <RowControll inBalance={inBalance} addRows={addRows} items={items} setItems={setItems} />
                        <ItemTable contacts={contacts} banks={banks} items={items} setItems={setItems} formik={formik} />
                    </div>
                </form>
            </CardContent>

            <CardFooter>
                <Button onClick={formik.handleSubmit} className="mt-5" isLoading={loading} disabled={!formik.isValid || !isValid}>
                    ثبت
                </Button>
            </CardFooter>
        </Card>
    );
}
