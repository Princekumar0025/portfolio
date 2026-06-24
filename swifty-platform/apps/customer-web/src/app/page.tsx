import { RestaurantCard } from '../components/RestaurantCard';
import { HeroSearch } from '../components/HeroSearch';

// Mocking the Backend API Response for Startup UI testing
const mockRestaurants = [
  {
    id: "r1",
    name: "Behrouz Biryani",
    rating: 4.5,
    categories: ["Mughlai", "Biryani"],
    eta: "35 mins",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&fit=crop",
    discount: "60% OFF"
  },
  {
    id: "r2",
    name: "Burger King",
    rating: 4.2,
    categories: ["Burgers", "American"],
    eta: "25 mins",
    imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&fit=crop",
    discount: "₹120 OFF"
  },
  {
    id: "r3",
    name: "Domino's Pizza",
    rating: 4.4,
    categories: ["Pizzas", "Fast Food"],
    eta: "30 mins",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&fit=crop",
    discount: "FREE DELIVERY"
  },
  {
    id: "r4",
    name: "KFC",
    rating: 4.0,
    categories: ["Fried Chicken", "Fast Food"],
    eta: "20 mins",
    imageUrl: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?q=80&w=800&fit=crop",
    discount: "20% OFF"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen pb-20 bg-zinc-50 dark:bg-zinc-950">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50">
        <HeroSearch />
      </header>

      {/* App Content */}
      <section className="container mx-auto px-4 mt-8">
        
        {/* Dynamic Filters Area */}
        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button className="flex-shrink-0 px-4 py-2 bg-white border border-zinc-200 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-shadow">Filters ⚙️</button>
          <button className="flex-shrink-0 px-4 py-2 bg-white border border-zinc-200 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-shadow">Rating 4.0+</button>
          <button className="flex-shrink-0 px-4 py-2 bg-white border border-zinc-200 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-shadow">Pure Veg</button>
          <button className="flex-shrink-0 px-4 py-2 bg-white border border-zinc-200 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-shadow">Fast Delivery</button>
          <button className="flex-shrink-0 px-4 py-2 bg-white border border-zinc-200 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-shadow">Offers</button>
        </div>

        <h2 className="text-2xl md:text-3xl font-black mb-6 text-zinc-900 dark:text-zinc-100">Top restaurant chains in Koramangala</h2>
        
        {/* Grid Engine */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10">
          {mockRestaurants.map((r) => (
            <RestaurantCard 
              key={r.id} 
              id={r.id}
              name={r.name}
              rating={r.rating}
              cuisines={r.categories}
              timeEstimate={r.eta}
              imageUrl={r.imageUrl}
              offer={r.discount}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
