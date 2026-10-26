"use client";

import { use, useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export const dynamic = "force-dynamic";

export default function TicketDetailsPage({ params }) {
  const { id } = use(params);

  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadTicket = useCallback(async () => {
    const data = await apiFetch(`/tickets/${id}`);
    setTicket(data);
  }, [id]);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        await loadTicket();
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTicket();

    const interval = setInterval(() => {
      loadTicket().catch((err) => setError(err.message));
    }, 10000);

    return () => clearInterval(interval);
  }, [loadTicket]);

  async function sendMessage(e) {
    e.preventDefault();

    try {
      await apiFetch(`/tickets/${id}/messages`, {
        method: "POST",
        body: JSON.stringify({ content: message }),
      });

      setMessage("");
      await loadTicket();
    } catch (err) {
      setError(err.message);
    }
  }

  if (error) return <p>{error}</p>;
  if (!ticket) return <p>Loading ticket...</p>;

  return (
    <main className="mx-auto max-w-3xl space-y-5 p-6">
      <h1 className="text-2xl font-bold">{ticket.subject}</h1>

      <p>Status: {ticket.status}</p>
      <p>Priority: {ticket.priority}</p>
      <p>Category: {ticket.category}</p>
      <p className="text-sm text-gray-500">Book: {ticket.book?.title || "General / Account Level"}</p>
      <p>{ticket.description}</p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Conversation</h2>

        {ticket.messages?.map((item) => (
          <div key={item.id} className="rounded border p-3">
            <p className="mb-1 text-xs font-semibold uppercase text-gray-500">{item.sender?.role || "SUPPORT"}</p>
            <p>{item.content}</p>
          </div>
        ))}
      </section>

      <form onSubmit={sendMessage} className="space-y-3">
        <textarea
          className="w-full rounded border p-2"
          placeholder="Write a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <button className="rounded bg-black px-4 py-2 text-white">
          Send Message
        </button>
      </form>
    </main>
  );
}