
import React from 'react';
import { Link } from 'react-router-dom';
import { ArchetypeId } from '@/types/archetype';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ArchetypeOverviewCardProps {
  id: ArchetypeId;
  name: string;
  family_id: string;
  short_description?: string;
  hex_color?: string;
  key_characteristics?: string[];
}

const ArchetypeOverviewCard = ({
  id,
  name,
  family_id,
  short_description,
  hex_color,
  key_characteristics = []
}: ArchetypeOverviewCardProps) => {
  const [showDialog, setShowDialog] = React.useState(false);
  const cardStyle = hex_color ? { borderTop: `3px solid ${hex_color}` } : {};
  
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the card
    setShowDialog(true);
  };
  
  return (
    <>
      <Link to={`/archetype/${id}`} onClick={handleCardClick}>
        <Card className="h-full p-6 hover:shadow-lg transition-shadow" style={cardStyle}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold">{name}</h3>
            <span className="text-sm text-gray-500">{id}</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">family {family_id}</p>
          {short_description && (
            <p className="text-gray-700">{short_description}</p>
          )}
        </Card>
      </Link>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>{name}</span>
              <span className="text-sm text-gray-500">{id}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-3">Key Characteristics:</h4>
            <div className="space-y-2">
              {Array.isArray(key_characteristics) && key_characteristics.map((characteristic, index) => (
                <div 
                  key={index} 
                  className="p-3 bg-gray-50 rounded-md border border-gray-100"
                >
                  {characteristic}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ArchetypeOverviewCard;
