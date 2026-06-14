import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const ConditionNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Condition"
    className="vs-node--condition"
    fields={[
      { name: 'expression', label: 'If', type: 'text', default: 'x === true' },
    ]}
    handles={[
      { id: `${id}-input`, type: 'target', position: Position.Left },
      { id: `${id}-output`, type: 'source', position: Position.Right },
    ]}
  />
);
