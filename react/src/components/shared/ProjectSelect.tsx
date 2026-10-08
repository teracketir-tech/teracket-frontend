import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import Select from "./inputs/Select";

export default function ProjectSelect({ name = "project_id", title = "پروژه", formik }: { name?: any; title?: any; formik?: any }) {
    const [projects, setProjects] = useState([]);

    const fetchProjects = async () => {
        const res = await api("project?per-page=1000");

        if (res?.data) setProjects(res?.data?.map((d: any) => ({ label: d.name, value: d.id.toString() })));
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return <Select name={name} title={title} formik={formik} required={false} options={projects} />;
}
