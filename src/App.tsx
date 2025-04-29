import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import Assessment from './pages/Assessment'
import Results from './pages/Results'
import ReportView from './pages/ReportView'
import ReportViewer from './pages/ReportViewer'
import AdminDashboard from './pages/AdminDashboard'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import UpdateProfile from './pages/UpdateProfile'
import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoute'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import NotFound from './pages/NotFound'
import InsightsView from './components/insights/InsightsView'
import { ArchetypeId } from './types/archetype'
import { isValidArchetypeId } from './utils/archetypeValidation'
import { Card } from '@/components/ui/card'
import { DebugProvider } from '@/components/debug/DebugProvider';

function App() {
  const { currentUser } = useAuth()

  return (
    <DebugProvider>
      <div className="App">
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Private Routes */}
            <Route
              path="/update-profile"
              element={
                <PrivateRoute>
                  <UpdateProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/onboarding"
              element={
                <PrivateRoute>
                  <Onboarding />
                </PrivateRoute>
              }
            />
            <Route
              path="/assessment"
              element={
                <PrivateRoute>
                  <Assessment />
                </PrivateRoute>
              }
            />
            <Route
              path="/results"
              element={
                <PrivateRoute>
                  <Results />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

            {/* Report Views */}
            <Route path="/report/:archetypeId" element={<ReportView />} />
            <Route path="/report/:archetypeId/:token" element={<ReportView />} />
            <Route path="/report-viewer/:archetypeId/:token" element={<ReportViewer />} />

            {/* Insights View - requires valid archetypeId */}
            <Route
              path="/insights/:archetypeId"
              element={
                currentUser ? (
                  (params) => {
                    const { archetypeId } = params
                    if (
                      archetypeId &&
                      isValidArchetypeId(archetypeId as ArchetypeId)
                    ) {
                      return <InsightsView archetypeId={archetypeId} />
                    } else {
                      return (
                        <Card className="p-6">
                          <h2>Invalid Archetype ID</h2>
                          <p>
                            The archetype ID is invalid. Please check the URL.
                          </p>
                        </Card>
                      )
                    }
                  }
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Default Route */}
            <Route
              path="/"
              element={
                currentUser ? (
                  <Navigate to="/results" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </div>
    </DebugProvider>
  );
}

export default App;
