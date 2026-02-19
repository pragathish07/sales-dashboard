'use client'

import { useEffect, useState } from 'react'

export default function PlaceOrderModal() {
  const [open, setOpen] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [form, setForm] = useState({
    customer: '',
    phone: '',
    productId: '',
    qty: 1,
    price: 0
  })

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(setProducts)
  }, [])

  const submit = async () => {
    await fetch('/api/sales_user/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-lg
                   bg-gradient-to-r from-purple-500 to-pink-500
                   text-white font-medium"
      >
        Place Order
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-black/80 backdrop-blur-xl
                          border border-white/10
                          rounded-2xl p-6 w-96 space-y-3">
            <h2 className="text-white font-semibold">
              Create Order
            </h2>

            <input
              placeholder="Customer Name"
              className="w-full p-2 bg-black border border-white/10 text-white"
              onChange={e =>
                setForm({ ...form, customer: e.target.value })
              }
            />

            <input
              placeholder="Phone"
              className="w-full p-2 bg-black border border-white/10 text-white"
              onChange={e =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <select
              className="w-full p-2 bg-black border border-white/10 text-white"
              onChange={e =>
                setForm({ ...form, productId: e.target.value })
              }
            >
              <option>Select Product</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Quantity"
              className="w-full p-2 bg-black border border-white/10 text-white"
              onChange={e =>
                setForm({ ...form, qty: +e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Price"
              className="w-full p-2 bg-black border border-white/10 text-white"
              onChange={e =>
                setForm({ ...form, price: +e.target.value })
              }
            />

            <div className="flex gap-2 pt-2">
              <button
                onClick={submit}
                className="flex-1 py-2 rounded-lg
                           bg-gradient-to-r from-purple-500 to-pink-500"
              >
                Confirm
              </button>

              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-2 rounded-lg border border-white/20"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
