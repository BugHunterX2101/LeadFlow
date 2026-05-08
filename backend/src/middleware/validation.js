import { AppError } from '../lib/errors.js'

export function validateInput(schema) {
  return (req, res, next) => {
    const errors = []

    if (schema.name && (!req.body.name || typeof req.body.name !== 'string' || req.body.name.trim().length === 0)) {
      errors.push('Name is required and must be a non-empty string')
    }

    if (schema.company && req.body.company && typeof req.body.company !== 'string') {
      errors.push('Company must be a string')
    }

    if (schema.phone && req.body.phone && typeof req.body.phone !== 'string') {
      errors.push('Phone must be a string')
    }

    if (schema.status && req.body.status && typeof req.body.status !== 'string') {
      errors.push('Status must be a string')
    }

    if (schema.note && (!req.body.note || typeof req.body.note !== 'string' || req.body.note.trim().length === 0)) {
      errors.push('Note is required and must be a non-empty string')
    }

    if (schema.followUpAt && req.body.followUpAt) {
      const date = new Date(req.body.followUpAt)
      if (isNaN(date.getTime())) {
        errors.push('followUpAt must be a valid ISO 8601 date string')
      }
    }

    // Sanitize input strings to prevent XSS
    if (req.body.name) req.body.name = sanitizeString(req.body.name)
    if (req.body.company) req.body.company = sanitizeString(req.body.company)
    if (req.body.note) req.body.note = sanitizeString(req.body.note)

    if (errors.length > 0) {
      return next(new AppError(400, `Validation failed: ${errors.join(', ')}`))
    }

    next()
  }
}

function sanitizeString(str) {
  return str
    .trim()
    .substring(0, 1000) // Limit length
    .replace(/[<>]/g, '') // Remove angle brackets
}
