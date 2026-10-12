import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { TaskNodeData } from "./buildGraph";

/**
 * One activity box of the precedence diagram: WBS code + critical badge,
 * the Persian name (RTL, clamped) and the duration. The wrapper div is sized
 * by `buildGraph`, this component just fills it.
 *
 * Precedence attaches on the top (incoming) and the bottom (outgoing),
 * matching the top-to-bottom rank direction of the layout (feedback 5).
 */
export default function TaskNode({ data }: NodeProps) {
    const node = data as TaskNodeData;

    const frame = node.focused
        ? "border-foreground ring-2 ring-foreground/30 shadow-md"
        : node.critical
          ? "border-red-500 shadow-sm"
          : "border-border shadow-sm";

    return (
        <div dir="rtl" className={`flex h-full w-full flex-col gap-1 overflow-hidden rounded-md border bg-card px-4 py-2 text-right ${frame}`}>
            <div className="flex items-center justify-between gap-2">
                <span dir="auto" className="truncate text-[0.65rem] font-bold text-muted-foreground">
                    {node.wbs || "—"}
                </span>

                {node.critical && (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-red-50 px-1.5 py-0.5 text-[0.6rem] text-red-500">
                        <span className="size-1 rounded-full bg-red-500"></span>
                        بحرانی
                    </span>
                )}
            </div>

            <p dir="auto" title={node.name} className="line-clamp-3 break-words text-[0.78rem] leading-5 text-foreground">
                {node.name}
            </p>

            <span className="mt-auto text-[0.65rem] text-muted-foreground">{node.duration}</span>

            <Handle
                type="target"
                position={Position.Top}
                style={{ background: "var(--muted-foreground)", width: 8, height: 8 }}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                style={{ background: "var(--muted-foreground)", width: 8, height: 8 }}
            />
        </div>
    );
}
