import { Router } from "express";
import { authRoutes } from "../modules/auth/routes";
import { userRoutes } from "../modules/user/routes";
const router = Router();

// using auth routes
router.use("/auth", authRoutes);

// using user routes
router.use("/users", userRoutes);

export const indexRoutes = router;
