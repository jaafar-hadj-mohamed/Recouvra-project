import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import User from '../src/models/User.js'
import { dbConnect } from '../src/config/db.js'

const adminName = process.env.ADMIN_NAME || 'Admin User'
const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!'

const main = async () => {
  try {
    await dbConnect()
    // Check if admin already exists
    const existing = await User.findOne({ email: adminEmail })
    if (existing) {
      console.log(`Admin already exists: ${existing.name} <${existing.email}> with role ${existing.role}`)
      process.exit(0)
    }
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
    const hashed = await bcrypt.hash(adminPassword, saltRounds)
    const admin = await User.create({ name: adminName, email: adminEmail, password: hashed, role: 'admin' })
    console.log(`Admin user created: ${admin.name} <${admin.email}> with role ${admin.role}`)
    process.exit(0)
  } catch (e) {
    console.error('Failed to create admin user', e)
    process.exit(1)
  }
}

main()
