import { useEffect, useState } from "react";
import Tree from "./inputs/Select/tree";
import { api } from "@/lib/axios";

export default function AccountingDataSelect({
    title = "حساب",
    name = "accounting_data_id",
    value,
    formik,
    onChange,
    required = false,
    isMulti,
    disableParent,
}: {
    title?: any;
    name?: any;
    value?: any;
    formik?: any;
    onChange?: any;
    required?: boolean;
    isMulti?: boolean;
    disableParent?: boolean;
}) {
    const [accountings, setAccountings] = useState<any>([]);

    const fetchAccountings = async () => {
        const res = await api("accounting-data", "GET");

        if (res?.data) setAccountings(res?.data);
    };

    useEffect(() => {
        fetchAccountings();
    }, []);

    const getSealChildren = (account: any) => {
        if (!account.is_parent) return [];

        return accountings
            ?.filter((acc: any) => acc.parent_id == account.id && (!formik?.values?.company_id || acc.company_id == formik.values.company_id))
            ?.map((a: any) => ({
                parent_id: a.parent_id,
                title: a.title,
                value: a.id,
                detail_name: a?.detail_name,
                disabled: disableParent && a.is_parent,
                children: getSealChildren(a),
            }));
    };

    const formatedAccounts = accountings
        ?.filter((acc: any) => !acc.parent_id)
        ?.map((a: any) => ({
            parent_id: a.parent_id,
            title: a.title,
            value: a.id,
            detail_name: a?.detail_name,
            disabled: disableParent && a.is_parent,
            children: getSealChildren(a),
        }));

    return (
        <Tree title={title} name={name} formik={formik} value={value} onChange={onChange} options={formatedAccounts} required={required} isMulti={isMulti} />
    );
}
