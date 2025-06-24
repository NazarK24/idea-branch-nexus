import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Node as KnowledgeNode } from '@/types';
import { X, Edit, GitMerge, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BranchCreator } from './BranchCreator';
import { DiffViewer } from './DiffViewer';

interface NodeViewerProps {
  node: KnowledgeNode;
  sourceNode?: KnowledgeNode;
  allNodes: KnowledgeNode[];
  onClose: () => void;
  onCreateBranch: (sourceNodeId: string, sourceText: string, content: string, type: 'correction' | 'addition') => void;
  onMergeCorrection: (correctionNodeId: string) => void;
  onAddComment: (nodeId: string, content: string) => void;
  onNodeSelect: (nodeId: string) => void;
}

export const NodeViewer: React.FC<NodeViewerProps> = ({
  node,
  sourceNode,
  allNodes,
  onClose,
  onCreateBranch,
  onMergeCorrection,
  onAddComment,
  onNodeSelect,
}) => {
  const [selectedText, setSelectedText] = useState<string>('');
  const [showBranchCreator, setShowBranchCreator] = useState(false);
  const [branchType, setBranchType] = useState<'correction' | 'addition'>('addition');
  const [showDiffViewer, setShowDiffViewer] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
    }
  };

  const handleCreateBranch = (type: 'correction' | 'addition') => {
    setBranchType(type);
    setShowBranchCreator(true);
  };

  const handleBranchSubmit = (content: string) => {
    onCreateBranch(node.id, selectedText, content, branchType);
    setShowBranchCreator(false);
    setSelectedText('');
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      onAddComment(node.id, commentText.trim());
      setCommentText('');
    }
  };

  const renderMarkdownWithCrossRefs = (content: string) => {
    // Replace [[NodeTitle]] with clickable links
    const processedContent = content.replace(/\[\[([^\]]+)\]\]/g, (match, title) => {
      const referencedNode = allNodes.find(n => n.title === title || n.id === title);
      if (referencedNode) {
        return `[${title}](#${referencedNode.id})`;
      }
      return match;
    });

    return (
      <ReactMarkdown
        components={{
          a: ({ href, children }) => {
            if (href?.startsWith('#')) {
              const nodeId = href.slice(1);
              return (
                <button
                  className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
                  onClick={() => onNodeSelect(nodeId)}
                >
                  {children}
                </button>
              );
            }
            return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
          }
        }}
      >
        {processedContent}
      </ReactMarkdown>
    );
  };

  if (showBranchCreator) {
    return (
      <BranchCreator
        sourceText={selectedText}
        branchType={branchType}
        onSubmit={handleBranchSubmit}
        onCancel={() => {
          setShowBranchCreator(false);
          setSelectedText('');
        }}
        allNodes={allNodes}
        onNodeSelect={onNodeSelect}
      />
    );
  }

  if (showDiffViewer && node.type === 'correction' && sourceNode) {
    return (
      <DiffViewer
        originalText={sourceNode.content}
        proposedText={node.content}
        sourceText={node.sourceText || ''}
        onMerge={() => {
          onMergeCorrection(node.id);
          setShowDiffViewer(false);
        }}
        onCancel={() => setShowDiffViewer(false)}
      />
    );
  }

  return (
    <div className="w-96 bg-white border-l border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{node.title || `${node.type} Node`}</h2>
          {node.status === 'merged' && (
            <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              Merged
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>

      <div className="p-4">
        {node.sourceText && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Branched from:</p>
            <p className="text-sm italic">"{node.sourceText}"</p>
          </div>
        )}

        <div 
          className="prose prose-sm max-w-none mb-6"
          onMouseUp={handleTextSelection}
          style={{ userSelect: 'text' }}
        >
          {renderMarkdownWithCrossRefs(node.content)}
        </div>

        {selectedText && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700 mb-2">Selected: "{selectedText}"</p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleCreateBranch('correction')}
                className="text-amber-700 border-amber-300 hover:bg-amber-50"
              >
                Propose Correction
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleCreateBranch('addition')}
                className="text-blue-700 border-blue-300 hover:bg-blue-50"
              >
                Add Detail
              </Button>
            </div>
          </div>
        )}

        {node.type === 'correction' && node.status === 'active' && sourceNode && (
          <div className="mb-6">
            <Button 
              onClick={() => setShowDiffViewer(true)}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              <GitMerge size={16} className="mr-2" />
              View & Merge Correction
            </Button>
          </div>
        )}

        {/* Comments Section */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle size={16} className="text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-700">Comments</h3>
          </div>

          {node.comments && node.comments.length > 0 && (
            <div className="space-y-3 mb-4">
              {node.comments.map(comment => (
                <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">{comment.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {comment.createdAt.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 min-h-[60px]"
            />
            <Button
              onClick={handleAddComment}
              disabled={!commentText.trim()}
              size="sm"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
