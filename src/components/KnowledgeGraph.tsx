
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
}

const nodeTypes = {
  custom: CustomNode,
};

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({
  nodes,
  links,
  onNodeClick,
}) => {
  const flowNodes: FlowNode[] = useMemo(() => {
    return nodes.map((node, index) => ({
      id: node.id,
      type: 'custom',
      position: { 
        x: Math.cos((index * 2 * Math.PI) / Math.max(nodes.length, 1)) * 200 + 400,
        y: Math.sin((index * 2 * Math.PI) / Math.max(nodes.length, 1)) * 200 + 300
      },
      data: { 
        node,
        onClick: () => onNodeClick(node)
      },
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
    }));
  }, [nodes, onNodeClick]);

  const flowEdges: FlowEdge[] = useMemo(() => {
    return links.map(link => {
      const sourceNode = nodes.find(n => n.id === link.sourceNodeId);
      const targetNode = nodes.find(n => n.id === link.targetNodeId);
      
      return {
        id: link.id,
        source: link.sourceNodeId,
        target: link.targetNodeId,
        type: 'smoothstep',
        animated: targetNode?.status === 'active',
        style: {
          stroke: link.type === 'correction' ? '#f59e0b' : '#3b82f6',
          strokeWidth: 2,
          opacity: targetNode?.status === 'merged' ? 0.5 : 1,
        },
        label: link.type === 'correction' ? 'Correction' : 'Addition',
        labelStyle: {
          fontSize: 12,
          fontWeight: 500,
        },
      };
    });
  }, [links, nodes]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-slate-50"
      >
        <Background color="#e2e8f0" size={1} />
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
