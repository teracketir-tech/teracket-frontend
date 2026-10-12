import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import Select from "./inputs/Select";

export default function UserSelect({ name = "user_id", title = "کاربر", formik }: { name?: any; title?: any; formik?: any }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);

        /** ایشوی ۱۸ (مورد ۷): `user` پشتِ نقش 1102 است و 401 آن نشست را به ورود می‌برد */
        const res = await api(`user/options${formik.values?.company_id ? `?company_id=${formik.values?.company_id}` : ""}`);

        if (res?.data) setUsers(res?.data?.map((d: any) => ({ label: `${d.first_name} ${d.last_name}`, value: d.id.toString() })));

        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, [formik?.values?.company_id]);

    return <Select name={name} title={title} formik={formik} required={false} options={users} isLoading={loading} />;
}
