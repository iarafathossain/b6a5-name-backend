import * as zod from "zod";

export const createSpeedZodSchema = zod.object({
  name: zod
    .string()
    .min(1, "Speed name is required")
    .min(3, "Speed name must be at least 3 characters long"),
  description: zod.string().optional().nullable(),
  baseFee: zod
    .number("Base fee must be a number")
    .min(0, "Base fee must be greater than or equal to 0")
    .optional(),
  slaHours: zod
    .number("SLA hours must be a number")
    .int("SLA hours must be an integer")
    .positive("SLA hours must be greater than 0"),
  isActive: zod.boolean("isActive must be a boolean").optional(),
});

export type CreateSpeedPayload = zod.infer<typeof createSpeedZodSchema>;

export const updateSpeedZodSchema = zod.object({
  name: zod
    .string()
    .min(3, "Speed name must be at least 3 characters long")
    .optional(),
  description: zod.string().optional().nullable(),
  baseFee: zod
    .number("Base fee must be a number")
    .min(0, "Base fee must be greater than or equal to 0")
    .optional(),
  slaHours: zod
    .number("SLA hours must be a number")
    .int("SLA hours must be an integer")
    .positive("SLA hours must be greater than 0")
    .optional(),
  isActive: zod.boolean("isActive must be a boolean").optional(),
});

export type UpdateSpeedPayload = zod.infer<typeof updateSpeedZodSchema>;
