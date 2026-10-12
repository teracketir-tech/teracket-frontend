import { api } from "@/lib/axios";
import { useEffect, useState } from "react";

/**
 * تسک‌های یک پروژه بدون صفحه‌بندی — برای انتخاب‌گرهای فیلتر و فرم‌ها.
 * با خالی شدن پروژه، لیست هم خالی می‌شود.
 */
export function useProjectTasks(projectId?: string | null) {
    const [tasks, setTasks] = useState<any[]>([]);

    useEffect(() => {
        let alive = true;

        if (!projectId) {
            setTasks([]);
            return;
        }

        api(`project/${projectId}/tasks`)
            .then((res: any) => alive && setTasks(res?.data ?? []))
            .catch(() => alive && setTasks([]));

        return () => {
            alive = false;
        };
    }, [projectId]);

    return tasks;
}
