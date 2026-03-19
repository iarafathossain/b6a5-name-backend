import { Router } from "express";
import { checkAuth } from "../../middlewares/check-auth";
import { validateRequest } from "../../middlewares/validate-request";
import { userController } from "./controllers";
import { createAdminZodSchema } from "./validators";

const router = Router();

// POST: /api/v1/users/create-admin - create admin (super admin only)
router.post(
  "/create-admin",
  validateRequest(createAdminZodSchema),
  checkAuth("SUPER_ADMIN"),
  userController.createAdmin,
);

export const userRoutes = router;
