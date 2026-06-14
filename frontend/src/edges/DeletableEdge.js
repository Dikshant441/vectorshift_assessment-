import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from "reactflow";
import { useStore } from "../store";

export const DeletableEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style,
  selected,
}) => {
  const removeEdge = useStore((state) => state.removeEdge);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
      {selected && (
        <EdgeLabelRenderer>
          <button
            type="button"
            className="vs-edge-delete"
            title="Delete connection"
            aria-label="Delete connection"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
            onClick={(event) => {
              event.stopPropagation();
              removeEdge(id);
            }}
          >
            ×
          </button>
        </EdgeLabelRenderer>
      )}
    </>
  );
};
