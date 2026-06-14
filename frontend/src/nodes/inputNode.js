import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const InputNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Input"
    className="vs-node--input"
    fields={[
      {
        name: 'inputName',
        label: 'Name',
        type: 'text',
        default: id.replace('customInput-', 'input_'),
      },
      {
        name: 'inputType',
        label: 'Type',
        type: 'select',
        options: ['Text', 'File'],
        default: 'Text',
      },
    ]}
    handles={[{ id: `${id}-value`, type: 'source', position: Position.Right }]}
  />
);
