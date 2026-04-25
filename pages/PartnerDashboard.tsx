
import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { backend } from '../services/mockBackend';
import { Partner, Booking, BookingStatus } from '../types';

const PartnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [typeFilter, setTypeFilter] = useState('All');

  // Generate next 14 days for the calendar ribbon
  const calendarDates = Array.from({ length: 14 }, (_, i) => {
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
    const p = user
      ? backend.getPartnerByOwnerId(user.id)
      : backend.getPartnerById('p_test_1');
    if (p) {
      setPartner(p);
      setBookings(backend.getPartnerBookings(p.id));
    }
  }, [user]);

  const handleAttendance = (id: string, status: BookingStatus) => {
    backend.updateBookingStatus(id, status);
    if (partner) {
      setBookings(backend.getPartnerBookings(partner.id));
      const updatedPartner = backend.getPartnerById(partner.id);
      if (updatedPartner) setPartner(updatedPartner);
    }
  };

  // Filter bookings for the selected date and workout type
  const activeBookings = bookings.filter(b => {
    const isSameDate = b.sessionTime.startsWith(selectedDate);
    const isSameType = typeFilter === 'All' || b.workoutType === typeFilter;
    return isSameDate && isSameType;
  });

  if (!partner) return <div className="p-10 text-center text-well-slate font-bold uppercase tracking-widest">Loading studio...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 page-transition">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <span className="bg-well-accent/10 text-well-accent text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-[0.2em] mb-3 inline-block border border-well-accent/20">
            Operations Portal
          </span>
          <h1 className="text-5xl font-black text-well-primary italic uppercase tracking-tighter leading-none">{partner.name}</h1>
          <p className="text-well-slate font-bold mt-2 uppercase tracking-widest text-sm">{partner.city} • Dashboard</p>
        </div>
        
        <div className="bg-well-primary p-8 rounded-[2.5rem] shadow-2xl text-white flex gap-10 min-w-[300px] border border-white/5">
          <div>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Lifetime Payout</p>
            <p className="text-3xl font-black text-well-accent">₹{partner.payoutBalance}</p>
          </div>
          <div className="w-px h-full bg-white/10"></div>
          <div>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Active Slots</p>
            <p className="text-3xl font-black text-white">{timeSlots.length}</p>
          </div>
        </div>
      </div>

      {/* Control Bar: Date Ribbon & Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        <div className="lg:col-span-7 bg-well-primary p-6 rounded-[2.5rem] shadow-xl overflow-hidden border border-white/5">
          <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-4 ml-2">Session Schedule (Next 14 Days)</label>
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar px-2">
            {calendarDates.map((date) => (
              <button
                key={date.full}
                onClick={() => setSelectedDate(date.full)}
                className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center transition-all ${selectedDate === date.full ? 'bg-well-accent text-well-primary shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-105' : 'bg-white/5 text-white/40 hover:bg-white/10 border border-white/5'}`}
              >
                <span className="text-[8px] font-black uppercase tracking-widest mb-1">{date.dayName}</span>
                <span className="text-xl font-black leading-none">{date.dateNum}</span>
                <span className="text-[8px] font-black uppercase mt-1">{date.month}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white p-6 rounded-[2.5rem] shadow-sm border border-well-primary/5 flex flex-col justify-center">
          <label className="block text-[10px] font-black text-well-slate uppercase tracking-widest mb-3 ml-2">Training Category</label>
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            <button 
              onClick={() => setTypeFilter('All')}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${typeFilter === 'All' ? 'bg-well-primary text-white shadow-lg' : 'bg-well-bg text-well-slate hover:bg-well-primary/5 border border-well-primary/5'}`}
            >
              All Programs
            </button>
            {partner.workoutTypes.map(type => (
              <button 
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${typeFilter === type ? 'bg-well-accent text-well-primary shadow-lg' : 'bg-well-bg text-well-slate hover:bg-well-primary/5 border border-well-primary/5'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Slots Grid */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-black italic uppercase text-well-primary">
            {new Date(selectedDate).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
          </h3>
          <div className="h-px flex-grow bg-well-primary/5"></div>
          <span className="bg-well-bg text-well-slate text-[10px] font-black px-4 py-1.5 rounded-full border border-well-primary/5 uppercase tracking-widest">
            {activeBookings.length} Bookings Logged
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {timeSlots.map(slot => {
            const slotBookings = activeBookings.filter(b => b.sessionTime.includes(slot));
            
            return (
              <div key={slot} className={`bg-white rounded-[2.5rem] p-8 border-2 transition-all group ${slotBookings.length > 0 ? 'border-well-accent/20 shadow-xl' : 'border-well-primary/5 opacity-60 grayscale hover:grayscale-0 hover:opacity-100'}`}>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h4 className="text-2xl font-black italic text-well-primary leading-none mb-1">{slot}</h4>
                    <p className="text-[10px] font-black text-well-slate uppercase tracking-widest">
                      {slotBookings.length} Athlete{slotBookings.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  {slotBookings.length > 0 && (
                    <div className="w-10 h-10 rounded-2xl bg-well-accent/10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-well-accent animate-pulse"></div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {slotBookings.length === 0 ? (
                    <div className="py-10 border-t border-dashed border-well-primary/10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full border-2 border-well-primary/5 mb-2"></div>
                      <p className="text-[10px] text-well-slate/30 font-black uppercase text-center tracking-widest italic">Open Slot</p>
                    </div>
                  ) : (
                    slotBookings.map(b => {
                      const athlete = backend.getAllUsers().find(u => u.id === b.userId);
                      return (
                        <div key={b.id} className="p-5 bg-well-bg rounded-2xl border border-well-primary/5 group transition-all hover:bg-well-primary/5">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-black text-well-primary uppercase truncate">{athlete?.name || 'Unknown User'}</p>
                              <p className="text-[9px] font-bold text-well-accent uppercase tracking-wider">{b.workoutType}</p>
                            </div>
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase ${
                              b.status === BookingStatus.PENDING ? 'bg-amber-100 text-amber-600 border-amber-200 shadow-sm' :
                              b.status === BookingStatus.ATTENDED ? 'bg-well-accent/10 text-well-accent border-well-accent/20' :
                              'bg-well-slate/10 text-well-slate border-well-slate/20'
                            }`}>
                              {b.status}
                            </span>
                          </div>

                          {b.status === BookingStatus.PENDING && (
                            <div className="flex gap-2 mt-4 pt-4 border-t border-well-primary/5">
                              <button 
                                onClick={() => handleAttendance(b.id, BookingStatus.ATTENDED)}
                                className="flex-1 bg-well-primary text-white py-2 rounded-lg text-[9px] font-black uppercase hover:bg-well-accent hover:text-well-primary transition-all shadow-md active:scale-95"
                              >
                                Check In
                              </button>
                              <button 
                                onClick={() => handleAttendance(b.id, BookingStatus.NO_SHOW)}
                                className="px-4 bg-white border border-red-100 text-red-500 py-2 rounded-lg text-[9px] font-black uppercase hover:bg-red-500 hover:text-white transition-all active:scale-95"
                              >
                                No Show
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
