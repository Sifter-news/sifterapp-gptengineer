import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ZOOM_LEVELS = [
  { value: 0.125, label: '12.5%' },  // 256 units (8 grid cells)
  { value: 0.25, label: '25%' },     // 128 units (4 grid cells)
  { value: 0.5, label: '50%' },      // 64 units (2 grid cells)
  { value: 1, label: '100%' },       // 32 units (1 grid cell)
  { value: 2, label: '200%' },       // 16 units (1/2 grid cell)
  { value: 4, label: '400%' },       // 8 units (1/4 grid cell)
];

const ZoomLevelMenu = ({ zoom, handleZoom }) => {
  const zoomPercentage = Math.round(100 * zoom);
  
  const setZoomLevel = (newZoom) => {
    const delta = newZoom - zoom;
    handleZoom(delta);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 rounded-lg text-white hover:text-white hover:bg-white/10 bg-white/[0.0625] flex items-center gap-1.5"
        >
          {zoomPercentage}%
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black text-white" align="top">
        {ZOOM_LEVELS.map((level) => (
          <DropdownMenuItem
            key={level.value}
            onClick={() => setZoomLevel(level.value)}
            className="flex items-center justify-between hover:text-white"
          >
            <span>{level.label}</span>
            {level.value === 1 && <span className="text-xs text-gray-400">⌘0</span>}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          onClick={() => setZoomLevel(1)}
          className="flex items-center gap-2 hover:text-white border-t border-white/10"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset Zoom</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ZoomLevelMenu;