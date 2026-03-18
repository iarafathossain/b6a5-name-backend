import { Request, Response } from "express";
import status from "http-status";
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
    message: "Merchant registered successfully",
    data: result,
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const result = await authServices.verifyEmail(email, otp);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: result.status ? "Email verified successfully" : "Invalid OTP",
    data: {
      user: result.user,
    },
  });
});

export const authControllers = {
  registerMerchant,
  verifyEmail,
};
