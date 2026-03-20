import status from "http-status";
import AppError from "../../errors/app-error";
import { IQueryParams } from "../../interfaces/query-type";
import { prisma } from "../../libs/prisma";
import { QueryBuilder } from "../../utils/query-builder";
import {
  CreatePricingRulePayload,
  UpdatePricingRulePayload,
} from "./validators";

const createPricingRule = async (payload: CreatePricingRulePayload) => {
  // Validate that min weight is less than max weight
  if (payload.minWeight >= payload.maxWeight) {
    throw new AppError(
      status.BAD_REQUEST,
      "Min weight must be less than max weight",
    );
  }

  // Validate that zones exist
  const originalZone = await prisma.zone.findUnique({
    where: { id: payload.originalZoneId },
  });

  if (!originalZone) {
    throw new AppError(status.NOT_FOUND, "Original zone not found");
  }

  const destinationZone = await prisma.zone.findUnique({
    where: { id: payload.destinationZoneId },
  });

  if (!destinationZone) {
    throw new AppError(status.NOT_FOUND, "Destination zone not found");
  }

  // Validate that service exists
  const service = await prisma.service.findUnique({
    where: { id: payload.serviceId },
  });

  if (!service) {
    throw new AppError(status.NOT_FOUND, "Service not found");
  }

  // prevent express delivery for outside dhaka
  if (
    service.slug === "express-delivery" &&
    destinationZone.slug === "outside-dhaka"
  ) {
    throw new AppError(
      status.BAD_REQUEST,
      "Express delivery is only available for deliveries within Dhaka",
    );
  }

  // Validate that category exists
  const category = await prisma.parcelCategory.findUnique({
    where: { id: payload.categoryId },
  });

  if (!category) {
    throw new AppError(status.NOT_FOUND, "Category not found");
  }

  // ensure minWeight is >= category base weight
  if (payload.minWeight < category.baseWeight) {
    throw new AppError(
      status.BAD_REQUEST,
      `Min weight must be greater than or equal to category base weight of ${category.baseWeight}`,
    );
  }

  // ensure price is >= service base fee
  if (payload.price < Number(service.baseFee)) {
    throw new AppError(
      status.BAD_REQUEST,
      `Price must be greater than or equal to service base fee of ${service.baseFee}`,
    );
  }

  const pricingRule = await prisma.pricingRule.create({
    data: {
      originalZoneId: payload.originalZoneId,
      destinationZoneId: payload.destinationZoneId,
      categoryId: payload.categoryId,
      serviceId: payload.serviceId,
      minWeight: payload.minWeight,
      maxWeight: payload.maxWeight,
      price: payload.price,
    },
    include: {
      originalZone: true,
      destinationZone: true,
      category: true,
      service: true,
    },
  });

  return pricingRule;
};

const getAllPricingRules = async (queryParams: IQueryParams) => {
  const listQueryParams: IQueryParams = {
    ...queryParams,
    sortBy: queryParams.sortBy ?? "createdAt",
    sortOrder: queryParams.sortOrder ?? "desc",
  };

  const queryBuilder = new QueryBuilder(prisma.pricingRule, listQueryParams, {
    searchableFields: [
      "originalZone.name",
      "destinationZone.name",
      "service.name",
      "category.name",
    ],
    filterableFields: [
      "originalZoneId",
      "destinationZoneId",
      "categoryId",
      "serviceId",
      "minWeight",
      "maxWeight",
      "price",
    ],
  })
    .search()
    .filter()
    .sort()
    .fields()
    .dynamicInclude(
      {
        originalZone: true,
        destinationZone: true,
        category: true,
        service: true,
      },
      ["originalZone", "destinationZone", "service", "category"],
    )
    .paginate();

  return await queryBuilder.execute();
};

