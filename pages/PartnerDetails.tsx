
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { backend } from '../services/mockBackend';
import { useAuth } from '../App';
import { Partner } from '../types';

const PartnerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [partner, setPartner] = useState<Partner | null>(null);
  const [selectedType, setSelectedType] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Generate next 7 days for the calendar
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      full: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNum: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' })
    };
  });

  const timeSlots = [
    '07:00 AM', '08:30 AM', '10:00 AM', '11:30 AM', 
    '01:00 PM', '04:30 PM', '06:00 PM', '07:30 PM', '09:00 PM'
  ];

  useEffect(() => {
    if (id) {
      const p = backend.getPartnerById(id);
      if (p) {
        setPartner(p);
        setSelectedType(p.workoutTypes[0]);
        setSelectedDate(dates[0].full);
      }
    }
  }, [id]);

  const handleBooking = () => {
    if (!user || !partner || !selectedDate || !selectedSlot) return;
    try {
      const sessionTime = `${selectedDate} ${selectedSlot}`;
      backend.createBooking(user.id, partner.id, selectedType, sessionTime);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!partner) return <div className="p-10 text-center text-well-slate font-bold">Establishing connection to studio...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 page-transition">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        
        {/* Left Section: Studio Info */}
        <div className="lg:col-span-3 space-y-8">
          <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl">
            <img src={partner.imageUrl} alt={partner.name} className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-well-primary/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-10 left-10">
              <span className="bg-well-accent text-well-primary px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-3 inline-block">
                Premium Venue
              </span>
              <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">{partner.name}</h1>
              <p className="text-white/60 font-bold mt-2 uppercase tracking-widest text-sm">{partner.city} • Authorized Partner</p>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-well-primary/5">
            <h2 className="text-2xl font-black text-well-primary uppercase italic mb-6">About the Experience</h2>
            <p className="text-well-slate leading-relaxed font-medium">
              Join us at {partner.name} for an elite training session. Our facilities are designed for performance, featuring top-tier equipment and expert instructors for {partner.workoutTypes.join(', ')}. No memberships required—just your drive and Wellcash.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
              {['Shower', 'Lockers', 'Water', 'Parking'].map(amenity => (
                <div key={amenity} className="flex items-center gap-2 bg-well-bg px-4 py-3 rounded-2xl border border-well-primary/5">
                  <div className="w-2 h-2 rounded-full bg-well-accent"></div>
                  <span className="text-[10px] font-black text-well-primary uppercase tracking-widest">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section: Booking Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-well-primary p-8 md:p-10 rounded-[3rem] shadow-2xl text-white sticky top-24">
            <h3 className="text-2xl font-black italic uppercase mb-8">Reserve Session</h3>
            
            {error && <div className="mb-6 p-4 bg-red-500/10 text-red-400 rounded-2xl text-xs font-black border border-red-500/20 uppercase tracking-widest">{error}</div>}
            {success && <div className="mb-6 p-4 bg-well-accent/10 text-well-accent rounded-2xl text-xs font-black border border-well-accent/20 uppercase tracking-widest">Training Logged Successfully!</div>}

            <div className="space-y-8">
              {/* Workout Type */}
              <div>
                <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Select Workout</label>
                <div className="grid grid-cols-2 gap-3">
                  {partner.workoutTypes.map(type => (
                    <button 
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${selectedType === type ? 'bg-well-accent text-well-primary shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calendar Selector */}
              <div>
                <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Pick Date</label>
                <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
                  {dates.map((date) => (
                    <button
                      key={date.full}
                      onClick={() => setSelectedDate(date.full)}
                      className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center transition-all ${selectedDate === date.full ? 'bg-well-accent text-well-primary' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                    >
                      <span className="text-[8px] font-black uppercase tracking-widest mb-1">{date.dayName}</span>
                      <span className="text-xl font-black leading-none">{date.dateNum}</span>
                      <span className="text-[8px] font-black uppercase mt-1">{date.month}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slot Selector */}
              <div>
                <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Available Slots</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map(slot => (
                    <button 
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-3 py-3 rounded-xl text-[9px] font-black transition-all ${selectedSlot === slot ? 'bg-white text-well-primary shadow-xl' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-8">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-white/40 font-black text-[10px] uppercase tracking-widest">Session Cost</span>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black text-well-accent italic">{partner.pricePerSession}</span>
                    <span className="text-[10px] font-black text-white/20 uppercase pb-1">Credits</span>
                  </div>
                </div>

                {user ? (
                  <>
                    <button
                      onClick={handleBooking}
                      disabled={!selectedSlot || success}
                      className="w-full bg-well-accent text-well-primary py-5 rounded-2xl font-black text-lg shadow-2xl btn-glow transition-all disabled:opacity-30 disabled:pointer-events-none uppercase italic"
                    >
                      Confirm & Log
                    </button>
                    <p className="text-[8px] text-center text-white/20 mt-6 font-black uppercase tracking-[0.3em]">
                      Guaranteed Refund up to 4 Hours Prior
                    </p>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="block w-full bg-well-accent text-well-primary py-5 rounded-2xl font-black text-lg shadow-2xl btn-glow transition-all uppercase italic text-center"
                  >
                    Login to Book
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDetails;
