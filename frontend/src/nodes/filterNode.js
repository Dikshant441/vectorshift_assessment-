import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const FilterNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Filter"
    className="vs-node--filter"
    fields={[
      { name: 'condition', label: 'Keep where', type: 'text', default: '' },
    ]}
    handles={[
      { id: `${id}-input`, type: 'target', position: Position.Left },
      { id: `${id}-output`, type: 'source', position: Position.Right },
    ]}
  />
);
