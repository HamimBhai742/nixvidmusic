import { JwtPayload, Secret } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import { AppError } from "../error/AppError";

export const verifyToken = (token: string, secret: Secret) => {
  try {
    const decoded = jwt.verify(token, secret)  as JwtPayload;;
    return decoded;
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Token has expired!');
    }
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token!');
  }
};