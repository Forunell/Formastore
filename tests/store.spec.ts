import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

test('пошук, порожній результат, фільтри, скидання та сортування', async ({ page }) => {
  await page.goto('/catalog');
  await expect(page.getByRole('article')).toHaveCount(24);
  await page.getByRole('textbox', { name: 'Пошук товарів' }).fill('Лампа Arc');
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Лампа Arc', exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'Пошук товарів' }).fill('zzzzz');
  await expect(page.getByRole('heading', { name: 'Поки нічого не знайшли' })).toBeVisible();
  await page.getByRole('button', { name: 'Скинути фільтри' }).last().click();
  await expect(page.getByRole('article')).toHaveCount(24);
  await page.getByRole('radio', { name: 'Освітлення' }).click();
  await expect(page.getByRole('radio', { name: 'Освітлення' })).toBeChecked();
  await page.getByRole('spinbutton', { name: 'Мінімальна ціна' }).fill('2000');
  await page.getByRole('spinbutton', { name: 'Максимальна ціна' }).fill('2800');
  await expect(page.getByRole('article')).toHaveCount(3);
  await page.getByLabel('Сортування').selectOption('price-desc');
  await expect(page.getByRole('article').first().getByRole('heading')).toHaveText('Лампа Halo');
  await page.getByLabel('Сортування').selectOption('price-asc');
  await expect(page.getByRole('article').first().getByRole('heading')).toHaveText('Лампа Line');
  await page.getByLabel('Сортування').selectOption('name');
  await expect(page.getByRole('article').first().getByRole('heading')).toHaveText('Лампа Arc');
  await page.reload();
  await expect(page.getByRole('article')).toHaveCount(3);
  await page.getByRole('button', { name: 'Скинути фільтри' }).click();
  await expect(page.getByRole('article')).toHaveCount(24);
  // Changing another filter must preserve search text still in its debounce window.
  await page.getByRole('textbox', { name: 'Пошук товарів' }).fill('Лампа Arc');
  await page.getByLabel('Сортування').selectOption('price-asc');
  await expect(page.getByRole('textbox', { name: 'Пошук товарів' })).toHaveValue('Лампа Arc');
  await expect(page.getByRole('article')).toHaveCount(1);
});

