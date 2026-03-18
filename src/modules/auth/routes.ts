import { Router } from "express";
import { validateRequest } from "../../middlewares/validate-request";
import { authControllers } from "./controllers";
import { registerMerchantZodSchema } from "./validators";

const router = Router();

// POST: api/v1/auth/register (register a new merchant)
router.post(
  "/register",
  validateRequest(registerMerchantZodSchema),
  authControllers.registerMerchant,
);

// POST: api/v1/auth/verify-email (verify email with OTP)
router.post("/verify-email", authControllers.verifyEmail);

export const authRoutes = router;
