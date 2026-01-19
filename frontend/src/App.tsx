import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'jotai';
import './App.css';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import Quiz from './pages/Quiz';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

/**
 * Theme initializer component that applies theme to document
 */
const ThemeInitializer = ({ children }: { children: React.ReactNode }) => {
  useTheme(); // This hook applies theme classes to document
  return <>{children}</>;
};

/**
 * Auth initialization component that handles session restoration
 */
const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useAuth();

  // Show loading spinner while session is being restored
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

function App() {
  return (
    <Provider>
      <ThemeInitializer>
        <Router>
          <AuthInitializer>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/signup" element={<Signup />} />
              <Route path="/auth/verify" element={<VerifyEmail />} />
              <Route path="/dashboard" element={
                <ProtectedRoute requireEmailVerification={false}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/quiz/:id" element={
                <ProtectedRoute requireEmailVerification={false}>
                  <Quiz />
                </ProtectedRoute>
              } />
            </Routes>
          </AuthInitializer>
        </Router>
      </ThemeInitializer>
    </Provider>
  );
}

export default App;