const getPricingRuleById = async (id: string, queryParams: IQueryParams) => {
  const queryBuilder = new QueryBuilder(prisma.pricingRule, queryParams)
    .where({ id })
    .fields()
    .dynamicInclude(
      {
        originalZone: true,
        destinationZone: true,
        category: true,
        service: true,
      },
      ["originalZone", "destinationZone", "service", "category"],
    );

  const pricingRules = await prisma.pricingRule.findMany(
    queryBuilder.getQuery() as Parameters<
      typeof prisma.pricingRule.findMany
    >[0],
  );

  return pricingRules[0] ?? null;
};

const updatePricingRule = async (
  id: string,
  payload: UpdatePricingRulePayload,
) => {
  const updateData: Record<string, unknown> = {};

  const existingPricingRule = await prisma.pricingRule.findUnique({
    where: { id },
    include: {
      service: true,
      category: true,
    },
  });

  if (!existingPricingRule) {
    throw new AppError(status.NOT_FOUND, "Pricing rule not found");
  }

  if (payload.minWeight !== undefined) {
    // ensure minWeight is >= category base weight
    if (payload.minWeight < existingPricingRule.category.baseWeight) {
      throw new AppError(
        status.BAD_REQUEST,
        `Min weight must be greater than or equal to category base weight of ${existingPricingRule.category.baseWeight}`,
      );
    }
    updateData.minWeight = payload.minWeight;
  }

  if (payload.maxWeight !== undefined) {
    updateData.maxWeight = payload.maxWeight;
  }

  // Validate min < max if both are being updated
  if (
    payload.minWeight !== undefined &&
    payload.maxWeight !== undefined &&
    payload.minWeight >= payload.maxWeight
  ) {
    throw new AppError(
      status.BAD_REQUEST,
      "Min weight must be less than max weight",
    );
  }

  if (payload.price !== undefined) {
    // ensure price is >= service base fee
    if (payload.price < Number(existingPricingRule.service.baseFee)) {
      throw new AppError(
        status.BAD_REQUEST,
        `Price must be greater than or equal to service base fee of ${existingPricingRule.service.baseFee}`,
      );
    }
    updateData.price = payload.price;
  }

  if (payload.originalZoneId) {
    const zone = await prisma.zone.findUnique({
      where: { id: payload.originalZoneId },
    });

    if (!zone) {
      throw new AppError(status.NOT_FOUND, "Original zone not found");
    }

    updateData.originalZoneId = payload.originalZoneId;
  }

  if (payload.destinationZoneId) {
    const zone = await prisma.zone.findUnique({
      where: { id: payload.destinationZoneId },
    });

    if (!zone) {
      throw new AppError(status.NOT_FOUND, "Destination zone not found");
    }

    updateData.destinationZoneId = payload.destinationZoneId;
  }

  if (payload.serviceId) {
    const service = await prisma.service.findUnique({
      where: { id: payload.serviceId },
    });

    if (!service) {
      throw new AppError(status.NOT_FOUND, "Service not found");
    }

    updateData.serviceId = payload.serviceId;
  }

  if (payload.categoryId !== undefined) {
    if (payload.categoryId) {
      const category = await prisma.parcelCategory.findUnique({
        where: { id: payload.categoryId },
      });

      if (!category) {
        throw new AppError(status.NOT_FOUND, "Category not found");
      }
    }

    updateData.categoryId = payload.categoryId;
  }

  const pricingRule = await prisma.pricingRule.update({
    where: { id },
    data: updateData,
    include: {
      originalZone: true,
      destinationZone: true,
      category: true,
      service: true,
    },
  });

  return pricingRule;
};

const deletePricingRule = async (id: string) => {
  // Validate if pricing rule exists before attempting to delete
  const existingPricingRule = await prisma.pricingRule.findUnique({
    where: { id },
  });

  if (!existingPricingRule) {
    throw new AppError(status.NOT_FOUND, "Pricing rule not found");
  }

  const pricingRule = await prisma.pricingRule.delete({
    where: { id },
  });

  return pricingRule;
};

export const pricingService = {
  createPricingRule,
  getAllPricingRules,
  getPricingRuleById,
  updatePricingRule,
  deletePricingRule,
};
