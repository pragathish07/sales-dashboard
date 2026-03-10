'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, DollarSign, FileText } from 'lucide-react'
import { apiFetch } from '@/lib/api'

type Order = {
  id: string
  customer: { name: string }
  totalAmount: number
  createdAt: string
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED'
  salesUser?: { id: string; name: string; email: string } | null
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const perPage = 10

  const [sortField, setSortField] = useState<'date' | 'total'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [salesFilter, setSalesFilter] = useState<string>('all')

  useEffect(() => {
    apiFetch('/api/orders/sales')
      .then(r => r.json())
      .then(data => setOrders(data.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Filtering
  const filteredOrders = salesFilter === 'all' ? orders : orders.filter(o => o.salesUser?.id === salesFilter)

  // Sorting
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortField === 'date') {
      return sortOrder === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else {
      return sortOrder === 'asc'
        ? a.totalAmount - b.totalAmount
        : b.totalAmount - a.totalAmount
    }
  })

  // Pagination
  const paginatedOrders = sortedOrders.slice((page - 1) * perPage, page * perPage)
  const nextPage = () => {
    if (page * perPage < sortedOrders.length) setPage(prev => prev + 1)
  }
  const prevPage = () => {
    if (page > 1) setPage(prev => prev - 1)
  }

  // KPI
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)
  const avgOrder = orders.length ? (totalRevenue / orders.length).toFixed(2) : 0
  const completedCount = orders.filter(o => o.status === 'PAID').length
  const pendingCount = orders.filter(o => o.status === 'PENDING').length

  // Alerts
  const highValueOrders = orders.filter(o => o.totalAmount > 4000)
  const oldPendingOrders = orders.filter(o => {
    const orderDate = new Date(o.createdAt)
    const diffDays = (Date.now() - orderDate.getTime()) / (1000 * 3600 * 24)
    return o.status === 'PENDING' && diffDays > 5
  })

  // Export CSV
  const exportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Customer,Date,Total,Status']
        .concat(
          orders.map(
            o =>
              `${o.id},${o.customer?.name || 'N/A'},${new Date(o.createdAt).toISOString().split('T')[0]},${o.totalAmount},${o.status}`
          )
        )
        .join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'orders.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="text-white p-4 space-y-6">

      {/* Header */}
      <div className="flex justify-between mb-4 items-center">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          Orders Dashboard
        </h1>

        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 text-sm font-medium text-white shadow-lg shadow-green-500/30 transition"
        >
          <FileText className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <div className="bg-black/40 rounded-2xl p-4 text-center">
          <div className="text-sm text-white/60">Total Orders</div>
          <div className="text-xl font-semibold">{orders.length}</div>
        </div>
        <div className="bg-black/40 rounded-2xl p-4 text-center">
          <div className="text-sm text-white/60">Total Revenue</div>
          <div className="text-xl font-semibold">₹{totalRevenue.toLocaleString()}</div>
        </div>
        <div className="bg-black/40 rounded-2xl p-4 text-center">
          <div className="text-sm text-white/60">Avg Order</div>
          <div className="text-xl font-semibold">₹{avgOrder}</div>
        </div>
        <div className="bg-black/40 rounded-2xl p-4 text-center">
          <div className="text-sm text-white/60">Completed</div>
          <div className="text-xl font-semibold text-green-400">{completedCount}</div>
        </div>
        <div className="bg-black/40 rounded-2xl p-4 text-center">
          <div className="text-sm text-white/60">Pending</div>
          <div className="text-xl font-semibold text-yellow-400">{pendingCount}</div>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-2">
        {highValueOrders.length > 0 && (
          <div className="bg-purple-500/20 text-purple-400 p-3 rounded-lg">
            ⚡ {highValueOrders.length} High-Value Orders (₹4000+)!
          </div>
        )}
        {oldPendingOrders.length > 0 && (
          <div className="bg-yellow-500/20 text-yellow-400 p-3 rounded-lg">
            ⏰ {oldPendingOrders.length} Pending Orders older than 5 days!
          </div>
        )}
      </div>

      {/* Sorting */}
      <div className="flex justify-end gap-2 mb-2">
        <select
          value={salesFilter}
          onChange={(e) => { setSalesFilter(e.target.value); setPage(1) }}
          className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All Sales Users</option>
          {[...new Map(orders.filter(o => o.salesUser).map(o => [o.salesUser!.id, o.salesUser!])).values()].map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select
          value={sortField}
          onChange={(e) => { setSortField(e.target.value as 'date' | 'total'); setPage(1) }}
          className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm"
        >
          <option value="date">Sort by Date</option>
          <option value="total">Sort by Price</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => { setSortOrder(e.target.value as 'asc' | 'desc'); setPage(1) }}
          className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-visible"
      >
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="text-left p-4">Customer</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Sales</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order, i) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="p-4">{order.customer?.name || 'N/A'}</td>
                <td className="p-4 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    {order.totalAmount.toLocaleString()}
                  </span>
                </td>
                <td className="p-4">{order.salesUser?.name || '—'}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      order.status === 'PAID'
                        ? 'bg-green-500/20 text-green-400'
                        : order.status === 'PENDING'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : order.status === 'CANCELLED'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-purple-500/20 text-purple-400'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={prevPage}
          disabled={page === 1}
          className="px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-white/60 text-sm self-center">
          Page {page} of {Math.ceil(sortedOrders.length / perPage) || 1}
        </span>
        <button
          onClick={nextPage}
          disabled={page * perPage >= sortedOrders.length}
          className="px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}