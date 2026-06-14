import { DraggableNode } from './draggableNode';

const NODES = [
  { type: 'customInput', label: 'Input' },
  { type: 'llm', label: 'LLM' },
  { type: 'customOutput', label: 'Output' },
  { type: 'text', label: 'Text' },
  { type: 'filter', label: 'Filter' },
  { type: 'math', label: 'Math' },
  { type: 'api', label: 'API' },
  { type: 'condition', label: 'Condition' },
  { type: 'note', label: 'Note' },
];

export const PipelineToolbar = () => (
  <div className="vs-toolbar">
    <span className="vs-toolbar__label">Drag a node onto the canvas</span>
    <div className="vs-toolbar__nodes">
      {NODES.map((node) => (
        <DraggableNode key={node.type} type={node.type} label={node.label} />
      ))}
    </div>
  </div>
);
