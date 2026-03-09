// src/modules/customers/customers.service.ts

import { prisma } from "../../config/adapter";

interface CreateCustomerInput {
  name: string;
  email?: string;
  phone: string;
  address?: string;
}

interface UpdateCustomerInput {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export const createCustomer = async (data: CreateCustomerInput) => {
  return await prisma.customer.create({
    data,
  });
};

export const getAllCustomers = async () => {
  return await prisma.customer.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getCustomerById = async (id: string) => {
  return await prisma.customer.findUnique({
    where: { id },
    include: {
      orders: true,
    },
  });
};

export const updateCustomer = async (id: string, data: UpdateCustomerInput) => {
  return await prisma.customer.update({
    where: { id },
    data,
  });
};

export const deleteCustomer = async (id: string) => {
  return await prisma.customer.delete({
    where: { id },
  });
};