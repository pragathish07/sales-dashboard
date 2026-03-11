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

export const getOrdersWithSalesUser = async () => {
  const orders = await prisma.order.findMany({
    include: {
      customer: true,
      user: { select: { id: true, name: true, email: true, role: true } },
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders.map((order) => {
    const salesUser = order.user?.role === "SALES"
      ? { id: order.user.id, name: order.user.name, email: order.user.email }
      : null;
    return { ...order, salesUser };
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
  // ensure sufficient inventory and decrement in transaction
  return await prisma.$transaction(async (tx) => {
    // load inventories for all products in order
    const inventories = await Promise.all(
      data.items.map((item) =>
        tx.inventory.findUnique({
          where: { productId: item.productId },
        })
      )
    );

    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      const inv = inventories[i];
      if (!inv) {
        throw new Error(`No inventory record for product ${item.productId}`);
      }
      if (inv.quantity < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }
    }

    // decrement inventory
    await Promise.all(
      data.items.map((item) =>
        tx.inventory.update({
          where: { productId: item.productId },
          data: { quantity: { decrement: item.quantity } },
        })
      )
    );

    const totalAmount = data.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await tx.order.create({
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

    return order;
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
