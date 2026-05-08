export class AppError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode
  }
}

export const badRequest = (message) => new AppError(400, message)
export const notFound = (message = 'Not found') => new AppError(404, message)