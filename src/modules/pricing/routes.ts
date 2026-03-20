import { Router } from "express";
import { checkAuth } from "../../middlewares/check-auth";
import { validateRequest } from "../../middlewares/validate-request";
import { pricingControllers } from "./controllers";
import {
  createPricingRuleZodSchema,
  updatePricingRuleZodSchema,
} from "./validators";

const router = Router();

// POST: /api/v1/pricing/ - Create a new pricing rule (Admin & Super Admin)
router.post(
  "/",
  validateRequest(createPricingRuleZodSchema),
  checkAuth("ADMIN", "SUPER_ADMIN"),
  pricingControllers.createPricingRule,
);

// GET: /api/v1/pricing/ - Get all pricing rules (Public)
router.get("/", pricingControllers.getAllPricingRules);

// GET: /api/v1/pricing/:id - Get pricing rule by ID (Public)
router.get("/:id", pricingControllers.getPricingRuleById);

// PATCH: /api/v1/pricing/:id - Update pricing rule by ID (Admin & Super Admin)
router.patch(
  "/:id",
  validateRequest(updatePricingRuleZodSchema),
  checkAuth("ADMIN", "SUPER_ADMIN"),
  pricingControllers.updatePricingRule,
);

// DELETE: /api/v1/pricing/:id - Delete pricing rule by ID (Admin & Super Admin)
router.delete(
  "/:id",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  pricingControllers.deletePricingRule,
);

export const pricingRoutes = router;
