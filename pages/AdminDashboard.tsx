
import React, { useState, useEffect } from 'react';
import { backend } from '../services/mockBackend';
import { Partner, User, UserRole, Booking } from '../types';
import { CITIES, WORKOUT_TYPES } from '../constants';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showCreatePartner, setShowCreatePartner] = useState(false);

  // Form State
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerEmail, setNewPartnerEmail] = useState('');
  const [newPartnerCity, setNewPartnerCity] = useState(CITIES[0]);
  const [newPartnerPrice, setNewPartnerPrice] = useState(200);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setStats(backend.getDashboardStats());
    setPartners(backend.getAllPartners());
    setUsers(backend.getAllUsers().filter(u => u.role === UserRole.CUSTOMER));
    setBookings(backend.getAllBookings());
  };

  const handleCreatePartner = (e: React.FormEvent) => {
    e.preventDefault();
    backend.createPartner(
      { name: newPartnerName, city: newPartnerCity, pricePerSession: newPartnerPrice, workoutTypes: [WORKOUT_TYPES[0], WORKOUT_TYPES[1]] },
      { name: `${newPartnerName} Owner`, email: newPartnerEmail }
    );
    setShowCreatePartner(false);
    refreshData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-gray-900">Platform Admin</h1>
        <button 
          onClick={() => setShowCreatePartner(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
        >
          Create Partner Account
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total GMV', value: `${stats.gmv} Wellcash`, icon: '💰' },
            { label: 'Platform Revenue', value: `${stats.revenue} Wellcash`, icon: '📈' },
            { label: 'Active Users', value: stats.activeUsers, icon: '👥' },
            { label: 'Active Studios', value: stats.activePartners, icon: '🏢' },
          ].map(stat => (
            <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <span className="text-2xl mb-2 block">{stat.icon}</span>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {showCreatePartner && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Create New Partner</h2>
            <form onSubmit={handleCreatePartner} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Studio Name</label>
                <input required type="text" value={newPartnerName} onChange={e => setNewPartnerName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Owner Email</label>
                <input required type="email" value={newPartnerEmail} onChange={e => setNewPartnerEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
                  <select value={newPartnerCity} onChange={e => setNewPartnerCity(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none">
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Price (Wellcash)</label>
                  <input required type="number" value={newPartnerPrice} onChange={e => setNewPartnerPrice(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setShowCreatePartner(false)} className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100">Cancel</button>
                <button type="submit" className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 font-bold text-xl">Partners</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-8 py-4">ID</th>
                  <th className="px-8 py-4">Name</th>
                  <th className="px-8 py-4">City</th>
                  <th className="px-8 py-4">Payout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {partners.map(p => (
                  <tr key={p.id} className="text-sm">
                    <td className="px-8 py-4 font-mono text-xs">{p.id}</td>
                    <td className="px-8 py-4 font-bold">{p.name}</td>
                    <td className="px-8 py-4">{p.city}</td>
                    <td className="px-8 py-4 text-green-600 font-bold">₹{p.payoutBalance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 font-bold text-xl">Recent Bookings</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-8 py-4">User</th>
                  <th className="px-8 py-4">Wellcash</th>
                  <th className="px-8 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.slice(0, 10).map(b => (
                  <tr key={b.id} className="text-sm">
                    <td className="px-8 py-4 font-medium">{backend.getAllUsers().find(u => u.id === b.userId)?.name}</td>
                    <td className="px-8 py-4 font-bold">{b.wellcashUsed}</td>
                    <td className="px-8 py-4 text-xs font-bold uppercase">{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
