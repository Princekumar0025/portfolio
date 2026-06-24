'use client';
import { useState } from 'react';

export default function AdminDashboard() {
  const [commissionRate, setCommissionRate] = useState(18); // Base 18% commission
  const [baseDeliveryFee, setBaseDeliveryFee] = useState(40); // Base ₹40 fee
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* KPI Cards */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm font-bold text-slate-500 mb-1">Total Daily Revenue</p>
          <h2 className="text-3xl font-black text-slate-900">₹452,800</h2>
          <p className="text-xs text-green-600 font-bold mt-2">↑ 12% from yesterday</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm font-bold text-slate-500 mb-1">Platform Earnings (Commission)</p>
          <h2 className="text-3xl font-black text-slate-900">₹81,504</h2>
          <p className="text-xs text-green-600 font-bold mt-2">↑ 8% from yesterday</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm font-bold text-slate-500 mb-1">Active Deliveries</p>
          <h2 className="text-3xl font-black text-slate-900">1,420</h2>
          <p className="text-xs text-green-600 font-bold mt-2">● Real-time via Sockets</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm font-bold text-slate-500 mb-1">Pending Disputes (Refunds)</p>
          <h2 className="text-3xl font-black text-red-600">3</h2>
          <p className="text-xs text-red-600 font-bold mt-2">Requires immediate action</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Configuration (Financials) */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Global Financial Configuration</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Base Platform Commission (%)</label>
              <div className="flex items-center space-x-4">
                <input 
                  type="range" 
                  min="5" 
                  max="30" 
                  value={commissionRate} 
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="font-bold w-12 text-right">{commissionRate}%</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Deducted from restaurant payouts automatically via Stripe Connect.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Base Delivery Fee (₹)</label>
              <div className="flex items-center space-x-4">
                <input 
                  type="number" 
                  value={baseDeliveryFee} 
                  onChange={(e) => setBaseDeliveryFee(Number(e.target.value))}
                  className="w-full border rounded p-2 text-sm"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Base fee assigned to Riders. Surge pricing applies automatically during peak hours algorithmically.</p>
            </div>

            <button className="w-full bg-slate-900 text-white font-bold py-2 rounded-lg hover:bg-slate-800 transition-colors">
              Save Financial Parameters
            </button>
          </div>
        </div>

        {/* Global Payout Tracking */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h3 className="text-lg font-bold text-slate-800">Pending Restaurant Payouts</h3>
            <button className="text-sm bg-blue-50 text-blue-600 px-3 py-1 font-bold rounded">Process All via Stripe</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-sm">
                  <th className="pb-3 font-semibold">Restaurant Node</th>
                  <th className="pb-3 font-semibold">Orders (Week)</th>
                  <th className="pb-3 font-semibold">Total Sales</th>
                  <th className="pb-3 font-semibold">Comm. (-18%)</th>
                  <th className="pb-3 font-semibold">Owed Payout</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                <tr>
                  <td className="py-3 font-bold text-slate-700">Behrouz Biryani</td>
                  <td className="py-3">1,204</td>
                  <td className="py-3">₹540,600</td>
                  <td className="py-3 text-red-500">-₹97,308</td>
                  <td className="py-3 font-bold text-green-600">₹443,292</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-slate-700">Burger King</td>
                  <td className="py-3">4,800</td>
                  <td className="py-3">₹890,000</td>
                  <td className="py-3 text-red-500">-₹160,200</td>
                  <td className="py-3 font-bold text-green-600">₹729,800</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-slate-700">La Pino'z Pizza</td>
                  <td className="py-3">940</td>
                  <td className="py-3">₹310,200</td>
                  <td className="py-3 text-red-500">-₹55,836</td>
                  <td className="py-3 font-bold text-green-600">₹254,364</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
