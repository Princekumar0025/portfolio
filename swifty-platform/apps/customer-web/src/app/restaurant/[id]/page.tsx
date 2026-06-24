'use client';

import { useCartStore } from '@/store/cartStore';

export default function RestaurantPage({ params }: { params: { id: string } }) {
  // In a real app, this would be fetched via React Server Components and Prisma
  const restaurant = {
    id: params.id,
    name: 'Behrouz Biryani',
    rating: 4.5,
    categories: 'Mughlai, Biryani',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&h=400&fit=crop',
    menu: [
      { id: 'm1', name: 'Dum Gosht Biryani', price: 450, isVeg: false, desc: 'Tender mutton pieces marinated in rich spices.' },
      { id: 'm2', name: 'Subz-e-Biryani', price: 320, isVeg: true, desc: 'Aromatic basmati rice cooked with fresh vegetables.' },
      { id: 'm3', name: 'Murgh Makhani Kefta', price: 290, isVeg: false, desc: 'Chicken meatballs in a buttery tomato gravy.' },
    ]
  };

  const { items, addItem, removeItem, getTotalPrice } = useCartStore();

  const handleAddToCart = (menuItem: any) => {
    addItem({
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: 1,
      restaurantId: restaurant.id,
    });
  };

  return (
    <main className="min-h-screen bg-neutral-50 pb-32">
      {/* Restaurant Header */}
      <div className="w-full h-64 md:h-80 relative bg-black">
        <img src={restaurant.image} className="w-full h-full object-cover opacity-60" alt={restaurant.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-6 md:p-12">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{restaurant.name}</h1>
            <p className="text-neutral-300 text-lg mb-4">{restaurant.categories}</p>
            <div className="flex items-center space-x-4">
              <span className="bg-green-600 text-white font-bold px-3 py-1 rounded shadow-lg">{restaurant.rating} ★</span>
              <span className="bg-white/20 backdrop-blur text-white px-3 py-1 rounded">35 mins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu & Cart Grid */}
      <div className="container mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Menu Items */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold border-b pb-4">Menu</h2>
          {restaurant.menu.map((item) => (
            <div key={item.id} className="flex justify-between items-start bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-all">
              <div className="max-w-[70%]">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`w-4 h-4 rounded-sm border flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                    <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></span>
                  </span>
                  <h3 className="font-bold text-lg">{item.name}</h3>
                </div>
                <p className="font-medium mb-2 text-neutral-800">₹{item.price}</p>
                <p className="text-neutral-500 text-sm">{item.desc}</p>
              </div>
              
              <div className="flex flex-col items-center">
                <button 
                  onClick={() => handleAddToCart(item)}
                  className="bg-orange-100 text-orange-600 font-bold px-6 py-2 rounded-lg hover:bg-orange-200 transition-colors shadow-sm border border-orange-200"
                >
                  ADD
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Cart Desk View */}
        <div className="hidden lg:block">
          <div className="sticky top-24 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xl">
            <h3 className="text-xl font-bold mb-4">Your Cart</h3>
            {items.length === 0 ? (
              <p className="text-neutral-500 text-center py-6">Good food is always cooking! Go ahead, order some yummy items from the menu.</p>
            ) : (
              <div className="space-y-4">
                {items.map((i) => (
                  <div key={i.id} className="flex justify-between items-center text-sm">
                    <span className="font-medium max-w-[50%] line-clamp-1">{i.name}</span>
                    <div className="flex items-center space-x-3 bg-neutral-100 rounded border px-2 py-1">
                      <button className="text-neutral-500 hover:text-black font-bold" onClick={() => removeItem(i.id)}>-</button>
                      <span className="font-bold">{i.quantity}</span>
                      <button className="text-green-600 font-bold" onClick={() => handleAddToCart(i)}>+</button>
                    </div>
                    <span className="font-medium">₹{i.price * i.quantity}</span>
                  </div>
                ))}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Subtotal</span>
                    <span>₹{getTotalPrice()}</span>
                  </div>
                  <button className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl mt-4 hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-600/30">
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
