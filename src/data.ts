export type Category = 'lamps' | 'stands' | 'mats' | 'chargers';
export type Product = {
  id: string; slug: string; name: string; category: Category; price: number;
  stock: number; color: string; background: string; material: string; size: string;
  description: string; tag?: string; variants: { name: string; color: string }[];
};
export const categories: { id: Category; name: string; caption: string }[] = [
  { id: 'lamps', name: 'Освітлення', caption: 'Світло для нових ідей' },
  { id: 'stands', name: 'Підставки', caption: 'Усе на своєму місці' },
  { id: 'mats', name: 'Килимки', caption: 'Основа вашого простору' },
  { id: 'chargers', name: 'Зарядні пристрої', caption: 'Енергія для вашого дня' },
];
type Seed = [string, string, number, number, string, string, string?];
const seeds: Record<Category, Seed[]> = {
  lamps: [
    ['arc', 'Лампа Arc', 2490, 8, '#b66a47', '#eee0d1', 'Вибір FORMA'],
    ['orbit', 'Лампа Orbit', 3190, 5, '#676e50', '#e8dfd1', 'Нове'],
    ['beam', 'Лампа Beam', 1890, 12, '#d1b164', '#f0e5cc'],
    ['halo', 'Лампа Halo', 2790, 3, '#d8c7b6', '#e6dad3'],
    ['line', 'Лампа Line', 2290, 0, '#555c65', '#e8e0d8'],
    ['dune', 'Лампа Dune', 3590, 6, '#ad7867', '#efdfd7'],
  ],
  stands: [
    ['rise', 'Підставка Rise', 1690, 10, '#b68e64', '#e8ded2', 'Вибір FORMA'],
    ['lift', 'Підставка Lift', 1290, 8, '#687572', '#e8dfd3'],
    ['slope', 'Підставка Slope', 2190, 4, '#b5b6b1', '#e9e0d6', 'Нове'],
    ['perch', 'Підставка Perch', 990, 14, '#ad7a59', '#e9dccb'],
    ['fold', 'Підставка Fold', 1490, 2, '#656a78', '#e4d9ce'],
    ['frame', 'Підставка Frame', 2590, 7, '#c7aa82', '#eee6d9'],
  ],
  mats: [
    ['field', 'Килимок Field', 890, 18, '#7c896b', '#e6decf', 'Вибір FORMA'],
    ['terra', 'Килимок Terra', 1090, 12, '#be7658', '#f0e0d3', 'Нове'],
    ['soft', 'Килимок Soft', 690, 20, '#ad907b', '#e7dbd2'],
    ['grid', 'Килимок Grid', 790, 9, '#69705b', '#e3d8ca'],
    ['plain', 'Килимок Plain', 1190, 0, '#d0bba0', '#eee6dc'],
    ['wide', 'Килимок Wide', 1390, 6, '#555d55', '#e5dbce'],
  ],
  chargers: [
    ['pebble', 'Зарядна станція Pebble', 1490, 11, '#d3b5a1', '#eee1d9', 'Вибір FORMA'],
    ['loop', 'Зарядна станція Loop', 1990, 7, '#717b6c', '#e6ddcf', 'Нове'],
    ['dot', 'Зарядний пристрій Dot', 790, 16, '#c2b5a3', '#ebe0d4'],
    ['duo', 'Зарядна станція Duo', 2490, 3, '#b28469', '#eadccf'],
    ['pulse', 'Зарядний пристрій Pulse', 1290, 9, '#65676d', '#e5dbd2'],
    ['nest', 'Зарядна станція Nest', 2890, 5, '#b5b58e', '#e9e8d9'],
  ],
};
const details: Record<Category, { material: string; size: string; description: string }> = {
  lamps: { material: 'Метал із матовим покриттям', size: 'Висота 38 см · основа 18 см', description: 'М’яке світло та виразна форма для зосередженої роботи. Плавні лінії додають простору характеру, а компактна основа залишає місце для ваших ідей.' },
  stands: { material: 'Дерево та алюміній', size: '28 × 22 × 14 см', description: 'Підніміть робочий ритм на новий рівень. Лаконічна підставка впорядковує стіл і звільняє місце для щоденних дрібниць.' },
  mats: { material: 'Екошкіра та коркова основа', size: '80 × 40 см · товщина 3 мм', description: 'Тактильна основа для щоденних ритуалів. Приємна поверхня об’єднує клавіатуру, нотатки та улюблену чашку в один охайний простір.' },
  chargers: { material: 'Матовий полімер та силікон', size: '14 × 14 × 2 см', description: 'Менше візуального шуму, більше енергії. Компактний аксесуар із м’якими контурами підтримує порядок у вашому робочому просторі.' },
};
export const products: Product[] = categories.flatMap(({ id: category }) => seeds[category].map(([slug, name, price, stock, color, background, tag]) => ({
  id: slug, slug, name, category, price, stock, color, background, tag,
  ...details[category], variants: [{ name: 'Авторський', color }, { name: 'Графіт', color: '#4c504b' }, { name: 'Пісок', color: '#c8b99e' }],
})));
export const money = (value: number) => new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 }).format(value) + ' ₴';
