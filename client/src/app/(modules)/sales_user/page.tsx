'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PlaceOrderModal from './components/PlaceOrderModal'
import { apiFetch } from '@/lib/api'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export default function SalesDashboard() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const loadData = () => {
    apiFetch('/api/reports/sales-stats')
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch')
        return r.json()
      })
      .then(setAnalytics)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  const kpis = [
    { label: 'Total Sales', value: analytics?.totalSales || 0, isCurrency: true },
    { label: 'Orders', value: analytics?.ordersCount || 0, isCurrency: false },
    { label: 'Avg Order', value: analytics?.avgOrderValue || 0, isCurrency: true },
    { label: 'Today Sales', value: analytics?.todaySales || 0, isCurrency: true }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Sales Dashboard</h1>
        <PlaceOrderModal onOrderPlaced={loadData} />
      </div>

      
      <div className="grid grid-cols-4 gap-4">
        {kpis.map(k => (
          <motion.div
            key={k.label}
            whileHover={{ y: -3 }}
            className="bg-white/5 backdrop-blur-xl
                       border border-white/10
                       rounded-xl p-4"
          >
            <p className="text-white/60 text-sm">{k.label}</p>
            <p className="text-2xl font-bold text-white">
              {k.isCurrency ? '₹' : ''}
              {typeof k.value === 'number' ? k.value.toLocaleString() : k.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4 h-72">
        <h2 className="text-white font-semibold mb-3">Sales Trend</h2>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={analytics?.salesByDate || []}>
            <XAxis dataKey="date" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#a855f7" />
          </LineChart>
        </ResponsiveContainer>
      </div>

   
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h2 className="text-white font-semibold mb-3">
          Recent Orders
        </h2>

        {analytics?.recentOrders?.length === 0 && (
          <p className="text-white/40 text-sm">No orders yet</p>
        )}

        {analytics?.recentOrders?.map((o: any) => (
          <div
            key={o.id}
            className="flex justify-between border-b border-white/10 py-2 text-white"
          >
            <span>{o.customer}</span>
            <span className={`text-sm ${
              o.status === 'PAID' ? 'text-green-400' :
              o.status === 'PENDING' ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {o.status}
            </span>
            <span>₹{o.amount?.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
