import type { TreeNodeData } from "../components/TreeView/types";

export const fetchChildren = (parentId: string): Promise<TreeNodeData[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: `${parentId}-1`, name: "Child A", hasChildren: false },
        { id: `${parentId}-2`, name: "Child B", hasChildren: true },
      ]);
    }, 700);
  });
