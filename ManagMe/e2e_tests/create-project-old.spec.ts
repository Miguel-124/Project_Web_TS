import { test, expect } from '@playwright/test'

test('tworzy historyjkę i zadanie w projekcie', async ({ page }) => {
  await page.goto('http://localhost:5173/login')

  // Logowanie
  await page.getByPlaceholder('Login').fill('admin')
  await page.getByPlaceholder('Hasło').fill('admin123')
  await page.locator('button[type="submit"]').click()

  // Poczekaj na listę projektów i dodaj nowy projekt
  await page.waitForSelector('text=Projekty')
  await page.getByPlaceholder('Nazwa projektu').fill('Projekt e2e')
  await page.locator('textarea[placeholder="Opis projektu"]').fill('Opis e2e')
  await page.locator('button.btn-add').click()

  // Otwórz projekt
  const projekt = page.locator('.project-item', { hasText: 'Projekt e2e' })
  await projekt.locator('button.btn-open').click()

  // Tworzenie historyjki
  await page.getByPlaceholder('Nazwa historyjki').fill('Nowa historyjka e2e')
  await page.locator('button.btn-add').click()
  await expect(page.locator('.project-item', { hasText: 'Nowa historyjka e2e' })).toBeVisible()

  // Tworzenie zadania wewnątrz historyjki (zakładam że widok z zadaniami pojawia się zaraz po dodaniu)
  const story = page.locator('.project-item', { hasText: 'Nowa historyjka e2e' })
  await story.locator('a.btn-open', { hasText: 'Zadania' }).click()
  await expect(page).toHaveURL(/\/story\/\d+\/tasks/)

  await page.getByPlaceholder('Nazwa zadania').fill('Zadanie testowe e2e')
  await page.getByPlaceholder('Opis zadania').fill('Opis do zadania e2e')
  await page.getByPlaceholder('Szacowany czas \(h\)').fill('3') // używamy regexu, bo nawiasy
  await page.selectOption('select', 'medium')
  await page.locator('button.btn-add', { hasText: 'Dodaj zadanie' }).click()

  await expect(page.locator('.kanban-card', { hasText: 'Zadanie testowe e2e' })).toBeVisible()
  await expect(page.locator('.kanban-card', { hasText: 'Opis do zadania e2e' })).toBeVisible()
  await expect(page.locator('.kanban-card', { hasText: '3h' })).toBeVisible()
  await expect(page.locator('.kanban-card', { hasText: 'medium' })).toBeVisible()

  // Przejście do widoku szczegółów zadania
await page.locator('.kanban-card', { hasText: 'Zadanie testowe e2e' })
  .locator('a', { hasText: 'Szczegóły' }).click()

await expect(page).toHaveURL(/\/tasks\/\d+/)
await expect(page.locator('h1', { hasText: 'Szczegóły zadania' })).toBeVisible()

// Kliknij „Rozpocznij zadanie”
// Przypisz użytkownika
await page.selectOption('#assign', '2') // np. Dev User

// Kliknij "Rozpocznij zadanie"
await page.locator('.task-actions .btn-edit', { hasText: 'Rozpocznij zadanie' }).click()

// Opcjonalnie: potwierdź zmianę statusu
await expect(page.locator('p', { hasText: 'Status:' })).toContainText(/in progress/i)
})
