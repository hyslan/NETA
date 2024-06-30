// @ts-check
require('dotenv').config()
const { test, expect } = require('@playwright/test');

test('neta', async ({ page }) => {
  await page.goto(process.env.URL);
  await page.getByText('Tarefas agendadas').click();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByTitle('Executados').click();
});