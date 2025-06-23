import { test, expect } from '@playwright/test'

test('tworzy zadanie w historyjce', async ({ page }) => {
  // Logowanie
  await page.goto('http://localhost:5173/login')
  await page.getByPlaceholder('Login').fill('admin')
  await page.getByPlaceholder('Hasło').fill('admin123')
  await page.locator('button[type="submit"]').click()
  await page.waitForSelector('text=Projekty')

  // Tworzenie projektu
  await page.getByPlaceholder('Nazwa projektu').fill('Projekt e2e')
  await page.locator('textarea[placeholder="Opis projektu"]').fill('Opis testowy')
  await page.locator('button.btn-add').click()
  const projekt = page.locator('.project-item', { hasText: 'Projekt e2e' })
  await projekt.locator('button.btn-open').click()

  // Tworzenie historyjki
  await page.getByPlaceholder('Nazwa historyjki').fill('Nowa historyjka e2e')
  await page.locator('button.btn-add').click()
  const story = page.locator('.project-item', { hasText: 'Nowa historyjka e2e' })
  await story.locator('a.btn-open', { hasText: 'Zadania' }).click()
  await expect(page).toHaveURL(/\/story\/\d+\/tasks/)

  // Tworzenie zadania
  await page.getByPlaceholder('Nazwa zadania').fill('Zadanie testowe e2e')
  await page.getByPlaceholder('Opis zadania').fill('Opis do zadania e2e')
  await page.getByPlaceholder('Szacowany czas \(h\)').fill('3')
  await page.selectOption('select', 'medium')
  await page.locator('button.btn-add', { hasText: 'Dodaj zadanie' }).click()

  await expect(page.locator('.kanban-card', { hasText: 'Zadanie testowe e2e' })).toBeVisible()
})
