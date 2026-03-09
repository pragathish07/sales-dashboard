// src/modules/inventory/inventory.service.ts

import { prisma } from "../../config/adapter";

interface CreateInventoryInput {
  productId: string;
  quantity: number;
  reorderLevel: number;
}

interface UpdateInventoryInput {
  quantity?: number;
  reorderLevel?: number;
}

export const createInventory = async (data: CreateInventoryInput) => {
  return await prisma.inventory.create({
    data,
    include: {
      product: true,
    },
  });
};

export const getAllInventory = async () => {
  return await prisma.inventory.findMany({
    include: {
      product: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
};

export const getInventoryById = async (id: string) => {
  return await prisma.inventory.findUnique({
    where: { id },
    include: {
      product: true,
    },
  });
};

export const getInventoryByProductId = async (productId: string) => {
  return await prisma.inventory.findUnique({
    where: { productId },
    include: {
      product: true,
    },
  });
};

export const updateInventory = async (id: string, data: UpdateInventoryInput) => {
  return await prisma.inventory.update({
    where: { id },
    data,
    include: {
      product: true,
    },
  });
};

export const adjustInventoryQuantity = async (productId: string, adjustment: number) => {
  const inventory = await prisma.inventory.findUnique({
    where: { productId },
  });

  if (!inventory) {
    throw new Error("Inventory not found for this product");
  }

  const newQuantity = inventory.quantity + adjustment;
  if (newQuantity < 0) {
    throw new Error("Insufficient inventory");
  }

  return await prisma.inventory.update({
    where: { productId },
    data: {
      quantity: newQuantity,
    },
    include: {
      product: true,
    },
  });
};

export const deleteInventory = async (id: string) => {
  return await prisma.inventory.delete({
    where: { id },
  });
};

export const getLowStockItems = async () => {
  return await prisma.inventory.findMany({
    where: {
      quantity: {
        lte: prisma.inventory.fields.reorderLevel,
      },
    },
    include: {
      product: true,
    },
  });
};