
import { useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";
import Button from '@/components/shared/Button';
import { Link } from "react-router-dom";

/**
 * Enhanced NotFound component with improved report URL handling
 * - Better detection of malformed report URLs
 * - More helpful suggestions for fixing report access issues
 * - Debug information for troubleshooting
 */
const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Analyze the URL pattern to provide better guidance
  const urlAnalysis = useMemo(() => {
    const path = location.pathname;
    
    // Check if this is likely a report URL
    const isReportPath = path.includes('/report/');
    
    // Extract archetype ID if available
    let archetypeId = null;
    let token = null;
    let suggestion = null;
    
    if (isReportPath) {
      const parts = path.split('/');
      if (parts.length >= 3) {
        archetypeId = parts[2];
      }
      if (parts.length >= 4) {
        token = parts[3];
      }
      
      // Check common report URL issues
      if (archetypeId && !token) {
        suggestion = "You may need an access token to view this report.";
      } else if (token === 'undefined' || token === 'null') {
        suggestion = "Your access token is invalid. Make sure you have the correct URL.";
      } else if (archetypeId === 'undefined' || archetypeId === 'null') {
        suggestion = "The report identifier is missing or invalid.";
      }
    }
    
    return {
      isReportPath,
      archetypeId,
      token: token ? `${token.substring(0, 5)}...` : null,
      suggestion,
      correctReportFormat: '/report/[archetypeId]/[token]',
      adminViewFormat: '/report/[archetypeId]/admin-view'
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center max-w-lg">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">We couldn't find the page you're looking for</p>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Attempted to access: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{location.pathname}</span>
          </p>
          
          {urlAnalysis.isReportPath && (
            <div className="mt-4 py-3 px-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                It looks like you were trying to access a report. Here's what might be wrong:
              </p>
              
              <div className="mt-2 text-sm text-yellow-700">
                {urlAnalysis.suggestion && (
                  <p className="font-medium">{urlAnalysis.suggestion}</p>
                )}
                
                <p className="mt-1">Proper report URL format: 
                  <code className="ml-1 font-mono bg-yellow-100 px-1 py-0.5 rounded">
                    {urlAnalysis.correctReportFormat}
                  </code>
                </p>
                
                {urlAnalysis.archetypeId && (
                  <div className="mt-3 space-y-1">
                    <p>You can try accessing this report as an admin:</p>
                    <Link to={`/report/${urlAnalysis.archetypeId}/admin-view`} className="inline-block text-blue-600 hover:underline font-medium">
                      View with admin access
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Link to="/">
              <Button>
                Return to Home
              </Button>
            </Link>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="font-semibold mb-2 text-gray-700">Quick Links:</h3>
              <div className="flex flex-wrap justify-center gap-2">
                <Link to="/report/a1/admin-view" className="text-blue-600 hover:underline text-sm">
                  Report a1 (Admin View)
                </Link>
                <Link to="/report/a2/admin-view" className="text-blue-600 hover:underline text-sm">
                  Report a2 (Admin View)
                </Link>
                <Link to="/report/a3/admin-view" className="text-blue-600 hover:underline text-sm">
                  Report a3 (Admin View)
                </Link>
                <Link to="/insights" className="text-blue-600 hover:underline text-sm">
                  Insights
                </Link>
                <Link to="/assessment" className="text-blue-600 hover:underline text-sm">
                  Assessment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
