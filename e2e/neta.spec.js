// @ts-check
require('dotenv').config()
const { test, expect } = require('@playwright/test');

test('neta', async ({ page }) => {
  await page.goto(process.env.URL);
  await page.getByText('Tarefas agendadas').click();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByTitle('Executados').click();
  // Manter a página aberta por 2 segundos ou pause infinito até pressionar F8 (Resume).
  // await page.pause();
  // await new Promise(r => setTimeout(r, 2000));
});