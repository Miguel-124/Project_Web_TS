// e2e/tests/create-story.spec.ts
import { test, expect } from '@playwright/test'

test('tworzy historyjkę w projekcie', async ({ page }) => {
  await page.goto('http://localhost:5173/login')
  await page.getByPlaceholder('Login').fill('admin')
  await page.getByPlaceholder('Hasło').fill('admin123')
  await page.locator('button[type="submit"]').click()

  await page.waitForSelector('text=Projekty')
  const projekt = page.locator('.project-item', { hasText: 'Projekt e2e' })
  await projekt.locator('button.btn-open').click()

  await page.getByPlaceholder('Nazwa historyjki').fill('Nowa historyjka e2e')
  await page.locator('button.btn-add').click()
  await expect(page.locator('.project-item', { hasText: 'Nowa historyjka e2e' })).toBeVisible()
})
