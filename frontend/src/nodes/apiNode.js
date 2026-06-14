import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

// Calls an external endpoint. Mixes a select and a text field.
export const ApiNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="API Request"
    className="vs-node--api"
    fields={[
      {
        name: 'method',
        label: 'Method',
        type: 'select',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
        default: 'GET',
      },
      { name: 'url', label: 'URL', type: 'text', default: 'https://api.example.com' },
    ]}
    handles={[
      { id: `${id}-body`, type: 'target', position: Position.Left },
      { id: `${id}-response`, type: 'source', position: Position.Right },
    ]}
  />
);
