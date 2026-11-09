import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { cartTotals, normalizeCart, normalizeFavorites, setQuantity } from './domain';
import type { CartItem } from './domain';
import { products } from './data';

function read(key: string): { value: unknown; error: string } {
  try { return { value: JSON.parse(localStorage.getItem(key) || 'null'), error: '' }; }
  catch { return { value: null, error: 'Не вдалося відновити збережені дані. Ви можете продовжити з новим кошиком.' }; }
}
type Store = {
  cart: CartItem[]; favorites: string[]; notice: string; storageError: string;
  add: (id: string, variant?: number, quantity?: number) => void; update: (id: string, variant: number, quantity: number) => void;
  toggleFavorite: (id: string) => void; clearCart: () => void;
  totals: { quantity: number; subtotal: number };
};
const Context = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(() => ({ cart: read('forma-cart-v1'), favorites: read('forma-favorites-v1') }));
  const [cart, setCart] = useState(() => normalizeCart(initial.cart.value));
  const [favorites, setFavorites] = useState(() => normalizeFavorites(initial.favorites.value));
  const [storageError, setStorageError] = useState(initial.cart.error || initial.favorites.error);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    try { localStorage.setItem('forma-cart-v1', JSON.stringify(cart)); localStorage.setItem('forma-favorites-v1', JSON.stringify(favorites)); }
    catch { setStorageError('Браузер не дозволяє збереження. Кошик та обране працюють до закриття сторінки.'); }
  }, [cart, favorites]);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 3200); return () => clearTimeout(timer); }, [notice]);
  function add(id: string, variant = 0, quantity = 1) {
    const p = products.find(p => p.id === id);
    if (!p || !p.variants[variant] || !Number.isInteger(quantity) || quantity < 1) return;
    const used = cart.filter(i => i.id === id).reduce((sum, i) => sum + i.quantity, 0);
    if (used >= p.stock) { setNotice('У кошику вже весь доступний залишок.'); return; }
    setCart(current => setQuantity(current, id, variant, (current.find(i => i.id === id && i.variant === variant)?.quantity || 0) + quantity));
    setNotice(`${p.name} — додано до кошика`);
  }
  return <Context.Provider value={{ cart, favorites, notice, storageError, add, totals: cartTotals(cart),
    update: (id, variant, quantity) => setCart(current => setQuantity(current, id, variant, quantity)),
    clearCart: () => setCart([]),
    toggleFavorite: id => setFavorites(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]),
  }}>{children}</Context.Provider>;
}
export function useStore() { const store = useContext(Context); if (!store) throw new Error('StoreProvider missing'); return store; }
