import fs from 'node:fs'
import path from 'node:path'

const envPath = path.resolve(process.cwd(), '.env')
let s = ''
try {
  s = fs.readFileSync(envPath, 'utf8')
} catch {
  s = ''
}

if (/^ADMIN_PIN=/m.test(s)) {
  console.log('ADMIN_PIN already present')
  process.exit(0)
}

if (s && !s.endsWith('\n')) s += '\n'
s += '\n# Admin PIN for delete/sensitive operations (single digit, change when live)\nADMIN_PIN=1\n'
fs.writeFileSync(envPath, s)
console.log('ADMIN_PIN added to .env')
