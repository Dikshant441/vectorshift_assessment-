import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const OutputNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Output"
    className="vs-node--output"
    fields={[
      {
        name: 'outputName',
        label: 'Name',
        type: 'text',
        default: id.replace('customOutput-', 'output_'),
      },
      {
        name: 'outputType',
        label: 'Type',
        type: 'select',
        options: ['Text', 'Image'],
        default: 'Text',
      },
    ]}
    handles={[{ id: `${id}-value`, type: 'target', position: Position.Left }]}
  />
);
