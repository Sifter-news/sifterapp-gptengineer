import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import Toolbar from './Toolbar';
import ThreeScene from './three/ThreeScene';

const ThreeDCanvas = () => {
  const [activeTool, setActiveTool] = useState('pan');
  const [zoom, setZoom] = useState(1);
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [activeConnection, setActiveConnection] = useState(null);
  const [viewMode, setViewMode] = useState('2d');
  const controlsRef = useRef();

  const handleStartConnection = (sourceId, sourcePosition, connectionPoint) => {
    setActiveConnection({
      sourceId,
      sourcePosition,
      sourcePoint: connectionPoint,
      targetPosition: sourcePosition // Initially same as source
    });
  };

  const handleEndConnection = async (targetId, targetPoint) => {
    if (!activeConnection || targetId === activeConnection.sourceId) {
      setActiveConnection(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('connections')
        .insert([{
          source_id: activeConnection.sourceId,
          target_id: targetId,
          source_point: activeConnection.sourcePoint,
          target_point: targetPoint
        }])
        .select()
        .single();

      if (error) throw error;

      setConnections(prev => [...prev, {
        id: data.id,
        sourceId: activeConnection.sourceId,
        targetId: targetId,
        sourcePosition: activeConnection.sourcePosition,
        targetPosition: nodes.find(n => n.id === targetId)?.position || [0, 0, 0],
        sourcePoint: activeConnection.sourcePoint,
        targetPoint: targetPoint
      }]);

      toast.success('Connection created');
    } catch (error) {
      console.error('Error creating connection:', error);
      toast.error('Failed to create connection');
    }

    setActiveConnection(null);
  };

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
              0,  // Always set y to 0
              0   // Always set z to 0 for 2D view
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

  const handleNodeUpdate = async (nodeId, newPosition) => {
    try {
      const { error } = await supabase
        .from('node')
        .update({
          position_x: newPosition[0],
          position_y: 0  // Always set y to 0
        })
        .eq('id', nodeId);

      if (error) throw error;

      setNodes(prev => prev.map(node =>
        node.id === nodeId ? { ...node, position: [newPosition[0], 0, 0] } : node
      ));
    } catch (error) {
      console.error('Error updating node position:', error);
      toast.error('Failed to update node position');
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-black">
      <Toolbar 
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        handleZoom={setZoom}
        zoom={zoom}
        nodes={nodes}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      <Canvas
        camera={{ 
          position: viewMode === '3d' ? [70.71, 70.71, 70.71] : [0, 0, 200],
          fov: 45,
          near: 0.1,
          far: 2000
        }}
        style={{ background: 'black' }}
      >
        <ThreeScene 
          nodes={nodes}
          connections={connections}
          activeConnection={activeConnection}
          viewMode={viewMode}
          activeTool={activeTool}
          controlsRef={controlsRef}
          handleNodeUpdate={handleNodeUpdate}
          onStartConnection={handleStartConnection}
          onEndConnection={handleEndConnection}
        />
      </Canvas>
    </div>
  );
};

export default ThreeDCanvas;
