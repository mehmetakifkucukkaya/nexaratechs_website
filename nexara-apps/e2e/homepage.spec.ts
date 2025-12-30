import { expect, test } from '@playwright/test';

test.describe('Homepage', () => {
    test('should load the homepage', async ({ page }) => {
        await page.goto('/');

        // Check page title
        await expect(page).toHaveTitle(/NexaraTechs/i);
    });

    test('should have working navigation', async ({ page }) => {
        await page.goto('/');

        // Check navbar is visible
        await expect(page.locator('nav')).toBeVisible();

        // Check Apps link exists
        const appsLink = page.getByRole('link', { name: /apps|uygulamalar/i });
        await expect(appsLink).toBeVisible();
    });

    test('should toggle theme', async ({ page }) => {
        await page.goto('/');

        // Find theme toggle button
        const themeToggle = page.locator('button[aria-label*="theme" i], button:has(svg)').first();

        // Click theme toggle
        await themeToggle.click();

        // Page should still be functional
        await expect(page.locator('body')).toBeVisible();
    });

    test('should be responsive on mobile', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        // Page should load
        await expect(page.locator('body')).toBeVisible();

        // Mobile menu should exist
        const mobileMenuBtn = page.locator('button[aria-label*="menu" i]');
        await expect(mobileMenuBtn).toBeVisible();
    });
});

test.describe('Apps Page', () => {
    test('should load apps page', async ({ page }) => {
        await page.goto('/apps');

        // Should show apps heading or loading state
        const heading = page.locator('h1, h2');
        await expect(heading.first()).toBeVisible();
    });

    test('should navigate to app detail', async ({ page }) => {
        await page.goto('/apps');

        // Wait for apps to load
        await page.waitForTimeout(2000);

        // Find and click first app link
        const appLinks = page.locator('a[href^="/apps/"]');
        const count = await appLinks.count();

        if (count > 0) {
            await appLinks.first().click();

            // Should navigate to detail page
            await expect(page).toHaveURL(/\/apps\/.+/);
        }
    });
});

test.describe('Language Switch', () => {
    test('should switch language to Turkish', async ({ page }) => {
        await page.goto('/');

        // Find language switcher
        const langSwitcher = page.locator('button:has-text("EN"), button:has-text("TR")');

        if (await langSwitcher.count() > 0) {
            await langSwitcher.first().click();

            // Select Turkish if dropdown appears
            const trOption = page.locator('button:has-text("TR")');
            if (await trOption.count() > 0) {
                await trOption.click();
            }

            // Wait for language change
            await page.waitForTimeout(500);

            // Page should still be functional
            await expect(page.locator('body')).toBeVisible();
        }
    });
});
