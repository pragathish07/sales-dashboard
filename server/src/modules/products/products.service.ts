import { prisma } from "../../config/adapter";

export const getAllProducts = async () => {
  return prisma.product.findMany({
    include: {
      category: true,
      inventory: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const createProduct = async (data: {
  name: string;
  sku: string;
  description?: string;
  price: number;
  costPrice: number;
  categoryId: string;
  stock: number;
  reorderLevel?: number;
}) => {
  const { stock, reorderLevel, ...productData } = data;

  return prisma.product.create({
    data: {
      ...productData,
      inventory: {
        create: {
          quantity: stock,
          reorderLevel: reorderLevel ?? 10,
        },
      },
    },
    include: {
      category: true,
      inventory: true,
    },
  });
};

export const updateProductStock = async (id: string, stock: number) => {
  return prisma.product.update({
    where: { id },
    data: {
      inventory: {
        update: { quantity: stock },
      },
    },
    include: {
      category: true,
      inventory: true,
    },
  });
};

export const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
};

export const createCategory = async (name: string) => {
  return prisma.category.create({
    data: { name },
  });
};
