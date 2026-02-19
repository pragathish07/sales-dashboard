'use client'

import React, { useState } from 'react'
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

type SalesUser = {
  id: string
  name: string
  email: string
  role: 'SALES'
  active: boolean
}

const initialUsers: SalesUser[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    role: 'SALES',
    active: true
  },
  {
    id: '2',
    name: 'Priya Verma',
    email: 'priya@example.com',
    role: 'SALES',
    active: false
  }
]

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers)
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

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  /* ================= ADD USER ================= */

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password) return

    setUsers(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: 'SALES',
        active: true
      }
    ])

    resetForm()
    setIsAdding(false)
  }

  /* ================= EDIT USER ================= */

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return

    setUsers(prev =>
      prev.map(user =>
        user.id === selectedUser.id
          ? { ...user, name: formData.name, email: formData.email }
          : user
      )
    )

    resetForm()
    setSelectedUser(null)
    setIsEditing(false)
  }

  /* ================= DELETE USER ================= */

  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id))
    setOpenMenu(null)
  }

  /* ================= TOGGLE ACTIVE ================= */

  const toggleActive = (id: string) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === id
          ? { ...user, active: !user.active }
          : user
      )
    )
    setOpenMenu(null)
  }

  /* ================= RESET PASSWORD ================= */

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Reset password for:', selectedUser?.id, newPassword)

    setNewPassword('')
    setIsResetting(false)
    setSelectedUser(null)
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
              <th className="text-left p-4">Status</th>
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
                    user.active
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {user.active ? 'Active' : 'Inactive'}
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

                      {/* Toggle Active */}
                      <button
                        onClick={() => toggleActive(user.id)}
                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-white/5"
                      >
                        {user.active ? (
                          <ToggleLeft className="w-4 h-4" />
                        ) : (
                          <ToggleRight className="w-4 h-4" />
                        )}
                        {user.active ? 'Deactivate' : 'Activate'}
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
                placeholder="Password"
                className="w-full bg-black/40 border border-white/10 px-3 py-2 rounded-lg"
                required
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
