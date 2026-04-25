
import React from 'react';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { backend } from '../services/mockBackend';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const balance = user.role === UserRole.CUSTOMER ? backend.getUserBalance(user.id) : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 page-transition">
      <div className="bg-white p-10 rounded-4xl soft-shadow border border-well-accent/10">
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="w-24 h-24 bg-well-accent text-white rounded-full flex items-center justify-center mb-6 soft-shadow">
            <span className="text-4xl font-black">{user.name.charAt(0)}</span>
          </div>
          <h1 className="text-4xl font-black text-well-primary tracking-tight">{user.name}</h1>
          <p className="text-well-slate font-bold uppercase text-[10px] tracking-[0.2em] mt-3">{user.role} • {user.city}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="p-8 bg-well-bg rounded-3xl border border-well-accent/5">
            <p className="text-[10px] font-black text-well-slate uppercase mb-6 tracking-widest">Account Details</p>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] text-well-accent font-black mb-1">EMAIL</p>
                <p className="text-sm font-bold text-well-primary">{user.email}</p>
              </div>
              <div>
                <p className="text-[10px] text-well-accent font-black mb-1">CURRENT CITY</p>
                <p className="text-sm font-bold text-well-primary">{user.city}</p>
              </div>
            </div>
          </div>

          {user.role === UserRole.CUSTOMER && (
            <div className="p-8 bg-well-gold/5 rounded-3xl border border-well-gold/20">
              <p className="text-[10px] font-black text-well-gold uppercase mb-6 tracking-widest">Wallet Status</p>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] text-well-gold font-black mb-1">TOTAL WELLCASH</p>
                  <p className="text-3xl font-black text-well-primary">{balance?.total || 0}</p>
                </div>
                <div>
                  <p className="text-[10px] text-well-gold font-black mb-1">BONUS CREDITS</p>
                  <p className="text-lg font-bold text-well-primary">{balance?.bonus || 0}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {user.role === UserRole.CUSTOMER && (
            <button 
              onClick={() => navigate('/wallet')}
              className="w-full bg-well-primary text-white font-bold py-5 rounded-full shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              ADD WELLCASH
            </button>
          )}
          
          <button 
            onClick={() => { logout(); navigate('/'); }}
            className="w-full bg-white text-red-500 font-bold py-5 rounded-full transition-all border border-red-100 hover:bg-red-50"
          >
            LOG OUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
