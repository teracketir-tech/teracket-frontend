import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import Select from "./inputs/Select";

export default function ProjectSelect({
    name = "project_id",
    title = "پروژه",
    formik,
    isMulti = false,
    required = false,
    disabled = false,
}: {
    name?: any;
    title?: any;
    formik?: any;
    isMulti?: boolean;
    required?: boolean;
    /** برای حالتِ فقط‌خواندنی (گزارش ثبت نهایی شده) */
    disabled?: boolean;
}) {
    const [projects, setProjects] = useState([]);

    const fetchProjects = async () => {
        const res = await api("project?per-page=1000");

        if (res?.data) setProjects(res?.data?.map((d: any) => ({ label: d.name, value: d.id.toString(), company_id: d.company_id })));
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // شرکت، دامنه‌ی دسترسی است: وقتی شرکتی انتخاب شده فقط پروژه‌های همان شرکت
    // دیده می‌شوند؛ پروژه‌های بدونِ شرکت هم عمداً استثنا نمی‌شوند.
    const filteredData = projects?.filter((p: any) => !formik?.values?.company_id || formik?.values?.company_id == p.company_id);

    return <Select name={name} title={title} formik={formik} isMulti={isMulti} required={required} disabled={disabled} options={filteredData} />;
}
