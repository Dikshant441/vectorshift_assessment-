import { useEffect, useMemo, useRef, useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

// Matches {{ name }} where name is a valid JS identifier (letters, digits,
// _ or $, not starting with a digit). The \s* allows optional spaces inside.
const VARIABLE_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

const extractVariables = (text) => {
  const found = new Set();
  let match;
  while ((match = VARIABLE_REGEX.exec(text)) !== null) {
    found.add(match[1]);
  }
  return [...found];
};

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [text, setText] = useState(data?.text ?? '{{ input }}');
  const textareaRef = useRef(null);

  // Part 3a: a left-side handle for every distinct variable in the text.
  const variables = useMemo(() => extractVariables(text), [text]);

  // Part 3b: node width grows with the longest line (clamped), height grows
  // via the auto-resizing textarea below.
  const width = useMemo(() => {
    const longestLine = text
      .split('\n')
      .reduce((max, line) => Math.max(max, line.length), 0);
    return Math.min(Math.max(220, longestLine * 8 + 48), 460);
  }, [text]);

  // Grow the textarea height to fit its content.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [text, width]);

  const onChange = (e) => {
    setText(e.target.value);
    updateNodeField(id, 'text', e.target.value);
  };

  const handles = [
    ...variables.map((name) => ({
      id: `${id}-${name}`,
      type: 'target',
      position: Position.Left,
    })),
    { id: `${id}-output`, type: 'source', position: Position.Right },
  ];

  return (
    <BaseNode
      id={id}
      data={data}
      title="Text"
      className="vs-node--text"
      style={{ width }}
      handles={handles}
    >
      <label className="vs-field">
        <span className="vs-field__label">Text</span>
        <textarea
          ref={textareaRef}
          className="vs-field__control vs-textarea"
          rows={1}
          value={text}
          onChange={onChange}
          placeholder="Type here. Use {{ variable }} to add an input."
        />
      </label>

      {variables.length > 0 && (
        <div className="vs-chips">
          {variables.map((name) => (
            <span className="vs-chip" key={name}>
              {name}
            </span>
          ))}
        </div>
      )}
    </BaseNode>
  );
};
