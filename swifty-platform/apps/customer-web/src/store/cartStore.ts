import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
  customizations?: string[];
}

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,

      addItem: (item) => {
        const currentItems = get().items;
        const currentRestaurant = get().restaurantId;

        // Prevent mixing items from different restaurants
        if (currentRestaurant && currentRestaurant !== item.restaurantId) {
          // In a real app, you would prompt the user if they want to clear the cart
          alert('You can only order from one restaurant at a time. Clear cart first!');
          return;
        }

        const existingItem = currentItems.find((i) => i.id === item.id);
        
        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({
            items: [...currentItems, item],
            restaurantId: item.restaurantId,
          });
        }
      },

      removeItem: (id) => {
        const updatedItems = get().items.filter((i) => i.id !== id);
        set({
          items: updatedItems,
          restaurantId: updatedItems.length === 0 ? null : get().restaurantId,
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [], restaurantId: null }),

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'swifty-cart-storage',
    }
  )
);
