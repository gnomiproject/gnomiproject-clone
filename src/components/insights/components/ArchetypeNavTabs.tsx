
import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

interface ArchetypeNavTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isUnlocked: boolean;
  onUnlockRequest: () => void;
}

const ArchetypeNavTabs = ({ 
  activeTab, 
  onTabChange, 
  isUnlocked, 
  onUnlockRequest 
}: ArchetypeNavTabsProps) => {
  const tabOptions = [
    { id: 'overview', label: 'Overview', requiresUnlock: false },
    { id: 'unique-advantages', label: 'Unique Advantages', requiresUnlock: true },
    { id: 'biggest-challenges', label: 'Biggest Challenges', requiresUnlock: true },
    { id: 'best-opportunities', label: 'Best Opportunities', requiresUnlock: true },
    { id: 'potential-pitfalls', label: 'Potential Pitfalls', requiresUnlock: true }
  ];

  const handleTabClick = (tabId: string, requiresUnlock: boolean) => {
    if (requiresUnlock && !isUnlocked) {
      onUnlockRequest();
    } else {
      onTabChange(tabId);
    }
  };

  return (
    <div className="border-b border-gray-200">
      <div className="flex flex-wrap gap-1 p-4 md:p-6 pb-0">
        {tabOptions.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            onClick={() => handleTabClick(tab.id, tab.requiresUnlock)}
            className={`
              flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg
              ${activeTab === tab.id 
                ? 'bg-blue-600 text-white border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
              ${tab.requiresUnlock && !isUnlocked ? 'opacity-75' : ''}
            `}
          >
            {tab.label}
            {tab.requiresUnlock && !isUnlocked && (
              <Lock className="w-3 h-3 ml-1" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ArchetypeNavTabs;
