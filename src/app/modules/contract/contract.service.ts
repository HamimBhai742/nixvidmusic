import { Request } from "express";
import { AppError } from "../../error/AppError";
import httpStatus from "http-status";

const contractAnalysis = async (req: Request) => {
  console.log(req.file)
  if (!req.file && !req.body) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please upload a file or provide data in the request body",
    );
  }
};


export const contractServices = { contractAnalysis };
