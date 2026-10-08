import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import Select from "./inputs/Select";
import { pathName } from "@/lib/utils";

export default function CompanySelect({
    name = "company_id",
    title = "شرکت",
    formik,
    required = false,
}: {
    name?: any;
    title?: any;
    formik?: any;
    required?: boolean;
}) {
    const [companies, setCompanies] = useState([]);

    const isCreateAccounting = pathName() === "/accounting/create";

    const fetchContacts = async () => {
        const res = await api("company?per-page=1000");

        if (res?.data)
            setCompanies(res?.data?.filter((c: any) => !isCreateAccounting || c.id != 1)?.map((d: any) => ({ label: d.name, value: d.id.toString() })));
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    return <Select name={name} title={title} formik={formik} required={required} options={companies} />;
}
