
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import SectionTitle from '@/components/shared/SectionTitle';
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

  return (
    <>
      {/* Hero Section */}
      <Section className="bg-white py-24">
        <div className="container mx-auto text-center">
          <SectionTitle
            title="Unlock the DNA of Your Organization's Healthcare Strategy"
            subtitle="Discover how your approach to healthcare benefits compares to other employers and gain actionable insights to optimize your strategy."
            center
          />
          <Button size="lg" asChild>
            <Link to="/assessment">Take the Free Assessment</Link>
          </Button>
          
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
      </Section>

      {/* Interactive DNA Explorer */}
      <InteractiveDNAExplorer />

      {/* Archetypes Grid */}
      <ArchetypesGridSection />
    </>
  );
};

export default Index;
