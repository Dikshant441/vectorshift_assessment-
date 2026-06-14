export const DraggableNode = ({ type, label }) => {
  const onDragStart = (event, nodeType) => {
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({ nodeType })
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={`vs-chip-drag vs-chip-drag--${type}`}
      draggable
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
    >
      {label}
    </div>
  );
};
