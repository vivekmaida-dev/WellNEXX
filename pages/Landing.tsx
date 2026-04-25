
import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="bg-well-primary page-transition min-h-screen flex items-center justify-center py-20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-well-accent/20 blur-[120px] rounded-full"></div>
          <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] bg-well-accent/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <span className="inline-block bg-well-accent/10 text-well-accent text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-[0.3em] mb-8 border border-well-accent/20">
          Fitness Marketplace
        </span>
        
        <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-[0.9] mb-6">
          WELL<span className="text-well-accent">NEXX</span>
        </h1>
        <p className="text-white/40 font-bold uppercase tracking-[0.4em] text-sm mb-16">The Future of Training</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* User Entry */}
          <Link
            to="/dashboard"
            className="group relative bg-well-accent p-8 rounded-[2.5rem] text-left transition-all hover:scale-[1.02] shadow-2xl btn-glow"
          >
            <div className="mb-4 text-white/50 font-black text-xs uppercase tracking-widest">Athlete Entry</div>
            <h3 className="text-2xl font-black text-white uppercase italic leading-none mb-10">Start Your <br/>Training</h3>
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Browse Studios</span>
            </div>
          </Link>

          {/* Partner Entry */}
          <Link
            to="/partner-dashboard"
            className="group relative bg-white/5 border border-white/10 p-8 rounded-[2.5rem] text-left transition-all hover:bg-white/10 hover:scale-[1.02]"
          >
            <div className="mb-4 text-white/30 font-black text-xs uppercase tracking-widest">Business Portal</div>
            <h3 className="text-2xl font-black text-white uppercase italic leading-none mb-10">Manage Your <br/>Studio</h3>
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">View Dashboard</span>
            </div>
          </Link>
        </div>

        <div className="mt-20 pt-10 border-t border-white/5 flex flex-wrap justify-center gap-12 grayscale opacity-40">
          <div className="text-[10px] font-black text-white uppercase tracking-widest">Zero Subscriptions</div>
          <div className="text-[10px] font-black text-white uppercase tracking-widest">Pay-Per-Session</div>
          <div className="text-[10px] font-black text-white uppercase tracking-widest">Wellcash Ledger</div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
