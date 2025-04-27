
  const checkDatabaseConnection = async () => {
    try {
      setConnectionStatus('checking');
      setTimeoutWarning(false);
      setError(null);
      console.log("Testing database connection to Supabase...");
      
      // Set a timeout to prevent hanging connections
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timed out after 15 seconds')), 15000);
      });
      
      // Try a simple query with a fast timeout
      const queryPromise = supabase
        .from('Core_Archetype_Overview')
        .select('count(*)', { count: 'exact', head: true });
      
      // Race the query against the timeout
      const { data, error: connError } = await Promise.race([
        queryPromise,
        timeoutPromise.then(() => { throw new Error('Connection timed out'); })
      ]) as any;
      
      if (connError) {
        console.error("Database connection error:", connError);
        setConnectionStatus('error');
        setError(`Database connection error: ${connError.message}`);
        toast.error("Database Connection Failed", {
          description: connError.message,
        });
        return false;
      }
      
      console.log("Database connection successful, count result:", data);
      setConnectionStatus('connected');
      toast.success("Database Connection Successful");
      
      // Load archetypes if we're connected
      await refetchArchetypes()
        .then(result => {
          // After fetching, process the data
          if (result.data) {
            const formattedArchetypes: ArchetypeListItem[] = result.data.map(item => ({
              id: item.archetype_id,
              name: item.archetype_name || '',
              familyId: item.family_id || '',
              description: item.short_description || '',
              status: 'idle' as const,
              lastUpdated: null,
              hasReport: false // Add the missing property
            }));
            setArchetypes(formattedArchetypes);
          }
        });
      return true;
    } catch (err) {
      console.error("Error testing database:", err);
      setConnectionStatus('error');
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Connection error: ${errorMessage}`);
      toast.error("Connection Error", {
        description: errorMessage,
      });
      return false;
    }
  };
