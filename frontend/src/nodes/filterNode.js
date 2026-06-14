import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

// Keeps only the items that match a condition. One in, one out.
export const FilterNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Filter"
    className="vs-node--filter"
    fields={[
      { name: 'condition', label: 'Keep where', type: 'text', default: 'value > 0' },
    ]}
    handles={[
      { id: `${id}-input`, type: 'target', position: Position.Left },
      { id: `${id}-output`, type: 'source', position: Position.Right },
    ]}
  />
);
