import { categories, products } from './data';
import type { Product } from './data';
export type CartItem = { id: string; variant: number; quantity: number };
export type Filters = { query: string; category: string; min: string; max: string; sort: string; color: string; material: string };
export const defaultFilters: Filters = { query: '', category: '', min: '', max: '', sort: 'featured', color: '', material: '' };
export function filterProducts(source: Product[], filters: Filters): Product[] {
  const query = filters.query.trim().toLocaleLowerCase('uk');
  const result = source.filter(p => {
    const searchable = `${p.name} FORMA-${p.id} ${categories.find(c => c.id === p.category)?.name}`.toLocaleLowerCase('uk');
    return (!query || searchable.includes(query)) && (!filters.category || p.category === filters.category)
      && (!filters.min || p.price >= Number(filters.min)) && (!filters.max || p.price <= Number(filters.max))
      && (!filters.color || p.variants.some(v => v.name === filters.color))
      && (!filters.material || p.material === filters.material);
  });
  if (filters.sort === 'price-asc') result.sort((a, b) => a.price - b.price);
  if (filters.sort === 'price-desc') result.sort((a, b) => b.price - a.price);
  if (filters.sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name, 'uk'));
  return result;
}
export function normalizeCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  const result: CartItem[] = [];
  for (const raw of value.slice(0, 100)) {
    if (!raw || typeof raw !== 'object') continue;
    const p = products.find(p => p.id === raw.id);
    if (!p || !Number.isInteger(raw.variant) || !p.variants[raw.variant] || !Number.isInteger(raw.quantity) || raw.quantity <= 0) continue;
    const used = result.filter(i => i.id === p.id).reduce((sum, i) => sum + i.quantity, 0);
    const quantity = Math.min(raw.quantity, p.stock - used);
    if (quantity <= 0) continue;
    const existing = result.find(i => i.id === p.id && i.variant === raw.variant);
    if (existing) existing.quantity += quantity;
    else result.push({ id: p.id, variant: raw.variant, quantity });
  }
  return result;
}
export function setQuantity(cart: CartItem[], id: string, variant: number, quantity: number): CartItem[] {
  const product = products.find(p => p.id === id);
  if (!product || !product.variants[variant] || !Number.isFinite(quantity)) return cart;
  const others = cart.filter(i => !(i.id === id && i.variant === variant));
  const used = others.filter(i => i.id === id).reduce((sum, i) => sum + i.quantity, 0);
  const next = Math.max(0, Math.min(Math.floor(quantity), product.stock - used));
  return next ? normalizeCart([...others, { id, variant, quantity: next }]) : others;
}
export function cartTotals(cart: CartItem[]) {
  return normalizeCart(cart).reduce((totals, item) => ({ quantity: totals.quantity + item.quantity, subtotal: totals.subtotal + products.find(p => p.id === item.id)!.price * item.quantity }), { quantity: 0, subtotal: 0 });
}
export function normalizeFavorites(value: unknown): string[] {
  return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === 'string' && products.some(p => p.id === id)))] : [];
}
export type Checkout = { name: string; contact: string; city: string; delivery: string; agreed: boolean };
export const deliveries = [{ id: 'studio', name: 'Демо-пункт FORMA', price: 0 }, { id: 'courier', name: 'Демо-кур’єр «Тихий маршрут»', price: 90 }];
export function validateCheckout(form: Checkout): Record<string, string> {
  const errors: Record<string, string> = {};
  if (form.name.trim().length < 2 || form.name.trim().length > 60) errors.name = 'Вкажіть вигадане ім’я: від 2 до 60 символів.';
  if (!['demo-email', 'demo-chat'].includes(form.contact)) errors.contact = 'Оберіть демонстраційний спосіб зв’язку.';
  if (!['Місто Ідей', 'Тиха Долина', 'Новий Простір'].includes(form.city)) errors.city = 'Оберіть вигадане місто.';
  if (!deliveries.some(d => d.id === form.delivery)) errors.delivery = 'Оберіть спосіб демодоставки.';
  if (!form.agreed) errors.agreed = 'Підтвердьте використання лише вигаданих даних.';
  return errors;
}
