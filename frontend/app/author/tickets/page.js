"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await apiFetch("/tickets");
        if (active) setTickets(data);
      } catch (err) {
        if (active) setError(err.message);
      }
    }
    load();
    const interval = setInterval(load, 10000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <main className="mx-auto max-w-5xl space-y-5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/author/dashboard" className="text-sm text-gray-500">Back to dashboard</Link>
          <h1 className="mt-2 text-3xl font-bold">My Tickets</h1>
        </div>
        <Link href="/author/tickets/new" className="rounded bg-black px-4 py-2 text-white">New query</Link>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      {tickets.map((ticket) => (
        <Link key={ticket.id} href={`/author/tickets/${ticket.id}`} className="block rounded-xl border p-4 hover:bg-gray-50">
          <div className="flex flex-wrap justify-between gap-2">
            <h2 className="font-semibold">{ticket.subject}</h2>
            <span className="text-sm">{ticket.status}</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">{ticket.description}</p>
          <p className="mt-2 text-xs text-gray-500">{ticket.messages?.length || 0} responses · {ticket.priority}</p>
        </Link>
      ))}
    </main>
  );
}
