import { Request, Response } from "express";
import status from "http-status";
import AppError from "../../errors/app-error";
import { IQueryParams } from "../../interfaces/query-type";
import { catchAsync } from "../../shared/catch-async";
import { sendResponse } from "../../shared/send-response";
import { pricingService } from "./services";

const createPricingRule = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await pricingService.createPricingRule(payload);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Pricing rule created successfully",
    data: result,
  });
});

const getAllPricingRules = catchAsync(async (req: Request, res: Response) => {
  const queryParams = req.query as IQueryParams;
  const result = await pricingService.getAllPricingRules(queryParams);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Pricing rules retrieved successfully",
    data: result.data ?? [],
    meta: result.meta,
  });
});

const getPricingRuleById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError(
      status.BAD_REQUEST,
      "Pricing rule ID parameter is required",
    );
  }

  if (typeof id !== "string") {
    throw new AppError(
      status.BAD_REQUEST,
      "Pricing rule ID parameter must be a string",
    );
  }

  const queryParams = req.query as IQueryParams;
  const result = await pricingService.getPricingRuleById(id, queryParams);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Pricing rule retrieved successfully",
    data: result,
  });
});

const updatePricingRule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError(
      status.BAD_REQUEST,
      "Pricing rule ID parameter is required",
    );
  }

  if (typeof id !== "string") {
    throw new AppError(
      status.BAD_REQUEST,
      "Pricing rule ID parameter must be a string",
    );
  }

  const payload = req.body;

  const result = await pricingService.updatePricingRule(id, payload);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Pricing rule updated successfully",
    data: result,
  });
});

const deletePricingRule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError(
      status.BAD_REQUEST,
      "Pricing rule ID parameter is required",
    );
  }

  if (typeof id !== "string") {
    throw new AppError(
      status.BAD_REQUEST,
      "Pricing rule ID parameter must be a string",
    );
  }

  const result = await pricingService.deletePricingRule(id);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Pricing rule deleted successfully",
    data: result,
  });
});

export const pricingControllers = {
  createPricingRule,
  getAllPricingRules,
  getPricingRuleById,
  updatePricingRule,
  deletePricingRule,
};
