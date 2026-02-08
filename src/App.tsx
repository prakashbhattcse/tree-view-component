import TreeView from "./components/TreeView/TreeView";
import { mockTreeData } from "./data/mockTreeData";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <TreeView data={mockTreeData} />
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}
