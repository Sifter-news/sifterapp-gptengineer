import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Clock, Map } from 'lucide-react';
import MindMapView from './MindMapView';
import TimeView from './TimeView';
import MapView from './MapView';
import SidePanel from './SidePanel';

const ProjectTabs = ({ 
  project, 
  nodes, 
  setNodes, 
  onAddNode, 
  onUpdateNode, 
  onDeleteNode, 
  onAddReport, 
  onUpdateReport, 
  focusedNodeId,
  onNodeFocus 
}) => {
  const selectedNode = nodes.find(node => node.id === focusedNodeId);

  return (
    <div className="relative flex-grow">
      <SidePanel
        nodes={nodes}
        onUpdateNode={onUpdateNode}
        onNodeFocus={onNodeFocus}
        selectedNode={selectedNode}
        onAddNode={onAddNode}
      />
      
      <Tabs defaultValue="mindmap" className="w-full h-full">
        <TabsList className="max-w-[340px] mx-auto justify-center fixed top-16 left-[250px] bg-white bg-opacity-80 backdrop-blur-md z-10 inline-flex">
          <TabsTrigger value="mindmap" className="flex items-center">
            <Brain className="w-4 h-4 mr-2" />
            Mind Map
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center">
            <Map className="w-4 h-4 mr-2" />
            Map
          </TabsTrigger>
        </TabsList>
        <div className="flex-grow mt-12">
          <TabsContent value="mindmap" className="h-[calc(100vh-128px)]">
            <MindMapView
              project={project}
              nodes={nodes}
              setNodes={setNodes}
              onAddNode={onAddNode}
              onUpdateNode={onUpdateNode}
              onDeleteNode={onDeleteNode}
              onAddReport={onAddReport}
              onUpdateReport={onUpdateReport}
              focusedNodeId={focusedNodeId}
              onNodeFocus={onNodeFocus}
            />
          </TabsContent>
          <TabsContent value="timeline">
            <TimeView nodes={nodes} />
          </TabsContent>
          <TabsContent value="map">
            <MapView nodes={nodes} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ProjectTabs;