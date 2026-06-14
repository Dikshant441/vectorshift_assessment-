import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="LLM"
    className="vs-node--llm"
    handles={[
      { id: `${id}-prompt`, type: 'target', position: Position.Left },
      { id: `${id}-response`, type: 'source', position: Position.Right },
    ]}
  >
    <p className="vs-node__hint">Large language model. Wire a prompt in, read the response out.</p>
  </BaseNode>
);
