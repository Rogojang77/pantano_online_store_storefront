import { expect, test } from '@playwright/test';

test('login redirects to account dashboard', async ({ page }) => {
  await page.route('**/api/v1/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        accessToken: 'fake-token',
        user: {
          id: 'u-1',
          email: 'qa@pantano.ro',
          firstName: 'QA',
          lastName: 'User',
          accountType: 'INDIVIDUAL',
          isVatPayer: false,
        },
      }),
    });
  });

  await page.goto('/cont');
  await page.getByLabel('Email').fill('qa@pantano.ro');
  await page.getByLabel('Parolă').fill('Password123!');
  await page.getByRole('button', { name: 'Autentificare' }).click();

  await expect(page).toHaveURL(/\/cont\/dashboard/);
});
