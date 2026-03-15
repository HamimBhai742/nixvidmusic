import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import config from "../../config";
import { IUser } from "../interface/user.interface";
import { verifyToken } from "./verifyToken";
import { prisma } from "./prisma";
import { AppError } from "../error/AppError";
import httpStatusCode from "http-status";
import { Prisma } from "../../generated/prisma";

export const generateToken = async (user: Partial<Prisma.UserCreateInput>) => {
  const payload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const accessToken = await jwt.sign(
    payload,
    config.jwt.access_secret as Secret,
    { expiresIn: config.jwt.access_expires_in } as SignOptions,
  );
  const refreshToken = await jwt.sign(
    payload,
    config.jwt.refresh_secret as Secret,
    { expiresIn: config.jwt.refresh_expires_in } as SignOptions,
  );
  return { accessToken, refreshToken };
};

export const createNewAccessToken = async (refreshToken: string) => {
  const verifiedToken = verifyToken(
    refreshToken,
    config.jwt.refresh_secret as Secret,
  ) as JwtPayload;
  const user = await prisma.user.findUnique({
    where: {
      email: verifiedToken.email,
    },
  });
  if (!user) {
    throw new AppError(httpStatusCode.NOT_FOUND, "User does not exsist");
  }

  if (user.status === "INACTIVE") {
    throw new AppError(httpStatusCode.NOT_FOUND, "User is inactive");
  }

  const payload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = await jwt.sign(
    payload,
    config.jwt.access_secret as Secret,
    { expiresIn: config.jwt.access_expires_in } as SignOptions,
  );
  return accessToken;
};

export const generateForgetToken = async (
  user: any,
  secret: Secret,
  expiresIn: string,
) => {
  const payload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const token = await jwt.sign(payload, secret, {
    expiresIn: expiresIn,
  } as SignOptions);
  return token;
};
