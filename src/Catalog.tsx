import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, RotateCcw, X, ArrowRight } from 'lucide-react';
import { categories, products } from './data';
import { defaultFilters, filterProducts } from './domain';
import type { Filters } from './domain';
import { ProductCard, Breadcrumb } from './App';
import { Modal } from './Modal';
import s from './App.module.css';

const colors = [...new Set(products.flatMap(p => p.variants.map(v => v.name)))];
const materials = [...new Set(products.map(p => p.material))];
export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const filters = Object.fromEntries(Object.entries(defaultFilters).map(([key, value]) => [key, params.get(key === 'query' ? 'q' : key) || value])) as Filters;
  const [query, setQuery] = useState(filters.query);
  const [showFilters, setShowFilters] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const paramsRef = useRef(params);
  paramsRef.current = params;
  useEffect(() => { setQuery(filters.query); }, [filters.query]);
  useEffect(() => {
    const timer = setTimeout(() => {
      const next = new URLSearchParams(paramsRef.current);
      if (query) next.set('q', query); else next.delete('q');
      if (next.toString() !== paramsRef.current.toString()) setParams(next, { replace: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [query, setParams]);
  useEffect(() => { if (params.get('focus') === 'search') input.current?.focus(); }, [params]);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 801px)');
    const close = () => { if (media.matches) setShowFilters(false); };
    media.addEventListener('change', close);
    return () => media.removeEventListener('change', close);
  }, []);
  function change(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  }
  function reset() { setQuery(''); setParams({}); }
  const result = filterProducts(filters.sort === 'new' ? products.filter(p => p.tag === 'Нове') : products, filters);
  const chips = [
    { key: 'q', value: filters.query, label: `Пошук: ${filters.query}` },
    { key: 'category', value: filters.category, label: categories.find(c => c.id === filters.category)?.name || filters.category },
    { key: 'min', value: filters.min, label: `Від ${filters.min} ₴` },
    { key: 'max', value: filters.max, label: `До ${filters.max} ₴` },
    { key: 'color', value: filters.color, label: filters.color },
    { key: 'material', value: filters.material, label: filters.material },
    { key: 'sort', value: filters.sort === 'new' ? 'new' : '', label: 'Новинки' },
  ].filter(c => c.value);
  const filterFields = <>
    <fieldset><legend>Категорія</legend>{[{ id: '', name: 'Усі товари' }, ...categories].map(c => <label className={s.radio} key={c.id}><input type="radio" name="category" checked={filters.category === c.id} onChange={() => change('category', c.id)}/>{c.name}<span>{products.filter(p => !c.id || p.category === c.id).length}</span></label>)}</fieldset>
    <fieldset><legend>Ціна, ₴</legend><div className={s.priceFields}><label><span>Від</span><input aria-label="Мінімальна ціна" type="number" min="0" max="100000" placeholder="0" value={filters.min} onChange={e => change('min', e.target.value)}/></label><span>—</span><label><span>До</span><input aria-label="Максимальна ціна" type="number" min="0" max="100000" placeholder={String(Math.max(...products.map(p => p.price)))} value={filters.max} onChange={e => change('max', e.target.value)}/></label></div>{filters.min && filters.max && +filters.min > +filters.max && <p className={s.fieldError}>Мінімальна ціна більша за максимальну.</p>}</fieldset>
    <fieldset><legend>Колір</legend><div className={s.colorFilters}>{colors.map(color => <button key={color} className={filters.color === color ? s.activeFilter : ''} aria-pressed={filters.color === color} onClick={() => change('color', filters.color === color ? '' : color)}><i style={{ background: color === 'Графіт' ? '#4c504b' : color === 'Пісок' ? '#c8b99e' : '#b66a47' }}/>{color}</button>)}</div></fieldset>
    <fieldset><legend>Матеріал</legend><select className={s.materialSelect} aria-label="Матеріал" value={filters.material} onChange={e => change('material', e.target.value)}><option value="">Усі матеріали</option>{materials.map(m => <option key={m}>{m}</option>)}</select></fieldset>
    <button className={s.reset} onClick={reset}><RotateCcw size={15}/> Скинути фільтри</button>
  </>;
  return <div className={s.page}>
    <Breadcrumb current="Каталог"/>
    <div className={s.pageTitle}><div><span className={s.eyebrow}>КОЛЕКЦІЯ ДЛЯ НЕКВАПЛИВОГО ЩОДНЯ</span><h1>Знайдіть свою форму<span className={s.titleDot}>.</span></h1></div><p>Світло, фактура й трохи натхнення.<br/>Речі, що роблять простір вашим.</p></div>
    <div className={s.catalogTop}><label className={s.search}><Search size={20}/><input ref={input} value={query} onChange={e => setQuery(e.target.value)} placeholder="Назва, категорія або артикул…" aria-label="Пошук товарів"/>{query && <button aria-label="Очистити пошук" onClick={() => setQuery('')}><X size={17}/></button>}</label><button className={s.filterToggle} onClick={() => setShowFilters(true)} aria-haspopup="dialog"><SlidersHorizontal size={18}/> Фільтри{chips.length > 0 && ` (${chips.length})`}</button><label className={s.sort}>Сортувати<select aria-label="Сортування" value={filters.sort} onChange={e => change('sort', e.target.value)}><option value="featured">Вибір редакції</option><option value="new">Новинки</option><option value="price-asc">Спочатку дешевші</option><option value="price-desc">Спочатку дорожчі</option><option value="name">За назвою</option></select></label></div>
    <div className={s.catalogLayout}><aside className={s.filters}><div className={s.filterHeading}><h2>Оберіть своє</h2><SlidersHorizontal size={17}/></div>{!showFilters && filterFields}<div className={s.filterAside}>Менше речей.<br/><strong>Більше сенсу.</strong><span>Авторська демоколекція.<br/>{products.length} форм для вашого простору.</span></div></aside>
    <div><div className={s.resultsInfo} role="status" aria-live="polite"><span>{query !== filters.query ? 'Шукаємо…' : `Знайдено товарів: ${result.length}`}</span><span>ДЕМОНСТРАЦІЙНІ ІЛЮСТРАЦІЇ</span></div>{chips.length > 0 && <div className={s.filterChips} aria-label="Застосовані фільтри">{chips.map(c => <button key={c.key} onClick={() => { if (c.key === 'q') setQuery(''); change(c.key, ''); }} aria-label={`Прибрати фільтр: ${c.label}`}>{c.label}<X size={13}/></button>)}</div>}
    {result.length ? <div className={`${s.productGrid} ${s.catalogGrid}`} aria-busy={query !== filters.query}>{result.map(p => <ProductCard key={p.id} product={p}/>)}</div> : <div className={s.empty}><Search size={36}/><h2>Поки нічого не знайшли</h2><p>Спробуйте іншу назву або змініть фільтри.</p><button className={s.button} onClick={reset}>Скинути фільтри <RotateCcw size={17}/></button></div>}</div></div>
    {showFilters && <Modal title="Фільтри" drawer onClose={() => setShowFilters(false)}><div className={s.drawerFilters}>{filterFields}</div><button className={s.button} onClick={() => setShowFilters(false)}>Показати товари ({result.length}) <ArrowRight size={18}/></button></Modal>}
  </div>;
}
