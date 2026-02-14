import { NextFunction, Request, Response } from "express";
import { AppError } from "../error/AppError";
import httpStatus from "http-status";
import { verifyToken } from "../utils/verifyToken";
import config from "../../config";
import { JwtPayload, Secret } from "jsonwebtoken";
import { prisma } from "../utils/prisma";

export const checkAuth = (...roles: string[]) => async (req: Request & { user?: JwtPayload }, res: Response, next: NextFunction) => {
const token= req.headers.authorization;

if(!token){
    throw new AppError(httpStatus.BAD_REQUEST, 'Token is required');
}

const verifyUserToken =await verifyToken(token, config.jwt.access_secret as Secret) as JwtPayload;
console.log(verifyUserToken)
// Check user is exist
const user = await prisma.user.findUnique({
    where: {
        id: verifyUserToken.id,
    },
});

if(!user){
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
}

req.user =verifyUserToken;
if (roles.length && !roles.includes(verifyUserToken.role)) {
    throw new AppError(httpStatus.BAD_REQUEST,'You are not access this route!');
}
next();
}