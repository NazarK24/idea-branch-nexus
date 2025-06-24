
import React, { useState } from 'react';
import { KnowledgeGraph } from '@/components/KnowledgeGraph';
import { NodeViewer } from '@/components/NodeViewer';
import { GenesisCreator } from '@/components/GenesisCreator';
import { useKnowledgeGraph } from '@/hooks/useKnowledgeGraph';
import { Node as KnowledgeNode } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, GitBranch, FileText } from 'lucide-react';

const Index = () => {
  const {
    nodes,
    links,
    createGenesisNode,
    createBranchNode,
    mergeCorrection,
    addComment,
    getNodeById,
  } = useKnowledgeGraph();

  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [showGenesisCreator, setShowGenesisCreator] = useState(false);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | undefined>();

  const handleNodeClick = (node: KnowledgeNode) => {
    setSelectedNode(node);
    setShowGenesisCreator(false);
    setHighlightedNodeId(undefined);
  };

  const handleCreateGenesis = (content: string) => {
    createGenesisNode(content);
    setShowGenesisCreator(false);
  };

  const handleCreateBranch = (
    sourceNodeId: string,
    sourceText: string,
    content: string,
    type: 'correction' | 'addition'
  ) => {
    createBranchNode(sourceNodeId, sourceText, content, type);
    setSelectedNode(null);
  };

  const handleMergeCorrection = (correctionNodeId: string) => {
    mergeCorrection(correctionNodeId);
    setSelectedNode(null);
  };

  const handleNodeSelect = (nodeId: string) => {
    const node = getNodeById(nodeId);
    if (node) {
      setHighlightedNodeId(nodeId);
      setSelectedNode(node);
    }
  };

  const getSourceNode = (node: KnowledgeNode) => {
    if (node.sourceNodeId) {
      return getNodeById(node.sourceNodeId);
    }
    return undefined;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Main Graph Area */}
      <div className="flex-1 relative">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <GitBranch className="text-purple-600" size={24} />
                <h1 className="text-2xl font-bold text-gray-900">Synapse</h1>
              </div>
              <div className="text-sm text-gray-600">
                Collaborative Knowledge Platform
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500">
                {nodes.length} {nodes.length === 1 ? 'node' : 'nodes'} • {links.length} {links.length === 1 ? 'connection' : 'connections'}
              </div>
              <Button 
                onClick={() => setShowGenesisCreator(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus size={16} className="mr-2" />
                Start New Topic
              </Button>
            </div>
          </div>
        </div>

        {/* Graph Container */}
        <div className="pt-20 h-screen">
          {nodes.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <FileText size={64} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                  Welcome to Synapse
                </h2>
                <p className="text-gray-600 mb-6">
                  Start building collaborative knowledge by creating your first topic. 
                  Others can then branch from your content with corrections and additions.
                </p>
                <Button 
                  onClick={() => setShowGenesisCreator(true)}
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus size={20} className="mr-2" />
                  Create Your First Topic
                </Button>
              </div>
            </div>
          ) : (
            <KnowledgeGraph
              nodes={nodes}
              links={links}
              onNodeClick={handleNodeClick}
              highlightedNodeId={highlightedNodeId}
            />
          )}
        </div>
      </div>

      {/* Side Panel */}
      {(selectedNode || showGenesisCreator) && (
        <div className="w-96 border-l border-gray-200">
          {showGenesisCreator ? (
            <GenesisCreator
              onSubmit={handleCreateGenesis}
              onCancel={() => setShowGenesisCreator(false)}
            />
          ) : selectedNode ? (
            <NodeViewer
              node={selectedNode}
              sourceNode={getSourceNode(selectedNode)}
              allNodes={nodes}
              onClose={() => {
                setSelectedNode(null);
                setHighlightedNodeId(undefined);
              }}
              onCreateBranch={handleCreateBranch}
              onMergeCorrection={handleMergeCorrection}
              onAddComment={addComment}
              onNodeSelect={handleNodeSelect}
            />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Index;
