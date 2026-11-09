import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

test('SKU, матеріал, колір, чипи та URL', async ({ page }) => {
  await page.goto('/catalog?q=FORMA-ARC');
  await expect(page.getByRole('article')).toHaveCount(1);
  await page.getByRole('button', { name: 'Прибрати фільтр: Пошук: FORMA-ARC' }).click();
  await expect(page.getByRole('article')).toHaveCount(24);
  await page.getByRole('radio', { name: 'Освітлення' }).click();
  await expect(page.getByRole('radio', { name: 'Освітлення' })).toBeChecked();
  await page.getByLabel('Матеріал', { exact: true }).selectOption('Метал із матовим покриттям');
  await page.getByRole('button', { name: 'Пісок', exact: true }).click();
  await page.getByLabel('Мінімальна ціна').fill('2400');
  await page.getByLabel('Максимальна ціна').fill('3200');
  await page.getByLabel('Сортування').selectOption('price-desc');
  await expect(page.getByRole('article')).toHaveCount(3);
  await expect(page.getByRole('article').first().getByRole('heading')).toHaveText('Лампа Orbit');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Пісок', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('article')).toHaveCount(3);
  await page.getByLabel('Матеріал', { exact: true }).selectOption('Дерево та алюміній');
  await expect(page.getByRole('heading', { name: 'Поки нічого не знайшли' })).toBeVisible();
  await page.getByRole('button', { name: 'Скинути фільтри' }).last().click();
  await expect(page.getByRole('article')).toHaveCount(24);
  await expect(page.getByLabel('Застосовані фільтри')).toHaveCount(0);
});

test('діалоги утримують фокус і відновлюють його після Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/catalog');
  const trigger = page.getByRole('button', { name: 'Фільтри', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Фільтри', exact: true });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Shift+Tab');
  expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBe(true);
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await page.goto('/products/arc');
  const zoom = page.getByRole('button', { name: 'Збільшити зображення' });
  await zoom.click();
  await expect(page.getByRole('dialog', { name: 'Лампа Arc' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(zoom).toBeFocused();
});

test('галерея, кількість і обране синхронні між сторінками', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Додати в обране: Лампа Arc', exact: true }).click();
  await page.goto('/products/arc');
  await expect(page.getByRole('button', { name: 'Додати або прибрати з обраного' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Колір: Пісок' }).click();
  await page.getByRole('button', { name: 'Показати деталі' }).click();
  await expect(page.getByRole('button', { name: 'Збільшити зображення' }).getByRole('img')).toHaveAttribute('aria-label', /Пісок, деталі/);
  await page.getByRole('button', { name: 'Більше одиниць' }).click();
  await page.getByRole('button', { name: 'Додати до кошика', exact: true }).click();
  await page.getByRole('link', { name: 'Кошик: 2', exact: true }).click();
  await expect(page.getByText('4 980 ₴', { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/Пісок ·/)).toBeVisible();
  await page.getByRole('link', { name: 'Оформити демозамовлення' }).click();
  await page.getByRole('link', { name: 'Редагувати кошик' }).click();
  await expect(page.getByRole('link', { name: 'Кошик: 2', exact: true })).toBeVisible();
});

test('локальні функції без мережі та пошкоджені записи', async ({ page, context }) => {
  await page.addInitScript(() => {
    localStorage.setItem('forma-cart-v1', JSON.stringify([{ id: 'deleted', variant: 0, quantity: 3 }, { id: 'line', variant: 0, quantity: 1 }, { id: 'arc', variant: 0, quantity: 1 }]));
  });
  await page.goto('/catalog');
  await expect(page.getByRole('link', { name: 'Кошик: 1', exact: true })).toBeVisible();
  await context.setOffline(true);
  await page.getByRole('textbox', { name: 'Пошук товарів', exact: true }).fill('FORMA-RISE');
  await expect(page.getByRole('article')).toHaveCount(1);
  await page.getByRole('button', { name: 'Додати до кошика: Підставка Rise', exact: true }).click();
  await page.getByRole('link', { name: 'Кошик: 2', exact: true }).click();
  await expect(page.getByText('4 180 ₴', { exact: true }).first()).toBeVisible();
});

test('зображення має резервний стан, reduced motion вимикає анімації', async ({ page }) => {
  await page.route('**/images/warm-editorial-hero.jpg', route => route.abort());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByText('Демоілюстрація · зображення недоступне')).toBeVisible();
  await expect(page.getByRole('link', { name: /Знайти свою форму/ })).toBeVisible();
  const duration = await page.getByRole('link', { name: /Знайти свою форму/ }).evaluate(el => getComputedStyle(el).transitionDuration);
  expect(duration).toBe('0s');
});

for (const width of [390, 768, 1440]) {
  test(`повний шлях і скриншоти всіх сторінок ${width}px`, async ({ page }) => {
    await mkdir('docs/screenshots/warm-editorial', { recursive: true });
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    const capture = async (name: string) => {
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.screenshot({ path: `docs/screenshots/warm-editorial/${name}-${width}.png`, fullPage: true, animations: 'disabled' });
    };
    await page.goto('/');
    await expect(page.locator('img')).toHaveJSProperty('complete', true);
    await expect(page.locator('img')).toHaveJSProperty('naturalWidth', 1536);
    await capture('home');
    await page.goto('/catalog');
    await capture('catalog');
    await page.getByRole('button', { name: 'Додати в обране: Лампа Arc', exact: true }).click();
    await page.getByRole('link', { name: 'Обране: 1', exact: true }).click();
    await capture('favorites');
    await page.getByRole('link', { name: 'Переглянути Лампа Arc' }).click();
    await capture('product');
    await page.getByRole('button', { name: 'Додати до кошика', exact: true }).click();
    await page.getByRole('link', { name: 'Кошик: 1', exact: true }).click();
    await page.getByRole('button', { name: 'Збільшити кількість: Лампа Arc' }).click();
    await page.reload();
    await expect(page.getByRole('link', { name: 'Кошик: 2', exact: true })).toBeVisible();
    await capture('cart');
    await page.getByRole('link', { name: 'Оформити демозамовлення' }).click();
    await page.getByRole('button', { name: 'Створити тестову квитанцію' }).click();
    await expect(page.getByRole('alert')).toContainText('Перевірте поля');
    await page.getByLabel('Вигадане ім’я').fill('Олена Приклад');
    await page.getByLabel('Спосіб зв’язку').selectOption('demo-chat');
    await page.getByLabel('Вигадане місто').selectOption('Місто Ідей');
    await page.getByRole('radio', { name: /Демо-кур’єр/ }).check();
    await page.getByRole('checkbox').check();
    await expect(page.getByRole('alert')).toHaveCount(0);
    await expect(page.getByText('5 070 ₴', { exact: true })).toBeVisible();
    await capture('checkout');
    await page.getByRole('button', { name: 'Створити тестову квитанцію' }).click();
    await expect(page.getByText(/FORMA-DEMO-/)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Кошик: 0', exact: true })).toBeVisible();
    await capture('receipt');
    expect(errors).toEqual([]);
  });
}
