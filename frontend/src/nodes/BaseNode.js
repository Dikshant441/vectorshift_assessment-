import { useEffect, useState } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import { useStore } from '../store';

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
  const removeNode = useStore((state) => state.removeNode);
  const updateNodeInternals = useUpdateNodeInternals();

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

  const handleKey = handles.map((h) => h.id).join('|');
  useEffect(() => {
    updateNodeInternals(id);
  }, [id, handleKey, updateNodeInternals]);

  return (
    <div className={`vs-node ${className}`} style={style}>
      <div className="vs-node__header">
        <span className="vs-node__dot" />
        <span className="vs-node__title">{title}</span>
        <button
          type="button"
          className="vs-node__remove"
          title="Delete node"
          aria-label="Delete node"
          onClick={() => removeNode(id)}
        >
          ×
        </button>
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
