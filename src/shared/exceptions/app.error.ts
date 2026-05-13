export class AppError extends Error {
    statusCode : number; 
    isOperational : boolean ; 
    constructor(message : string , statusCode : number) {
        super(message)
        this.statusCode = statusCode; 
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor)

    }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized access") {
    super(message, 401);
  }
}
export class ConflictError extends AppError {
  constructor(message = "User Already Exists") {
    super(message, 409);
  }
}
export class MatchError extends AppError {
  constructor(message = "Password Mismatch") {
    super(message, 401);
  }
}
export class NotFoundError extends AppError {
  constructor(message = "Information Not Found") {
    super(message, 404);
  }
}