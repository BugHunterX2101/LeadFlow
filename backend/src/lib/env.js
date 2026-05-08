import { AppError } from './errors.js'

function validateEnv() {
  const required = ['DATABASE_URL']
  const optional = ['PORT', 'NODE_ENV']
  
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new AppError(500, `Missing required environment variables: ${missing.join(', ')}`)
  }

  return {
    DATABASE_URL: process.env.DATABASE_URL,
    PORT: process.env.PORT || '3001',
    NODE_ENV: process.env.NODE_ENV || 'development'
  }
}

export const env = validateEnv()
