'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PlaceOrderModal from './components/PlaceOrderModal'
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

  useEffect(() => {
    fetch('/api/sales_user/analytics')
      .then(r => r.json())
      .then(setAnalytics)
  }, [])

  const kpis = [
    { label: 'Total Sales', value: analytics?.totalSales || 0 },
    { label: 'Orders', value: analytics?.ordersCount || 0 },
    { label: 'Avg Order', value: analytics?.avgOrderValue || 0 },
    { label: 'Today Sales', value: analytics?.todaySales || 0 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Sales Dashboard</h1>
        <PlaceOrderModal />
      </div>

      {/* KPI */}
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
              ₹{k.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 h-72">
        <h2 className="text-white font-semibold mb-3">Sales Trend</h2>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={analytics?.salesByDate || []}>
            <XAxis dataKey="date" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Line type="monotone" dataKey="sales" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h2 className="text-white font-semibold mb-3">
          Recent Orders
        </h2>

        {analytics?.recentOrders?.map((o: any) => (
          <div
            key={o.id}
            className="flex justify-between border-b border-white/10 py-2 text-white"
          >
            <span>{o.customer}</span>
            <span>₹{o.amount}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
