import { test, expect, Page } from '@playwright/test'

const loginAndCreateProject = async (page: Page) => {
  await page.goto('http://localhost:5173/login')
  await page.getByPlaceholder('Login').fill('admin')
  await page.getByPlaceholder('Hasło').fill('admin123')
  await page.locator('button[type="submit"]').click()
  await page.waitForSelector('text=Projekty')

  await page.getByPlaceholder('Nazwa projektu').fill('Edytuj projekt')
  await page.locator('textarea[placeholder="Opis projektu"]').fill('Opis testowy')
  await page.locator('button.btn-add').click()
}

test('edycja projektu i zadania (bez edycji historyjki)', async ({ page }) => {
  await loginAndCreateProject(page)

  // Edytuj projekt (na stronie głównej)
  const projekt = page.locator('.project-item', { hasText: 'Edytuj' })
  await projekt.locator('a.btn-edit').click()
  await page.getByPlaceholder('Nazwa projektu').fill('Projekt po edycji')
  await page.locator('textarea[placeholder="Opis projektu"]').fill('Zmieniony opis')
  await page.locator('button.btn-save').click()
  await expect(page.locator('.project-item')).toContainText('Projekt po edycji')

  // Otwórz projekt i dodaj historyjkę
  await projekt.locator('button.btn-open').click()
  await page.getByPlaceholder('Nazwa historyjki').fill('Historyjka testowa')
  await page.locator('button.btn-add').click()

  const story = page.locator('.project-item', { hasText: 'Historyjka testowa' })
  await story.locator('a.btn-open', { hasText: 'Zadania' }).click()

  // Dodaj zadanie
  await page.getByPlaceholder('Nazwa zadania').fill('Zadanie testowe')
  await page.getByPlaceholder('Opis zadania').fill('Opis testowy')
  await page.getByPlaceholder('Szacowany czas \(h\)').fill('1')
  await page.selectOption('select', 'low')
  await page.locator('button.btn-add', { hasText: 'Dodaj zadanie' }).click()

  // Wejdź w szczegóły zadania i edytuj
  const card = page.locator('.kanban-card', { hasText: 'Zadanie testowe' })
await card.locator('a', { hasText: 'Szczegóły' }).click()
await page.locator('button.btn-edit').click()
const inputs = page.locator('input.input')
const textarea = page.locator('textarea.textarea')
await inputs.nth(0).fill('Zadanie po edycji')
await textarea.fill('Nowy opis')
await inputs.nth(1).fill('5')
await page.selectOption('select', 'high')
await page.locator('button.btn-save').click()

await expect(page.locator('p', { hasText: 'Nazwa:' })).toContainText('Zadanie po edycji')
})
