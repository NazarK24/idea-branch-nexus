
import React, { useState, useRef, useEffect } from 'react';
import { Node as KnowledgeNode } from '@/types';
import { Search } from 'lucide-react';

interface CrossReferenceProps {
  nodes: KnowledgeNode[];
  onNodeSelect: (nodeId: string) => void;
  onInsert: (text: string) => void;
  position: { x: number; y: number };
  onClose: () => void;
}

export const CrossReference: React.FC<CrossReferenceProps> = ({
  nodes,
  onNodeSelect,
  onInsert,
  position,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredNodes = nodes.filter(node =>
    node.title?.toLowerCase().includes(query.toLowerCase()) ||
    node.content.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSelect = (node: KnowledgeNode) => {
    onInsert(`[[${node.title || node.id}]]`);
    onClose();
  };

  return (
    <div
      className="absolute z-50 bg-white border border-gray-300 rounded-lg shadow-lg w-64 max-h-48 overflow-y-auto"
      style={{ left: position.x, top: position.y }}
    >
      <div className="p-2 border-b border-gray-200">
        <div className="relative">
          <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search nodes..."
            className="w-full pl-8 pr-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="max-h-32 overflow-y-auto">
        {filteredNodes.length === 0 ? (
          <div className="p-3 text-sm text-gray-500">No nodes found</div>
        ) : (
          filteredNodes.map(node => (
            <div
              key={node.id}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
              onClick={() => handleSelect(node)}
            >
              <div className="font-medium">{node.title || 'Untitled'}</div>
              <div className="text-gray-500 text-xs truncate">
                {node.content.substring(0, 50)}...
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
