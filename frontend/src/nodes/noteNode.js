import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { useStore } from "../store";

export const NoteNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [note, setNote] = useState(data?.note ?? "write something...");

  return (
    <BaseNode
      id={id}
      data={data}
      title="Note"
      className="vs-node--note"
      handles={[]}
    >
      <textarea
        className="vs-field__control vs-textarea"
        value={note}
        rows={3}
        onChange={(e) => {
          setNote(e.target.value);
          updateNodeField(id, "note", e.target.value);
        }}
      />
    </BaseNode>
  );
};
