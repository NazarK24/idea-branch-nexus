
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Check } from 'lucide-react';

interface DiffViewerProps {
  originalText: string;
  proposedText: string;
  sourceText: string;
  onMerge: () => void;
  onCancel: () => void;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  originalText,
  proposedText,
  sourceText,
  onMerge,
  onCancel,
}) => {
  const highlightChanges = (text: string, isOriginal: boolean) => {
    if (isOriginal) {
      return text.replace(sourceText, `<mark class="bg-red-200">${sourceText}</mark>`);
    } else {
      return originalText.replace(sourceText, `<mark class="bg-green-200">${proposedText}</mark>`);
    }
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Review Correction</h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X size={16} />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Original Text:</h3>
            <div 
              className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm"
              dangerouslySetInnerHTML={{ __html: highlightChanges(originalText, true) }}
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">With Proposed Changes:</h3>
            <div 
              className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm"
              dangerouslySetInnerHTML={{ __html: highlightChanges(originalText, false) }}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 flex gap-2">
          <Button onClick={onMerge} className="flex-1 bg-green-600 hover:bg-green-700">
            <Check size={16} className="mr-2" />
            Confirm Merge
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
