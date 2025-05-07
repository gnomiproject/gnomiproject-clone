
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import WebsiteImage from '@/components/common/WebsiteImage';
import InteractiveDNAExplorer from '@/components/home/InteractiveDNAExplorer';
import ArchetypesGridSection from '@/components/home/ArchetypesGridSection';
import CallToActionSection from '@/components/home/CallToActionSection';
import { migrateDataToSupabase, checkDataInSupabase } from '@/utils/migrationUtil';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [isMigrating, setIsMigrating] = React.useState(false);
  const [dataExists, setDataExists] = React.useState<boolean | null>(null);
  const isMobile = useIsMobile();

  // Check if data exists in Supabase
  React.useEffect(() => {
    const checkDatabase = async () => {
      try {
        const result = await checkDataInSupabase();
        setDataExists(result.exists);
      } catch (error) {
        console.error("Error checking database:", error);
      }
    };
    
    checkDatabase();
  }, []);
  
  const handleMigrateData = async () => {
    try {
      setIsMigrating(true);
      const success = await migrateDataToSupabase();
      if (success) {
        toast.success('Data successfully migrated to the database!');
        setDataExists(true);
        // Force reload the page to refresh the data
        window.location.reload();
      } else {
        toast.error('Failed to migrate data. Please check console for more information.');
      }
    } catch (error) {
      console.error('Migration failed:', error);
      toast.error('An error occurred during migration.');
    } finally {
      setIsMigrating(false);
    }
  };

  const scrollToArchetypes = () => {
    document.getElementById('archetype-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* Hero Section - Added pt-16 to account for fixed header height */}
      <section className="py-8 pt-20 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="flex flex-col items-start">
            {/* Gnome character positioned to the left with adjusted margin */}
            <div className="mb-2 self-center md:self-start">
              <WebsiteImage 
                type="overlook" 
                altText="Healthcare Gnome" 
                className="h-20 md:h-28"
              />
            </div>
            
            {/* Title */}
            <div className="mb-5 text-left w-full">
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="inline">What's Your Company's </span>
                <span className="inline text-blue-500">Healthcare Personality?</span>
              </h1>
            </div>

            <div className="max-w-3xl space-y-6">
              <p className="text-xl text-gray-600">
                Curious why your healthcare program differs from similar companies? Wonder which strategies would work best for your unique workforce?
              </p>
              
              <p className="text-lg text-gray-600">
                In just 3 minutes, discover which of our nine healthcare archetypes matches your organization. Based on data from 400+ companies and 7+ million members, these archetypes reveal insights that typical industry benchmarks miss.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-start pt-4">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/assessment">Find Your Archetype</Link>
              </Button>
              
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={scrollToArchetypes}
                className="text-lg px-8 bg-blue-100 text-blue-600 hover:bg-blue-200"
              >
                Explore All Archetypes
              </Button>
            </div>

            {dataExists === false && (
              <div className="mt-6">
                <p className="text-amber-600 mb-2">No archetype data found in database.</p>
                <Button 
                  variant="outline" 
                  onClick={handleMigrateData} 
                  disabled={isMigrating}
                >
                  {isMigrating ? 'Migrating Data...' : 'Migrate Data to Database'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Interactive DNA Explorer - only rendered on non-mobile devices within the component */}
      <InteractiveDNAExplorer />

      {/* Archetypes Grid */}
      <ArchetypesGridSection />

      {/* Call to Action Section */}
      <CallToActionSection />
    </>
  );
};

export default Index;
