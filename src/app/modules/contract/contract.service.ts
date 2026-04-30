import { Request } from "express";
import { AppError } from "../../error/AppError";
import httpStatus from "http-status";
import FormData from "form-data";
import axios from "axios";
import { prisma } from "../../utils/prisma";

const contractAnalysis = async (req: Request & { user?: any }) => {
  const userId = req.user?.userId;
  const file = req.file;
  const contractText = req.body?.contract_text;
  console.log(file, contractText);
  if (!file && !contractText) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please upload a file or provide contract text",
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      plan: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // ✅ Free user max 3 analysis
  if (user.plan === "FREE") {
    const totalAnalysis = await prisma.contract.count({
      where: {
        userId,
      },
    });

    if (totalAnalysis >= 3) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Free users can analyze maximum 3 contracts. Please upgrade to premium.",
      );
    }
  }

  const formData = new FormData();

  formData.append("user_id", userId);

  let apiUrl = "";

  // ✅ If user uploads file
  if (file) {
    apiUrl = "http://206.162.244.175:8003/contract-analysis/analyze-contract/";

    formData.append("file", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
  }

  // ✅ If user provides text
  if (!file && contractText) {
    apiUrl =
      "http://206.162.244.175:8003/contract-analysis/analyze-contract-text/";

    formData.append("contract_text", contractText);
  }

  const response = await axios.post(apiUrl, formData, {
    headers: {
      ...formData.getHeaders(),
    },
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  });

  console.log(response?.data);

  if (!response?.data) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Contract analysis failed. Please try again.",
    );
  }

  const analysisData = {
    userId,
    document_id: response.data.document_id,
    risk_level: response.data.overall_risk_level,
    meaning_summary: response.data.meaning_summary,
    key_risk_flags: response.data.key_risk_flags,
  };

  const data = await prisma.contract.create({
    data: analysisData,
  });

  return data;
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
