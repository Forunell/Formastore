import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight, ZoomIn, Check, CheckCircle2, ChevronDown, Heart, Menu, Minus, Plus, Search, ShoppingBag, Trash2, X, Package, MoveUpRight, Leaf, Download } from 'lucide-react';
import { categories, money, products } from './data';
import type { Product } from './data';
import { deliveries, validateCheckout } from './domain';
import type { Checkout } from './domain';
import { ProductArt } from './Illustration';
import { useStore } from './store';
import s from './App.module.css';
import Catalog from './Catalog';
import { Modal } from './Modal';
import { HeroImage } from './HeroImage';

function ButtonLink({ to, children, light = false }: { to: string; children: ReactNode; light?: boolean }) {
  return <Link className={`${s.button} ${light ? s.lightButton : ''}`} to={to}>{children}<ArrowUpRight size={18}/></Link>;
}
function Empty({ title, text, icon = <ShoppingBag size={36}/> }: { title: string; text: string; icon?: ReactNode }) {
  return <div className={s.empty}>{icon}<h2>{title}</h2><p>{text}</p><ButtonLink to="/catalog">Знайти свою форму</ButtonLink></div>;
}
function Header() {
  const { totals, favorites } = useStore();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => { setOpen(false); }, [location]);
  useEffect(() => { const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler); }, []);
  return <>
    <div className={s.announcement}><span>Продумані речі. Ваш особистий простір.</span><span>DEMO · без реальних оплат і доставок</span></div>
    <header className={s.header}>
      <Link to="/" className={s.logo} aria-label="FormaStore — головна">forma<span>store</span><i /></Link>
      <nav className={s.desktopNav} aria-label="Основна навігація"><NavLink to="/catalog">Каталог <ChevronDown size={13}/></NavLink><Link to="/catalog?sort=new">Новинки</Link><Link to="/#philosophy">Філософія FORMA</Link></nav>
      <div className={s.headerActions}>
        <Link to="/catalog?focus=search" aria-label="Пошук товарів" className={s.iconButton}><Search size={21}/></Link>
        <Link to="/favorites" aria-label={`Обране: ${favorites.length}`} className={s.iconButton}><Heart size={21}/>{favorites.length > 0 && <span className={s.badge}>{favorites.length}</span>}</Link>
        <Link to="/cart" className={s.cartLink} aria-label={`Кошик: ${totals.quantity}`}><ShoppingBag size={20}/><span>Кошик</span><b>{totals.quantity}</b></Link>
        <button className={`${s.iconButton} ${s.menuButton}`} aria-label={open ? 'Закрити меню' : 'Відкрити меню'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
      </div>
      {open && <Modal title="Меню" drawer onClose={() => setOpen(false)}><nav className={s.mobileNav} id="mobile-menu" aria-label="Мобільна навігація"><Link to="/catalog">Усі товари <ArrowRight size={18}/></Link>{categories.map(c => <Link key={c.id} to={`/catalog?category=${c.id}`}>{c.name}</Link>)}<Link to="/favorites">Обране</Link><Link to="/#philosophy">Філософія FORMA</Link></nav></Modal>}
    </header>
  </>;
}
export function ProductCard({ product }: { product: Product }) {
  const { favorites, toggleFavorite, add, cart } = useStore();
  const liked = favorites.includes(product.id);
  const available = product.stock > cart.filter(i => i.id === product.id).reduce((n, i) => n + i.quantity, 0);
  return <article className={s.productCard}>
    <div className={s.cardVisual}>
      <Link to={`/products/${product.slug}`} aria-label={`Переглянути ${product.name}`}><ProductArt product={product}/></Link>
      {(product.tag || !product.stock) && <span className={s.productTag}>{!product.stock ? 'Незабаром знову' : product.tag}</span>}
      <button className={`${s.favoriteButton} ${liked ? s.liked : ''}`} aria-label={`${liked ? 'Прибрати з обраного' : 'Додати в обране'}: ${product.name}`} aria-pressed={liked} onClick={() => toggleFavorite(product.id)}><Heart size={18} fill={liked ? 'currentColor' : 'none'}/></button>
      <button className={s.quickAdd} disabled={!available} onClick={() => add(product.id)} aria-label={`Додати до кошика: ${product.name}`}>{available ? <Plus size={18}/> : <Check size={18}/>}</button>
    </div>
    <div className={s.cardCategory}>{categories.find(c => c.id === product.category)?.name}<span className={s.swatches}>{product.variants.map(v => <i key={v.name} style={{ background: v.color }}/>)}</span></div>
    <div className={s.cardBottom}><h3><Link to={`/products/${product.slug}`}>{product.name}</Link></h3><span>{money(product.price)}</span></div>
  </article>;
}
function Home() {
  return <>
    <section className={s.hero}>
      <div className={s.heroCopy}><span className={s.eyebrow}><i/> МЕНШЕ ЗАЙВОГО. БІЛЬШЕ ВАШОГО.</span><h1>Дайте форму<br/>своїм <span>ідеям.</span></h1><p>Речі, з якими хочеться працювати.<br/>Створіть простір, що надихає бути собою.</p><ButtonLink to="/catalog">Знайти свою форму</ButtonLink><Link className={s.heroSecondary} to="/catalog?sort=new">Дивитися новинки <ArrowRight size={15}/></Link><div className={s.heroFoot}><span className={s.smallMark}>f.</span><span>Дизайн із сенсом.<br/><b>Для вашого щодня.</b></span><ArrowDown size={19}/></div></div>
      <div className={s.heroVisual}><HeroImage/><span className={s.heroEdition}>МИСТЕЦТВО ПОВСЯКДЕННОГО / 01</span><Link className={s.heroProduct} to="/products/arc"><span><small>У центрі уваги</small><strong>Лампа Arc</strong><span>Тепле світло. Чітка форма.</span></span><span className={s.roundArrow}><ArrowUpRight size={23}/></span></Link><span className={s.heroNumber}>AI-візуалізація · демоколекція</span></div>
    </section>
    <div className={s.values}><span><MoveUpRight size={18}/> Функціональність у кожній деталі</span><span><Leaf size={19}/> Матеріали з характером</span><span><Package size={19}/> Продумано для вашого простору</span></div>
    <section className={s.section}><div className={s.sectionHeading}><div><span className={s.eyebrow}>ВАШ ПРОСТІР, ВАШІ ПРАВИЛА</span><h2>З чого почнемо?</h2></div><Link className={s.textLink} to="/catalog">Усі {products.length} товари <ArrowUpRight size={18}/></Link></div>
      <div className={s.categoryGrid}>{categories.map((c, i) => <Link key={c.id} to={`/catalog?category=${c.id}`} className={s.categoryTile}><span className={s.categoryIndex}>0{i + 1}</span><div className={s.categoryArt}><ProductArt product={products.find(p => p.category === c.id)!}/></div><div className={s.categoryName}><div><h3>{c.name}</h3><p>{c.caption}</p></div><ArrowUpRight size={22}/></div></Link>)}</div>
    </section>
    <section className={s.section}><div className={s.sectionHeading}><div><span className={s.eyebrow}>ДОБРЕ ПРАЦЮЮТЬ РАЗОМ</span><h2>Вибір FORMA<span className={s.titleDot}>.</span></h2></div><Link className={s.textLink} to="/catalog">До каталогу <ArrowUpRight size={18}/></Link></div><div className={s.productGrid}>{products.filter(p => p.tag === 'Вибір FORMA').map(p => <ProductCard key={p.id} product={p}/>)}</div></section>
    <section id="philosophy" className={s.philosophy}><div className={s.philosophySymbol}>f<span>○</span>rma</div><div><span className={s.eyebrow}>НЕ ПРОСТО РЕЧІ</span><h2>Хороший день<br/>починається з простору.</h2><p>Ми віримо в речі, які не привертають зайвої уваги, але змінюють відчуття від кожного дня. У спокійні кольори, приємні фактури та місце для власних ідей.</p><Link className={s.textLink} to="/catalog">Зібрати свій простір <ArrowUpRight size={18}/></Link></div></section>
    <div className={s.demoNote}><span>Чесно про FORMA</span><p>Це авторський навчальний магазин. Усі товари вигадані, а замовлення створюються лише на вашому пристрої.</p><span>Нуль реальних платежів.</span></div>
  </>;
}
export function Breadcrumb({ current }: { current: string }) { return <nav aria-label="Хлібні крихти" className={s.breadcrumb}><Link to="/">Головна</Link><span>/</span><Link to="/catalog">Каталог</Link><span>/</span><span>{current}</span></nav>; }
function ProductPage() {
  const { slug } = useParams();
  const product = products.find(p => p.slug === slug);
  const [variant, setVariant] = useState(0);
  const [view, setView] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { add, cart, favorites, toggleFavorite } = useStore();
  useEffect(() => { setVariant(0); setView(0); setQuantity(1); setZoom(false); }, [slug]);
  if (!product) return <div className={s.page}><Empty title="Такої форми ще немає" text="Товар не знайдено. Погляньте на поточну колекцію."/></div>;
  const used = cart.filter(i => i.id === product.id).reduce((n, i) => n + i.quantity, 0);
  return <div className={s.page}><Breadcrumb current={product.name}/><div className={s.detailGrid}><div><button className={s.detailArt} aria-label="Збільшити зображення" onClick={() => setZoom(true)}><ProductArt product={product} variant={variant} view={view}/><span className={s.zoomHint}><ZoomIn size={17} aria-hidden="true"/> Роздивитися ближче</span></button>{zoom && <Modal title={product.name} onClose={() => setZoom(false)}><div className={s.zoomArt}><ProductArt product={product} variant={variant} view={view}/></div><p className={s.smallNote}>Авторська демоілюстрація · {product.variants[variant].name}</p></Modal>}<div className={s.thumbnails}>{[0, 1].map(v => <button key={v} aria-label={v ? 'Показати деталі' : 'Показати загальний вигляд'} aria-pressed={view === v} onClick={() => setView(v)} className={view === v ? s.selectedThumb : ''}><ProductArt product={product} variant={variant} view={v}/></button>)}<span>Власні ілюстрації FORMA<br/>Демонстраційний товар</span></div></div><div className={s.detailInfo}><span className={s.eyebrow}>{categories.find(c => c.id === product.category)?.name} / FORMA OBJECTS</span><h1>{product.name}</h1><p className={s.detailDescription}>{product.description}</p><p className={s.detailPrice}>{money(product.price)}</p><span className={`${s.stock} ${!product.stock ? s.noStock : ''}`}><i/>{product.stock ? `У наявності: ${product.stock} шт. · спільний залишок кольорів` : 'Тимчасово немає в наявності'}</span><fieldset className={s.variantField}><legend>Колір: <strong>{product.variants[variant].name}</strong></legend><div className={s.variantButtons}>{product.variants.map((v, i) => <button key={v.name} aria-label={`Колір: ${v.name}`} aria-pressed={variant === i} className={variant === i ? s.selectedVariant : ''} onClick={() => setVariant(i)}><i style={{ background: v.color }}/>{variant === i && <Check size={15}/>}</button>)}</div></fieldset><div className={s.productQuantity}><span>Кількість</span><div className={s.quantity}><button aria-label="Менше одиниць" disabled={quantity <= 1} onClick={() => setQuantity(n => n - 1)}><Minus size={15}/></button><span>{Math.min(quantity, Math.max(1, product.stock - used))}</span><button aria-label="Більше одиниць" disabled={quantity >= product.stock - used} onClick={() => setQuantity(n => n + 1)}><Plus size={15}/></button></div></div><div className={s.detailActions}><button className={s.button} disabled={used >= product.stock} onClick={() => { add(product.id, variant, Math.min(quantity, product.stock - used)); setQuantity(1); }}><ShoppingBag size={19}/>{!product.stock ? 'Немає в наявності' : used >= product.stock ? 'Увесь залишок у кошику' : 'Додати до кошика'}<ArrowUpRight size={18}/></button><button className={s.outlineButton} aria-label="Додати або прибрати з обраного" aria-pressed={favorites.includes(product.id)} onClick={() => toggleFavorite(product.id)}><Heart size={21} fill={favorites.includes(product.id) ? 'currentColor' : 'none'}/></button></div><div className={s.specs}><div><span>Матеріал</span><strong>{product.material}</strong></div><div><span>Розміри</span><strong>{product.size}</strong></div><div><span>Артикул</span><strong>FORMA-{product.id.toUpperCase()}</strong></div></div><p className={s.smallNote}>Навчальна колекція. Характеристики вигадані; реальна покупка та доставка не здійснюються.</p></div></div><section className={s.related}><div className={s.sectionHeading}><h2>Гарна компанія для вашого столу</h2></div><div className={s.productGrid}>{products.filter(p => p.category !== product.category && p.tag === 'Вибір FORMA').map(p => <ProductCard product={p} key={p.id}/>)}</div></section></div>;
}
function Favorites() { const { favorites } = useStore(); return <div className={s.page}><Breadcrumb current="Обране"/><div className={s.pageTitle}><h1>Ваше обране<span className={s.titleDot}>.</span></h1><span>{favorites.length} товарів</span></div>{favorites.length ? <div className={s.productGrid}>{products.filter(p => favorites.includes(p.id)).map(p => <ProductCard product={p} key={p.id}/>)}</div> : <Empty title="Збережіть те, що надихає" text="Натисніть сердечко на товарі — він чекатиме на вас тут." icon={<Heart size={36}/>}/>}</div>; }
function Summary({ children, shipping = 0 }: { children?: ReactNode; shipping?: number }) { const { totals } = useStore(); return <aside className={s.summary}><h2>Ваш простір у деталях</h2><div><span>Товари ({totals.quantity})</span><strong>{money(totals.subtotal)}</strong></div><div><span>Демодоставка</span><span>{shipping ? money(shipping) : 'Демо 0 ₴'}</span></div><div className={s.total}><span>Разом</span><strong>{money(totals.subtotal + shipping)}</strong></div>{children}<p><CheckCircle2 size={15}/> Демонстрація без реальної оплати</p><span className={s.smallNote}>Демонстраційний магазин. Реальні замовлення, оплати та доставки не здійснюються.</span></aside>; }
function Cart() {
  const { cart, totals, update } = useStore();
  return <div className={s.page}><Breadcrumb current="Кошик"/><div className={s.pageTitle}><h1>Майже ваш простір<span className={s.titleDot}>.</span></h1><span>У кошику: {totals.quantity}</span></div>{!cart.length ? <Empty title="Усе починається з однієї речі" text="Ваш кошик поки порожній. Знайдіть першу деталь свого простору."/> : <div className={s.checkoutGrid}><div className={s.cartItems}>{cart.map(item => { const p = products.find(p => p.id === item.id)!; const used = cart.filter(i => i.id === p.id).reduce((n, i) => n + i.quantity, 0); return <article className={s.cartItem} key={`${item.id}-${item.variant}`}><Link to={`/products/${p.slug}`} className={s.cartImage}><ProductArt product={p} variant={item.variant}/></Link><div className={s.cartItemInfo}><Link to={`/products/${p.slug}`}><h2>{p.name}</h2></Link><p>{p.variants[item.variant].name} · {money(p.price)} / шт.</p><div className={s.quantity}><button aria-label={`Зменшити кількість: ${p.name}`} disabled={item.quantity <= 1} onClick={() => update(p.id, item.variant, item.quantity - 1)}><Minus size={14}/></button><span aria-label={`Кількість: ${p.name}`}>{item.quantity}</span><button aria-label={`Збільшити кількість: ${p.name}`} disabled={used >= p.stock} onClick={() => update(p.id, item.variant, item.quantity + 1)}><Plus size={14}/></button></div>{used >= p.stock && <small>Увесь доступний залишок у кошику</small>}</div><div className={s.cartItemEnd}><strong>{money(p.price * item.quantity)}</strong><button className={s.deleteButton} aria-label={`Видалити: ${p.name}`} onClick={() => update(p.id, item.variant, 0)}><Trash2 size={17}/></button></div></article>; })}<Link to="/catalog" className={s.textLink}>Продовжити знайомство з колекцією <ArrowUpRight size={17}/></Link></div><Summary><ButtonLink to="/checkout">Оформити демозамовлення</ButtonLink><span className={s.smallNote}>Спосіб демодоставки можна змінити на наступному кроці.</span></Summary></div>}</div>;
}
type Receipt = { id: string; date: string; items: { name: string; variant: string; quantity: number; price: number }[]; subtotal: number; shipping: number; total: number; delivery: string };
function CheckoutPage({ onReceipt }: { onReceipt: (receipt: Receipt) => void }) {
  const { cart, totals, clearCart } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState<Checkout>({ name: '', contact: '', city: '', delivery: 'studio', agreed: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const errorRef = useRef<HTMLDivElement>(null);
  const submitting = useRef(false);
  function field(key: keyof Checkout, value: string | boolean) { const next = { ...form, [key]: value }; setForm(next); if (Object.keys(errors).length) setErrors(validateCheckout(next)); }
  function submit(event: FormEvent) {
    event.preventDefault();
    const errors = validateCheckout(form);
    setErrors(errors);
    if (Object.keys(errors).length) { requestAnimationFrame(() => errorRef.current?.focus()); return; }
    if (!cart.length || submitting.current) return;
    submitting.current = true;
    const delivery = deliveries.find(d => d.id === form.delivery)!;
    const receipt: Receipt = { id: `FORMA-DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, date: new Date().toISOString(), items: cart.map(i => { const p = products.find(p => p.id === i.id)!; return { name: p.name, variant: p.variants[i.variant].name, quantity: i.quantity, price: p.price }; }), subtotal: totals.subtotal, shipping: delivery.price, total: totals.subtotal + delivery.price, delivery: delivery.name };
    onReceipt(receipt); clearCart(); navigate('/receipt');
  }
  if (!cart.length) return <div className={s.page}><Empty title="Спочатку додайте трохи форми" text="Для демозамовлення потрібен хоча б один товар у кошику."/></div>;
  return <div className={s.page}><Breadcrumb current="Демооформлення"/><div className={s.pageTitle}><h1>Останній штрих<span className={s.titleDot}>.</span></h1><span>Кошик → <strong>Демооформлення</strong> → Квитанція</span></div><div className={s.checkoutGrid}><form onSubmit={submit} noValidate className={s.checkoutForm}><div className={s.formNotice}><CheckCircle2 size={22}/><div><strong>Демо — замовлення не надсилається</strong><p>Використовуйте лише вигадане ім’я. Телефон, email та платіжні реквізити не потрібні. Дані форми не зберігаються.</p></div></div>{Object.keys(errors).length > 0 && <div ref={errorRef} tabIndex={-1} role="alert" className={s.errorSummary}>Перевірте поля нижче: {Object.keys(errors).length} помилок.</div>}<h2>01 / Познайомимося умовно</h2><label className={s.formField}>Вигадане ім’я<input autoComplete="off" maxLength={60} placeholder="Наприклад, Олена Приклад" value={form.name} onChange={e => field('name', e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'error-name' : undefined}/>{errors.name && <span id="error-name" className={s.fieldError}>{errors.name}</span>}</label><div className={s.formRow}><label className={s.formField}>Спосіб зв’язку<select value={form.contact} onChange={e => field('contact', e.target.value)} aria-invalid={!!errors.contact} aria-describedby={errors.contact ? 'error-contact' : undefined}><option value="">Оберіть демоканал</option><option value="demo-email">Демо-пошта (без адреси)</option><option value="demo-chat">Демо-чат (без акаунта)</option></select>{errors.contact && <span id="error-contact" className={s.fieldError}>{errors.contact}</span>}</label><label className={s.formField}>Вигадане місто<select value={form.city} onChange={e => field('city', e.target.value)} aria-invalid={!!errors.city} aria-describedby={errors.city ? 'error-city' : undefined}><option value="">Оберіть місто</option>{['Місто Ідей', 'Тиха Долина', 'Новий Простір'].map(city => <option key={city}>{city}</option>)}</select>{errors.city && <span id="error-city" className={s.fieldError}>{errors.city}</span>}</label></div><h2>02 / Демодоставка</h2>{deliveries.map(d => <label className={s.deliveryOption} key={d.id}><input type="radio" name="delivery" value={d.id} checked={form.delivery === d.id} onChange={() => field('delivery', d.id)}/><span>{d.name}<small>Вигадана опція · реальної доставки немає</small></span><strong>{d.price ? money(d.price) : '0 ₴'}</strong></label>)}{errors.delivery && <p className={s.fieldError}>{errors.delivery}</p>}<label className={s.consent}><input type="checkbox" checked={form.agreed} onChange={e => field('agreed', e.target.checked)} aria-describedby={errors.agreed ? 'error-agreed' : undefined}/>Я використовую вигадані дані та розумію, що це демонстрація.</label>{errors.agreed && <p id="error-agreed" className={s.fieldError}>{errors.agreed}</p>}<button className={s.button} type="submit">Створити тестову квитанцію <ArrowUpRight size={18}/></button></form><Summary shipping={deliveries.find(d => d.id === form.delivery)?.price || 0}><div className={s.miniItems}>{cart.map(i => <div key={`${i.id}-${i.variant}`}><span>{products.find(p => p.id === i.id)?.name}<small>{products.find(p => p.id === i.id)?.variants[i.variant].name} · ×{i.quantity}</small></span><span>{money(products.find(p => p.id === i.id)!.price * i.quantity)}</span></div>)}</div><Link className={s.textLink} to="/cart">Редагувати кошик <ArrowRight size={15}/></Link></Summary></div></div>;
}
function ReceiptPage({ receipt }: { receipt: Receipt | null }) {
  if (!receipt) return <div className={s.page}><Empty title="Квитанції поки немає" text="Створіть демозамовлення. Квитанція доступна до закриття або перезавантаження сторінки."/></div>;
  function download() { const blob = new Blob([JSON.stringify({ notice: 'Демо — замовлення не надсилається', ...receipt }, null, 2)], { type: 'application/json;charset=utf-8' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `${receipt!.id}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
  return <div className={s.receiptPage}><div className={s.receiptSuccess}><Check size={32}/></div><span className={s.eyebrow}>ВАШ ТЕСТОВИЙ СЦЕНАРІЙ ЗАВЕРШЕНО</span><h1>Усе набуло форми.</h1><p>Демо — замовлення не надсилається</p><div className={s.receipt}><div className={s.receiptHeader}><span className={s.logo}>forma<span>store</span><i/></span><span>ТЕСТОВА КВИТАНЦІЯ</span></div><div className={s.receiptMeta}><strong>{receipt.id}</strong><span>{new Date(receipt.date).toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })}</span></div>{receipt.items.map((i, n) => <div className={s.receiptRow} key={n}><span>{i.name}<small>{i.variant} · {i.quantity} × {money(i.price)}</small></span><strong>{money(i.quantity * i.price)}</strong></div>)}<div className={s.receiptRow}><span>{receipt.delivery}</span><strong>{money(receipt.shipping)}</strong></div><div className={s.receiptTotal}><span>Демонстраційна сума</span><strong>{money(receipt.total)}</strong></div><p>До сплати: 0 ₴. Кошти не списуються, товари не резервуються. Квитанція створена локально та не містить даних форми.</p></div><div className={s.receiptActions}><button className={s.outlineButton} onClick={download}><Download size={17}/> Зберегти JSON-квитанцію</button><ButtonLink to="/catalog">Повернутися до колекції</ButtonLink></div><p className={s.smallNote}>Збережіть квитанцію, якщо хочете залишити приклад: після перезавантаження вона зникне.</p></div>;
}
function Footer() { return <footer className={s.footer}><div><Link to="/" className={s.logo}>forma<span>store</span><i/></Link><p>Ваша робота. Ваш ритм. Ваша форма.</p></div><nav aria-label="Навігація в підвалі"><Link to="/catalog">Каталог</Link><Link to="/favorites">Обране</Link><Link to="/cart">Кошик</Link></nav><div><span>© 2026 FormaStore</span><p>Авторський навчальний проєкт</p></div></footer>; }
export default function App() {
  const location = useLocation();
  const { notice, storageError } = useStore();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  useEffect(() => {
    if (location.hash) { requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })); }
    else window.scrollTo(0, 0);
    const title = location.pathname.startsWith('/products/') ? products.find(p => location.pathname === `/products/${p.slug}`)?.name : ({ '/': 'Простір для ваших ідей', '/catalog': 'Каталог', '/cart': 'Кошик', '/favorites': 'Обране', '/checkout': 'Демооформлення', '/receipt': 'Тестова квитанція' } as Record<string, string>)[location.pathname];
    document.title = `${title || 'Сторінку не знайдено'} — FormaStore`;
  }, [location.pathname, location.hash]);
  return <div className={s.app}><a className={s.skipLink} href="#main">Перейти до вмісту</a><Header/>{storageError && <div className={s.storageError} role="alert">{storageError}</div>}<main id="main"><Routes><Route path="/" element={<Home/>}/><Route path="/catalog" element={<Catalog/>}/><Route path="/products/:slug" element={<ProductPage/>}/><Route path="/favorites" element={<Favorites/>}/><Route path="/cart" element={<Cart/>}/><Route path="/checkout" element={<CheckoutPage onReceipt={setReceipt}/>}/><Route path="/receipt" element={<ReceiptPage receipt={receipt}/>}/><Route path="*" element={<Empty title="Ця сторінка ще не набула форми" text="Перевірте адресу або поверніться до колекції."/>}/></Routes></main><Footer/><div className={`${s.toast} ${notice ? s.toastVisible : ''}`} role="status" aria-live="polite">{notice && <><CheckCircle2 size={19}/><span>{notice}</span><Link to="/cart">До кошика <ArrowRight size={15}/></Link></>}</div></div>;
}

