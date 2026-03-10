'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Package, Tag, IndianRupee, Plus } from 'lucide-react'
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
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
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
        setProducts(prodData.products || [])
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
      }
    } catch {}

    setNewProduct({ name: '', sku: '', categoryId: '', price: '', costPrice: '', stock: '', description: '' })
    setIsAddingCategory(false)
    setNewCategoryName('')
    setIsAdding(false)
  }

  const addCategory = async () => {
    const name = newCategoryName.trim()
    if (!name) return

    const exists = categories.find(c => c.name.toLowerCase() === name.toLowerCase())
    if (exists) {
      setNewProduct(prev => ({ ...prev, categoryId: exists.id }))
      setIsAddingCategory(false)
      setNewCategoryName('')
      return
    }

    try {
      const res = await apiFetch('/api/products/categories', {
        method: 'POST',
        body: JSON.stringify({ name }),
      })
      const data = await res.json()
      if (res.ok && data.category) {
        setCategories(prev => [...prev, data.category])
        setNewProduct(prev => ({ ...prev, categoryId: data.category.id }))
      }
    } catch {}

    setIsAddingCategory(false)
    setNewCategoryName('')
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold bg-gradient-to-r
          from-purple-400 to-pink-500
          text-transparent bg-clip-text">
          Products
        </h1>
      </div>
      
      {/* Table */}
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
            {products.map((product, i) => (
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
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      (product.inventory?.quantity ?? 0) > 10
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {product.inventory?.quantity ?? 0} units
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Add Product button */}
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500 hover:bg-purple-600 text-sm font-medium text-white shadow-lg shadow-purple-500/30 transition"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Add Product modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs text-white/60 mb-1">Name</label>
                <input
                  name="name"
                  value={newProduct.name}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm outline-none focus:border-purple-500"
                  placeholder="Product name"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-white/60 mb-1">SKU</label>
                <input
                  name="sku"
                  value={newProduct.sku}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm outline-none focus:border-purple-500"
                  placeholder="SKU (unique)"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-white/60 mb-1">Category</label>
                <div className="flex items-stretch gap-2">
                  <select
                    name="categoryId"
                    value={newProduct.categoryId}
                    onChange={(e) => {
                      setIsAddingCategory(false)
                      handleChange(e)
                    }}
                    className="flex-1 rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm outline-none focus:border-purple-500"
                    required
                  >
                    <option value="" disabled>Select category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(true)}
                    className="px-3 rounded-lg border border-white/10 text-white/80 hover:bg-white/5 transition"
                    title="Add category"
                  >
                    +
                  </button>
                </div>

                {isAddingCategory && (
                  <div className="mt-2 flex items-stretch gap-2">
                    <input
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="flex-1 rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm outline-none focus:border-purple-500"
                      placeholder="New category name"
                    />
                    <button
                      type="button"
                      onClick={addCategory}
                      className="px-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-sm font-medium text-white transition"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCategory(false)
                        setNewCategoryName('')
                      }}
                      className="px-3 rounded-lg border border-white/10 text-white/70 hover:bg-white/5 transition"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs text-white/60 mb-1">Description</label>
                <input
                  name="description"
                  value={newProduct.description}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm outline-none focus:border-purple-500"
                  placeholder="Optional description"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-white/60 mb-1">Price</label>
                  <input
                    name="price"
                    type="number"
                    value={newProduct.price}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm outline-none focus:border-purple-500"
                    placeholder="Price"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1">Cost Price</label>
                  <input
                    name="costPrice"
                    type="number"
                    value={newProduct.costPrice}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm outline-none focus:border-purple-500"
                    placeholder="Cost"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1">Stock</label>
                  <input
                    name="stock"
                    type="number"
                    value={newProduct.stock}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm outline-none focus:border-purple-500"
                    placeholder="Stock"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-2 text-sm rounded-full border border-white/10 text-white/70 hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500 hover:bg-purple-600 text-sm font-medium text-white shadow-lg shadow-purple-500/30 transition"
                >
                  <Plus className="w-4 h-4" />
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
  )
}