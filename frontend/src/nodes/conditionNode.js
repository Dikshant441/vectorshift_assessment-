import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

// One input, two outputs (true / false) — shows multiple sources on one side.
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
      { id: `${id}-true`, type: 'source', position: Position.Right },
      { id: `${id}-false`, type: 'source', position: Position.Right },
    ]}
  />
);
