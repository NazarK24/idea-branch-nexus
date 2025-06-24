
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { X, Save, FileText } from 'lucide-react';

interface GenesisCreatorProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
}

export const GenesisCreator: React.FC<GenesisCreatorProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content.trim());
    }
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={20} className="text-purple-600" />
          <h2 className="text-lg font-semibold">Start New Topic</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X size={16} />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content (Markdown supported):
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="# Your Topic Title

Write your initial content here. You can use Markdown formatting.

This will be the genesis node that others can branch from with corrections and additions."
            className="min-h-[300px] font-mono text-sm"
            autoFocus
          />
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <p className="mb-1"><strong>Tip:</strong> This creates the starting point for collaborative knowledge building.</p>
          <p>Others will be able to select any text and propose corrections or add additional details.</p>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleSubmit} 
            disabled={!content.trim()}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            <Save size={16} className="mr-2" />
            Create Genesis Node
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
