import status from "http-status";
import AppError from "../../errors/app-error";
import { auth } from "../../libs/auth";
import { prisma } from "../../libs/prisma";
import { tokenUtils } from "../../utils/token";
import { RegisterMerchantZodSchema } from "./validators";

const registerMerchant = async (payload: RegisterMerchantZodSchema) => {
  const { email, password, contactNumber, name, businessName, pickupAddress } =
    payload;

  // step 1: check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    throw new AppError("Email already exists", status.BAD_REQUEST);
  }

  // step 2: create new user with better-auth
  const { user, token: sessionToken } = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      contactNumber,
    },
  });

  if (!user) {
    throw new AppError("Failed to create user", status.INTERNAL_SERVER_ERROR);
  }

  try {
    // step 3: create merchant profile in the database
    const merchant = await prisma.merchant.create({
      data: {
        userId: user.id,
        businessName,
        pickupAddress,
      },
    });

    // When email verification is required, Better Auth returns token: null.
    // Only issue app tokens if Better Auth session exists.
    const accessToken = sessionToken
      ? tokenUtils.getAccessToken({
          userId: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          status: user.status,
          isDeleted: user.isDeleted,
          emailVerified: user.emailVerified,
        })
      : null;

    const refreshToken = sessionToken
      ? tokenUtils.getRefreshToken({
          userId: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          status: user.status,
          isDeleted: user.isDeleted,
          emailVerified: user.emailVerified,
        })
      : null;

    return {
      user,
      merchant,
      accessToken,
      refreshToken,
      sessionToken,
    };
  } catch (error) {
    // delete the user if merchant creation failed
    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });
    throw new AppError(
      "Failed to create merchant account",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const verifyEmail = async (email: string, otp: string) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp,
    },
  });

  console.log("Email verification result:", result);

  if (result.status && !result.user.emailVerified) {
    await prisma.user.update({
      where: {
        id: result.user.id,
      },
      data: {
        emailVerified: true,
      },
    });
  }

  return result;
};

export const authServices = {
  registerMerchant,
  verifyEmail,
};
