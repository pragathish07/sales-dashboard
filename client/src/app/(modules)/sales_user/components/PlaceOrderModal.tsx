'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'

type Product = {
  id: string
  name: string
  price: number
  inventory?: { quantity: number }
}

export default function PlaceOrderModal({
  onOrderPlaced
}: {
  onOrderPlaced?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    customer: '',
    phone: '',
    productId: '',
    qty: 1,
    price: 0,
    paymentMethod: 'CASH',
    status: 'PENDING'
  })

  useEffect(() => {
    if (open) {
      apiFetch('/api/products')
        .then(r => r.json())
        .then(data => setProducts(data.products || []))
        .catch(() => {})
    }
  }, [open])


  const handleProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId)
    setForm(prev => ({
      ...prev,
      productId,
      price: product?.price || 0,
      qty: 1
    }))
  }

  const submit = async () => {
    if (!form.customer || !form.phone || !form.productId) return
    setSubmitting(true)

    try {
      const custRes = await apiFetch('/api/customers', {
        method: 'POST',
        body: JSON.stringify({
          name: form.customer,
          phone: form.phone,
        }),
      })
      const custData = await custRes.json()
      const customerId = custData.customer?.id

      if (!customerId) {
        console.error('Failed to create customer')
        return
      }

      // client-side stock check
      const selected = products.find(p => p.id === form.productId)
      const avail = selected?.inventory?.quantity ?? Infinity
      if (form.qty > avail) {
        alert(`Not enough stock, only ${avail} available`)
        setSubmitting(false)
        return
      }

      const orderRes = await apiFetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          customerId,
          paymentMethod: form.paymentMethod,
          status: form.status,
          items: [
            {
              productId: form.productId,
              quantity: form.qty,
              price: form.price,
            },
          ],
        }),
      })

      if (!orderRes.ok) {
        const errData = await orderRes.json().catch(() => null)
        alert(`Order failed: ${errData?.message || orderRes.statusText}`)
        setSubmitting(false)
        return
      }

      setOpen(false)
      setForm({
        customer: '',
        phone: '',
        productId: '',
        qty: 1,
        price: 0,
        paymentMethod: 'CASH',
        status: 'PENDING'
      })
      onOrderPlaced?.()
    } catch (err) {
      console.error('Error placing order:', err)
    } finally {
      setSubmitting(false)
    }
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
          <div
            className="bg-black/80 backdrop-blur-xl
                       border border-white/10
                       rounded-2xl p-6 w-96 space-y-3"
          >
            <h2 className="text-white font-semibold">
              Create Order
            </h2>

            
            <input
              placeholder="Customer Name"
              value={form.customer}
              className="w-full p-2 bg-black border border-white/10 text-white rounded-lg"
              onChange={e =>
                setForm({ ...form, customer: e.target.value })
              }
            />

            
            <input
              placeholder="Phone"
              value={form.phone}
              className="w-full p-2 bg-black border border-white/10 text-white rounded-lg"
              onChange={e =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            
            <select
              value={form.productId}
              className="w-full p-2 bg-black border border-white/10 text-white rounded-lg"
              onChange={e => handleProductChange(e.target.value)}
            >
              <option value="">Select Product</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} — ₹{p.price} {p.inventory ? `(stock: ${p.inventory.quantity})` : ''}
                </option>
              ))}
            </select>
            {form.productId && (
              <p className="text-white/60 text-xs">
                Available: {products.find(p => p.id === form.productId)?.inventory?.quantity ?? '—'}
              </p>
            )}

            
            <input
              type="number"
              placeholder="Quantity"
              value={form.qty}
              min={1}
              className="w-full p-2 bg-black border border-white/10 text-white rounded-lg"
              onChange={e => {
                const val = +e.target.value
                const prod = products.find(p => p.id === form.productId)
                const avail = prod?.inventory?.quantity ?? Infinity
                setForm({ ...form, qty: val })
                if (val > avail) {
                  alert(`Only ${avail} units available`)
                  setForm(prev => ({ ...prev, qty: avail }))
                }
              }}
            />

          
            <div>
              <label className="text-white/60 text-xs pl-1">Price per unit</label>
              <input
                type="number"
                placeholder="Price per unit"
                value={form.price}
                className="w-full mt-1 p-2 bg-black/50 border border-white/5 text-white/50 rounded-lg cursor-not-allowed"
                readOnly
                disabled
              />
            </div>

            
            <div className="text-white/60 text-sm">
              Total: ₹{(form.price * form.qty).toLocaleString()}
            </div>

           
            <div>
              <label className="text-white/60 text-sm">
                Payment Method
              </label>
              <select
                value={form.paymentMethod}
                className="w-full mt-1 p-2 bg-black border border-white/10 text-white rounded-lg"
                onChange={e =>
                  setForm({
                    ...form,
                    paymentMethod: e.target.value
                  })
                }
              >
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="UPI">UPI</option>
                <option value="NETBANKING">
                  Net Banking
                </option>
              </select>
            </div>

            
            <div>
              <label className="text-white/60 text-sm">
                Order Status
              </label>
              <select
                value={form.status}
                className="w-full mt-1 p-2 bg-black border border-white/10 text-white rounded-lg"
                onChange={e =>
                  setForm({
                    ...form,
                    status: e.target.value
                  })
                }
              >
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="CANCELLED">
                  Cancelled
                </option>
                <option value="REFUNDED">
                  Refunded
                </option>
              </select>
            </div>

            
            <div className="flex gap-2 pt-3">
              <button
                onClick={submit}
                disabled={submitting}
                className="flex-1 py-2 rounded-lg
                           bg-gradient-to-r from-purple-500 to-pink-500
                           disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Confirm'}
              </button>

              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-2 rounded-lg border border-white/20 text-white"
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
