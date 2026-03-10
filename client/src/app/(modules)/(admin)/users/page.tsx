'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  KeyRound,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'
import { apiFetch } from '@/lib/api'

type SalesUser = {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<SalesUser[]>([])
  const [loading, setLoading] = useState(true)
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const [selectedUser, setSelectedUser] = useState<SalesUser | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [newPassword, setNewPassword] = useState('')

  useEffect(() => {
    apiFetch('/api/users')
      .then(r => r.json())
      .then(data => setUsers(data.users || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  /* ================= ADD USER ================= */

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password) return

    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'SALES',
        }),
      })

      const data = await res.json()
      if (res.ok && data.user) {
        setUsers(prev => [...prev, data.user])
      }
    } catch {}

    resetForm()
    setIsAdding(false)
  }

  /* ================= EDIT USER ================= */

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return

    try {
      const res = await apiFetch('/api/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      })

      if (res.ok) {
        setUsers(prev =>
          prev.map(user =>
            user.id === selectedUser.id
              ? { ...user, name: formData.name, email: formData.email }
              : user
          )
        )
      }
    } catch {}

    resetForm()
    setSelectedUser(null)
    setIsEditing(false)
  }

  /* ================= DELETE USER ================= */

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await apiFetch(`/api/auth/users/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setUsers(prev => prev.filter(user => user.id !== id))
      }
    } catch {}
    setOpenMenu(null)
  }

  /* ================= RESET PASSWORD ================= */

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return

    // Note: In a real admin flow, you'd have a dedicated admin reset endpoint
    console.log('Reset password for:', selectedUser.id, newPassword)

    setNewPassword('')
    setIsResetting(false)
    setSelectedUser(null)
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

      {/* Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold bg-gradient-to-r
          from-purple-400 to-pink-500
          text-transparent bg-clip-text">
          Manage Sales Users
        </h1>

        <button
          onClick={() => {
            resetForm()
            setIsAdding(true)
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500 hover:bg-purple-600 text-sm font-medium text-white shadow-lg shadow-purple-500/30 transition"
        >
          <Plus className="w-4 h-4" />
          Add Sales User
        </button>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-visible"
      >
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Role</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, i) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="border-t border-white/10 hover:bg-white/5 transition relative"
              >
                <td className="p-4 flex items-center gap-3">
                  <User className="w-4 h-4 text-purple-400" />
                  {user.name}
                </td>

                <td className="p-4 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  {user.email}
                </td>

                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    user.role === 'ADMIN'
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {user.role}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-4 relative">
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === user.id ? null : user.id)
                    }
                    className="p-2 rounded-full hover:bg-white/10"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {openMenu === user.id && (
                    <div className="absolute right-4 mt-2 w-44 bg-zinc-900 border border-white/10 rounded-xl shadow-xl z-50 text-sm">

                      {/* Edit */}
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          setFormData({
                            name: user.name,
                            email: user.email,
                            password: ''
                          })
                          setIsEditing(true)
                          setOpenMenu(null)
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-white/5"
                      >
                        <Pencil className="w-4 h-4" /> Edit
                      </button>

                      {/* Reset Password */}
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          setIsResetting(true)
                          setOpenMenu(null)
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-white/5"
                      >
                        <KeyRound className="w-4 h-4" /> Reset Password
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="flex items-center gap-2 w-full px-4 py-2 text-red-400 hover:bg-white/5"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* ADD USER MODAL */}
      {isAdding && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-zinc-900 p-6 rounded-2xl w-full max-w-md border border-white/10">
            <h2 className="text-lg mb-4 font-semibold">Add Sales User</h2>

            <form onSubmit={handleAddUser} className="space-y-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full bg-black/40 border border-white/10 px-3 py-2 rounded-lg"
                required
              />

              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full bg-black/40 border border-white/10 px-3 py-2 rounded-lg"
                required
              />

              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password (min 6 chars)"
                className="w-full bg-black/40 border border-white/10 px-3 py-2 rounded-lg"
                required
                minLength={6}
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-2 border border-white/10 rounded-full"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-purple-500 hover:bg-purple-600"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditing && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-zinc-900 p-6 rounded-2xl w-full max-w-md border border-white/10">
            <h2 className="text-lg mb-4 font-semibold">Edit User</h2>

            <form onSubmit={handleEditUser} className="space-y-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 px-3 py-2 rounded-lg"
              />

              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 px-3 py-2 rounded-lg"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-2 border border-white/10 rounded-full"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-purple-500 hover:bg-purple-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {isResetting && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-zinc-900 p-6 rounded-2xl w-full max-w-md border border-white/10">
            <h2 className="text-lg mb-4 font-semibold">Reset Password</h2>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className="w-full bg-black/40 border border-white/10 px-3 py-2 rounded-lg"
                required
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsResetting(false)}
                  className="px-3 py-2 border border-white/10 rounded-full"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-yellow-500 hover:bg-yellow-600"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}