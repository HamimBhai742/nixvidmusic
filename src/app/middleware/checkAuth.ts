import { NextFunction, Request, Response } from "express";
import { AppError } from "../error/AppError";
import httpStatus from "http-status";
import { verifyToken } from "../utils/verifyToken";
import config from "../../config";
import {  Secret } from "jsonwebtoken";
import { prisma } from "../utils/prisma";
import { IJwtPayload } from "../interface/user.interface";

export const checkAuth =
  (...roles: string[]) =>
  async (
    req: Request & { user?: IJwtPayload },
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new AppError(httpStatus.BAD_REQUEST, "Token is required");
      }

      const verifyUserToken = (await verifyToken(
        token,
        config.jwt.access_secret as Secret,
      )) as IJwtPayload;
      console.log(verifyUserToken);
      // Check user is exist
      const user = await prisma.user.findUnique({
        where: {
          id: verifyUserToken.userId,
        },
      });

      if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }

      req.user = verifyUserToken;
      if (roles.length && !roles.includes(verifyUserToken.role)) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "You are not access this route!",
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
