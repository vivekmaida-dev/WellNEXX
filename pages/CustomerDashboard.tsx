
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { backend } from '../services/mockBackend';
import { useAuth } from '../App';
import { Partner, Booking, BookingStatus } from '../types';
import { CITIES, WORKOUT_TYPES } from '../constants';

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterCity, setFilterCity] = useState(user?.city || 'All');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    setPartners(backend.getAllPartners());
    if (user) {
      setBookings(backend.getUserBookings(user.id));
    }
  }, [user]);

  const filteredPartners = partners.filter(p => 
    (filterCity === 'All' || p.city === filterCity) &&
    (filterType === 'All' || p.workoutTypes.includes(filterType))
  );

  const getStatusColor = (status: BookingStatus) => {
    switch(status) {
      case BookingStatus.PENDING: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case BookingStatus.ATTENDED: return 'bg-well-accent/10 text-well-accent border-well-accent/20';
      case BookingStatus.CANCELLED: return 'bg-white/5 text-white/30 border-white/10';
      case BookingStatus.NO_SHOW: return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 page-transition">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-well-primary p-6 rounded-[2rem] border border-white/10 shadow-lg">
            <h3 className="font-black text-white text-lg mb-6 uppercase tracking-tighter italic">Filters</h3>
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 block">City</label>
                <select value={filterCity} onChange={e => setFilterCity(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:border-well-accent outline-none transition-all">
                  <option value="All" className="bg-well-primary">All Cities</option>
                  {CITIES.map(c => <option key={c} value={c} className="bg-well-primary">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 block">Workout</label>
                <select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:border-well-accent outline-none transition-all">
                  <option value="All" className="bg-well-primary">All Types</option>
                  {WORKOUT_TYPES.map(t => <option key={t} value={t} className="bg-well-primary">{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-well-primary p-6 rounded-[2rem] border border-white/10 shadow-lg">
            <h3 className="font-black text-white text-lg mb-6 uppercase tracking-tighter italic">Recent Logs</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto hide-scrollbar">
              {bookings.length === 0 && <p className="text-xs text-white/20 italic py-4">No recent training logs found.</p>}
              {bookings.map(b => (
                <div key={b.id} className="p-4 bg-white/5 rounded-2xl border border-transparent group hover:border-well-accent/30 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-well-accent uppercase tracking-widest truncate max-w-[100px]">
                      {partners.find(p => p.id === b.partnerId)?.name}
                    </span>
                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase border ${getStatusColor(b.status)}`}>{b.status}</span>
                  </div>
                  <p className="text-sm font-bold text-white leading-tight">{b.workoutType}</p>
                  <p className="text-[10px] text-white/30 mt-1 font-medium">{new Date(b.sessionTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <h2 className="text-5xl font-black text-well-primary tracking-tighter uppercase italic leading-[0.85]">
              Elite <br/><span className="text-well-accent">Boutiques.</span>
            </h2>
            <div className="text-[10px] font-black text-well-accent uppercase tracking-[0.3em] bg-well-primary px-6 py-2.5 rounded-full shadow-xl">
              {filteredPartners.length} Active Venues
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredPartners.map(partner => (
              <Link key={partner.id} to={`/partner/${partner.id}`} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className="h-64 overflow-hidden relative">
                  <img src={partner.imageUrl} alt={partner.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 brightness-90 group-hover:brightness-100" />
                  <div className="absolute top-5 right-5 bg-well-primary/80 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black text-well-accent shadow-2xl uppercase tracking-widest">
                    {partner.city}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-5">
                    <h4 className="font-black text-2xl text-well-primary leading-none uppercase italic tracking-tighter">{partner.name}</h4>
                    <div className="flex flex-col items-end">
                      <span className="text-well-accent font-black text-3xl tracking-tighter">{partner.pricePerSession}</span>
                      <span className="text-[10px] text-well-primary font-black uppercase tracking-widest opacity-30">Credits</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {partner.workoutTypes.map(type => (
                      <span key={type} className="text-[9px] font-black px-4 py-1.5 bg-well-bg text-well-slate rounded-full uppercase tracking-tighter border border-well-primary/5">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
