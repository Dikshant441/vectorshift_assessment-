import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

// A sticky note — no handles at all. Proves the abstraction handles the
// "zero connections" case just as cleanly as the others.
export const NoteNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [note, setNote] = useState(data?.note ?? 'Jot something down...');

  return (
    <BaseNode id={id} data={data} title="Note" className="vs-node--note" handles={[]}>
      <textarea
        className="vs-field__control vs-textarea"
        value={note}
        rows={3}
        onChange={(e) => {
          setNote(e.target.value);
          updateNodeField(id, 'note', e.target.value);
        }}
      />
    </BaseNode>
  );
};
