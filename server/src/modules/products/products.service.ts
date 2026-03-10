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
<<<<<<< HEAD
export const getProductsService = async () => {
  return await prisma.product.findMany({
    include: {
      category: true,
      inventory: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
export const getProductByIdService = async (id: string) => {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      inventory: true,
    },
  });
};
export const updateProductService = async (
  id: string,
  data: UpdateProductInput
) => {
  const { name, sku, description, price, costPrice, categoryId } = data;
  return await prisma.product.update({
    where: { id },
    data: {
      name,
      sku,
      description,
      price: price ? Number(price) : undefined,
      costPrice: costPrice ? Number(costPrice) : undefined,
      categoryId,
    },
    include: {
      category: true,
      inventory: true,
    },
  });
};
export const deleteProductService = async (id: string) => {
  await prisma.inventory.deleteMany({
    where: { productId: id },
  });
 
  return await prisma.product.delete({
    where: { id },
  });
};
=======

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
>>>>>>> 832d1fb72ccb2279486bdccc2883c6a2710fc4ff
