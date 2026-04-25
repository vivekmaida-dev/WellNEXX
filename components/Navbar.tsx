
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { UserRole } from '../types';
import { backend } from '../services/mockBackend';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const balance = user?.role === UserRole.CUSTOMER ? backend.getUserBalance(user.id) : null;

  const isLanding = location.pathname === '/';
  const isDashboard = ['/dashboard', '/partner-dashboard', '/admin', '/calories'].includes(location.pathname);
  const isAuth = location.pathname === '/login' || location.pathname === '/signup';
  
  const showBack = !isLanding && !isDashboard;
  const showWallet = user && user.role === UserRole.CUSTOMER && !isAuth;

  const getHomeDashboard = () => {
    if (!user) return '/';
    switch (user.role) {
      case UserRole.CUSTOMER: return '/dashboard';
      case UserRole.PARTNER: return '/partner-dashboard';
      case UserRole.ADMIN: return '/admin';
      default: return '/';
    }
  };

  const handleBack = () => {
    if (isAuth) {
      navigate('/');
    } else if (location.pathname.startsWith('/partner/')) {
      navigate('/dashboard');
    } else if (location.pathname === '/wallet' || location.pathname === '/profile' || location.pathname === '/calories') {
      navigate(getHomeDashboard());
    } else {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/');
      }
    }
  };

  return (
    <nav className="bg-well-primary border-b border-white/10 sticky top-0 z-50 h-16 md:h-20 flex items-center px-4 md:px-8 shadow-xl">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        
        <div className="flex items-center gap-4">
          {showBack && (
            <button 
              onClick={handleBack}
              className="p-2 hover:bg-white/10 rounded-full transition-colors group flex items-center justify-center"
              aria-label="Go Back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-well-accent group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <Link to={getHomeDashboard()} className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase italic">
            Well<span className="text-well-accent">nexx</span>
          </Link>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          {user?.role === UserRole.CUSTOMER && !isAuth && (
            <Link
              to="/calories"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm font-black uppercase tracking-wider ${location.pathname === '/calories' ? 'bg-well-accent text-white border-well-accent' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'}`}
            >
              🔥 Calories
            </Link>
          )}
          {showWallet && (
            <Link 
              to="/wallet" 
              className="flex items-center gap-2 bg-well-accent/10 border border-well-accent/20 px-4 py-2 rounded-xl hover:bg-well-accent/20 transition-all"
            >
              <div className="w-5 h-5 bg-well-accent rounded-full flex items-center justify-center">
                <span className="text-[10px] font-black text-white">W</span>
              </div>
              <span className="font-bold text-well-accent text-sm tracking-tight">{balance?.total || 0}</span>
            </Link>
          )}

          {user ? (
            <Link 
              to="/profile" 
              className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all border border-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </Link>
          ) : !isAuth && (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-bold text-white/60 hover:text-white">Login</Link>
              <Link to="/signup" className="bg-well-accent text-white px-6 py-2.5 rounded-xl text-sm font-black btn-glow transition-all uppercase">JOIN</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
