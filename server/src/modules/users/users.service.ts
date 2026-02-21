import {prisma} from "../../config/adapter";

import { CreateUserInput } from "../users/users.types"

export const createUser = async (data: CreateUserInput) => {
  return await prisma.user.create({
    data,
  });
};

export const fetchAllUsers = async () => {
  return await prisma.user.findMany();
};
