
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
      case 'genesis': return 'bg-purple-500 border-purple-600 text-white';
      case 'correction': return 'bg-amber-500 border-amber-600 text-white';
      case 'addition': return 'bg-blue-500 border-blue-600 text-white';
      default: return 'bg-gray-500 border-gray-600 text-white';
    }
  };

  const getIcon = () => {
    switch (node.type) {
      case 'genesis': return <FileText size={20} />;
      case 'correction': return <GitBranch size={20} />;
      case 'addition': return <Plus size={20} />;
      default: return <FileText size={20} />;
    }
  };

  return (
    <div 
      className={`w-20 h-20 rounded-full border-4 cursor-pointer transition-all hover:shadow-lg flex flex-col items-center justify-center ${getNodeColor()}`}
      onClick={onClick}
    >
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-white border-2 border-gray-400" />
      
      <div className="flex flex-col items-center justify-center h-full">
        {getIcon()}
        <span className="text-xs font-bold mt-1 uppercase tracking-wider">
          {node.type === 'genesis' ? 'G' : node.type === 'correction' ? 'C' : 'A'}
        </span>
      </div>
      
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-white border-2 border-gray-400" />
    </div>
  );
};
