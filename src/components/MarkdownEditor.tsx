
import React, { useState, useRef, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Node as KnowledgeNode } from '@/types';
import { CrossReference } from './CrossReference';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  nodes: KnowledgeNode[];
  onNodeSelect: (nodeId: string) => void;
  placeholder?: string;
  className?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  nodes,
  onNodeSelect,
  placeholder,
  className,
}) => {
  const [showCrossRef, setShowCrossRef] = useState(false);
  const [crossRefPosition, setCrossRefPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === '[' && e.shiftKey) {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const { selectionStart } = textarea;
      const textBefore = value.substring(selectionStart - 1, selectionStart);
      
      if (textBefore === '[') {
        e.preventDefault();
        
        // Calculate position for dropdown
        const rect = textarea.getBoundingClientRect();
        const textBeforeCursor = value.substring(0, selectionStart);
        const lines = textBeforeCursor.split('\n');
        const currentLine = lines.length;
        const currentCol = lines[lines.length - 1].length;
        
        setCrossRefPosition({
          x: rect.left + currentCol * 8, // Approximate character width
          y: rect.top + currentLine * 20, // Approximate line height
        });
        setCursorPosition(selectionStart + 1);
        setShowCrossRef(true);
      }
    }
  }, [value]);

  const handleInsert = useCallback((text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const before = value.substring(0, cursorPosition - 2); // Remove the [[
    const after = value.substring(cursorPosition);
    const newValue = before + text + after;
    
    onChange(newValue);
    setShowCrossRef(false);
    
    // Focus back on textarea
    setTimeout(() => {
      textarea.focus();
      const newPosition = before.length + text.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  }, [value, cursorPosition, onChange]);

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
      />
      
      {showCrossRef && (
        <CrossReference
          nodes={nodes}
          onNodeSelect={onNodeSelect}
          onInsert={handleInsert}
          position={crossRefPosition}
          onClose={() => setShowCrossRef(false)}
        />
      )}
    </div>
  );
};
