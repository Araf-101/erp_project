"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { apiFetch, unwrapList } from "@/lib/api";
import type { Order } from "@/types/models";

export default function OrdersPage() {
  const [rows, setRows] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const json = await apiFetch<unknown>("/api/orders");
      setRows(unwrapList<Order>(json));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load orders");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900">Orders</h2>
      <p className="mt-1 max-w-2xl text-sm text-slate-600">
        List orders from the API. Full flow: pick a customer, add line items with
        quantities, compute total, POST the order, then decrement stock server-side.
      </p>
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No orders yet. Implement POST /api/orders on the backend to create
                  some.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-mono text-slate-800">{r.id}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {r.customer_id ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-900">{String(r.total_amount)}</td>
                  <td className="px-4 py-3 text-slate-600">{r.status ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {r.created_at ? new Date(r.created_at).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/orders/${r.id}`}
                      className="text-slate-800 underline-offset-2 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}