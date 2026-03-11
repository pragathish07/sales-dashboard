'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Package, Tag, IndianRupee, Plus, Pencil } from 'lucide-react'
import { apiFetch } from '@/lib/api'

type Product = {
  id: string
  name: string
  sku: string
  price: number
  costPrice: number
  category: { id: string; name: string } | null
  inventory: { quantity: number; reorderLevel: number } | null
}

type Category = {
  id: string
  name: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingStock, setEditingStock] = useState<{id:string, quantity:number} | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    categoryId: '',
    price: '',
    costPrice: '',
    stock: '',
    description: ''
  })

  useEffect(() => {
    Promise.all([
      apiFetch('/api/products').then(r => r.json()),
      apiFetch('/api/products/categories').then(r => r.json()),
    ])
      .then(([prodData, catData]) => {
        const list = prodData.products || []
        setProducts(list)
        setFilteredProducts(list)
        setCategories(catData.categories || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newProduct.name || !newProduct.categoryId || !newProduct.sku) return

    const price = Number(newProduct.price)
    const costPrice = Number(newProduct.costPrice)
    const stock = Number(newProduct.stock)

    if (Number.isNaN(price) || Number.isNaN(stock) || Number.isNaN(costPrice)) return

    try {
      const res = await apiFetch('/api/products', {
        method: 'POST',
        body: JSON.stringify({
          name: newProduct.name,
          sku: newProduct.sku,
          description: newProduct.description || undefined,
          price,
          costPrice,
          categoryId: newProduct.categoryId,
          stock,
        }),
      })

      const data = await res.json()
      if (res.ok && data.product) {
        setProducts(prev => [data.product, ...prev])
        setNewProduct({ name: '', sku: '', categoryId: '', price: '', costPrice: '', stock: '', description: '' })
        setIsAdding(false)
      } else {
        alert('Give a unique SKU and try again ' )
      }
    } catch (err) {
      alert('Error adding product')
    }
  }
  const handleStockUpdate = async (qty: number) => {
    if (!editingStock) return
    try {
      const res = await apiFetch(`/api/products/${editingStock.id}`, {
        method: 'PUT',
        body: JSON.stringify({ stock: qty }),
      })
      const data = await res.json()
      if (res.ok && data.product) {
        setProducts(prev => prev.map(p => p.id === data.product.id ? data.product : p))
        setFilteredProducts(prev => prev.map(p => p.id === data.product.id ? data.product : p))
      }
    } catch (err) {
      console.error('stock update error', err)
    }
    setEditingStock(null)
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

      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <div className="flex items-center gap-3 flex-1">
          <h1 className="text-2xl font-semibold bg-gradient-to-r
            from-purple-400 to-pink-500
            text-transparent bg-clip-text">
            Products
          </h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              const term = e.target.value
              setSearchTerm(term)
              const filtered = products.filter(p =>
                p.name.toLowerCase().includes(term.toLowerCase()) ||
                p.sku.toLowerCase().includes(term.toLowerCase())
              )
              setFilteredProducts(filtered)
            }}
            className="bg-black/40 border border-white/10 px-3 py-2 rounded-lg text-white outline-none focus:border-purple-500"
          />
        </div>
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
              <th className="text-left p-4">SKU</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Stock</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product, i) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="p-4 flex items-center gap-3">
                  <Package className="w-4 h-4 text-purple-400" />
                  {product.name}
                </td>

                <td className="p-4 text-white/70">{product.sku}</td>

                <td className="p-4 text-white">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {product.category?.name || '—'}
                  </div>
                </td>

                <td className="p-4 flex items-center gap-1">
                  <IndianRupee className="w-4 h-4 text-green-400" />
                  {product.price}
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        (product.inventory?.quantity ?? 0) > 10
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {product.inventory?.quantity ?? 0} units
                    </span>
                    <button
                      onClick={() => {
                        setEditingStock({
                          id: product.id,
                          quantity: product.inventory?.quantity ?? 0,
                        })
                      }}
                      className="p-1 rounded hover:bg-white/10"
                      title="Edit stock"
                    >
                      <Pencil className="w-4 h-4 text-white/60" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
     
      </div>
  )
}