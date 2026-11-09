import { describe, expect, it } from 'vitest';
import { products } from './data';
import { cartTotals, defaultFilters, filterProducts, normalizeCart, normalizeFavorites, setQuantity, validateCheckout } from './domain';

describe('Каталог', () => {
  it('містить 24 унікальні товари та URL', () => {
    expect(products).toHaveLength(24);
    expect(new Set(products.map(p => p.slug)).size).toBe(24);
    expect(products.every(p => Number.isInteger(p.price) && p.price > 0 && p.variants.length > 1)).toBe(true);
  });
  it('знаходить точну назву незалежно від регістру та пробілів', () => {
    expect(filterProducts(products, { ...defaultFilters, query: '  ЛАМПА ARC ' }).map(p => p.id)).toEqual(['arc']);
  });
  it('повертає порожній результат без збігів', () => {
    expect(filterProducts(products, { ...defaultFilters, query: 'неіснуюча річ' })).toEqual([]);
  });
  it('шукає за артикулом та українською категорією', () => {
    expect(filterProducts(products, { ...defaultFilters, query: 'forma-ARC' }).map(p => p.id)).toEqual(['arc']);
    expect(filterProducts(products, { ...defaultFilters, query: 'Освітлення' })).toHaveLength(6);
  });
  it('поєднує матеріал, колір, ціну, категорію та сортування', () => {
    const filters = { ...defaultFilters, category: 'lamps', color: 'Пісок', material: 'Метал із матовим покриттям', min: '2400', max: '3200', sort: 'price-desc' };
    expect(filterProducts(products, filters).map(p => p.id)).toEqual(['orbit', 'halo', 'arc']);
    expect(filterProducts(products, { ...filters, material: 'Дерево та алюміній' })).toEqual([]);
    expect(filterProducts(products, { ...filters, color: 'невідомий' })).toEqual([]);
  });
  it('поєднує категорію та обидві межі ціни', () => {
    const result = filterProducts(products, { ...defaultFilters, category: 'lamps', min: '2000', max: '2800' });
    expect(result.map(p => p.id)).toEqual(['arc', 'halo', 'line']);
  });
  it('межі включні, інвертований діапазон порожній', () => {
    expect(filterProducts(products, { ...defaultFilters, min: '2490', max: '2490' })).toHaveLength(2);
    expect(filterProducts(products, { ...defaultFilters, min: '3000', max: '1000' })).toEqual([]);
  });
  it('сортує за ціною в обидва боки, не змінюючи каталог', () => {
    const before = products.map(p => p.id);
    const asc = filterProducts(products, { ...defaultFilters, sort: 'price-asc' });
    const desc = filterProducts(products, { ...defaultFilters, sort: 'price-desc' });
    expect(asc.map(p => p.price)).toEqual([...products.map(p => p.price)].sort((a,b) => a-b));
    expect(desc.map(p => p.price)).toEqual([...products.map(p => p.price)].sort((a,b) => b-a));
    expect(products.map(p => p.id)).toEqual(before);
  });
  it('сортує за українською назвою', () => {
    const names = filterProducts(products, { ...defaultFilters, sort: 'name' }).map(p => p.name);
    expect(names).toEqual([...names].sort((a,b) => a.localeCompare(b, 'uk')));
  });
});
describe('Кошик', () => {
  it('рахує два товари та збільшення кількості', () => {
    let cart = setQuantity([], 'arc', 0, 1);
    cart = setQuantity(cart, 'rise', 0, 2);
    expect(cartTotals(cart)).toEqual({ quantity: 3, subtotal: 5870 });
  });
  it('видаляє позицію, коли кількість дорівнює нулю', () => {
    expect(setQuantity([{ id: 'arc', variant: 0, quantity: 1 }], 'arc', 0, 0)).toEqual([]);
    expect(cartTotals([])).toEqual({ quantity: 0, subtotal: 0 });
  });
  it('не перевищує залишок між усіма кольорами', () => {
    let cart = setQuantity([], 'fold', 0, 1);
    cart = setQuantity(cart, 'fold', 1, 99);
    cart = setQuantity(cart, 'fold', 2, 99);
    expect(cartTotals(cart).quantity).toBe(2);
    expect(cart.map(i => i.quantity)).toEqual([1, 1]);
  });
  it('не продає відсутні товари та відхиляє невідомі дані', () => {
    expect(setQuantity([], 'line', 0, 1)).toEqual([]);
    expect(setQuantity([], 'unknown', 0, 1)).toEqual([]);
    expect(setQuantity([], 'arc', 99, 1)).toEqual([]);
    expect(setQuantity([], 'arc', 0, NaN)).toEqual([]);
  });
  it('санітизує пошкоджене сховище та об’єднує дублікати', () => {
    expect(normalizeCart({})).toEqual([]);
    expect(normalizeCart([null, { id: 'unknown' }, { id: 'arc', variant: 0, quantity: '3' }, { id: 'line', variant: 0, quantity: 4 }, { id: 'arc', variant: 0, quantity: -1 }])).toEqual([]);
    expect(normalizeCart([{ id: 'fold', variant: 0, quantity: 1 }, { id: 'fold', variant: 0, quantity: 5 }])).toEqual([{ id: 'fold', variant: 0, quantity: 2 }]);
  });
  it('нормалізує обране', () => {
    expect(normalizeFavorites(['arc', 'arc', null, 'invalid', 'rise'])).toEqual(['arc', 'rise']);
    expect(normalizeFavorites('arc')).toEqual([]);
  });
});
describe('Демооформлення', () => {
  const valid = { name: 'Олена Приклад', contact: 'demo-chat', city: 'Місто Ідей', delivery: 'studio', agreed: true };
  it('приймає коректний вигаданий приклад', () => { expect(validateCheckout(valid)).toEqual({}); });
  it('відхиляє порожнє ім’я та пробіли', () => { expect(validateCheckout({ ...valid, name: '  ' })).toHaveProperty('name'); });
  it('відхиляє підмінені значення та відсутню згоду', () => {
    expect(Object.keys(validateCheckout({ ...valid, name: 'x'.repeat(61), contact: 'real@email.test', city: 'unknown', delivery: 'invalid', agreed: false }))).toHaveLength(5);
  });
});
