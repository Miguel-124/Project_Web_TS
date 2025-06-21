// e2e/tests/login.spec.ts
import { test, expect } from '@playwright/test'

test('loguje się jako admin', async ({ page }) => {
  await page.goto('http://localhost:5173/login')
  await page.getByPlaceholder('Login').fill('admin')
  await page.getByPlaceholder('Hasło').fill('admin123')
  await page.locator('button[type="submit"]').click()
  await expect(page.locator('text=Projekty')).toBeVisible()
})
