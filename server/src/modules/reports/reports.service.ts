import { prisma } from "../../config/adapter";

export const getAdminStats = async () => {
  const [
    totalOrders,
    totalRevenue,
    completedOrders,
    pendingOrders,
    cancelledOrders,
    totalUsers,
    totalProducts,
    totalCustomers,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
    prisma.order.count({ where: { status: "PAID" } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "CANCELLED" } }),
    prisma.user.count(),
    prisma.product.count(),
    prisma.customer.count(),
  ]);

  const revenue = totalRevenue._sum.totalAmount ?? 0;
  const avgOrderValue = totalOrders > 0 ? revenue / totalOrders : 0;

  return {
    totalOrders,
    totalRevenue: revenue,
    avgOrderValue: Math.round(avgOrderValue * 100) / 100,
    completedOrders,
    pendingOrders,
    cancelledOrders,
    totalUsers,
    totalProducts,
    totalCustomers,
  };
};

export const getSalesStats = async (userId: string) => {
  const userOrders = await prisma.order.findMany({
    where: { userId },
    include: { customer: true },
    orderBy: { createdAt: "desc" },
  });

  const totalSales = userOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const ordersCount = userOrders.length;
  const avgOrderValue = ordersCount > 0 ? totalSales / ordersCount : 0;

  // Today's sales
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todaySales = userOrders
    .filter((o) => o.createdAt >= todayStart)
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // Recent orders (last 10)
  const recentOrders = userOrders.slice(0, 10).map((o) => ({
    id: o.id,
    customer: o.customer.name,
    amount: o.totalAmount,
    status: o.status,
    date: o.createdAt,
  }));

  // Sales by date (last 30 days)
  const salesByDate: { date: string; sales: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const daySales = userOrders
      .filter((o) => o.createdAt.toISOString().split("T")[0] === dateStr)
      .reduce((sum, o) => sum + o.totalAmount, 0);
    salesByDate.push({ date: dateStr, sales: daySales });
  }

  return {
    totalSales: Math.round(totalSales * 100) / 100,
    ordersCount,
    avgOrderValue: Math.round(avgOrderValue * 100) / 100,
    todaySales: Math.round(todaySales * 100) / 100,
    recentOrders,
    salesByDate,
  };
};
