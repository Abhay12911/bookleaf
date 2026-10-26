"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ status: "", priority: "", category: "" });

  useEffect(() => {
    async function loadTickets() {
      try {
        const query = new URLSearchParams(
          Object.entries(filters).filter(([, value]) => value)
        ).toString();
        const data = await apiFetch(`/admin/tickets${query ? `?${query}` : ""}`);
        setTickets(data);
      } catch (err) {
        setError(err.message);
      }
    }

    loadTickets();
  }, [filters]);

  if (error) return <p>{error}</p>;

  return (
    <main className="mx-auto max-w-6xl space-y-5 p-6">
      <h1 className="text-2xl font-bold">Admin Ticket Queue</h1>
      <div className="grid gap-3 md:grid-cols-3">
        <Filter label="Status" value={filters.status} onChange={(value) => setFilters({ ...filters, status: value })} options={["OPEN", "IN_PROGRESS", "WAITING_FOR_AUTHOR", "RESOLVED", "CLOSED"]} />
        <Filter label="Priority" value={filters.priority} onChange={(value) => setFilters({ ...filters, priority: value })} options={["CRITICAL", "HIGH", "MEDIUM", "LOW"]} />
        <Filter label="Category" value={filters.category} onChange={(value) => setFilters({ ...filters, category: value })} options={["ROYALTY_PAYMENTS", "ISBN_METADATA", "PRINTING_QUALITY", "DISTRIBUTION_AVAILABILITY", "BOOK_STATUS_PRODUCTION", "GENERAL_INQUIRY"]} />
      </div>

      {tickets.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-700">
          <h2 className="font-semibold">No tickets found</h2>
          <p className="mt-1 text-sm text-slate-600">
            Tickets submitted by authors will appear here.
          </p>
        </div>
      )}

      {tickets.map((ticket) => (
        <Link
          key={ticket.id}
          href={`/admin/tickets/${ticket.id}`}
          className="mb-3 block rounded border p-4"
        >
          <h2 className="font-semibold">{ticket.subject}</h2>
          <p>Author: {ticket.author?.email}</p>
          <p>Status: {ticket.status}</p>
          <p>Priority: <strong>{ticket.priority}</strong></p>
          <p>Category: {ticket.category}</p>
        </Link>
      ))}
    </main>
  );
}

function Filter({ label, value, onChange, options }) {
  return (
    <label className="text-sm font-medium">
      {label}
      <select className="mt-1 w-full rounded border p-2" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">All</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}
