import type { TreeNodeData } from "../components/TreeView/types";


export const mockTreeData: TreeNodeData[] = [
  {
    id: "1",
    name: "Root Folder",
    hasChildren: true,
  },
  {
    id: "2",
    name: "Documents",
    hasChildren: true,
  },
  {
    id: "3",
    name: "Images",
    hasChildren: false,
  },
];
