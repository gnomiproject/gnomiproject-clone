
import React from 'react';
import { ArchetypeId } from '@/types/archetype';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ArchetypeDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  archetypeDetail: {
    id: ArchetypeId;
    familyId: 'a' | 'b' | 'c';
    name: string;
    familyName: string;
    color?: string;
    hexColor?: string;
    keyFindings?: string[];
    fullDescription?: string;
  } | null;
}

const ArchetypeDetailDialog: React.FC<ArchetypeDetailDialogProps> = ({
  open,
  onOpenChange,
  archetypeDetail
}) => {
  if (!archetypeDetail) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap gap-2 mb-2">
            <div className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-family-${archetypeDetail.familyId}/20 text-family-${archetypeDetail.familyId}`}>
              Family {archetypeDetail.familyId}: {archetypeDetail.familyName}
            </div>
            <div className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-archetype-${archetypeDetail.id}/20 text-archetype-${archetypeDetail.id}`}>
              {archetypeDetail.id}
            </div>
          </div>
          
          <DialogTitle className={`text-2xl font-bold text-archetype-${archetypeDetail.id}`}>
            {archetypeDetail.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-6 space-y-8">
          {/* Full Description */}
          {archetypeDetail.fullDescription && (
            <div>
              <p className="text-gray-700 text-lg leading-relaxed">{archetypeDetail.fullDescription}</p>
            </div>
          )}
          
          {/* Key Findings Section */}
          {archetypeDetail.keyFindings && archetypeDetail.keyFindings.length > 0 && (
            <div>
              <h3 className={`font-bold text-xl mb-5 text-archetype-${archetypeDetail.id}`}>Key Findings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {archetypeDetail.keyFindings.map((finding, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start gap-3 p-4 rounded-md bg-archetype-${archetypeDetail.id}/5 border-l-3 border-archetype-${archetypeDetail.id} text-left`}
                  >
                    <div className={`h-2.5 w-2.5 mt-1.5 rounded-full bg-archetype-${archetypeDetail.id} flex-shrink-0`}></div>
                    <span className="text-gray-700">{finding}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArchetypeDetailDialog;
