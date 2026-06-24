'use client';
import { useState } from 'react';

const MOCK_MENU = [
  { id: 'm1', name: 'Dum Gosht Biryani', category: 'Biryani', price: 450, inStock: true },
  { id: 'm2', name: 'Subz-e-Biryani', category: 'Biryani', price: 320, inStock: true },
  { id: 'm3', name: 'Murgh Makhani Kefta', category: 'Mains', price: 290, inStock: false },
  { id: 'm4', name: 'Garlic Naan', category: 'Breads', price: 60, inStock: true },
];

export default function MenuManagement() {
  const [menu, setMenu] = useState(MOCK_MENU);

  const toggleStock = (id: string) => {
    setMenu(menu.map(item => item.id === id ? { ...item, inStock: !item.inStock } : item));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-neutral-500 text-sm">Update prices, toggle stock, and add new items.</p>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded-lg font-bold hover:bg-neutral-800 transition-colors">
          + Add New Item
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-neutral-50 border-b">
            <tr>
              <th className="p-4 font-bold text-neutral-600">Item Name</th>
              <th className="p-4 font-bold text-neutral-600">Category</th>
              <th className="p-4 font-bold text-neutral-600">Price</th>
              <th className="p-4 font-bold text-neutral-600">Stock Status</th>
              <th className="p-4 font-bold text-neutral-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {menu.map((item) => (
              <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                <td className="p-4 font-medium">{item.name}</td>
                <td className="p-4 text-neutral-500">
                  <span className="bg-neutral-100 px-2 py-1 rounded text-xs border">{item.category}</span>
                </td>
                <td className="p-4 font-bold">₹{item.price}</td>
                <td className="p-4">
                  <button 
                    onClick={() => toggleStock(item.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${item.inStock ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}
                  >
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                  </button>
                </td>
                <td className="p-4 text-right space-x-3">
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">Edit</button>
                  <button className="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
