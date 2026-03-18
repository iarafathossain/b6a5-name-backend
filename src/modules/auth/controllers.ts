import { Request, Response } from "express";
import status from "http-status";
import AppError from "../../errors/app-error";
import { catchAsync } from "../../shared/catch-async";
import { sendResponse } from "../../shared/send-response";
import { tokenUtils } from "../../utils/token";
import { authServices } from "./services";

const registerMerchant = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authServices.registerMerchant(payload);

  // Set cookies only if a session was created.
  if (result.accessToken && result.refreshToken && result.sessionToken) {
    tokenUtils.setAccessTokenCookie(res, result.accessToken);
    tokenUtils.setRefreshTokenCookie(res, result.refreshToken);
    tokenUtils.setBetterAuthSessionTokenCookie(res, result.sessionToken);
  }

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: result.requiresEmailVerification
      ? "Merchant registered. Please verify your email with OTP to complete login."
      : "Merchant registered successfully",
    requiredEmailVerification: result.requiresEmailVerification,
    data: result,
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authServices.verifyEmail(payload);

  if (result.accessToken && result.refreshToken && result.sessionToken) {
    tokenUtils.setAccessTokenCookie(res, result.accessToken);
    tokenUtils.setRefreshTokenCookie(res, result.refreshToken);
    tokenUtils.setBetterAuthSessionTokenCookie(res, result.sessionToken);
  }

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: result.status ? "Email verified successfully" : "Invalid OTP",
    data: result,
    requiredEmailVerification: false,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authServices.loginUser(payload);

  // Set cookies only if a session was created.
  if (result.accessToken && result.refreshToken && result.sessionToken) {
    tokenUtils.setAccessTokenCookie(res, result.accessToken);
    tokenUtils.setRefreshTokenCookie(res, result.refreshToken);
    tokenUtils.setBetterAuthSessionTokenCookie(res, result.sessionToken);
  }

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new AppError(
      "Unauthorized Access! No user information found in request",
      status.UNAUTHORIZED,
    );
  }

  const result = await authServices.getMe(user);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User details retrieved successfully",
    data: result,
  });
});

export const authControllers = {
  registerMerchant,
  verifyEmail,
  loginUser,
  getMe,
};
