import { expect, test } from '@playwright/test';

test('search shows empty recovery when no products', async ({ page }) => {
  await page.route('**/api/v1/search/products**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 24,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      }),
    });
  });

  await page.goto('/cautare?q=ciocan');

  await expect(page.getByText('Niciun rezultat')).toBeVisible();
});
