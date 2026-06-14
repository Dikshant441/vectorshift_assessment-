import { useEffect, useState } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import { useStore } from '../store';

/**
 * BaseNode
 * ---------
 * One reusable shell that every node is built from. A new node only has to
 * describe *what* it contains (a title, some fields, some handles) — never
 * *how* it is laid out, styled, or wired into the store. That shared chrome
 * lives here once.
 *
 * Props:
 *  - title    : text shown in the coloured header
 *  - handles  : [{ id, type: 'source' | 'target', position }]
 *  - fields   : [{ name, label, type: 'text' | 'select', options?, default? }]
 *  - children : custom content (used by nodes with special logic, e.g. Text)
 *  - className: extra class for per-node accent colours
 */

// Space handles evenly down the side they sit on, so a node with two inputs
// doesn't stack them on top of each other.
const handleStyle = (allHandles, handle) => {
  const sameSide = allHandles.filter((h) => h.position === handle.position);
  const indexOnSide = sameSide.indexOf(handle);
  const percent = ((indexOnSide + 1) * 100) / (sameSide.length + 1);
  const vertical =
    handle.position === Position.Left || handle.position === Position.Right;
  return vertical ? { top: `${percent}%` } : { left: `${percent}%` };
};

export const BaseNode = ({
  id,
  data,
  title,
  handles = [],
  fields = [],
  children,
  className = '',
  style = {},
}) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const updateNodeInternals = useUpdateNodeInternals();

  // Local mirror of field values, seeded from saved data or each field default.
  const [values, setValues] = useState(() => {
    const seed = {};
    fields.forEach((f) => {
      seed[f.name] = data?.[f.name] ?? f.default ?? '';
    });
    return seed;
  });

  const onChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    updateNodeField(id, name, value);
  };

  // When the set of handles changes (e.g. Text node variables), tell React Flow
  // to re-measure so connected edges snap to the right spot.
  const handleKey = handles.map((h) => h.id).join('|');
  useEffect(() => {
    updateNodeInternals(id);
  }, [id, handleKey, updateNodeInternals]);

  return (
    <div className={`vs-node ${className}`} style={style}>
      <div className="vs-node__header">
        <span className="vs-node__dot" />
        <span className="vs-node__title">{title}</span>
      </div>

      <div className="vs-node__body">
        {fields.map((field) => (
          <label className="vs-field" key={field.name}>
            <span className="vs-field__label">{field.label}</span>
            {field.type === 'select' ? (
              <select
                className="vs-field__control"
                value={values[field.name]}
                onChange={(e) => onChange(field.name, e.target.value)}
              >
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="vs-field__control"
                type={field.type || 'text'}
                value={values[field.name]}
                onChange={(e) => onChange(field.name, e.target.value)}
              />
            )}
          </label>
        ))}

        {children}
      </div>

      {handles.map((handle) => (
        <Handle
          key={handle.id}
          id={handle.id}
          type={handle.type}
          position={handle.position}
          className="vs-handle"
          style={handleStyle(handles, handle)}
        />
      ))}
    </div>
  );
};
