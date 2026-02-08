export interface TreeNodeData {
  id: string;
  name: string;
  children?: TreeNodeData[];
  hasChildren?: boolean;   
  isLoading?: boolean;
}
