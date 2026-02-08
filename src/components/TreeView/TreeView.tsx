import { useState } from "react";
import {
  DndContext,

  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import TreeNode from "./TreeNode";
import type { TreeNodeData } from "./types";
import "./tree.css";

/* ---------- helpers ---------- */
const findNode = (
  nodes: TreeNodeData[],
  id: string,
  parent: TreeNodeData | null = null
): any => {
  for (const node of nodes) {
    if (node.id === id) return { node, parent };
    if (node.children) {
      const res = findNode(node.children, id, node);
      if (res) return res;
    }
  }
  return null;
};

const removeNode = (nodes: TreeNodeData[], id: string): TreeNodeData[] =>
  nodes
    .filter((n) => n.id !== id)
    .map((n) =>
      n.children ? { ...n, children: removeNode(n.children, id) } : n
    );

const insertNode = (
  nodes: TreeNodeData[],
  parentId: string | null,
  nodeToInsert: TreeNodeData
): TreeNodeData[] => {
  if (!parentId) return [...nodes, nodeToInsert];

  return nodes.map((n) => {
    if (n.id === parentId) {
      return {
        ...n,
        hasChildren: true,
        children: [...(n.children || []), nodeToInsert],
      };
    }
    if (n.children) {
      return { ...n, children: insertNode(n.children, parentId, nodeToInsert) };
    }
    return n;
  });
};
/* -------------------------------- */

export default function TreeView({ data }: { data: TreeNodeData[] }) {
  const [treeData, setTreeData] = useState<TreeNodeData[]>(data);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setTreeData((prev) => {
      const activeInfo = findNode(prev, active.id as string);
      const overInfo = findNode(prev, over.id as string);

      if (!activeInfo || !overInfo) return prev;

      const removed = removeNode(prev, active.id as string);
      return insertNode(
        removed,
        overInfo.node.hasChildren ? overInfo.node.id : overInfo.parent?.id ?? null,
        activeInfo.node
      );
    });
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
<div className="tree-wrapper">
  {/* ===== Hero Header ===== */}
  <header className="tree-hero">
    <div className="tree-hero-content">
      <h1 className="tree-hero-title">
        Manage hierarchical data visually
      </h1>

      <p className="tree-hero-subtitle">
        A powerful tree view component with drag & drop, inline editing,
        lazy loading, and real-time structure updates.
      </p>

    </div>
  </header>

  {/* ===== Tree ===== */}
  <div className="tree-container">
    {treeData.map((node) => (
      <TreeNode key={node.id} node={node} setTreeData={setTreeData} />
    ))}
  </div>
</div>


    </DndContext>
  );
}
