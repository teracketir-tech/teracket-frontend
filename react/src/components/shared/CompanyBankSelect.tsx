import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import Select from "./inputs/Select";

export default function BankSelect({ formik, required = false }: { formik?: any; required?: boolean }) {
    const [banks, setBanks] = useState([]);

    const fetchBanks = async () => {
        const res = await api(`bank?per-page=1000`);

        if (res?.data) setBanks(res?.data?.map((d: any) => ({ label: d?.name || d?.bankName?.name, value: d.id.toString(), company_id: d.company_id })));
    };

    useEffect(() => {
        fetchBanks();
    }, []);

    const filteredData = banks?.filter((b: any) => !formik?.values?.company_id || !b.company_id || formik?.values?.company_id == b.company_id);

    return <Select title="بانک" name="bank_id" formik={formik} required={required} options={filteredData} />;
}
