import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import NodeActions from './NodeActions';
import { getNodeTypeIcon } from './NodeTypeIcon';
import { Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from 'react';
import { toast } from 'sonner';

const NodeListItem = ({ 
  node, 
  isSelected, 
  onSelect, 
  onFocus, 
  onUpdateNode, 
  onAIConversation,
  isFocused,
  onEdit,
  onDelete 
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!node) return null;

  const getNodeTypeLabel = (type) => {
    const types = {
      generic: "Generic Note",
      node_person: "Person",
      node_organization: "Organization",
      node_object: "Object",
      node_concept: "Concept",
      node_location: "Location",
      node_event: "Event"
    };
    return types[type] || "Generic Note";
  };

  const handleDelete = async () => {
    try {
      await onDelete(node.id);
      toast.success('Node deleted successfully');
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error('Failed to delete node');
    }
  };

  return (
    <>
      <div 
        className={`group flex items-center justify-between p-1 hover:bg-gray-100 rounded-lg ml-4 mb-4 ${
          isSelected ? 'bg-blue-50 ring-2 ring-blue-500' : ''
        } ${isFocused ? 'ring-2 ring-blue-600' : ''}`}
        onClick={() => onSelect(node.id)}
      >
        <div 
          className="flex items-center flex-grow cursor-pointer gap-3"
          onClick={(e) => {
            e.stopPropagation();
            onFocus(node.id);
          }}
        >
          <Avatar className="h-6 w-6">
            <AvatarImage src="/default-image.png" alt={node.title} />
            <AvatarFallback>{getNodeTypeIcon(node.nodeType)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm">{node.title}</div>
            <div className="text-xs text-gray-500">{getNodeTypeLabel(node.nodeType)}</div>
            <div className="text-sm text-gray-500">
              {node.description}
              {node.type === 'group' && node.children && ` (${node.children.length} nodes)`}
            </div>
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(node);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <NodeActions 
            node={node} 
            onUpdateNode={onUpdateNode}
            onAIConversation={onAIConversation}
          />
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this node
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NodeListItem;