import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Position, useUpdateNodeInternals } from "reactflow";
import { BaseNode } from "./BaseNode";
import { useStore } from "../store";

const VARIABLE_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

const extractVariables = (text) => {
  const found = new Set();
  for (const match of text.matchAll(VARIABLE_REGEX)) {
    found.add(match[1]);
  }
  return [...found];
};

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const updateNodeInternals = useUpdateNodeInternals();
  const [text, setText] = useState(data?.text ?? "{{ input }}");
  const textareaRef = useRef(null);

  // A manual drag-resize, once made, acts as a larger floor. Auto-grow can
  // still push past it so typed text is never clipped, but it won't shrink
  // below what the user chose.
  const manualSize = useRef({ width: null, height: null });
  const downSize = useRef(null);

  const variables = useMemo(() => extractVariables(text), [text]);

  // Content-driven width (the auto-grow minimum), clamped to a sane range.
  const autoWidth = useMemo(() => {
    const longestLine = text
      .split("\n")
      .reduce((max, line) => Math.max(max, line.length), 0);
    return Math.min(Math.max(200, longestLine * 7.5 + 28), 460);
  }, [text]);

  const autosize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.width = `${Math.max(autoWidth, manualSize.current.width ?? 0)}px`;
    el.style.height = "auto";
    el.style.height = `${Math.max(
      el.scrollHeight,
      manualSize.current.height ?? 0
    )}px`;
    updateNodeInternals(id);
  }, [autoWidth, id, updateNodeInternals]);

  useEffect(() => {
    autosize();
  }, [text, autosize]);

  const onChange = (e) => {
    setText(e.target.value);
    updateNodeField(id, "text", e.target.value);
  };

  // Record the size at the start of a pointer interaction so we can tell a
  // genuine drag-resize apart from an ordinary click.
  const onPointerDown = () => {
    const el = textareaRef.current;
    if (el) downSize.current = { width: el.offsetWidth, height: el.offsetHeight };
  };

  const onPointerUp = () => {
    const el = textareaRef.current;
    if (!el || !downSize.current) return;
    const changed =
      el.offsetWidth !== downSize.current.width ||
      el.offsetHeight !== downSize.current.height;
    if (changed) {
      manualSize.current = { width: el.offsetWidth, height: el.offsetHeight };
      updateNodeInternals(id);
    }
    downSize.current = null;
  };

  // Left side: one handle per {{ variable }}, or a single default input when
  // there are none, so the node is always connectable on both ends.
  const inputHandles =
    variables.length > 0
      ? variables.map((name) => ({
          id: `${id}-var-${name}`,
          type: "target",
          position: Position.Left,
        }))
      : [{ id: `${id}-input`, type: "target", position: Position.Left }];

  const handles = [
    ...inputHandles,
    { id: `${id}-output`, type: "source", position: Position.Right },
  ];

  return (
    <BaseNode
      id={id}
      data={data}
      title="Text"
      className="vs-node--text"
      handles={handles}
    >
      <label className="vs-field">
        <span className="vs-field__label">Text</span>
        <textarea
          ref={textareaRef}
          className="vs-field__control vs-textarea vs-textarea--auto"
          rows={1}
          value={text}
          onChange={onChange}
          onMouseDown={onPointerDown}
          onMouseUp={onPointerUp}
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
