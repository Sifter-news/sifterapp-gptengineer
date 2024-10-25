import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import { findAvailablePosition } from '@/utils/canvasUtils';

export const useNodeOperations = (setNodes) => {
  const handleAddNode = async (newNode, projectId) => {
    try {
      const position = findAvailablePosition([]);
      const nodeWithPosition = {
        title: newNode.title,
        description: newNode.description,
        type: newNode.type,
        investigation_id: projectId,
        position_x: position.x,
        position_y: position.y,
        width: newNode.width || 200
      };

      const { data, error } = await supabase
        .from('node')
        .insert([nodeWithPosition])
        .select()
        .single();

      if (error) throw error;

      // Map position_x and position_y to x and y for frontend compatibility
      const mappedNode = {
        ...data,
        x: data.position_x,
        y: data.position_y
      };

      setNodes(prevNodes => [...prevNodes, mappedNode]);
      toast.success('Node added successfully');
    } catch (error) {
      console.error('Error adding node:', error);
      toast.error('Failed to add node');
    }
  };

  const handleUpdateNode = async (nodeId, updates) => {
    try {
      const validUpdates = {
        title: updates.title,
        description: updates.description,
        position_x: updates.x,
        position_y: updates.y,
        width: updates.width
      };

      const { error } = await supabase
        .from('node')
        .update(validUpdates)
        .eq('id', nodeId);

      if (error) throw error;

      setNodes(prevNodes => prevNodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      ));
    } catch (error) {
      console.error('Error updating node:', error);
      toast.error('Failed to update node');
    }
  };

  const handleDeleteNode = async (nodeId) => {
    try {
      const { error } = await supabase
        .from('node')
        .delete()
        .eq('id', nodeId);

      if (error) throw error;

      setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
      toast.success('Node deleted successfully');
    } catch (error) {
      console.error('Error deleting node:', error);
      toast.error('Failed to delete node');
    }
  };

  return { handleAddNode, handleUpdateNode, handleDeleteNode };
};