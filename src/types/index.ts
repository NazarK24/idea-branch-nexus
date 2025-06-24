
export interface Node {
  id: string;
  content: string;
  type: 'genesis' | 'correction' | 'addition';
  status: 'active' | 'merged';
  createdAt: Date;
  sourceText?: string; // The text that was selected to create this branch
  sourceNodeId?: string; // The node this was branched from
}

export interface Link {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  type: 'correction' | 'addition';
  sourceText: string; // The exact text that was selected
  createdAt: Date;
}

export interface SelectionInfo {
  text: string;
  nodeId: string;
}
