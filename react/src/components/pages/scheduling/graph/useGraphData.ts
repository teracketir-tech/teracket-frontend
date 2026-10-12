import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import type { RelationRow, TaskRow } from "./buildGraph";

export type GraphData = {
    projectId: string;
    tasks: TaskRow[];
    relations: RelationRow[];
    unit: string;
    projectName: string;
    focusTask: TaskRow | null;
    loading: boolean;
    /** non-empty when the graph data could not be loaded at all */
    error: string;
};

/** last settled request; `key` tells which request it belongs to */
type Settled = Omit<GraphData, "loading"> & { key: string };

const BLANK: Settled = { key: "", projectId: "", tasks: [], relations: [], unit: "day", projectName: "", focusTask: null, error: "" };

const NO_PROJECT: GraphData = { ...BLANK, loading: false, error: "برای نمایش گراف، ابتدا یک پروژه را انتخاب کنید" };

/**
 * Everything the dependency graph needs: all tasks of the project (with their
 * CPM critical flags) plus every relation of that project.
 *
 * Focus mode (`focusId` set) fetches the task first so the project is known
 * even when the URL carries no `project_id`.
 *
 * `loading` is derived from the settled request key instead of being written
 * inside the effect, so the effect only ever sets state after an `await`.
 */
export function useGraphData(focusId: string | null, projectId: string | null): GraphData {
    const key = `${focusId ?? ""}|${projectId ?? ""}`;
    const [settled, setSettled] = useState<Settled>(BLANK);

    useEffect(() => {
        if (!focusId && !projectId) return;

        let alive = true;

        (async () => {
            try {
                let pid = projectId ?? "";
                let focus: TaskRow | null = null;

                if (focusId) {
                    const res = await api(`task/${focusId}`);

                    if (!res?.success) {
                        if (alive) setSettled({ ...BLANK, key, error: res?.message || "تسک موردنظر یافت نشد" });
                        return;
                    }

                    focus = res.data;
                    pid = String(res.data?.project_id ?? "");
                }

                if (!pid) {
                    if (alive) setSettled({ ...BLANK, key, error: "پروژه‌ی این تسک یافت نشد" });
                    return;
                }

                const [taskRes, relationRes] = await Promise.all([
                    api(`task?project_id=${pid}&per-page=0`),
                    api(`task-relation?project_id=${pid}&per-page=0&expand=project,predecessor,successor`),
                ]);

                if (!alive) return;

                setSettled({
                    key,
                    projectId: pid,
                    tasks: taskRes?.data ?? [],
                    relations: relationRes?.data ?? [],
                    unit: taskRes?.cpm?.unit ?? "day",
                    projectName: taskRes?.cpm?.project_name ?? "",
                    focusTask: focus,
                    error: "",
                });
            } catch {
                if (alive) setSettled({ ...BLANK, key, error: "دریافت اطلاعات گراف ممکن نشد" });
            }
        })();

        return () => {
            alive = false;
        };
    }, [focusId, projectId, key]);

    if (!focusId && !projectId) return NO_PROJECT;

    const current = settled.key === key ? settled : BLANK;

    return {
        projectId: current.projectId,
        tasks: current.tasks,
        relations: current.relations,
        unit: current.unit,
        projectName: current.projectName,
        focusTask: current.focusTask,
        loading: settled.key !== key,
        error: current.error,
    };
}
