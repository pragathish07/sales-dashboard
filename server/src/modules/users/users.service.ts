import {prisma} from "../../config/adapter";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "SALES";
}

export const createUser = async (data: CreateUserInput) => {
  return await prisma.user.create({
    data,
  });
};

export const fetchAllUsers = async () => {
  return await prisma.user.findMany();
};
