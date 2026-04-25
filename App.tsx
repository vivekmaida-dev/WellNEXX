
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { User, UserRole } from './types';
import { backend } from './services/mockBackend';

// Components
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import CustomerDashboard from './pages/CustomerDashboard';
import PartnerDashboard from './pages/PartnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PartnerDetails from './pages/PartnerDetails';
import WalletStore from './pages/WalletStore';
import Profile from './pages/Profile';
import CalorieTracker from './pages/CalorieTracker';

// Context
interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string, partnerId?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('wellnexx_auth');
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password?: string, partnerId?: string) => {
    const authenticatedUser = backend.login(email, password, partnerId);
    setUser(authenticatedUser);
    localStorage.setItem('wellnexx_auth', JSON.stringify(authenticatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wellnexx_auth');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode, roles?: UserRole[] }> = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-darker flex items-center justify-center text-neon font-black">LOADING...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col bg-darker text-white font-sans overflow-x-hidden">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/signup" element={<Auth isSignup />} />
              
              {/* Authenticated Routes */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              {/* Customer Routes - browsable without login */}
              <Route path="/dashboard" element={<CustomerDashboard />} />
              <Route path="/partner/:id" element={<PartnerDetails />} />
              <Route path="/wallet" element={
                <ProtectedRoute roles={[UserRole.CUSTOMER]}>
                  <WalletStore />
                </ProtectedRoute>
              } />

              {/* Calorie Tracker */}
              <Route path="/calories" element={
                <ProtectedRoute roles={[UserRole.CUSTOMER]}>
                  <CalorieTracker />
                </ProtectedRoute>
              } />

              {/* Partner Routes */}
              <Route path="/partner-dashboard" element={<PartnerDashboard />} />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute roles={[UserRole.ADMIN]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <footer className="bg-charcoal border-t border-white/5 text-gray-600 py-16 px-4">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                <span className="text-2xl font-black text-white tracking-tighter">WELL<span className="text-neon">NEXX</span></span>
                <p className="text-xs font-bold uppercase mt-2 tracking-widest opacity-50">Fitness Freedom Marketplace</p>
              </div>
              <div className="text-center md:text-right space-y-2">
                <p className="text-xs font-medium">© 2024 Wellnexx India Private Limited. All Rights Reserved.</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Mumbai • Delhi • Bangalore • Hyderabad</p>
              </div>
            </div>
          </footer>
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
