import { useState } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { Plus, Minus, Folder, Circle, Pencil, Trash } from "lucide-react";
import type { TreeNodeData } from "./types";
import { fetchChildren } from "../../utils/fakeApi";
import { toast } from "react-toastify";

export default function TreeNode({
  node,
  setTreeData,
}: {
  node: TreeNodeData;
  setTreeData: any;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(node.name);
  const [adding, setAdding] = useState(false);
  const [newChild, setNewChild] = useState("");

const { attributes, listeners, setNodeRef, transform, isDragging } =
  useDraggable({ id: node.id });

const { setNodeRef: setDropRef } =
  useDroppable({ id: node.id });

const style = {
  transform: CSS.Translate.toString(transform),
  opacity: isDragging ? 0.5 : 1,
};



const updateNode = (
  nodes: TreeNodeData[],
  id: string,
  cb: (n: TreeNodeData) => void
): TreeNodeData[] => {
  return nodes.map((n) => {
    if (n.id === id) {
      const copy = { ...n };
      cb(copy);
      return copy;
    }

    if (n.children) {
      return {
        ...n,
        children: updateNode(n.children, id, cb),
      };
    }

    return n;
  });
};


const deleteNode = (
  nodes: TreeNodeData[],
  id: string
): TreeNodeData[] => {
  return nodes
    .filter((n) => n.id !== id)
    .map((n) =>
      n.children
        ? { ...n, children: deleteNode(n.children, id) }
        : n
    );
};




  const toggle = async () => {
    setExpanded((p) => !p);

    if (node.hasChildren && !node.children) {
      setTreeData((prev: any) =>
        updateNode(prev, node.id, (n) => (n.isLoading = true))
      );

      const children = await fetchChildren(node.id);

      setTreeData((prev: any) =>
        updateNode(prev, node.id, (n) => {
          n.children = children;
          n.isLoading = false;
        })
      );
    }
  };

 const confirmDelete = () => {
  toast(
    ({ closeToast }) => (
      <div>
        <p style={{ marginBottom: 8 }}>
          Delete this node and all children?
        </p>
        <button
          onClick={() => {
            setTreeData((prev: any) => deleteNode(prev, node.id));
            toast.success("Node deleted");
            closeToast?.();
          }}
          style={{
            background: "#ef4444",
            color: "#fff",
            padding: "4px 10px",
            borderRadius: 4,
            marginRight: 8,
          }}
        >
          Delete
        </button>
        <button onClick={closeToast}>Cancel</button>
      </div>
    ),
    { autoClose: false }
  );
};


  const addChild = () => {
    if (!newChild.trim()) return;

    setTreeData((prev: any) =>
      updateNode(prev, node.id, (n) => {
        n.children = [
          ...(n.children || []),
          {
            id: crypto.randomUUID(),
            name: newChild,
            hasChildren: false,
          },
        ];
        n.hasChildren = true;
      })
    );

    setNewChild("");
    setAdding(false);
    setExpanded(true);
  };

  return (
   <div
  ref={(el) => {
    setNodeRef(el);
    setDropRef(el);
  }}
  style={style}
  className="tree-node"
>
     <div className="node-row">
  <span
    className="drag-handle"
    {...listeners}
    {...attributes}
    title="Drag"
  >
    ⋮⋮
  </span>

        {node.hasChildren ? (
          <span className="toggle" onClick={toggle}>
            {expanded ? <Minus size={12} /> : <Plus size={12} />}
          </span>
        ) : (
          <span className="toggle placeholder" />
        )}

        {node.hasChildren ? <Folder size={16} /> : <Circle size={10} />}

        {editing ? (
          <input
            className="node-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => {
              setTreeData((prev: any) =>
                updateNode(prev, node.id, (n) => (n.name = value))
              );
              setEditing(false);
            }}
            autoFocus
          />
        ) : (
          <span className="node-name" onDoubleClick={() => setEditing(true)}>
            {node.name}
          </span>
        )}

        <button onClick={() => setAdding(true)} title="Add child">
          <Plus size={14} />
        </button>

        <button onClick={() => setEditing(true)} title="Edit">
          <Pencil size={14} />
        </button>

        <button onClick={confirmDelete} title="Delete">
          <Trash size={14} />
        </button>
      </div>

      {node.isLoading && <div className="loading">Loading…</div>}

{adding && (
  <div className="add-node-wrapper">
    <div className="add-node-connector" />

    <div className="add-node-card">
      <input
        className="add-node-input"
        value={newChild}
        onChange={(e) => setNewChild(e.target.value)}
        placeholder="New node name"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (!newChild.trim()) {
              toast.error("Node name required");
              return;
            }
            addChild();
            toast.success("Node added");
          }
          if (e.key === "Escape") setAdding(false);
        }}
      />

      <button
        className="add-node-btn primary"
        title="Add"
        onClick={() => {
          if (!newChild.trim()) {
            toast.error("Node name required");
            return;
          }
          addChild();
          toast.success("Node added");
        }}
      >
        Add
      </button>

      <button
        className="add-node-btn ghost"
        title="Cancel"
        onClick={() => setAdding(false)}
      >
        Cancel
      </button>
    </div>
  </div>
)}



      {expanded && node.children && (
        <div className="children">
          {node.children.map((c) => (
            <TreeNode key={c.id} node={c} setTreeData={setTreeData} />
          ))}
        </div>
      )}
    </div>
  );
}
