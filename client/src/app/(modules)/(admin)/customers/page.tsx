'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Phone, Mail, MapPin, Calendar, Users } from 'lucide-react'
import { apiFetch } from '@/lib/api'

type Customer = {
  id: string
  name: string
  email: string | null
  phone: string
  address: string | null
  createdAt: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<'name' | 'date'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const perPage = 10

  useEffect(() => {
    apiFetch('/api/customers')
      .then(r => r.json())
      .then(data => setCustomers(data.customers || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Search
  const filtered = customers.filter(c => {
    const term = searchTerm.toLowerCase()
    return (
      c.name.toLowerCase().includes(term) ||
      (c.email?.toLowerCase().includes(term) ?? false) ||
      c.phone.includes(term) ||
      (c.address?.toLowerCase().includes(term) ?? false)
    )
  })

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortField === 'name') {
      return sortOrder === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    }
    return sortOrder === 'asc'
      ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  // Pagination
  const paginated = sorted.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.ceil(sorted.length / perPage) || 1

  // Reset page when filters change
  useEffect(() => { setPage(1) }, [searchTerm, sortField, sortOrder])

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          Customers
        </h1>

        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search by name, email, phone…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-sm text-white placeholder-white/40 w-56"
          />
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-black/40 rounded-2xl p-4 text-center">
          <div className="text-sm text-white/60">Total Customers</div>
          <div className="text-xl font-semibold">{customers.length}</div>
        </div>
        <div className="bg-black/40 rounded-2xl p-4 text-center">
          <div className="text-sm text-white/60">With Email</div>
          <div className="text-xl font-semibold text-blue-400">
            {customers.filter(c => c.email).length}
          </div>
        </div>
        <div className="bg-black/40 rounded-2xl p-4 text-center">
          <div className="text-sm text-white/60">With Address</div>
          <div className="text-xl font-semibold text-green-400">
            {customers.filter(c => c.address).length}
          </div>
        </div>
      </div>

      {/* Sort controls */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-white/50">
          {filtered.length} result{filtered.length !== 1 && 's'}
        </div>
        <div className="flex gap-2">
          <select
            value={sortField}
            onChange={e => setSortField(e.target.value as 'name' | 'date')}
            className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
          </select>
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Customer List */}
      {paginated.length === 0 ? (
        <div className="text-center text-white/40 py-16">
          <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
          No customers found.
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-visible"
        >
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Phone</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Address</th>
                <th className="text-left p-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  <td className="p-4 font-medium">{c.name}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4 text-purple-400" />
                      {c.phone}
                    </span>
                  </td>
                  <td className="p-4">
                    {c.email ? (
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4 text-blue-400" />
                        {c.email}
                      </span>
                    ) : (
                      <span className="text-white/30">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    {c.address ? (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-green-400" />
                        {c.address}
                      </span>
                    ) : (
                      <span className="text-white/30">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-pink-400" />
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-white/60 text-sm self-center">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          className="px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
