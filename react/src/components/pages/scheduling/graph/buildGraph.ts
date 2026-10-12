import { MarkerType, type Edge, type Node } from "@xyflow/react";
import { durationLabel, unitLabel } from "@/lib/labels";

/** Payload of one activity node (an Activity-on-Node box). */
export type TaskNodeData = {
    wbs: string;
    name: string;
    duration: string;
    critical: boolean;
    focused: boolean;
};

export type TaskFlowNode = Node<TaskNodeData, "task">;

export type TaskRow = {
    id: number | string;
    wbs_code?: string | null;
    name?: string | null;
    parent_id?: number | string | null;
    duration?: number | string | null;
    duration_unit?: number | string | null;
    cpm?: { is_critical?: boolean; duration?: number | string | null } | null;
};

export type RelationRow = {
    predecessor_task_id: number | string;
    successor_task_id: number | string;
    relation_type?: string | null;
    lag?: number | string | null;
    lag_unit?: number | string | null;
};

export type GraphInput = {
    tasks: TaskRow[];
    relations: RelationRow[];
    /** focused task id (single-task graph) or null for the whole project */
    focusId: string | null;
    /** CPM base unit (`day`/`hour`) used for the duration captions */
    unit: string;
};

export type BuiltGraph = { nodes: TaskFlowNode[]; edges: Edge[] };

const MIN_WIDTH = 200;
const MAX_WIDTH = 340;
/** rough glyph width of the Kalameh body text used inside a node */
const CHAR_WIDTH = 7;
const PAD_X = 16;
const FRAME_HEIGHT = 60;
const LINE_HEIGHT = 18;
const MAX_NAME_LINES = 3;

/** edge palette, shared with the canvas legend so the two cannot drift */
export const EDGE_COLORS = { critical: "var(--color-red-600)", normal: "var(--muted-foreground)" };

/** The activity box is sized to its own label, never wider than MAX_WIDTH. */
function nodeBox(task: TaskRow, name: string) {
    const longest = Math.max(name.length, String(task.wbs_code ?? "").length);
    const width = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(longest * CHAR_WIDTH) + PAD_X * 2 + 8));
    const lines = Math.max(1, Math.ceil((name.length * CHAR_WIDTH) / Math.max(1, width - PAD_X * 2)));

    return { width, height: FRAME_HEIGHT + Math.min(lines, MAX_NAME_LINES) * LINE_HEIGHT };
}

/** Summary rows (parents) never take part in relations, so only leaves are nodes. */
function leafIds(tasks: TaskRow[]): Set<string> {
    const parents = new Set<string>();

    tasks.forEach((task) => {
        if (task.parent_id !== null && task.parent_id !== undefined && task.parent_id !== "") parents.add(String(task.parent_id));
    });

    return new Set(tasks.filter((task) => !parents.has(String(task.id))).map((task) => String(task.id)));
}

/** `FS`, plus the Persian lag/lead when the lag is not zero (feedback 4) */
function edgeLabel(type: string, lag: number, lagUnit: number | string | null | undefined) {
    if (!lag) return type;

    return `${type} · ${lag > 0 ? "تاخیر" : "پیش افتادگی"} ${Math.abs(lag)} ${unitLabel(lagUnit ?? null)}`;
}

/**
 * Shape tasks + relations into React Flow nodes and edges.
 *
 * Focus mode keeps the task and its direct predecessors/successors; project
 * mode keeps every leaf activity, which is exactly the CPM network
 * (`CpmGraphService::leafRows` never puts summary rows in the graph either).
 */
export function buildGraph({ tasks, relations, focusId, unit }: GraphInput): BuiltGraph {
    const critical = new Set(tasks.filter((task) => task.cpm?.is_critical).map((task) => String(task.id)));
    let visible = tasks;

    if (focusId) {
        const around = new Set<string>([focusId]);

        relations.forEach((relation) => {
            const from = String(relation.predecessor_task_id);
            const to = String(relation.successor_task_id);

            if (from === focusId) around.add(to);
            if (to === focusId) around.add(from);
        });

        visible = tasks.filter((task) => around.has(String(task.id)));
    } else {
        const leaves = leafIds(tasks);
        visible = tasks.filter((task) => leaves.has(String(task.id)));
    }

    const visibleIds = new Set(visible.map((task) => String(task.id)));

    const nodes: TaskFlowNode[] = visible.map((task) => {
        const id = String(task.id);
        const name = String(task.name ?? "");
        const box = nodeBox(task, name);
        const duration = task.cpm ? durationLabel(task.cpm.duration, unit) : durationLabel(task.duration, task.duration_unit);

        return {
            id,
            type: "task",
            position: { x: 0, y: 0 },
            // `width`/`height` are what MiniMap measures the node by — keeping
            // them alongside `style` is what makes the minimap draw the nodes
            // instead of an empty box (feedback 5.1)
            width: box.width,
            height: box.height,
            style: { width: box.width, height: box.height },
            data: {
                wbs: String(task.wbs_code ?? ""),
                name,
                duration,
                critical: critical.has(id),
                focused: id === focusId,
            },
        };
    });

    const edges: Edge[] = [];

    relations.forEach((relation) => {
        const source = String(relation.predecessor_task_id);
        const target = String(relation.successor_task_id);

        if (!visibleIds.has(source) || !visibleIds.has(target)) return;

        const type = String(relation.relation_type ?? "FS");
        const lag = Number(relation.lag ?? 0);
        // an edge of the critical path is drawn in red, like the critical nodes
        const hot = critical.has(source) && critical.has(target);
        const color = hot ? EDGE_COLORS.critical : EDGE_COLORS.normal;

        edges.push({
            id: `${source}-${target}-${type}`,
            source,
            target,
            label: edgeLabel(type, lag, relation.lag_unit),
            markerEnd: { type: MarkerType.ArrowClosed, color },
            style: { stroke: color, strokeWidth: hot ? 2 : 1.5 },
        });
    });

    return { nodes, edges };
}