test('два товари, перерахунок, перезавантаження, видалення, порожній кошик', async ({ page }) => {
  await page.goto('/catalog');
  await page.getByRole('button', { name: 'Додати до кошика: Лампа Arc', exact: true }).click();
  await page.getByRole('button', { name: 'Додати до кошика: Підставка Rise', exact: true }).click();
  await page.getByRole('link', { name: 'Кошик: 2', exact: true }).click();
  await expect(page.getByText('4 180 ₴', { exact: true }).first()).toBeVisible();
  await page.getByRole('button', { name: 'Збільшити кількість: Лампа Arc' }).click();
  await expect(page.getByText('6 670 ₴', { exact: true }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByRole('link', { name: 'Кошик: 3', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Зменшити кількість: Лампа Arc' }).click();
  await page.getByRole('button', { name: 'Видалити: Підставка Rise' }).click();
  await expect(page.getByRole('link', { name: 'Кошик: 1', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Видалити: Лампа Arc' }).click();
  await expect(page.getByRole('heading', { name: 'Усе починається з однієї речі' })).toBeVisible();
});

test('прямий URL, галерея, кольори, спільний залишок та відсутній товар', async ({ page }) => {
  await page.goto('/products/fold');
  await expect(page.getByRole('heading', { name: 'Підставка Fold', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Показати деталі' }).click();
  await expect(page.getByRole('button', { name: 'Показати деталі' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Додати до кошика', exact: true }).click();
  await page.getByRole('button', { name: 'Колір: Графіт' }).click();
  await page.getByRole('button', { name: 'Додати до кошика', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Увесь залишок у кошику' })).toBeDisabled();
  await page.goto('/cart');
  await expect(page.getByRole('article')).toHaveCount(2);
  for (const button of await page.getByRole('button', { name: 'Збільшити кількість: Підставка Fold' }).all()) await expect(button).toBeDisabled();
  await page.goto('/products/line');
  await expect(page.getByRole('button', { name: 'Немає в наявності', exact: true })).toBeDisabled();
  await page.goto('/products/not-real');
  await expect(page.getByRole('heading', { name: 'Такої форми ще немає' })).toBeVisible();
});

test('обране зберігається і видаляється', async ({ page }) => {
  await page.goto('/catalog');
  await page.getByRole('button', { name: 'Додати в обране: Лампа Arc', exact: true }).click();
  await page.getByRole('link', { name: 'Обране: 1', exact: true }).click();
  await expect(page.getByRole('article')).toHaveCount(1);
  await page.reload();
  await expect(page.getByRole('article')).toHaveCount(1);
  await page.getByRole('button', { name: 'Прибрати з обраного: Лампа Arc', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Збережіть те, що надихає' })).toBeVisible();
});

test('валідація і повний локальний сценарій без зовнішніх запитів', async ({ page }) => {
  const external: string[] = [];
  page.on('request', r => { if (/^https?:/.test(r.url()) && !r.url().startsWith('http://127.0.0.1:5173')) external.push(r.url()); });
  await page.goto('/products/arc');
  await page.getByRole('button', { name: 'Додати до кошика', exact: true }).click();
  await page.goto('/checkout');
  await page.getByRole('button', { name: 'Створити тестову квитанцію' }).click();
  await expect(page.getByRole('alert')).toContainText('Перевірте поля');
  await expect(page.getByText('Вкажіть вигадане ім’я: від 2 до 60 символів.')).toBeVisible();
  await page.getByLabel('Вигадане ім’я').fill('Олена Приклад');
  await page.getByLabel('Спосіб зв’язку').selectOption('demo-chat');
  await page.getByLabel('Вигадане місто').selectOption('Місто Ідей');
  await page.getByRole('radio', { name: /Демо-кур’єр/ }).check();
  await expect(page.getByText('2 580 ₴', { exact: true })).toBeVisible();
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Створити тестову квитанцію' }).click();
  await expect(page).toHaveURL(/\/receipt$/);
  await expect(page.getByRole('heading', { name: 'Усе набуло форми.' })).toBeVisible();
  await expect(page.getByText('Демо — замовлення не надсилається', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Кошик: 0', exact: true })).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Зберегти JSON-квитанцію' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^FORMA-.*\.json$/);
  const stream = await download.createReadStream();
  let data = ''; for await (const chunk of stream!) data += chunk;
  const receipt = JSON.parse(data);
  expect(receipt.total).toBe(2580);
  expect(receipt.items[0].name).toBe('Лампа Arc');
  expect(data).not.toContain('Олена');
  expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain('Олена');
  expect(external).toEqual([]);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Квитанції поки немає' })).toBeVisible();
});

test('зіпсоване сховище та заборона localStorage', async ({ page }) => {
  await page.addInitScript(() => { localStorage.setItem('forma-cart-v1', '{broken'); });
  await page.goto('/cart');
  await expect(page.getByRole('alert')).toContainText('Не вдалося відновити');
  await expect(page.getByRole('heading', { name: 'Усе починається з однієї речі' })).toBeVisible();
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('blocked'); }; });
  await page.goto('/catalog');
  await expect(page.getByRole('alert')).toContainText('Браузер не дозволяє збереження');
  await page.getByRole('button', { name: 'Додати до кошика: Лампа Arc', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Кошик: 1', exact: true })).toBeVisible();
});

for (const width of [390, 768, 1440]) {
  test(`адаптивність, меню, фільтри та кошик: ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    for (const path of ['/', '/catalog', '/products/arc', '/favorites', '/cart', '/checkout', '/not-found']) {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
    await page.goto('/');
    if (width < 1000) {
      await page.getByRole('button', { name: 'Відкрити меню' }).click();
      await page.getByRole('navigation', { name: 'Мобільна навігація' }).getByRole('link', { name: 'Усі товари' }).click();
      await expect(page).toHaveURL(/\/catalog$/);
    } else await page.goto('/catalog');
    if (width <= 800) await page.getByRole('button', { name: 'Фільтри', exact: true }).click();
    await page.getByRole('radio', { name: 'Освітлення' }).click();
    await expect(page.getByRole('radio', { name: 'Освітлення' })).toBeChecked();
    if (width <= 800) await page.getByRole('button', { name: 'Показати товари (6)' }).click();
    await expect(page.getByRole('article')).toHaveCount(6);
    await page.getByRole('button', { name: 'Додати до кошика: Лампа Arc', exact: true }).click();
    await page.getByRole('link', { name: 'Кошик: 1', exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.getByRole('link', { name: 'Оформити демозамовлення' }).click();
    await expect(page.getByLabel('Вигадане ім’я')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test('скриншоти та клавіатурна навігація', async ({ page }) => {
  await mkdir('docs/screenshots', { recursive: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Перейти до вмісту' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'FormaStore — головна' })).toBeFocused();
  await page.mouse.click(1350, 110);
  await page.screenshot({ path: 'docs/screenshots/01-home-1440.png', fullPage: true });
  await page.goto('/catalog');
  await page.screenshot({ path: 'docs/screenshots/02-catalog-1440.png', fullPage: true });
  await page.goto('/products/arc');
  await page.screenshot({ path: 'docs/screenshots/03-product-1440.png', fullPage: true });
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/');
  await page.screenshot({ path: 'docs/screenshots/04-home-360.png', fullPage: true });
  await page.setViewportSize({ width: 768, height: 1000 });
  await page.goto('/catalog');
  await page.screenshot({ path: 'docs/screenshots/05-catalog-768.png', fullPage: true });
});
