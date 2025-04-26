
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useArchetypes } from '@/hooks/useArchetypes';
import { ArchetypeId } from '@/types/archetype';
import { AssessmentResult } from '@/types/assessment';
import MatchFeedbackMenu from '@/components/insights/MatchFeedbackMenu';
import NoAssessmentResults from '@/components/insights/NoAssessmentResults';
import AssessmentResultsCard from '@/components/insights/AssessmentResultsCard';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

// Storage keys
const INSIGHTS_STORAGE_KEY = 'healthcareArchetypeInsights';
const SESSION_RESULTS_KEY = 'healthcareArchetypeSessionResults';

const Insights = () => {
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeId | null>(null);
  const [sessionResults, setSessionResults] = useState<AssessmentResult | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [hasFeedbackBeenClosed, setHasFeedbackBeenClosed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Use consistent hook calls - important for React's hook rules
  const { getArchetypeDetailedById, getFamilyById } = useArchetypes();
  
  useEffect(() => {
    // Check sources for archetype in this priority order:
    // 1. Location state (direct navigation from Results)
    // 2. Session storage (user has taken assessment this session)
    // 3. Local storage (persisted preference)
    
    let newArchetype: ArchetypeId | null = null;
    
    if (location.state?.selectedArchetype) {
      // Source 1: Direct navigation from Results
      newArchetype = location.state.selectedArchetype;
      
      // Store in localStorage to persist across refreshes
      localStorage.setItem(INSIGHTS_STORAGE_KEY, newArchetype);
      
      // Clear the location state to avoid persisting the selection on refresh
      window.history.replaceState({}, document.title);
    } else {
      // Source 2: Check sessionStorage for results from current session
      const sessionResultsStr = sessionStorage.getItem(SESSION_RESULTS_KEY);
      if (sessionResultsStr) {
        try {
          const parsedResults = JSON.parse(sessionResultsStr) as AssessmentResult;
          setSessionResults(parsedResults);
          newArchetype = parsedResults.primaryArchetype;
        } catch (error) {
          console.error('Error parsing session results:', error);
        }
      } else {
        // Source 3: Try to retrieve from localStorage if no state is present
        const storedArchetype = localStorage.getItem(INSIGHTS_STORAGE_KEY);
        if (storedArchetype) {
          newArchetype = storedArchetype as ArchetypeId;
        }
      }
    }
    
    // Only update selectedArchetype if it's different to avoid re-rendering
    if (newArchetype && newArchetype !== selectedArchetype) {
      setSelectedArchetype(newArchetype);
      
      // Pre-fetch the archetype data to fill the cache
      queryClient.prefetchQuery({
        queryKey: ['archetype', newArchetype],
        staleTime: 5 * 60 * 1000 // 5 minutes
      });
    }
  }, [location.state, queryClient, selectedArchetype]);

  // Add scroll event listener to show feedback menu when scrolling
  // with throttling to avoid too many events
  useEffect(() => {
    let scrollTimeout: number | null = null;
    
    const handleScroll = () => {
      if (scrollTimeout !== null) {
        return;
      }
      
      scrollTimeout = window.setTimeout(() => {
        if (!hasFeedbackBeenClosed && window.scrollY > 100) {
          setShowFeedback(true);
        }
        scrollTimeout = null;
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout !== null) {
        window.clearTimeout(scrollTimeout);
      }
    };
  }, [hasFeedbackBeenClosed]);

  // Handle retaking the assessment
  const handleRetakeAssessment = () => {
    // Navigate to assessment without clearing localStorage or sessionStorage
    // This allows the user to come back to insights with their previous results
    navigate('/assessment');
  };

  // Handle closing the feedback menu with error handling
  const handleCloseFeedback = () => {
    try {
      setShowFeedback(false);
      setHasFeedbackBeenClosed(true);
    } catch (error) {
      console.error('Error closing feedback menu:', error);
      toast.error('There was an issue closing the feedback menu');
    }
  };

  // Get the archetype data if one is selected - using consistent hook usage pattern
  const archetypeData = selectedArchetype ? getArchetypeDetailedById(selectedArchetype) : null;
  const familyData = archetypeData?.familyId ? getFamilyById(archetypeData.familyId) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12 pb-24 relative">
      <div className="max-w-5xl mx-auto">
        {/* Show assessment results if an archetype is selected */}
        {selectedArchetype && archetypeData ? (
          <AssessmentResultsCard
            archetypeData={archetypeData}
            familyData={familyData}
            selectedArchetype={selectedArchetype}
            onRetakeAssessment={handleRetakeAssessment}
          />
        ) : (
          <NoAssessmentResults />
        )}
      </div>

      {/* Feedback menu in bottom right corner - only show if archetype is selected and user has scrolled */}
      {selectedArchetype && archetypeData && showFeedback && (
        <div className="fixed bottom-6 right-6 z-10 animate-slide-in-from-bottom">
          <MatchFeedbackMenu 
            archetypeId={selectedArchetype} 
            onClose={handleCloseFeedback}
          />
        </div>
      )}
    </div>
  );
};

export default Insights;
