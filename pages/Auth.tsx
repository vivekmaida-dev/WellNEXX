
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { UserRole } from '../types';
import { backend } from '../services/mockBackend';
import { CITIES } from '../constants';

interface AuthProps {
  isSignup?: boolean;
}

const Auth: React.FC<AuthProps> = ({ isSignup }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const queryParams = new URLSearchParams(location.search);
  const isPartnerLogin = queryParams.get('type') === 'partner';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState(CITIES[0]);
  const [partnerId, setPartnerId] = useState('');
  const [error, setError] = useState('');

  const fillTestCredentials = (role: 'customer' | 'partner') => {
    setError('');
    if (role === 'customer') {
      setEmail('test.customer@wellnexx.com');
      setPassword('password');
      setPartnerId('');
      if (isPartnerLogin) navigate('/login');
    } else {
      setEmail('');
      setPassword('password');
      setPartnerId('p_test_1');
      if (!isPartnerLogin) navigate('/login?type=partner');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignup) {
        backend.signup(name, email, city, UserRole.CUSTOMER);
        await login(email, 'password');
        navigate('/dashboard');
      } else {
        const loginEmail = isPartnerLogin ? '' : email;
        const loginPartnerId = isPartnerLogin ? partnerId : undefined;
        
        await login(loginEmail, password, loginPartnerId);
        const user = backend.login(loginEmail, password, loginPartnerId);
        
        if (user.role === UserRole.CUSTOMER) navigate('/dashboard');
        else if (user.role === UserRole.PARTNER) navigate('/partner-dashboard');
        else navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 page-transition">
      <div className="max-w-md w-full bg-well-primary p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-well-accent/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
        
        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter italic">
          {isSignup ? 'Build your Body' : isPartnerLogin ? 'Partner Portal' : 'Welcome Back'}
        </h2>
        <p className="text-white/40 mb-8 font-medium text-sm uppercase tracking-widest">
          {isSignup ? 'Join the elite fitness network.' : isPartnerLogin ? 'Secure access for Studio owners.' : 'Enter your credentials to continue.'}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 text-red-400 text-xs rounded-xl border border-red-500/20 font-bold uppercase tracking-wide">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative">
          {isSignup && (
            <>
              <div>
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-well-accent outline-none transition-all placeholder:text-white/10" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 ml-1">Location</label>
                <select value={city} onChange={e => setCity(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-well-accent outline-none transition-all">
                  {CITIES.map(c => <option key={c} value={c} className="bg-well-primary">{c}</option>)}
                </select>
              </div>
            </>
          )}

          {isPartnerLogin ? (
            <div>
              <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 ml-1">Studio ID</label>
              <input required type="text" value={partnerId} onChange={e => setPartnerId(e.target.value)} placeholder="e.g. p_test_1" className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-well-accent outline-none transition-all" />
            </div>
          ) : (
            <div>
              <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 ml-1">Email</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="athlete@wellnexx.com" className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-well-accent outline-none transition-all" />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 ml-1">Password</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-well-accent outline-none transition-all" />
          </div>

          <button type="submit" className="w-full bg-well-accent text-white py-5 rounded-2xl font-black text-lg shadow-xl btn-glow transition-all transform active:scale-[0.98] mt-4 uppercase italic">
            {isSignup ? 'CREATE PROFILE' : 'SIGN IN'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs">
          {isSignup ? (
            <p className="text-white/40 font-bold uppercase tracking-widest">Active account? <Link to="/login" className="text-well-accent ml-1">Log in</Link></p>
          ) : (
            <p className="text-white/40 font-bold uppercase tracking-widest">New Recruit? <Link to="/signup" className="text-well-accent ml-1">Sign up</Link></p>
          )}
        </div>
      </div>

      {/* Test Access Section */}
      <div className="mt-10 max-w-md w-full bg-white/5 p-6 rounded-[2rem] border border-black/10">
        <p className="text-[10px] font-black text-well-primary/30 uppercase tracking-[0.3em] mb-4 text-center">Development Access</p>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => fillTestCredentials('customer')}
            className="p-4 bg-white rounded-2xl border border-black/5 hover:border-well-accent/50 transition-all text-left group shadow-sm"
          >
            <p className="text-[10px] font-black text-well-accent uppercase tracking-wider mb-1">Customer QA</p>
            <p className="text-[9px] text-well-primary/40 truncate">athlete@wellnexx.com</p>
          </button>
          <button 
            onClick={() => fillTestCredentials('partner')}
            className="p-4 bg-white rounded-2xl border border-black/5 hover:border-well-accent/50 transition-all text-left group shadow-sm"
          >
            <p className="text-[10px] font-black text-well-accent uppercase tracking-wider mb-1">Partner QA</p>
            <p className="text-[9px] text-well-primary/40 truncate">ID: p_test_1</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
