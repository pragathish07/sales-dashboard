'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { Download } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

type OrderItem = {
  id: string
  quantity: number
  price: number
  product: { name: string }
}

type Order = {
  id: string
  customer: { name: string; phone?: string; address?: string }
  totalAmount: number
  status: string
  createdAt: string
  items?: OrderItem[]
}

export default function SalesOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/api/orders')
      .then(r => r.json())
      .then(data => setOrders(data.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await apiFetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    })

    setOrders(prev =>
      prev.map(o =>
        o.id === id ? { ...o, status } : o
      )
    )
  }

  const downloadInvoice = (order: Order) => {
    const doc = new jsPDF()

    // Title
    doc.setFontSize(20)
    doc.text('INVOICE', 105, 15, { align: 'center' })

    doc.setFontSize(10)
    doc.text(`Order ID: ${order.id}`, 14, 25)
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 14, 31)
    doc.text(`Status: ${order.status}`, 14, 37)

    // Customer Details
    doc.setFontSize(12)
    doc.text('Customer Details', 14, 47)
    doc.setFontSize(10)
    doc.text(`Name: ${order.customer?.name || 'N/A'}`, 14, 53)
    doc.text(`Phone: ${order.customer?.phone || 'N/A'}`, 14, 59)
    doc.text(`Address: ${order.customer?.address || 'N/A'}`, 14, 65)

    // Table Data
    const tableColumn = ['Product', 'Quantity', 'Price', 'Subtotal']
    const tableRows = order.items?.map(i => [
      i.product.name,
      i.quantity,
      `Rs. ${i.price.toLocaleString()}`,
      `Rs. ${(i.quantity * i.price).toLocaleString()}`
    ]) || []

    autoTable(doc, {
      startY: 72,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [168, 85, 247] } // Purple match
    })

    // Total
    const finalY = (doc as any).lastAutoTable.finalY || 72
    doc.setFontSize(12)
    doc.text(`Total Amount: Rs. ${order.totalAmount.toLocaleString()}`, 14, finalY + 10)

    doc.setFontSize(10)
    doc.text('Thank you for your business!', 105, finalY + 25, { align: 'center' })

    // Save PDF
    doc.save(`Invoice_${order.id.slice(0, 8)}.pdf`)
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'text-green-400'
      case 'PENDING':
        return 'text-yellow-400'
      case 'CANCELLED':
        return 'text-red-400'
      case 'REFUNDED':
        return 'text-purple-400'
      default:
        return 'text-white'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-4">
        My Orders
      </h1>

      <div className="bg-black/40 backdrop-blur-xl
                      border border-white/10
                      rounded-2xl">
        {orders.length === 0 && (
          <p className="text-white/40 text-sm p-4">No orders found</p>
        )}

        {orders.map(o => (
          <div
            key={o.id}
            className="grid grid-cols-5 p-4 border-b border-white/10 text-white items-center gap-4"
          >
            {/* Customer */}
            <span className="truncate">{o.customer?.name || 'N/A'}</span>

            {/* Amount */}
            <span>₹{o.totalAmount?.toLocaleString()}</span>

            {/* Status editable */}
            <select
              value={o.status}
              onChange={e =>
                updateStatus(o.id, e.target.value)
              }
              className={`bg-transparent border border-white/10 rounded px-2 py-1 ${statusColor(
                o.status
              )}`}
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

            {/* Date */}
            <span className="truncate">
              {new Date(o.createdAt).toLocaleDateString()}
            </span>

            {/* Download Invoice Button */}
            <div className="flex justify-end">
              <button
                onClick={() => downloadInvoice(o)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition"
                title="Download Invoice"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Invoice</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

