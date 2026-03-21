import * as zod from "zod";

export const createMethodZodSchema = zod.object({
  name: zod
    .string()
    .min(1, "Method name is required")
    .min(3, "Method name must be at least 3 characters long"),
  description: zod.string().optional().nullable(),
  baseFee: zod
    .number("Base fee must be a number")
    .min(0, "Base fee must be greater than or equal to 0")
    .optional(),
});

export type CreateMethodPayload = zod.infer<typeof createMethodZodSchema>;

export const updateMethodZodSchema = zod.object({
  name: zod
    .string()
    .min(3, "Method name must be at least 3 characters long")
    .optional(),
  description: zod.string().optional().nullable(),
  baseFee: zod
    .number("Base fee must be a number")
    .min(0, "Base fee must be greater than or equal to 0")
    .optional(),
});

export type UpdateMethodPayload = zod.infer<typeof updateMethodZodSchema>;
