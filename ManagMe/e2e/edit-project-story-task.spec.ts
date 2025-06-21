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
  const projekt = page.locator('.project-item', { hasText: 'Edytuj projekt' })
  await projekt.locator('button.btn-open').click()
}

test('edycja projektu, historyjki i zadania', async ({ page }) => {
  await loginAndCreateProject(page)

  // Edytuj projekt
  await page.locator('button.btn-edit', { hasText: 'Edytuj projekt' }).click()
  await page.getByPlaceholder('Nazwa projektu').fill('Projekt po edycji')
  await page.locator('textarea[placeholder="Opis projektu"]').fill('Zmieniony opis')
  await page.locator('button.btn-save').click()
  await expect(page.locator('.project-header')).toContainText('Projekt po edycji')

  // Dodaj i edytuj historyjkę
  await page.getByPlaceholder('Nazwa historyjki').fill('Historyjka do edycji')
  await page.locator('button.btn-add').click()
  const story = page.locator('.project-item', { hasText: 'Historyjka do edycji' })
  await story.locator('button.btn-edit').click()
  await page.getByPlaceholder('Nazwa historyjki').fill('Historyjka po edycji')
  await page.locator('button.btn-save').click()
  await expect(page.locator('.project-item')).toContainText('Historyjka po edycji')

  // Przejdź do zadań i edytuj zadanie
  await story.locator('a.btn-open', { hasText: 'Zadania' }).click()
  await page.getByPlaceholder('Nazwa zadania').fill('Zadanie do edycji')
  await page.getByPlaceholder('Opis zadania').fill('Opis A')
  await page.getByPlaceholder('Szacowany czas \(h\)').fill('1')
  await page.selectOption('select', 'low')
  await page.locator('button.btn-add', { hasText: 'Dodaj zadanie' }).click()

  const card = page.locator('.kanban-card', { hasText: 'Zadanie do edycji' })
  await card.locator('a', { hasText: 'Szczegóły' }).click()
  await page.locator('button.btn-edit', { hasText: 'Edytuj' }).click()
  await page.getByPlaceholder('Nazwa zadania').fill('Zadanie po edycji')
  await page.getByPlaceholder('Opis zadania').fill('Nowy opis')
  await page.getByPlaceholder('Szacowany czas \(h\)').fill('5')
  await page.selectOption('select', 'high')
  await page.locator('button', { hasText: 'Zapisz' }).click()
  await expect(page.locator('p', { hasText: 'Nazwa:' })).toContainText('Zadanie po edycji')
})
