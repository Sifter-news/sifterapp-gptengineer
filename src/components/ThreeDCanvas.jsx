import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import Grid from './Grid';
import Toolbar from './Toolbar';
import ThreeDNode from './ThreeDNode';
import ConnectionLine from './ConnectionLine';

const ThreeDCanvas = () => {
  // Changed default tool to 'pan' instead of 'select'
  const [activeTool, setActiveTool] = useState('pan');
  const [zoom, setZoom] = useState(1);
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [activeConnection, setActiveConnection] = useState(null);
  const [viewMode, setViewMode] = useState('2d');
  const controlsRef = useRef();

  // Add keyboard event handler
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key.toLowerCase() === 'v') {
        setActiveTool('select');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const { data, error } = await supabase
          .from('node')
          .select('*');
          
        if (error) throw error;
        
        if (data) {
          const mappedNodes = data.map(node => ({
            id: node.id,
            title: node.title || '',
            description: node.description || '',
            position: [
              node.position_x || 0,
              0, // Y position is locked to 0 in 2D mode
              node.position_y || 0 // Using position_y as Z coordinate
            ],
            type: node.type || 'generic',
            visualStyle: node.visual_style || 'default'
          }));
          setNodes(mappedNodes);
        }
      } catch (error) {
        console.error('Error loading nodes:', error);
        toast.error('Failed to load nodes');
      }
    };

    fetchNodes();
  }, []);

  useEffect(() => {
    if (controlsRef.current) {
      if (viewMode === '2d') {
        controlsRef.current.setAzimuthalAngle(0);
        controlsRef.current.setPolarAngle(0);
        controlsRef.current.enableRotate = false;
      } else {
        controlsRef.current.setAzimuthalAngle(Math.PI / 4);
        controlsRef.current.setPolarAngle(Math.PI / 4);
        controlsRef.current.enableRotate = true;
      }
    }
  }, [viewMode]);

  const handleZoom = (delta) => {
    setZoom(prev => Math.max(0.1, Math.min(2, prev + delta)));
  };

  const handleNodeUpdate = async (nodeId, newPosition) => {
    try {
      const { error } = await supabase
        .from('node')
        .update({
          position_x: newPosition[0],
          position_y: newPosition[2] // Z coordinate maps to Y in database
        })
        .eq('id', nodeId);

      if (error) throw error;

      setNodes(prev => prev.map(node =>
        node.id === nodeId ? { ...node, position: newPosition } : node
      ));
    } catch (error) {
      console.error('Error updating node position:', error);
      toast.error('Failed to update node position');
    }
  };

  const handleStartConnection = (sourceId, sourcePosition) => {
    setActiveConnection({
      sourceId,
      sourcePosition,
      targetPosition: sourcePosition
    });
  };

  const handleEndConnection = (targetId) => {
    if (activeConnection && activeConnection.sourceId !== targetId) {
      const sourceNode = nodes.find(n => n.id === activeConnection.sourceId);
      const targetNode = nodes.find(n => n.id === targetId);
      
      if (sourceNode && targetNode) {
        setConnections(prev => [...prev, {
          id: Date.now(),
          sourceId: activeConnection.sourceId,
          targetId: targetId,
          sourcePosition: sourceNode.position,
          targetPosition: targetNode.position
        }]);
      }
    }
    setActiveConnection(null);
  };

  const handlePointerMove = (event) => {
    if (activeConnection) {
      const { clientX, clientY } = event;
      setActiveConnection(prev => ({
        ...prev,
        targetPosition: [clientX / 100 - 5, 10, clientY / 100 - 5]
      }));
    }
  };

  return (
    <div 
      className="relative w-full h-[calc(100vh-64px)] bg-black"
      onPointerMove={handlePointerMove}
    >
      <div className="absolute top-0 left-0 right-0 z-10">
        <Toolbar 
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          handleZoom={handleZoom}
          zoom={zoom}
          nodes={nodes}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>
      <Canvas
        camera={{ 
          position: [0, 100, 0],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        style={{ background: 'black' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Grid size={100} divisions={24} />
        
        {nodes.map(node => (
          <ThreeDNode 
            key={node.id}
            node={node}
            activeTool={activeTool}
            onUpdate={(newPosition) => {
              const lockedPosition = viewMode === '2d' 
                ? [newPosition[0], 0, newPosition[2]]
                : newPosition;
              
              handleNodeUpdate(node.id, lockedPosition);
            }}
            onStartConnection={handleStartConnection}
            onEndConnection={handleEndConnection}
          />
        ))}

        {connections.map(connection => (
          <ConnectionLine
            key={connection.id}
            start={connection.sourcePosition}
            end={connection.targetPosition}
          />
        ))}

        {activeConnection && (
          <ConnectionLine
            start={activeConnection.sourcePosition}
            end={activeConnection.targetPosition}
          />
        )}

        <OrbitControls 
          ref={controlsRef}
          enableZoom={true}
          enablePan={activeTool === 'pan'}
          enableRotate={viewMode === '3d' && activeTool === 'pan'}
          maxDistance={200}
          minDistance={10}
          maxPolarAngle={viewMode === '2d' ? 0 : Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};

export default ThreeDCanvas;
