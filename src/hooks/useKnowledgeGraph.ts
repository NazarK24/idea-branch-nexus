
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Node as KnowledgeNode, Link, Comment } from '@/types';

export const useKnowledgeGraph = () => {
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [links, setLinks] = useState<Link[]>([]);

  const createGenesisNode = useCallback((content: string, title?: string) => {
    const newNode: KnowledgeNode = {
      id: uuidv4(),
      content,
      title: title || `Genesis ${Date.now()}`,
      type: 'genesis',
      status: 'active',
      createdAt: new Date(),
      comments: [],
    };
    setNodes(prev => [...prev, newNode]);
    return newNode;
  }, []);

  const createBranchNode = useCallback((
    sourceNodeId: string,
    sourceText: string,
    content: string,
    type: 'correction' | 'addition',
    title?: string
  ) => {
    const newNode: KnowledgeNode = {
      id: uuidv4(),
      content,
      title: title || `${type} ${Date.now()}`,
      type,
      status: 'active',
      createdAt: new Date(),
      sourceText,
      sourceNodeId,
      comments: [],
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

    setNodes(prev => prev
      .map(node => {
        if (node.id === correctionNode.sourceNodeId) {
          // Replace the source text with the correction content
          const updatedContent = node.content.replace(
            correctionNode.sourceText || '',
            correctionNode.content
          );
          return { ...node, content: updatedContent };
        }
        return node;
      })
      .filter(node => node.id !== correctionNodeId) // Remove the correction node
    );

    // Remove the link associated with the correction
    setLinks(prev => prev.filter(link => link.targetNodeId !== correctionNodeId));
  }, [nodes]);

  const addComment = useCallback((nodeId: string, content: string) => {
    const newComment: Comment = {
      id: uuidv4(),
      content,
      createdAt: new Date(),
      nodeId,
    };

    setNodes(prev => prev.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          comments: [...(node.comments || []), newComment],
        };
      }
      return node;
    }));
  }, []);

  const getNodeById = useCallback((id: string) => {
    return nodes.find(n => n.id === id);
  }, [nodes]);

  const searchNodes = useCallback((query: string) => {
    return nodes.filter(node => 
      node.title?.toLowerCase().includes(query.toLowerCase()) ||
      node.content.toLowerCase().includes(query.toLowerCase())
    );
  }, [nodes]);

  return {
    nodes,
    links,
    createGenesisNode,
    createBranchNode,
    mergeCorrection,
    addComment,
    getNodeById,
    searchNodes,
  };
};
