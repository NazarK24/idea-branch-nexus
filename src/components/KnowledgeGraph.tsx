
import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node as FlowNode,
  Edge as FlowEdge,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Node as KnowledgeNode, Link } from '@/types';
import { CustomNode } from './CustomNode';

interface KnowledgeGraphProps {
  nodes: KnowledgeNode[];
  links: Link[];
  onNodeClick: (node: KnowledgeNode) => void;
  highlightedNodeId?: string;
}

const nodeTypes = {
  custom: CustomNode,
};

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({
  nodes,
  links,
  onNodeClick,
  highlightedNodeId,
}) => {
  const flowNodes: FlowNode[] = useMemo(() => {
    return nodes.map((node, index) => ({
      id: node.id,
      type: 'custom',
      position: { 
        x: Math.cos((index * 2 * Math.PI) / Math.max(nodes.length, 1)) * 250 + 400,
        y: Math.sin((index * 2 * Math.PI) / Math.max(nodes.length, 1)) * 250 + 300
      },
      data: { 
        node,
        onClick: () => onNodeClick(node)
      },
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
      style: highlightedNodeId === node.id ? {
        boxShadow: '0 0 20px #3b82f6',
        zIndex: 10,
      } : {},
    }));
  }, [nodes, onNodeClick, highlightedNodeId]);

  const flowEdges: FlowEdge[] = useMemo(() => {
    return links.map(link => {
      return {
        id: link.id,
        source: link.sourceNodeId,
        target: link.targetNodeId,
        type: 'smoothstep',
        animated: true,
        style: {
          stroke: link.type === 'correction' ? '#f59e0b' : '#3b82f6',
          strokeWidth: 3,
        },
        label: link.type === 'correction' ? 'Correction' : 'Addition',
        labelStyle: {
          fontSize: 12,
          fontWeight: 600,
          fill: '#374151',
          backgroundColor: 'white',
          padding: '2px 6px',
          borderRadius: '4px',
        },
      };
    });
  }, [links]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-slate-50"
        minZoom={0.1}
        maxZoom={2}
      >
        <Background color="#e2e8f0" size={2} />
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            const knowledgeNode = nodes.find(n => n.id === node.id);
            if (!knowledgeNode) return '#94a3b8';
            
            switch (knowledgeNode.type) {
              case 'genesis': return '#8b5cf6';
              case 'correction': return '#f59e0b';
              case 'addition': return '#3b82f6';
              default: return '#94a3b8';
            }
          }}
          className="bg-white border border-slate-200"
        />
      </ReactFlow>
    </div>
  );
};
