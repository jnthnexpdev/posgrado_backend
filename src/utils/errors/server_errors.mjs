export default class AppError extends Error {
    constructor(message, httpCode) {
        super(message);
        this.httpCode = httpCode;
        this.isOperational = true;
        
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
