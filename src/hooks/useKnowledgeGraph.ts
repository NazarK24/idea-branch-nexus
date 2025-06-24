
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Node as KnowledgeNode, Link } from '@/types';

export const useKnowledgeGraph = () => {
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [links, setLinks] = useState<Link[]>([]);

  const createGenesisNode = useCallback((content: string) => {
    const newNode: KnowledgeNode = {
      id: uuidv4(),
      content,
      type: 'genesis',
      status: 'active',
      createdAt: new Date(),
    };
    setNodes(prev => [...prev, newNode]);
    return newNode;
  }, []);

  const createBranchNode = useCallback((
    sourceNodeId: string,
    sourceText: string,
    content: string,
    type: 'correction' | 'addition'
  ) => {
    const newNode: KnowledgeNode = {
      id: uuidv4(),
      content,
      type,
      status: 'active',
      createdAt: new Date(),
      sourceText,
      sourceNodeId,
    };

    const newLink: Link = {
      id: uuidv4(),
      sourceNodeId,
      targetNodeId: newNode.id,
      type,
      sourceText,
      createdAt: new Date(),
    };

    setNodes(prev => [...prev, newNode]);
    setLinks(prev => [...prev, newLink]);
    return newNode;
  }, []);

  const mergeCorrection = useCallback((correctionNodeId: string) => {
    const correctionNode = nodes.find(n => n.id === correctionNodeId);
    if (!correctionNode || correctionNode.type !== 'correction' || !correctionNode.sourceNodeId) {
      return;
    }

    setNodes(prev => prev.map(node => {
      if (node.id === correctionNode.sourceNodeId) {
        // Replace the source text with the correction content
        const updatedContent = node.content.replace(
          correctionNode.sourceText || '',
          correctionNode.content
        );
        return { ...node, content: updatedContent };
      }
      if (node.id === correctionNodeId) {
        return { ...node, status: 'merged' as const };
      }
      return node;
    }));
  }, [nodes]);

  const getNodeById = useCallback((id: string) => {
    return nodes.find(n => n.id === id);
  }, [nodes]);

  return {
    nodes,
    links,
    createGenesisNode,
    createBranchNode,
    mergeCorrection,
    getNodeById,
  };
};
