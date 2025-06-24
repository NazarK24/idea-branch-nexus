
export interface Node {
  id: string;
  content: string;
  title?: string; // For easier referencing
  type: 'genesis' | 'correction' | 'addition';
  status: 'active' | 'merged';
  createdAt: Date;
  sourceText?: string; // The text that was selected to create this branch
  sourceNodeId?: string; // The node this was branched from
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  nodeId: string;
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

export interface CrossReference {
  nodeId: string;
  title: string;
}
