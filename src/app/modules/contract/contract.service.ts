import { Request } from "express";
import { AppError } from "../../error/AppError";
import httpStatus from "http-status";
import FormData from "form-data";
import axios from "axios";
import { prisma } from "../../utils/prisma";

const contractAnalysis = async (req: Request & { user?: any }) => {
  if (!req.file) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please upload a file");
  }

  const formData = new FormData();

  formData.append("user_id", req.user?.userId);

  formData.append("file", req.file.buffer, {
    filename: req.file.originalname,
    contentType: req.file.mimetype,
  });

  const response = await axios.post(
    "http://206.162.244.175:8003/contract-analysis/analyze-contract",
    formData,
    {
      headers: {
        ...formData.getHeaders(),
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    },
  );
  console.log(response);
  // return response.data;
  if (response?.data) {
    const analysisData = {
      userId: req?.user?.userId,
      document_id: response?.data.document_id,
      risk_level: response?.data.overall_risk_level,
      meaning_summary: response?.data.meaning_summary,
      key_risk_flags: response?.data.key_risk_flags,
    };
    const data = await prisma.contract.create({
      data: analysisData,
    });

    return data;
  }
};

const getRecentContracts = async (userId: string) => {
  const contracts = await prisma.contract.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  return contracts;
};

const getAllContracts = async (userId: string, searchTerm?: string) => {
  const where: any = {
    userId,
    ...(searchTerm && {
      OR: [
        { risk_level: { contains: searchTerm } },
        { meaning_summary: { contains: searchTerm } },
        {
          key_risk_flags: {
            some: {
              OR: [
                { title: { contains: searchTerm } },
                { description: { contains: searchTerm } },
                { why_it_matters: { contains: searchTerm } },
              ],
            },
          },
        },
      ],
    }),
  };

  const contracts = await prisma.contract.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return contracts;
};

const totalContracts = async (userId: string) => {
  const count = await prisma.contract.count({
    where: { userId },
  });
  return {
    totalContracts: count,
  };
};

const highRiskContracts = async (userId: string) => {
  const count = await prisma.contract.count({
    where: { userId, risk_level: "High" },
  });
  return {
    highRiskContracts: count,
  };
};

const mediumRiskContracts = async (userId: string) => {
  const count = await prisma.contract.count({
    where: { userId, risk_level: "Medium" },
  });
  return {
    mediumRiskContracts: count,
  };
};

const lowRiskContracts = async (userId: string) => {
  const count = await prisma.contract.count({
    where: { userId, risk_level: "Low" },
  });
  return {
    lowRiskContracts: count,
  };
};

export const contractServices = {
  contractAnalysis,
  getRecentContracts,
  getAllContracts,
  totalContracts,
  highRiskContracts,
  mediumRiskContracts,
  lowRiskContracts,
};
