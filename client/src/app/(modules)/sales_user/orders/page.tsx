'use client'

import { useEffect, useState } from 'react'

type Order = {
  id: string
  customerName: string
  phone: string
  totalAmount: number
  createdAt: string
}

export default function SalesUserOrders() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(setOrders)
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">
        My Orders
      </h1>

      <table className="w-full text-left text-white">
        <thead className="text-white/70 border-b border-white/10">
          <tr>
            <th className="py-2">Customer</th>
            <th>Phone</th>
            <th>Total</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(o => (
            <tr
              key={o.id}
              className="border-b border-white/5 hover:bg-white/5"
            >
              <td className="py-2">{o.customerName}</td>
              <td>{o.phone}</td>
              <td>₹ {o.totalAmount}</td>
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
