import type { CSSProperties } from "react";
import dagre from "dagre";

/** dagre works with plain numbers; a CSS size may also be a string */
function sizeOf(value: number | string | undefined, fallback: number): number {
    return typeof value === "number" ? value : fallback;
}

type LayoutNode = {
    id: string;
    style?: CSSProperties;
    position: { x: number; y: number };
};

/**
 * Layered Activity-on-Node (PDM) layout: ranks follow the precedence
 * direction top → bottom (feedback 5), nodes of the same rank are stacked
 * with `nodesep`, and every node keeps the box size `buildGraph` gave it.
 *
 * Returns a new array — the input nodes are never mutated.
 */
export function layoutGraph<T extends LayoutNode>(nodes: T[], edges: { source: string; target: string }[]): T[] {
    const graph = new dagre.graphlib.Graph();

    graph.setGraph({ rankdir: "TB", nodesep: 56, ranksep: 110, marginx: 32, marginy: 32 });
    graph.setDefaultEdgeLabel(() => ({}));

    nodes.forEach((node) => {
        graph.setNode(node.id, {
            width: sizeOf(node.style?.width, 240),
            height: sizeOf(node.style?.height, 96),
        });
    });

    edges.forEach((edge) => graph.setEdge(String(edge.source), String(edge.target)));

    dagre.layout(graph);

    return nodes.map((node) => {
        const placed = graph.node(node.id);

        if (!placed) return node;

        return { ...node, position: { x: placed.x - placed.width / 2, y: placed.y - placed.height / 2 } };
    });
}
