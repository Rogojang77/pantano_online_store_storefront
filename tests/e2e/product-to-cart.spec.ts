import { expect, test } from '@playwright/test';

test('cart renders seeded product and allows checkout navigation', async ({ page }) => {
  await page.goto('/cart');

  await page.evaluate(() => {
    localStorage.setItem(
      'pantano_cart',
      JSON.stringify({
        state: {
          items: [
            {
              variantId: 'var-1',
              productId: 'prod-1',
              name: 'Ciocan test',
              slug: 'ciocan-test',
              price: '49.90',
              quantity: 1,
              imageUrl: null,
              ean: '5940000000000',
              sku: 'SKU-1',
            },
          ],
        },
        version: 0,
      }),
    );
  });

  await page.reload();

  await expect(page.getByText('Ciocan test')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Finalizează comanda' })).toBeVisible();
});
