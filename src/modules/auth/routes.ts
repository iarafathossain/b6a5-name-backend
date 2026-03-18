import { Router } from "express";
import { checkAuth } from "../../middlewares/check-auth";
import { validateRequest } from "../../middlewares/validate-request";
import { authControllers } from "./controllers";
import {
  loginUserZodSchema,
  registerMerchantZodSchema,
  verifyEmailZodSchema,
} from "./validators";

const router = Router();

// POST: api/v1/auth/register (register a new merchant)
router.post(
  "/register",
  validateRequest(registerMerchantZodSchema),
  authControllers.registerMerchant,
);

// POST: api/v1/auth/verify-email (verify email with OTP)
router.post(
  "/verify-email",
  validateRequest(verifyEmailZodSchema),
  authControllers.verifyEmail,
);

// POST: api/v1/auth/login (login a user)
router.post(
  "/login",
  validateRequest(loginUserZodSchema),
  authControllers.loginUser,
);

// GET: api/v1/auth/me (get current logged in user)
router.get(
  "/me",
  checkAuth("ADMIN", "MERCHANT", "RIDER", "SUPER_ADMIN"),
  authControllers.getMe,
);

export const authRoutes = router;
