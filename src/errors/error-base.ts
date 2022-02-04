import { Request, Response, NextFunction } from "express";

export enum HTTPStatusCodes {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  NOT_ACCEPTABLE = 406,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

class ErrorBase extends Error {
  statusCode: HTTPStatusCodes;
  isOperational: boolean;

  constructor(
    name: string,
    statusCode: HTTPStatusCodes,
    isOperational: boolean
  ) {
    super(name);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.message = name; // TODO: Figure out how to display 'message'
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}

export const errorHandler = (
  err: ErrorBase,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.statusCode || HTTPStatusCodes.INTERNAL_SERVER_ERROR).json({
    message: err.message || "Internal Server Error",
    statusCode: err.statusCode || HTTPStatusCodes.INTERNAL_SERVER_ERROR,
  });
};

export default ErrorBase;
