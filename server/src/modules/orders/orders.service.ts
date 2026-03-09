import { prisma } from "../../config/adapter";

export const getAllOrders = async () => {
  return prisma.order.findMany({
    include: {
      customer: true,
      user: { select: { id: true, name: true, email: true } },
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getOrdersByUser = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      customer: true,
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const createOrder = async (data: {
  customerId: string;
  userId: string;
  paymentMethod: "CASH" | "CARD" | "UPI" | "NETBANKING";
  status: "PENDING" | "PAID" | "CANCELLED" | "REFUNDED";
  items: { productId: string; quantity: number; price: number }[];
}) => {
  const totalAmount = data.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return prisma.order.create({
    data: {
      customerId: data.customerId,
      userId: data.userId,
      paymentMethod: data.paymentMethod,
      status: data.status,
      totalAmount,
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: {
      customer: true,
      items: { include: { product: true } },
    },
  });
};

export const updateOrderStatus = async (
  orderId: string,
  status: "PENDING" | "PAID" | "CANCELLED" | "REFUNDED"
) => {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      customer: true,
      items: { include: { product: true } },
    },
  });
};
