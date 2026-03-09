'use client'

import { useEffect, useState } from 'react'

export default function SalesOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/sales_user/orders')
      .then(r => r.json())
      .then(setOrders)
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/sales_user/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })

    // update UI instantly
    setOrders(prev =>
      prev.map(o =>
        o.id === id ? { ...o, status } : o
      )
    )
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'text-green-400'
      case 'PENDING':
        return 'text-yellow-400'
      case 'CANCELLED':
        return 'text-red-400'
      case 'REFUNDED':
        return 'text-purple-400'
      default:
        return 'text-white'
    }
  }

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
            className="grid grid-cols-4 p-4 border-b border-white/10 text-white items-center"
          >
            {/* Customer */}
            <span>{o.customer}</span>

            {/* Amount */}
            <span>₹{o.amount}</span>

            {/* Status editable */}
            <select
              value={o.status}
              onChange={e =>
                updateStatus(o.id, e.target.value)
              }
              className={`bg-transparent border border-white/10 rounded px-2 py-1 ${statusColor(
                o.status
              )}`}
            >
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="CANCELLED">
                Cancelled
              </option>
              <option value="REFUNDED">
                Refunded
              </option>
            </select>

            {/* Date */}
            <span>
              {new Date(o.date).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
