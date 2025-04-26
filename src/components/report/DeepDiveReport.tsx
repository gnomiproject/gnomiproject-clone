
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  Home, 
  Users, 
  Activity, 
  PieChart, 
  Heart, 
  AlertCircle, 
  Shield, 
  Lightbulb,
  Mail,
  ChevronLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

// Report section components
import ReportIntroduction from './sections/ReportIntroduction';
import ArchetypeProfile from './sections/ArchetypeProfile';
import DemographicsSection from './sections/DemographicsSection';
import CostAnalysis from './sections/CostAnalysis';
import UtilizationPatterns from './sections/UtilizationPatterns';
import DiseaseManagement from './sections/DiseaseManagement';
import CareGaps from './sections/CareGaps';
import RiskFactors from './sections/RiskFactors';
import StrategicRecommendations from './sections/StrategicRecommendations';
import ContactSection from './sections/ContactSection';

interface DeepDiveReportProps {
  reportData: any;
  userData: any;
  averageData?: any;
  loading?: boolean;
}

// Navigation sections configuration
const navigationSections = [
  { id: 'introduction', name: 'Home & Introduction', icon: Home },
  { id: 'profile', name: 'Archetype Profile', icon: PieChart },
  { id: 'demographics', name: 'Demographics', icon: Users },
  { id: 'cost', name: 'Cost Analysis', icon: Activity },
  { id: 'utilization', name: 'Utilization Patterns', icon: Activity },
  { id: 'disease', name: 'Disease Prevalence', icon: Heart },
  { id: 'care-gaps', name: 'Care Gaps', icon: AlertCircle },
  { id: 'risk', name: 'Risk & SDOH Factors', icon: Shield },
  { id: 'recommendations', name: 'Strategic Recommendations', icon: Lightbulb },
  { id: 'contact', name: 'Contact Us', icon: Mail },
];

const DeepDiveReport = ({ reportData, userData, averageData, loading }: DeepDiveReportProps) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('introduction');
  const [menuOpen, setMenuOpen] = useState(true);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Ensure userData has required fields (handle fallback data scenario)
  if (!userData) {
    userData = {
      name: 'Demo User',
      organization: 'Demo Organization',
      created_at: new Date().toISOString(),
      email: 'demo@example.com'
    };
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 p-8">
        <div className="h-12 bg-gray-200 rounded w-1/2"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Report Data Not Available</h1>
          <p className="mb-6">The requested report could not be found or has expired.</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  // Default average data if not provided
  if (!averageData) {
    averageData = {
      archetype_id: 'All_Average',
      archetype_name: 'Population Average',
      "Demo_Average Age": 40,
      "Demo_Average Family Size": 3.0,
      "Risk_Average Risk Score": 1.0,
      "Cost_Medical & RX Paid Amount PMPY": 5000
    };
  }

  // Render the content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'introduction':
        return <ReportIntroduction reportData={reportData} userData={userData} />;
      case 'profile':
        return <ArchetypeProfile reportData={reportData} averageData={averageData} />;
      case 'demographics':
        return <DemographicsSection reportData={reportData} averageData={averageData} />;
      case 'cost':
        return <CostAnalysis reportData={reportData} averageData={averageData} />;
      case 'utilization':
        return <UtilizationPatterns reportData={reportData} averageData={averageData} />;
      case 'disease':
        return <DiseaseManagement reportData={reportData} averageData={averageData} />;
      case 'care-gaps':
        return <CareGaps reportData={reportData} averageData={averageData} />;
      case 'risk':
        return <RiskFactors reportData={reportData} averageData={averageData} />;
      case 'recommendations':
        return <StrategicRecommendations reportData={reportData} averageData={averageData} />;
      case 'contact':
        return <ContactSection userData={userData} />;
      default:
        return <ReportIntroduction reportData={reportData} userData={userData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Report Header */}
      <header className="bg-white border-b p-4 print:hidden">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-blue-800">
                Deep Dive Healthcare Report
              </h1>
              <p className="text-sm text-gray-600">
                {reportData.archetype_name || reportData.archetype_id?.toUpperCase()} Archetype Analysis
              </p>
            </div>
            <div className="text-right text-sm">
              <p><span className="font-medium">For:</span> {userData.name}</p>
              <p><span className="font-medium">Organization:</span> {userData.organization}</p>
              <p><span className="font-medium">Generated:</span> {format(new Date(userData.created_at), 'MMM d, yyyy')}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation - Collapsible on mobile */}
        <div className={cn(
          "bg-white border-r transition-all duration-300 print:hidden",
          menuOpen ? "w-64" : "w-0 md:w-16"
        )}>
          <div className="flex justify-end p-2">
            <Button variant="ghost" size="sm" onClick={toggleMenu} className="md:hidden">
              {menuOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </Button>
          </div>
          <nav className="p-2 overflow-y-auto h-full">
            {navigationSections.map((section) => (
              <Button
                key={section.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left mb-1 overflow-hidden whitespace-nowrap",
                  activeSection === section.id ? "bg-blue-50 text-blue-700" : "text-gray-700",
                  section.id === 'contact' ? "mt-6" : "",
                  !menuOpen ? "px-3" : "px-4"
                )}
                onClick={() => setActiveSection(section.id)}
              >
                <section.icon className={cn("h-5 w-5 mr-2", !menuOpen && "mr-0")} />
                {menuOpen && <span>{section.name}</span>}
              </Button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 print:p-0">
          <div className="container mx-auto">
            {/* Mobile menu toggle */}
            <div className="md:hidden mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleMenu}
                className="flex items-center gap-2"
              >
                {menuOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                {!menuOpen && "Menu"}
              </Button>
            </div>
            
            {/* Content */}
            <div>
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeepDiveReport;
