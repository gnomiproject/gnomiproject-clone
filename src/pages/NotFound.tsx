
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Button from '@/components/shared/Button';
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center max-w-lg">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! We couldn't find the page you're looking for</p>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Attempted to access: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{location.pathname}</span>
          </p>
          
          <div className="space-y-2">
            <Link to="/">
              <Button>
                Return to Home
              </Button>
            </Link>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="font-semibold mb-2 text-gray-700">Quick Links:</h3>
              <div className="flex flex-wrap justify-center gap-2">
                <Link to="/report/a1" className="text-blue-600 hover:underline text-sm">
                  Report a1
                </Link>
                <Link to="/report/a2" className="text-blue-600 hover:underline text-sm">
                  Report a2
                </Link>
                <Link to="/report/a3" className="text-blue-600 hover:underline text-sm">
                  Report a3
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
