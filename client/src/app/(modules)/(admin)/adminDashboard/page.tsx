'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { apiFetch } from '@/lib/api'
import {
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  TrendingUp,
  Clock,
  XCircle,
  UserCheck
} from 'lucide-react'

type AdminStats = {
  totalOrders: number
  totalRevenue: number
  avgOrderValue: number
  completedOrders: number
  pendingOrders: number
  cancelledOrders: number
  totalUsers: number
  totalProducts: number
  totalCustomers: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/api/reports/admin-stats')
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch')
        return r.json()
      })
      .then(data => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const kpis = stats
    ? [
        { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-blue-400' },
        { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-400' },
        { label: 'Avg Order Value', value: `₹${stats.avgOrderValue}`, icon: TrendingUp, color: 'text-purple-400' },
        { label: 'Completed', value: stats.completedOrders, icon: ShoppingCart, color: 'text-green-400' },
        { label: 'Pending', value: stats.pendingOrders, icon: Clock, color: 'text-yellow-400' },
        { label: 'Cancelled', value: stats.cancelledOrders, icon: XCircle, color: 'text-red-400' },
        { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-indigo-400' },
        { label: 'Products', value: stats.totalProducts, icon: Package, color: 'text-pink-400' },
        { label: 'Customers', value: stats.totalCustomers, icon: UserCheck, color: 'text-cyan-400' },
      ]
    : []

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="text-white space-y-6">
      <h1 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <motion.div
              key={kpi.label}
              whileHover={{ y: -3 }}
              className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`w-5 h-5 ${kpi.color}`} />
                <p className="text-white/60 text-sm">{kpi.label}</p>
              </div>
              <p className="text-2xl font-bold">{kpi.value}</p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}