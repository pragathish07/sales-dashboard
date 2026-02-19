'use client'

import { useEffect, useState } from 'react'

export default function SalesOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/sales_user/orders')
      .then(r => r.json())
      .then(setOrders)
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-4">
        My Orders
      </h1>

      <div className="bg-black/40 backdrop-blur-xl
                      border border-white/10
                      rounded-2xl">
        {orders.map(o => (
          <div
            key={o.id}
            className="grid grid-cols-4 p-4 border-b border-white/10 text-white"
          >
            <span>{o.customer}</span>
            <span>₹{o.amount}</span>
            <span>{o.status}</span>
            <span>
              {new Date(o.date).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
