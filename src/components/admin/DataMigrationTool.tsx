
import React, { useState, useEffect } from 'react';
import { migrateDataToSupabase, checkDataInSupabase } from '@/utils/migrationUtil';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

const DataMigrationTool = () => {
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'checking' | 'migrating' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [dataExists, setDataExists] = useState<boolean>(false);
  const [archCount, setArchCount] = useState<number>(0);
  const [errorDetails, setErrorDetails] = useState<string>('');

  useEffect(() => {
    checkData();
  }, []);

  const checkData = async () => {
    setMigrationStatus('checking');
    setErrorDetails('');
    try {
      // Check if data exists in Supabase
      const { exists, count } = await checkDataInSupabase();
      setDataExists(exists);
      setArchCount(count || 0);
      
      if (exists) {
        setMessage(`Database already contains ${count} archetypes. You can force a migration to update or override the data.`);
      } else {
        setMessage('No archetype data found in database. Click "Migrate Data" to populate the database.');
      }
      setMigrationStatus('idle');
    } catch (error) {
      console.error('Error checking data:', error);
      setMessage('Failed to check data. There might be a connection issue or the required tables might not exist.');
      setErrorDetails(error instanceof Error ? error.message : String(error));
      setMigrationStatus('error');
    }
  };

  const handleMigration = async () => {
    setMigrationStatus('migrating');
    setMessage('Migrating data to Supabase...');
    setErrorDetails('');
    
    try {
      const success = await migrateDataToSupabase();
      
      if (success) {
        setMessage('Data migration completed successfully! The database now contains all the archetype data.');
        setMigrationStatus('success');
        toast({
          title: "Migration Successful",
          description: "Data has been successfully migrated to your Supabase database.",
        });
        checkData(); // Refresh the data status
      } else {
        setMessage('Data migration failed. Check the console for detailed error messages.');
        setMigrationStatus('error');
        toast({
          title: "Migration Failed",
          description: "There was an error during migration. Check the console for details.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Migration error:', error);
      setMessage(`Migration error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setErrorDetails(error instanceof Error ? error.stack || error.message : String(error));
      setMigrationStatus('error');
      toast({
        title: "Migration Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto my-10">
      <h2 className="text-2xl font-bold mb-4">Archetype Data Migration Tool</h2>
      
      <div className={`p-4 mb-6 rounded-lg ${
        migrationStatus === 'error' ? 'bg-red-50 text-red-800' :
        migrationStatus === 'success' ? 'bg-green-50 text-green-800' :
        'bg-blue-50 text-blue-800'
      }`}>
        <p>{message}</p>
        {errorDetails && (
          <div className="mt-2 p-3 bg-red-100 rounded text-red-900 text-sm font-mono overflow-auto">
            <p className="font-semibold mb-1">Error Details:</p>
            <p className="whitespace-pre-wrap">{errorDetails}</p>
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="font-medium mb-2">Database Status:</h3>
          <p className="text-gray-600">
            {dataExists
              ? `✅ Database contains ${archCount} archetypes`
              : '❌ No archetype data found in the database'}
          </p>
        </div>
        
        <div className="flex gap-4 mt-4">
          <button
            onClick={checkData}
            disabled={migrationStatus === 'checking' || migrationStatus === 'migrating'}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            {migrationStatus === 'checking' ? 'Checking...' : 'Check Database'}
          </button>
          
          <button
            onClick={handleMigration}
            disabled={migrationStatus === 'migrating'}
            className={`px-4 py-2 rounded text-white ${
              dataExists 
                ? 'bg-amber-500 hover:bg-amber-600'
                : 'bg-blue-500 hover:bg-blue-600'
            } disabled:opacity-50`}
          >
            {migrationStatus === 'migrating' 
              ? 'Migrating...' 
              : dataExists 
                ? 'Force Update Data' 
                : 'Migrate Data'}
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-sm text-gray-500">
        <h3 className="font-medium mb-2">About this tool:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>This tool helps you migrate the client-side archetype data to your Supabase database.</li>
          <li>Make sure you have created all the necessary tables in your Supabase database before running the migration.</li>
          <li>The migration will upsert data (insert if not exists, update if exists) based on ID.</li>
          <li>After successful migration, your application will use the database data instead of the client-side data files.</li>
          <li><strong>Important:</strong> If you're seeing RLS policy errors, you might need to disable Row Level Security on your tables in Supabase or create appropriate policies.</li>
        </ul>
      </div>
    </div>
  );
};

export default DataMigrationTool;
