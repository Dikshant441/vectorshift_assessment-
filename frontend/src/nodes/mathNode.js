import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const MathNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Math"
    className="vs-node--math"
    fields={[
      {
        name: 'operation',
        label: 'Operation',
        type: 'select',
        options: ['Add', 'Subtract', 'Multiply', 'Divide'],
        default: 'Add',
      },
    ]}
    handles={[
      { id: `${id}-input`, type: 'target', position: Position.Left },
      { id: `${id}-result`, type: 'source', position: Position.Right },
    ]}
  />
);
