"use client";

import { useEffect, useState } from "react";
import axios from "axios";

/* ================= TYPES ================= */

type Product = {
  id: string;
  name: string;
  price: number;
};

type Customer = {
  id: string;
  name: string;
};

type OrderItem = {
  quantity: number;
};

type Order = {
  id: string;
  createdAt: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  customer?: Customer;
  items: OrderItem[];
};

/* ================= API ================= */

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* ================= PAGE ================= */

export default function SalesUserPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [productId, setProductId] = useState<string>("");
  const [customerId, setCustomerId] = useState<string>("");
  const [qty, setQty] = useState<number>(1);
  const [payment, setPayment] = useState<string>("CASH");

  const userId = "demo-sales-user"; // replace with auth user id

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    const res = await api.get<Product[]>("/products");
    setProducts(res.data);
  };

  const fetchCustomers = async () => {
    const res = await api.get<Customer[]>("/customers");
    setCustomers(res.data);
  };

  const fetchOrders = async () => {
    const res = await api.get<Order[]>("/orders/today");
    setOrders(res.data);
  };

  const selectedProduct = products.find((p) => p.id === productId);
  const total = selectedProduct ? selectedProduct.price * qty : 0;

  const placeOrder = async () => {
    if (!productId || !customerId || !selectedProduct) {
      alert("Select product and customer");
      return;
    }

    await api.post("/orders", {
      customerId,
      userId,
      paymentMethod: payment,
      items: [
        {
          productId,
          quantity: qty,
          price: selectedProduct.price,
        },
      ],
    });

    setQty(1);
    fetchOrders();
  };

  const ordersToday = orders.length;

  const revenue = orders.reduce(
    (sum, o) => sum + o.totalAmount,
    0
  );

  const itemsSold = orders.reduce(
    (sum, o) =>
      sum + o.items.reduce((a, i) => a + i.quantity, 0),
    0
  );

  const today = new Date().toLocaleDateString();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sales Dashboard</h1>
          <p className="text-sm text-gray-500">{today}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full" />
          <span>Sales User</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-4 rounded">
          <p>Orders Today</p>
          <h2 className="text-xl font-bold">{ordersToday}</h2>
        </div>
        <div className="bg-green-500 text-white p-4 rounded">
          <p>Revenue</p>
          <h2 className="text-xl font-bold">₹{revenue}</h2>
        </div>
        <div className="bg-purple-500 text-white p-4 rounded">
          <p>Items Sold</p>
          <h2 className="text-xl font-bold">{itemsSold}</h2>
        </div>
      </div>

      {/* Order Form */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-bold mb-3">Place Order</h2>

        <div className="flex gap-2 flex-wrap">
          <select
            className="border p-2"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            <option value="">Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className="border p-2"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            <option value="">Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            className="border p-2 w-20"
            value={qty}
            min={1}
            onChange={(e) => setQty(Number(e.target.value))}
          />

          <select
            className="border p-2"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
          >
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
            <option value="UPI">UPI</option>
            <option value="NETBANKING">Netbanking</option>
          </select>

          <button
            onClick={placeOrder}
            className="bg-blue-600 text-white px-4 rounded"
          >
            Add
          </button>
        </div>

        <p className="mt-2 font-semibold">Total: ₹{total}</p>
      </div>

      {/* Orders Table */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-3">Today's Orders</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left">Time</th>
              <th className="text-left">Customer</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b">
                <td>
                  {new Date(o.createdAt).toLocaleTimeString()}
                </td>
                <td>{o.customer?.name}</td>
                <td>₹{o.totalAmount}</td>
                <td>{o.paymentMethod}</td>
                <td>{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
