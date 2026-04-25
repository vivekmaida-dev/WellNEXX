
import React, { useState } from 'react';
import { WELLCASH_PACKS } from '../constants';
import { backend } from '../services/mockBackend';
import { useAuth } from '../App';
import { LedgerEntryType } from '../types';

const WalletStore: React.FC = () => {
  const { user } = useAuth();
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePurchase = (pack: typeof WELLCASH_PACKS[0]) => {
    if (!user) return;
    setPurchasing(pack.id);
    
    // Simulate payment process
    setTimeout(() => {
      backend.addLedgerEntry(user.id, pack.baseWellcash, LedgerEntryType.PURCHASE, false);
      if (pack.bonusWellcash > 0) {
        backend.addLedgerEntry(user.id, pack.bonusWellcash, LedgerEntryType.BONUS, true);
      }
      setPurchasing(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  const balance = user ? backend.getUserBalance(user.id) : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Wellcash Store</h1>
        <p className="text-lg text-gray-500">Fuel your fitness. No subscriptions, just Wellcash.</p>
        
        {balance && (
          <div className="mt-8 inline-flex items-center gap-8 bg-indigo-600 px-10 py-6 rounded-3xl text-white shadow-2xl">
            <div className="text-left">
              <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Total Balance</p>
              <p className="text-4xl font-black">{balance.total}</p>
            </div>
            <div className="h-10 w-px bg-white/20"></div>
            <div className="text-left">
              <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Bonus</p>
              <p className="text-xl font-bold">{balance.bonus}</p>
            </div>
          </div>
        )}
      </div>

      {success && (
        <div className="max-w-md mx-auto mb-8 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <span className="font-bold">Purchase Successful! Wellcash added to your wallet.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {WELLCASH_PACKS.map(pack => (
          <div key={pack.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all relative flex flex-col h-full">
            {pack.bonusWellcash > 100 && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Best Value</span>
            )}
            
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-1">Total Wellcash</h3>
              <p className="text-5xl font-black text-gray-900">{pack.total}</p>
            </div>

            <div className="space-y-4 mb-10 flex-grow">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Base Amount</span>
                <span className="font-bold text-gray-700">{pack.baseWellcash}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Bonus Credits</span>
                <span className="font-bold text-green-500">+{pack.bonusWellcash}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Validity</span>
                <span className="font-bold text-gray-700">12 Months</span>
              </div>
            </div>

            <button 
              onClick={() => handlePurchase(pack)}
              disabled={!!purchasing}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-black transition-all disabled:opacity-50"
            >
              {purchasing === pack.id ? 'Processing...' : `Buy for ₹${pack.price}`}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-20 bg-gray-50 rounded-3xl p-10 border border-gray-100">
        <h4 className="font-bold text-lg mb-4 text-gray-900 text-center">Important Wellcash Policies</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600">
          <div className="flex gap-4">
            <span className="h-6 w-6 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full font-bold flex-shrink-0">1</span>
            <p><strong>Expiry:</strong> Purchased Wellcash expires in 12 months. Bonus Wellcash expires in 6 months from the date of credit.</p>
          </div>
          <div className="flex gap-4">
            <span className="h-6 w-6 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full font-bold flex-shrink-0">2</span>
            <p><strong>Usage:</strong> Our system automatically uses your bonus Wellcash first to ensure you get the maximum value.</p>
          </div>
          <div className="flex gap-4">
            <span className="h-6 w-6 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full font-bold flex-shrink-0">3</span>
            <p><strong>Refunds:</strong> Cancel up to 4 hours before your session for a 100% refund of Wellcash to your wallet.</p>
          </div>
          <div className="flex gap-4">
            <span className="h-6 w-6 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full font-bold flex-shrink-0">4</span>
            <p><strong>Transfer:</strong> Wellcash is non-transferable and cannot be withdrawn as real currency once purchased.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletStore;
