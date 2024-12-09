export default class AppError extends Error{
    constructor(message, httpCode){
        super(message);
        this.httpCode = httpCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}