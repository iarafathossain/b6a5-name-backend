import zod from "zod";
import { Gender } from "../../generated/prisma/enums";

export const createAdminZodSchema = zod.object({
  password: zod
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password must be at most 50 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[@$!%*?&]/,
      "Password must contain at least one special character (@, $, !, %, *, ?, &)",
    ),
  admin: zod.object({
    name: zod.string().min(1, "Name is required"),
    email: zod.email("Invalid email address"),
    contactNumber: zod
      .string()
      .min(11, "Contact number must be at least 11 characters long")
      .max(11, "Contact number must be at most 11 characters long")
      .regex(/^[0-9]+$/, "Contact number must contain only digits"),
    gender: zod.enum(
      [Gender.MALE, Gender.FEMALE, Gender.OTHER],
      "Invalid gender value",
    ),
  }),
});

export type CreateAdminZodSchema = zod.infer<typeof createAdminZodSchema>;
