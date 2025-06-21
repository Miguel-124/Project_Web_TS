// e2e/tests/task-actions.spec.ts
import { test, expect } from '@playwright/test'

test('rozpoczyna zadanie i przypisuje użytkownika', async ({ page }) => {
  await page.goto('http://localhost:5173/login')
  await page.getByPlaceholder('Login').fill('admin')
  await page.getByPlaceholder('Hasło').fill('admin123')
  await page.locator('button[type="submit"]').click()

  await page.waitForSelector('text=Projekty')
  const projekt = page.locator('.project-item', { hasText: 'Projekt e2e' })
  await projekt.locator('button.btn-open').click()

  const story = page.locator('.project-item', { hasText: 'Nowa historyjka e2e' })
  await story.locator('a.btn-open', { hasText: 'Zadania' }).click()
  await expect(page).toHaveURL(/\/story\/\d+\/tasks/)

  await page.locator('.kanban-card', { hasText: 'Zadanie testowe e2e' })
    .locator('a', { hasText: 'Szczegóły' }).click()

  await expect(page).toHaveURL(/\/tasks\/\d+/)
  await expect(page.locator('h1', { hasText: 'Szczegóły zadania' })).toBeVisible()

  await page.selectOption('#assign', '2')
  await page.locator('.task-actions .btn-edit', { hasText: 'Rozpocznij zadanie' }).click()
  await expect(page.locator('p', { hasText: 'Status:' })).toContainText(/in progress/i)
})
