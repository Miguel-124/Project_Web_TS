// import { test, expect, Page } from '@playwright/test'

// const loginAndCreateProject = async (page: Page) => {
//   await page.goto('http://localhost:5173/login')
//   await page.getByPlaceholder('Login').fill('admin')
//   await page.getByPlaceholder('Hasło').fill('admin123')
//   await page.locator('button[type="submit"]').click()
//   await page.waitForSelector('text=Projekty')

//   await page.getByPlaceholder('Nazwa projektu').fill('Projekt do usunięcia')
//   await page.locator('textarea[placeholder="Opis projektu"]').fill('Opis testowy')
//   await page.locator('button.btn-add').click()
//   const projekt = page.locator('.project-item', { hasText: 'Projekt do usunięcia' })
//   await projekt.locator('button.btn-open').click()

//   await page.getByPlaceholder('Nazwa historyjki').fill('Historia do usunięcia')
//   await page.locator('button.btn-add').click()
//   const story = page.locator('.project-item', { hasText: 'Historia do usunięcia' })
//   await story.locator('a.btn-open', { hasText: 'Zadania' }).click()

//   await page.getByPlaceholder('Nazwa zadania').fill('Zadanie do usunięcia')
//   await page.getByPlaceholder('Opis zadania').fill('Opis X')
//   await page.getByPlaceholder('Szacowany czas \(h\)').fill('2')
//   await page.selectOption('select', 'medium')
//   await page.locator('button.btn-add', { hasText: 'Dodaj zadanie' }).click()
// }

// test('usunięcie projektu, historyjki i zadania', async ({ page }) => {
//   await loginAndCreateProject(page)

//   // Przejdź do szczegółów i usuń zadanie
//   await page.locator('.kanban-card', { hasText: 'Zadanie do usunięcia' })
//     .locator('a', { hasText: 'Szczegóły' }).click()

//   await page.locator('button.btn-delete', { hasText: 'Usuń' }).click()
//   await expect(page.locator('.kanban-card', { hasText: 'Zadanie do usunięcia' })).toHaveCount(0)

//   // Wróć i usuń historyjkę
//   await page.goto('http://localhost:5173/stories')
//   const historia = page.locator('.project-item', { hasText: 'Historia do usunięcia' })
//   await historia.locator('button.btn-delete').click()
//   await expect(historia).toHaveCount(0)

//   // Usuń projekt
//   await page.goto('http://localhost:5173/projects')
//   const projekt = page.locator('.project-item', { hasText: 'Projekt do usunięcia' })
//   await projekt.locator('button.btn-delete').click()
//   await expect(projekt).toHaveCount(0)
// })
