// Navegador para renderizar y exportar: PLAS_CHROME, o Chrome/Chromium del
// sistema, o (si devuelve undefined) el Chromium que instale Playwright.
import fs from 'node:fs'
import process from 'node:process'

const CANDIDATES = [
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
]

export function findBrowser() {
  return process.env.PLAS_CHROME ?? CANDIDATES.find(p => fs.existsSync(p))
}
