import { expect, test } from '@playwright/test';

test('guest checkout reaches review step', async ({ page }) => {
  await page.route('**/api/v1/pricing/delivery-options', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 'STANDARD',
          label: 'Livrare standard',
          fee: '19.90',
          estimatedDaysMin: 2,
          estimatedDaysMax: 3,
        },
      ]),
    });
  });

  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem(
      'pantano_cart',
      JSON.stringify({
        state: {
          items: [
            {
              variantId: 'var-2',
              productId: 'prod-2',
              name: 'Bormașină test',
              slug: 'bormasina-test',
              price: '199.00',
              quantity: 1,
              imageUrl: null,
              ean: '5940000000001',
              sku: 'SKU-2',
            },
          ],
        },
        version: 0,
      }),
    );
  });
  await page.goto('/checkout/login');

  await page.getByRole('button', { name: 'Continuă ca oaspete' }).click();
  await expect(page).toHaveURL(/\/checkout\/address/);

  await page.locator('#lastName').fill('Popescu');
  await page.locator('#firstName').fill('Ion');
  await page.locator('#email').fill('guest@example.com');
  await page.locator('#phone').fill('0712345678');
  await page.locator('#addressLine1').fill('Strada Test 12');
  await page.locator('#city').fill('București');
  await page.locator('#postalCode').fill('010101');
  await page.getByRole('button', { name: 'Continuă la livrare' }).click();

  await expect(page).toHaveURL(/\/checkout\/delivery/);
  await page.getByText('Livrare standard').click();
  await page.getByRole('button', { name: 'Continuă la confirmare' }).click();

  await expect(page).toHaveURL(/\/checkout\/review/);
});
