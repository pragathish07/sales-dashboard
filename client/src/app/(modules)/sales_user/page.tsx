'use client'

import { useEffect, useState } from 'react'

type Product = {
  id: string
  name: string
  price: number
}

export default function SalesUserDashboard() {
  const [open, setOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])

  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    productId: '',
    quantity: 1,
    price: 0
  })

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts)
  }, [])

  useEffect(() => {
    const p = products.find(p => p.id === form.productId)
    if (p) setForm(f => ({ ...f, price: p.price }))
  }, [form.productId, products])

  const handleSubmit = async () => {
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    setOpen(false)
    setForm({
      customerName: '',
      phone: '',
      productId: '',
      quantity: 1,
      price: 0
    })
  }

  const total = form.quantity * form.price

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">
          Sales Dashboard
        </h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Create Order
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[420px]">
            <h2 className="text-xl font-semibold mb-4">Create Order</h2>

            <input
              placeholder="Customer Name"
              className="w-full border p-2 rounded mb-2"
              value={form.customerName}
              onChange={e =>
                setForm({ ...form, customerName: e.target.value })
              }
            />

            <input
              placeholder="Phone"
              className="w-full border p-2 rounded mb-2"
              value={form.phone}
              onChange={e =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <select
              className="w-full border p-2 rounded mb-2"
              value={form.productId}
              onChange={e =>
                setForm({ ...form, productId: e.target.value })
              }
            >
              <option value="">Select Product</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              min={1}
              className="w-full border p-2 rounded mb-2"
              value={form.quantity}
              onChange={e =>
                setForm({ ...form, quantity: Number(e.target.value) })
              }
            />

            <input
              type="number"
              className="w-full border p-2 rounded mb-2"
              value={form.price}
              onChange={e =>
                setForm({ ...form, price: Number(e.target.value) })
              }
            />

            <div className="mb-4 font-semibold">
              Total: ₹ {total}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
