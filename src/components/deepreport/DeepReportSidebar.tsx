
import React from 'react';
import { 
  Home, BookOpen, LineChart, BarChart2, 
  List, PieChart, LucideIcon, BookMarked, 
  HeartHandshake, CircleArrowRight, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ArchetypeId } from '@/types/archetype';
import { getArchetypeColorHex } from '@/data/colors';

interface DeepReportSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  archetypeId: ArchetypeId;
  archetypeName: string;
}

interface NavItemProps {
  id: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ id, label, icon: Icon, isActive, onClick }) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
          isActive ? 'bg-white shadow-sm text-primary' : 'text-gray-600 hover:bg-white/50'
        }`}
      >
        <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary' : 'text-gray-500'}`} />
        <span className="font-medium">{label}</span>
      </button>
    </li>
  );
};

const DeepReportSidebar: React.FC<DeepReportSidebarProps> = ({ 
  activeSection, 
  onSectionChange,
  archetypeId,
  archetypeName
}) => {
  const navigate = useNavigate();
  const archetypeColor = getArchetypeColorHex(archetypeId);
  
  const navItems = [
    { id: 'landing', label: 'Cover', icon: Home },
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'key-findings', label: 'Key Findings', icon: LineChart },
    { id: 'detailed-metrics', label: 'Detailed Metrics', icon: BarChart2 },
    { id: 'swot', label: 'SWOT Analysis', icon: PieChart },
    { id: 'recommendations', label: 'Recommendations', icon: List },
    { id: 'methodology', label: 'Methodology', icon: BookMarked },
    { id: 'next-steps', label: 'Next Steps', icon: HeartHandshake },
  ];

  const handleBackToAdmin = () => {
    navigate('/admin');
  };

  return (
    <div className="w-72 bg-gray-100 shadow-md flex-shrink-0 hidden md:block">
      <div className="p-6 h-full flex flex-col">
        <div className="mb-6">
          <button 
            onClick={handleBackToAdmin} 
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="font-medium">Back to Admin</span>
          </button>
          
          <h1 className="text-lg font-bold" style={{ color: archetypeColor }}>
            Archetype {archetypeId.toUpperCase()}
          </h1>
          <h2 className="text-sm font-medium text-gray-600">{archetypeName}</h2>
          <div className="mt-4 h-1 w-16 rounded-full" style={{ backgroundColor: archetypeColor }}></div>
        </div>
        
        <nav className="flex-grow">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                id={item.id}
                label={item.label}
                icon={item.icon}
                isActive={activeSection === item.id}
                onClick={() => onSectionChange(item.id)}
              />
            ))}
          </ul>
        </nav>
        
        <div className="mt-auto pt-6 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-500">
            <CircleArrowRight className="h-4 w-4 mr-2 text-primary" />
            <span>gNomi Healthcare Archetypes</span>
          </div>
          <div className="mt-2 text-xs text-gray-400">v0.0.1</div>
        </div>
      </div>
    </div>
  );
};

export default DeepReportSidebar;
