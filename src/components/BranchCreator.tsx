
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, Save } from 'lucide-react';

interface BranchCreatorProps {
  sourceText: string;
  branchType: 'correction' | 'addition';
  onSubmit: (content: string) => void;
  onCancel: () => void;
}

export const BranchCreator: React.FC<BranchCreatorProps> = ({
  sourceText,
  branchType,
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
        <h2 className="text-lg font-semibold">
          {branchType === 'correction' ? 'Propose Correction' : 'Add Detail'}
        </h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X size={16} />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Selected text:</p>
          <p className="text-sm italic">"{sourceText}"</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {branchType === 'correction' 
              ? 'Your proposed correction:' 
              : 'Additional information:'
            }
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              branchType === 'correction'
                ? 'Enter the corrected text...'
                : 'Add additional details, context, or alternative viewpoint...'
            }
            className="min-h-[200px]"
            autoFocus
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSubmit} disabled={!content.trim()}>
            <Save size={16} className="mr-2" />
            Save {branchType === 'correction' ? 'Correction' : 'Addition'}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
