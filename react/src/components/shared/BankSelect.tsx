import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import Select from "./inputs/Select";

export default function BankSelect({ formik, required = false, name = "bank_id" }: { formik?: any; required?: boolean; name?: string }) {
    const [banks, setBanks] = useState([]);

    const fetchBanks = async () => {
        const res = await api(`bank-name?per-page=1000`);

        if (res?.data) setBanks(res?.data?.map((d: any) => ({ label: d.name, value: d.id.toString() })));
    };

    useEffect(() => {
        fetchBanks();
    }, []);

    return <Select title="بانک" name={name} formik={formik} required={required} options={banks} />;
}
