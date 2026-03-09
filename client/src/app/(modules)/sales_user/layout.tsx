'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, ShoppingCart, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { name: 'Dashboard', href: '/sales_user', icon: LayoutDashboard },
  { name: 'Orders', href: '/sales_user/orders', icon: ShoppingCart }
]

export default function SalesLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const logout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-black relative flex overflow-hidden">
      {/* Gradient BG */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-600/40 via-purple-900/60 to-black" />

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="relative z-10 w-64 m-4 rounded-2xl
                   bg-black/40 backdrop-blur-xl
                   border border-white/10 shadow-2xl
                   p-4 flex flex-col"
      >
        <h1 className="text-xl font-bold mb-8 text-center
          bg-gradient-to-r from-purple-400 to-pink-500
          text-transparent bg-clip-text">
          Sales Panel
        </h1>

        <nav className="flex flex-col gap-2 flex-1">
          {menuItems.map(item => {
            const Icon = item.icon
            const active = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition',
                    active
                      ? 'bg-white text-black'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg
                     text-red-400 hover:bg-red-500/10 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </motion.aside>

      {/* Content */}
      <main className="relative z-10 flex-1 p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-xl
                     border border-white/10
                     rounded-2xl p-6 min-h-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}
