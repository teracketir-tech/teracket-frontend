import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import Select from "./inputs/Select";

export default function UserSelect({ name = "user_id", title = "کاربر", formik }: { name?: any; title?: any; formik?: any }) {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        const res = await api("user?per-page=1000");

        if (res?.data) setUsers(res?.data?.map((d: any) => ({ label: `${d.first_name} ${d.last_name}`, value: d.id.toString() })));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return <Select name={name} title={title} formik={formik} required={false} options={users} />;
}
