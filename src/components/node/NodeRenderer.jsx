import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import NodeContent from './NodeContent';
import NodeTooltip from './NodeTooltip';

const NodeRenderer = ({ 
  node, 
  onDragStart, 
  onDrag,
  zoom, 
  onNodeUpdate, 
  onFocus, 
  isFocused, 
  onAIConversation, 
  onDelete,
  isDragging,
  onPositionUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(node.title);
  const [localDescription, setLocalDescription] = useState(node.description);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setShowTooltip(false);
    }
  }, [isFocused]);

  const handleNodeClick = (e) => {
    e.stopPropagation();
    setShowTooltip(true);
    onFocus(node.id);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onNodeUpdate(node.id, {
      title: localTitle,
      description: localDescription
    });
  };

  const handleDragStop = (e, d) => {
    if (onPositionUpdate) {
      onPositionUpdate(node.id, d.x, d.y);
    }
  };

  return (
    <Rnd
      size={{ width: node.width || 200, height: node.height || 100 }}
      position={{ x: node.x || 0, y: node.y || 0 }}
      onDragStart={(e) => onDragStart?.(e)}
      onDrag={(e) => onDrag?.(e)}
      onDragStop={handleDragStop}
      scale={zoom}
      className={`absolute ${
        isFocused 
          ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-[1.02] z-50' 
          : 'hover:ring-1 hover:ring-blue-300 hover:ring-offset-1 hover:shadow-md hover:scale-[1.01] z-40'
      } ${isDragging ? 'cursor-grabbing !transition-none' : 'cursor-grab transition-all duration-200'}`}
      onClick={handleNodeClick}
      enableResizing={false}
      bounds="parent"
      dragHandleClassName="drag-handle"
    >
      <NodeContent
        style={node.visualStyle}
        isEditing={isEditing}
        node={node}
        localTitle={localTitle}
        localDescription={localDescription}
        handleBlur={handleBlur}
        setLocalTitle={setLocalTitle}
        setLocalDescription={setLocalDescription}
        handleNodeClick={handleNodeClick}
        isFocused={isFocused}
      />
      {showTooltip && (
        <NodeTooltip
          node={node}
          showTooltip={showTooltip}
          onAIConversation={onAIConversation}
          onDelete={onDelete}
          onUpdateNode={onNodeUpdate}
        />
      )}
    </Rnd>
  );
};

export default NodeRenderer;