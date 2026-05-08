import { AppError } from '../lib/errors.js'

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error)
  }

  // Log error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method
    })
  } else {
    console.error('Error:', error.message)
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ 
      error: error.message,
      status: error.statusCode
    })
  }

  // Handle Prisma errors
  if (error.code === 'P2025') {
    return res.status(404).json({ error: 'Resource not found', status: 404 })
  }

  if (error.code === 'P2002') {
    const field = error.meta?.target?.[0] || 'field'
    return res.status(400).json({ error: `${field} already exists`, status: 400 })
  }

  if (error.code?.startsWith('P')) {
    return res.status(400).json({ error: 'Database error', status: 400 })
  }

  // Handle validation errors
  if (error instanceof SyntaxError && error.status === 400) {
    return res.status(400).json({ error: 'Invalid JSON', status: 400 })
  }

  // Default error response
  return res.status(500).json({ 
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    status: 500
  })
}