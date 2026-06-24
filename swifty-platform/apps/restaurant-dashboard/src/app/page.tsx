'use client';
import { useState } from 'react';

// Mock Order Data
const MOCK_ORDERS = [
  { id: 'ORD-8921', status: 'PLACED', items: '2x Dum Gosht Biryani, 1x Coke', total: '₹950', time: '2 mins ago', customer: 'Rahul K.' },
  { id: 'ORD-8920', status: 'PREPARING', items: '1x Murgh Makhani Kefta', total: '₹290', time: '12 mins ago', customer: 'Sneha P.' },
  { id: 'ORD-8919', status: 'READY_FOR_PICKUP', items: '3x Subz-e-Biryani', total: '₹960', time: '25 mins ago', customer: 'Amit T.' },
];

export default function DashboardHome() {
  const [orders, setOrders] = useState(MOCK_ORDERS);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Live Orders Dashboard</h1>
        <div className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full animate-pulse border border-orange-200">
          ● Connected to Live Socket
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* NEW ORDERS COLUMN */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm flex flex-col h-[calc(100vh-180px)]">
          <div className="p-4 border-b bg-neutral-50 rounded-t-xl flex justify-between items-center">
            <h2 className="font-bold text-neutral-800">New / Pending</h2>
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">1</span>
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            {orders.filter(o => o.status === 'PLACED').map(order => (
              <div key={order.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-black text-lg">{order.id}</span>
                  <span className="text-xs text-neutral-500">{order.time}</span>
                </div>
                <p className="text-sm font-medium mb-1">{order.items}</p>
                <div className="flex justify-between items-end mt-3">
                  <div className="text-sm text-neutral-600">Customer: <span className="font-bold">{order.customer}</span></div>
                  <span className="font-black text-green-700">{order.total}</span>
                </div>
                <div className="flex space-x-2 mt-4">
                  <button className="flex-1 bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700">Accept</button>
                  <button className="flex-1 bg-red-50 text-red-600 font-bold py-2 rounded hover:bg-red-100">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PREPARING COLUMN */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm flex flex-col h-[calc(100vh-180px)]">
          <div className="p-4 border-b bg-neutral-50 rounded-t-xl flex justify-between items-center">
            <h2 className="font-bold text-neutral-800">Preparing</h2>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">1</span>
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            {orders.filter(o => o.status === 'PREPARING').map(order => (
              <div key={order.id} className="border rounded-lg p-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-black text-lg">{order.id}</span>
                  <span className="text-xs text-neutral-500">{order.time}</span>
                </div>
                <p className="text-sm font-medium mb-1">{order.items}</p>
                <div className="mt-4">
                  <button className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700">Mark Food Ready</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* READY / WAITING FOR RIDER COLUMN */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm flex flex-col h-[calc(100vh-180px)]">
          <div className="p-4 border-b bg-neutral-50 rounded-t-xl flex justify-between items-center">
            <h2 className="font-bold text-neutral-800">Ready for Pickup</h2>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">1</span>
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            {orders.filter(o => o.status === 'READY_FOR_PICKUP').map(order => (
              <div key={order.id} className="border rounded-lg p-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-black text-lg">{order.id}</span>
                  <span className="text-xs text-neutral-500">{order.time}</span>
                </div>
                <p className="text-sm font-medium mb-1">{order.items}</p>
                <div className="mt-4 flex items-center text-sm text-neutral-500 bg-neutral-100 p-2 rounded">
                  🛵 Rider (Vikas) is 3 mins away.
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
