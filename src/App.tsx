
import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom'
import ReportView from './pages/ReportView'
import ReportViewer from './pages/ReportViewer'
import { Toaster } from 'sonner'
import NotFound from './pages/NotFound'
import InsightsView from './components/insights/InsightsView'
import { ArchetypeId, FamilyId } from './types/archetype'
import { isValidArchetypeId } from './utils/archetypeValidation'
import { Card } from '@/components/ui/card'
import { DebugProvider } from '@/components/debug/DebugProvider';

function App() {
  // We'll simplify this for now to avoid references to non-existent components
  // A proper implementation would include auth checks
  const currentUser = true;

  return (
    <div className="App">
      <Router>
        <DebugProvider>
          <Routes>
            {/* Report Views */}
            <Route path="/report/:archetypeId" element={<ReportView />} />
            <Route path="/report/:archetypeId/:token" element={<ReportView />} />
            <Route path="/report-viewer/:archetypeId/:token" element={<ReportViewer />} />

            {/* Insights View - requires valid archetypeId */}
            <Route
              path="/insights/:archetypeId"
              element={
                currentUser ? (
                  <InsightsContainer />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            {/* Default Route */}
            <Route
              path="/"
              element={<ReportViewer />}
            />

            {/* Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </DebugProvider>
      </Router>
    </div>
  );
}

// Helper component for the insights route
const InsightsContainer = () => {
  // Get archetypeId from URL params
  const archetypeId = window.location.pathname.split('/').pop() as ArchetypeId;
  
  if (archetypeId && isValidArchetypeId(archetypeId)) {
    return <InsightsView archetypeId={archetypeId} reportData={{
      id: archetypeId,
      name: 'Sample Archetype',
      familyId: 'a' as FamilyId, // Correctly typed as a valid FamilyId
      familyName: 'Sample Family',
      color: '#6E59A5',
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: []
    }} />;
  } else {
    return (
      <Card className="p-6">
        <h2>Invalid Archetype ID</h2>
        <p>
          The archetype ID is invalid. Please check the URL.
        </p>
      </Card>
    );
  }
};

export default App;
