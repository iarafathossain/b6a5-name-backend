import status from "http-status";
import AppError from "../../errors/app-error";
import { UserStatus } from "../../generated/prisma/enums";
import { IRequestUser } from "../../interfaces/auth-type";
import { auth } from "../../libs/auth";
import { prisma } from "../../libs/prisma";
import { tokenUtils } from "../../utils/token";
import {
  LoginUserZodSchema,
  RegisterMerchantZodSchema,
  VerifyEmailZodSchema,
} from "./validators";

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
      requiresEmailVerification: !sessionToken,
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

const verifyEmail = async (payload: VerifyEmailZodSchema) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email: payload.email,
      otp: payload.otp,
    },
  });

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

  const accessToken = result.token
    ? tokenUtils.getAccessToken({
        userId: result.user.id,
        email: result.user.email,
        role: result.user.role,
        name: result.user.name,
        status: result.user.status,
        isDeleted: result.user.isDeleted,
        emailVerified: result.user.emailVerified,
      })
    : null;

  const refreshToken = result.token
    ? tokenUtils.getRefreshToken({
        userId: result.user.id,
        email: result.user.email,
        role: result.user.role,
        name: result.user.name,
        status: result.user.status,
        isDeleted: result.user.isDeleted,
        emailVerified: result.user.emailVerified,
      })
    : null;

  return {
    status: result.status,
    user: result.user,
    sessionToken: result.token,
    accessToken,
    refreshToken,
  };
};

const loginUser = async (payload: LoginUserZodSchema) => {
  const { email, password } = payload;

  const { user, token: sessionToken } = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  // check if the user is authenticated
  if (!user) {
    throw new AppError("Invalid email or password", status.UNAUTHORIZED);
  }

  // check if a user is blocked
  if (user.status === UserStatus.BLOCKED) {
    throw new AppError(
      "Your account is blocked. Please contact support.",
      status.UNAUTHORIZED,
    );
  }

  // check if a user is deleted
  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new AppError(
      "Your account has been deleted. Please contact support.",
      status.UNAUTHORIZED,
    );
  }

  const accessToken = tokenUtils.getAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    status: user.status,
    isDeleted: user.isDeleted,
    emailVerified: user.emailVerified,
  });

  const refreshToken = tokenUtils.getRefreshToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    status: user.status,
    isDeleted: user.isDeleted,
    emailVerified: user.emailVerified,
  });

  return { user, accessToken, refreshToken, sessionToken };
};

const getMe = async (user: IRequestUser) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    include: {
      merchantProfile: {
        include: {
          parcels: true,
        },
      },

      adminProfile: true,
      riderProfile: true,
    },
  });

  if (!isUserExist) {
    throw new AppError("User not found", status.NOT_FOUND);
  }

  return isUserExist;
};

export const authServices = {
  registerMerchant,
  verifyEmail,
  loginUser,
  getMe,
};
