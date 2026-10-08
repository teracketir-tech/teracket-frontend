import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import Select from "./inputs/Select";

export default function ContactSelect({ name = "contact_id", title = "شخص", formik }: { name?: any; title?: any; formik?: any }) {
    const [contacts, setContacts] = useState([]);

    const fetchContacts = async () => {
        const res = await api("contact?per-page=1000");

        if (res?.data) setContacts(res?.data?.map((d: any) => ({ label: d.alias, value: d.id.toString() })));
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    return <Select name={name} title={title} formik={formik} required={false} options={contacts} />;
}
