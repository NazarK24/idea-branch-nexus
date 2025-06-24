
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Node as KnowledgeNode } from '@/types';
import { FileText, GitBranch, Plus } from 'lucide-react';

interface CustomNodeProps {
  data: {
    node: KnowledgeNode;
    onClick: () => void;
  };
}

export const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
  const { node, onClick } = data;

  const getNodeColor = () => {
    switch (node.type) {
      case 'genesis': return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'correction': return node.status === 'merged' 
        ? 'bg-amber-50 border-amber-200 text-amber-700 opacity-75'
        : 'bg-amber-100 border-amber-300 text-amber-800';
      case 'addition': return 'bg-blue-100 border-blue-300 text-blue-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getIcon = () => {
    switch (node.type) {
      case 'genesis': return <FileText size={16} />;
      case 'correction': return <GitBranch size={16} />;
      case 'addition': return <Plus size={16} />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div 
      className={`px-4 py-3 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md min-w-[120px] max-w-[200px] ${getNodeColor()}`}
      onClick={onClick}
    >
      <Handle type="target" position={Position.Left} className="w-2 h-2" />
      
      <div className="flex items-center gap-2 mb-1">
        {getIcon()}
        <span className="text-xs font-semibold uppercase tracking-wider">
          {node.type}
        </span>
        {node.status === 'merged' && (
          <span className="text-xs bg-green-200 text-green-800 px-1 rounded">
            Merged
          </span>
        )}
      </div>
      
      <div className="text-sm line-clamp-3">
        {node.content.substring(0, 80)}
        {node.content.length > 80 && '...'}
      </div>
      
      <Handle type="source" position={Position.Right} className="w-2 h-2" />
    </div>
  );
};
