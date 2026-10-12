import { Background, Controls, MiniMap, ReactFlow, type Edge, type Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useMemo } from "react";
import TaskNode from "./TaskNode";
import { EDGE_COLORS, type TaskNodeData } from "./buildGraph";

// registered once at module level — React Flow warns about a fresh object per render
const nodeTypes = { task: TaskNode };

/** fallbacks, used only if the theme really does not define the variable */
const FALLBACK = { foreground: "#111111", red: "#fca5a5", border: "#e5e7eb", background: "#ffffff" };

/**
 * Feedback 5.1: the minimap used to be a blank white box.
 *
 * MiniMap paints its rectangles through SVG `fill` **attributes**, and an
 * attribute is not a CSS declaration — `var(--foreground)` never resolves
 * there, so every node came out unstyled and the whole box read as empty.
 * Reading the variables once through `getComputedStyle` turns them into
 * literal colours the SVG can actually paint with.
 */
function useMiniPalette() {
    return useMemo(() => {
        const source = getComputedStyle(document.documentElement);
        const read = (name: string, fallback: string) => source.getPropertyValue(name).trim() || fallback;

        return {
            foreground: read("--foreground", FALLBACK.foreground),
            red: read("--color-red-300", FALLBACK.red),
            border: read("--border", FALLBACK.border),
            background: read("--background", FALLBACK.background),
        };
    }, []);
}

interface Props {
    nodes: Node[];
    edges: Edge[];
}

/**
 * React Flow canvas of the precedence diagram: layered layout already
 * applied by `layoutGraph`, plus zoom / pan / fit-to-view controls,
 * a minimap and the legend of the visual codes.
 */
export default function GraphCanvas({ nodes, edges }: Props) {
    const palette = useMiniPalette();

    // the minimap itself is the zoomed-out overview of the whole network
    const miniColor = (node: Node) => {
        const data = node.data as TaskNodeData;

        if (data.focused) return palette.foreground;
        if (data.critical) return palette.red;

        return palette.border;
    };

    return (
        <div dir="ltr" className="relative h-[calc(100vh-19rem)] min-h-[26rem] w-full overflow-hidden rounded border border-border bg-background">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.15}
                maxZoom={2}
                nodesConnectable={false}
                deleteKeyCode={null}
            >
                <Background gap={16} size={1} color={palette.border} />
                <Controls showInteractive={false} />
                <MiniMap
                    pannable
                    zoomable
                    nodeColor={miniColor}
                    maskColor={`color-mix(in oklab, ${palette.background} 75%, transparent)`}
                    style={{ border: `1px solid ${palette.border}`, borderRadius: 8, boxShadow: "var(--shadow-sm)" }}
                />
            </ReactFlow>

            <Legend />
        </div>
    );
}

/** what the colours and the arrowheads mean */
function Legend() {
    return (
        <div
            dir="rtl"
            className="pointer-events-none absolute top-3 right-3 flex flex-wrap items-center gap-3 rounded border border-border bg-card/95 px-3 py-1.5 text-[0.65rem] text-muted-foreground shadow-sm"
        >
            <span className="flex items-center gap-1.5">
                <span className="h-3 w-5 rounded-sm border border-red-500 bg-card"></span>
                فعالیت بحرانی
            </span>
            <span className="flex items-center gap-1.5">
                <span className="h-3 w-5 rounded-sm border border-foreground bg-card"></span>
                تسک انتخاب‌شده
            </span>
            {/* feedback 5.2: the word "یال" (edge) was dropped from the label */}
            <span className="flex items-center gap-1.5">
                <span className="block h-0.5 w-5" style={{ background: EDGE_COLORS.critical }}></span>
                مسیر بحرانی
            </span>
            <span className="flex items-center gap-1.5">
                <span className="block h-0.5 w-5" style={{ background: EDGE_COLORS.normal }}></span>
                رابطه عادی
            </span>
        </div>
    );
}
