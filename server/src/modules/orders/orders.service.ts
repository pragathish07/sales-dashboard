import { prisma } from '../../config/adapter'

export const createOrderService = async (data: any, userId: string) => {
  const { customerId, items, paymentMethod } = data

  // Calculate total amount
  let totalAmount = 0
  const orderItems = []

  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId }
    })
    if (!product) throw new Error('Product not found')

    const itemTotal = product.price * item.quantity
    totalAmount += itemTotal

    orderItems.push({
      productId: item.productId,
      quantity: item.quantity,
      price: product.price
    })

    // Update inventory
    await prisma.inventory.update({
      where: { productId: item.productId },
      data: { quantity: { decrement: item.quantity } }
    })
  }

  return await prisma.order.create({
    data: {
      customerId,
      userId,
      totalAmount,
      paymentMethod,
      items: {
        create: orderItems
      }
    },
    include: {
      customer: true,
      items: {
        include: {
          product: true
        }
      }
    }
  })
}

export const getOrdersService = async () => {
  return await prisma.order.findMany({
    include: {
      customer: true,
      user: true,
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export const getOrderByIdService = async (id: string) => {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      user: true,
      items: {
        include: {
          product: true
        }
      }
    }
  })
}

export const updateOrderStatusService = async (id: string, status: string) => {
  return await prisma.order.update({
    where: { id },
    data: { status },
    include: {
      customer: true,
      items: {
        include: {
          product: true
        }
      }
    }
  })
}