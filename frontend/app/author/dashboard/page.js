"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default function AuthorDashboard() {
  const [stats, setStats] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [dashboardData, ticketData] = await Promise.all([
          apiFetch("/dashboard"),
          apiFetch("/tickets"),
        ]);

        setStats(dashboardData);
        setTickets(ticketData);
      } catch (err) {
        setError(err.message);
      }
    }

    loadDashboard();
  }, []);

  if (error) return <p>{error}</p>;
  if (!stats) return <p>Loading dashboard...</p>;

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">Author Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat title="Total" value={stats.total} />
        <Stat title="Open" value={stats.open} />
        <Stat title="In Progress" value={stats.inProgress} />
        <Stat title="Resolved" value={stats.resolved} />
      </div>

      <Link
        href="/author/tickets/new"
        className="inline-block rounded bg-black px-4 py-2 text-white"
      >
        Create Support Ticket
      </Link>
      <Link
        href="/author/books"
        className="ml-3 inline-block rounded border border-black px-4 py-2"
      >
        View My Books
      </Link>
      <Link
        href="/author/tickets"
        className="ml-3 inline-block rounded border border-black px-4 py-2"
      >
        View My Tickets
      </Link>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat title="Books" value={stats.books} />
        <Stat title="Copies sold" value={stats.copiesSold} />
        <Stat title="Royalty earned" value={`₹${stats.royaltyEarned.toLocaleString("en-IN")}`} />
        <Stat title="Pending royalty" value={`₹${stats.royaltyPending.toLocaleString("en-IN")}`} />
      </div>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Recent Tickets</h2>

        {tickets.map((ticket) => (
          <Link
            key={ticket.id}
            href={`/author/tickets/${ticket.id}`}
            className="mb-3 block rounded border p-4"
          >
            <h3 className="font-semibold">{ticket.subject}</h3>
            <p>Status: {ticket.status}</p>
            <p>Priority: {ticket.priority}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}

function Stat({ title, value }) {
  return (
    <div className="rounded border p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}