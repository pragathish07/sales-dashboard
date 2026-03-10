import { prisma } from "../../config/adapter";

export const getAllCustomers = async () => {
  return prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const findOrCreateCustomer = async (data: {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}) => {
  const existing = await prisma.customer.findFirst({
    where: { phone: data.phone },
  });

  if (existing) return existing;

  return prisma.customer.create({ data });
};
