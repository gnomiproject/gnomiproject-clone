
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import InteractiveDNAExplorer from '@/components/home/InteractiveDNAExplorer';
import ArchetypesGridSection from '@/components/home/ArchetypesGridSection';
import { Section } from '@/components/shared/Section';
import { migrateDataToSupabase, checkDataInSupabase } from '@/utils/migrationUtil';
import { toast } from 'sonner';

const Index = () => {
  const [isMigrating, setIsMigrating] = React.useState(false);
  const [dataExists, setDataExists] = React.useState<boolean | null>(null);

  // Check if data exists in Supabase
  React.useEffect(() => {
    const checkDatabase = async () => {
      const result = await checkDataInSupabase();
      setDataExists(result.exists);
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
      {/* Hero Section */}
      <Section className="bg-gradient-to-b from-blue-50 to-white min-h-[90vh] flex items-center">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center space-y-8">
            <img 
              src="/lovable-uploads/12da516f-6471-47a3-9861-9c4d50ab9415.png" 
              alt="Healthcare Gnome" 
              className="w-32 h-32 mx-auto md:mx-0 md:ml-[80px] mb-5 object-contain self-start"
            />
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              What's Your Company's{' '}
              <span className="text-blue-500">Healthcare Personality?</span>
            </h1>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-xl text-gray-600">
                Curious why your healthcare program differs from similar companies? Wonder which strategies would work best for your unique workforce?
              </p>
              
              <p className="text-lg text-gray-600">
                In just 3 minutes, discover which of our nine healthcare archetypes matches your organization. Based on data from 400+ companies and 7+ million members, these archetypes reveal insights that typical industry benchmarks miss.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
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
      </Section>

      {/* Interactive DNA Explorer */}
      <InteractiveDNAExplorer />

      {/* Archetypes Grid */}
      <ArchetypesGridSection />
    </>
  );
};

export default Index;
