'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { apiFetch } from '@/lib/api'

type Category = {
  id: string
  name: string
  createdAt: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [name, setName] = useState('')

  const loadData = async () => {
    try {
      const res = await apiFetch('/api/category')
      if (res.ok) {
        const data = await res.json()
        // Handle both array response and object with categories property
        setCategories(Array.isArray(data) ? data : data.categories || [])
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editing) await apiFetch(`/api/category/${editing.id}`, { method: 'PUT', body: JSON.stringify({ name }) })
      else await apiFetch('/api/category', { method: 'POST', body: JSON.stringify({ name }) })
      setName(''); setEditing(null); setShowForm(false); loadData()
    } catch (e) { console.error(e) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return
    await apiFetch(`/api/category/${id}`, { method: 'DELETE' }); loadData()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="text-white">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold bg-gradient-to-r
          from-purple-400 to-pink-500
          text-transparent bg-clip-text">
          Categories
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 backdrop-blur-xl
                   border border-white/10
                   rounded-2xl overflow-hidden"
      >
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Created</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-6 text-white/60">
                  No categories found
                </td>
              </tr>
            ) : (
              categories.map((r: Category) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  <td className="p-4 font-medium">{r.name}</td>
                  <td className="p-4 text-white/70">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => { setEditing(r); setName(r.name); setShowForm(true) }} className="px-3 py-1 text-xs rounded-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="px-3 py-1 text-xs rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 transition">
                        Delete
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>

      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={() => { setEditing(null); setName(''); setShowForm(true) }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500 hover:bg-purple-600 text-sm font-medium text-white shadow-lg shadow-purple-500/30 transition"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Category' : 'Add New Category'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-white/60 mb-1">Category Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm outline-none focus:border-purple-500"
                  placeholder="Category name"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditing(null); setName('') }}
                  className="px-3 py-2 text-sm rounded-full border border-white/10 text-white/70 hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500 hover:bg-purple-600 text-sm font-medium text-white shadow-lg shadow-purple-500/30 transition"
                >
                  <Plus className="w-4 h-4" />
                  {editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
