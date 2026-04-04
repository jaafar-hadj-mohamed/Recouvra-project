#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const root = process.cwd()
const envPath = path.join(root, '.env')
const examplePath = path.join(root, '.env.example')

const defaults = {
  PORT: '3000',
  MONGODB_URI: 'mongodb://localhost:27017/billingdb',
  JWT_SECRET: '', // will be generated if missing
  JWT_EXPIRES_IN: '1h',
  BCRYPT_SALT_ROUNDS: '10',
  ADMIN_NAME: 'Admin User',
  ADMIN_EMAIL: 'admin@example.com',
  ADMIN_PASSWORD: 'ChangeMe123!'
}

// Load values from .env.example if present, into defaults as a hint
try {
  if (fs.existsSync(examplePath)) {
    const content = fs.readFileSync(examplePath, 'utf8')
    content.split(/\r?\n/).forEach((line) => {
      const t = line.trim()
      if (!t || t.startsWith('#')) return
      const i = t.indexOf('=')
      if (i > -1) {
        const k = t.substring(0, i).trim()
        const v = t.substring(i + 1).trim()
        if (k) defaults[k] = v
      }
    })
  }
} catch (e) {
  // ignore parsing errors from env.example
}

// Read existing .env if present to preserve values
let current = {}
try {
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8')
    content.split(/\r?\n/).forEach((line) => {
      const t = line.trim()
      if (!t || t.startsWith('#')) return
      const i = t.indexOf('=')
      if (i > -1) {
        const k = t.substring(0, i).trim()
        const v = t.substring(i + 1)
        if (k) current[k] = v
      }
    })
  }
} catch (e) {
  // ignore
}

// Ensure JWT_SECRET exists; generate if missing
let jwtSecret = current.JWT_SECRET || defaults.JWT_SECRET
if (!jwtSecret) {
  jwtSecret = crypto.randomBytes(32).toString('hex')
  defaults.JWT_SECRET = jwtSecret
}

const lines = [
  `PORT=${current.PORT ?? defaults.PORT}`,
  `MONGODB_URI=${current.MONGODB_URI ?? defaults.MONGODB_URI}`,
  `JWT_SECRET=${jwtSecret}`,
  `JWT_EXPIRES_IN=${current.JWT_EXPIRES_IN ?? defaults.JWT_EXPIRES_IN}`,
  `BCRYPT_SALT_ROUNDS=${current.BCRYPT_SALT_ROUNDS ?? defaults.BCRYPT_SALT_ROUNDS}`,
  `ADMIN_NAME=${current.ADMIN_NAME ?? defaults.ADMIN_NAME}`,
  `ADMIN_EMAIL=${current.ADMIN_EMAIL ?? defaults.ADMIN_EMAIL}`,
  `ADMIN_PASSWORD=${current.ADMIN_PASSWORD ?? defaults.ADMIN_PASSWORD}`
]

const contentOut = lines.join('\n') + '\n'
fs.writeFileSync(envPath, contentOut, { encoding: 'utf8' })
console.log(`.env generated at ${envPath}`)

console.log('Summary:')
console.log(`PORT=${current.PORT ?? defaults.PORT}`)
console.log(`MONGODB_URI=${current.MONGODB_URI ?? defaults.MONGODB_URI}`)
console.log(`JWT_SECRET=${jwtSecret ? '[hidden]' : '[missing]'}`)
console.log(`JWT_EXPIRES_IN=${current.JWT_EXPIRES_IN ?? defaults.JWT_EXPIRES_IN}`)
console.log(`ADMIN_NAME=${current.ADMIN_NAME ?? defaults.ADMIN_NAME}`)
console.log(`ADMIN_EMAIL=${current.ADMIN_EMAIL ?? defaults.ADMIN_EMAIL}`)
console.log(`ADMIN_PASSWORD=${current.ADMIN_PASSWORD ?? defaults.ADMIN_PASSWORD}`)
