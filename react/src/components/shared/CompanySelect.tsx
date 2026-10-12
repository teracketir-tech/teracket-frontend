import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import Select from "./inputs/Select";
import { useAuth } from "@/context/AuthContext";

export default function CompanySelect({
    name = "company_id",
    title = "شرکت",
    formik,
    required = false,
    disabled = false,
    onChange,
}: {
    name?: any;
    title?: any;
    formik?: any;
    required?: boolean;
    disabled?: boolean;
    /** عوض‌شدنِ شرکت — برای پاک‌کردنِ انتخاب‌هایِ وابسته به شرکت (ایشوی ۱) */
    onChange?: (value: string) => void;
}) {
    const { auth } = useAuth();
    const [companies, setCompanies] = useState([]);

    const fetchCompanies = async () => {
        const res = await api("company?per-page=1000");

        if (res?.data) setCompanies(res?.data?.map((d: any) => ({ label: d.name, value: d.id.toString() })));
    };

    useEffect(() => {
        if (!auth?.company_id) fetchCompanies();
    }, []);

    if (auth?.company_id) return null;

    return <Select name={name} title={title} formik={formik} required={required} disabled={disabled} options={companies} onChange={onChange} />;
}
