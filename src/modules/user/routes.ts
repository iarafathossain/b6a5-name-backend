import { Router } from "express";
import { checkAuth } from "../../middlewares/check-auth";
import { validateRequest } from "../../middlewares/validate-request";
import { userController } from "./controllers";
import { createAdminZodSchema, createRiderZodSchema } from "./validators";

const router = Router();

// POST: /api/v1/users/create-admin - create admin (super admin & admin only)
router.post(
  "/create-admin",
  validateRequest(createAdminZodSchema),
  checkAuth("SUPER_ADMIN", "ADMIN"),
  userController.createAdmin,
);

// POST: /api/v1/users/create-rider - create rider (super admin & admin only)
router.post(
  "/create-rider",
  validateRequest(createRiderZodSchema),
  checkAuth("SUPER_ADMIN", "ADMIN"),
  userController.createRider,
);

export const userRoutes = router;
