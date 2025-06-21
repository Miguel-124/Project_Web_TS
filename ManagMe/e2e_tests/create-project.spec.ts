// e2e/tests/create-project.spec.ts
import { test, expect } from '@playwright/test'

test('tworzy nowy projekt', async ({ page }) => {
  await page.goto('http://localhost:5173/login')
  await page.getByPlaceholder('Login').fill('admin')
  await page.getByPlaceholder('Hasło').fill('admin123')
  await page.locator('button[type="submit"]').click()

  await page.waitForSelector('text=Projekty')
  await page.getByPlaceholder('Nazwa projektu').fill('Projekt e2e')
  await page.locator('textarea[placeholder="Opis projektu"]').fill('Opis e2e')
  await page.locator('button.btn-add').click()
  await expect(page.locator('.project-details', { hasText: 'Projekt e2e' })).toBeVisible()
})
