"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function AdminTicketPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [ticket, setTicket] = useState(null);
  const [reply, setReply] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await apiFetch(`/tickets/${id}`);
      setTicket(data);
    } catch (err) {
      setError(err.message);
    }
  }, [id]);

  useEffect(() => {
    const fetchTicket = async () => {
      await load();
    };
    fetchTicket();
  }, [load]);

  async function update(data) {
    await apiFetch(`/admin/tickets/${id}`, { method: "PATCH", body: JSON.stringify(data) });
    await load();
  }

  async function sendReply(event) {
    event.preventDefault();
    await apiFetch(`/admin/tickets/${id}/reply`, { method: "POST", body: JSON.stringify({ content: reply }) });
    setReply("");
    await load();
  }

  async function addNote(event) {
    event.preventDefault();
    await apiFetch(`/admin/tickets/${id}/notes`, { method: "POST", body: JSON.stringify({ content: note }) });
    setNote("");
    await load();
  }

  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!ticket) return <p className="p-6">Loading ticket...</p>;

  return (
    <main className="mx-auto max-w-5xl space-y-5 p-6">
      <button onClick={() => router.push("/admin/tickets")} className="text-sm text-gray-500">Back to queue</button>
      <section className="rounded-xl border p-5">
        <h1 className="text-2xl font-bold">{ticket.subject}</h1>
        <p className="mt-3 whitespace-pre-wrap">{ticket.description}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Select label="Status" value={ticket.status} onChange={(value) => update({ status: value })} options={["OPEN", "IN_PROGRESS", "WAITING_FOR_AUTHOR", "RESOLVED", "CLOSED"]} />
          <Select label="Priority" value={ticket.priority} onChange={(value) => update({ priority: value })} options={["CRITICAL", "HIGH", "MEDIUM", "LOW"]} />
          <Select label="Category" value={ticket.category} onChange={(value) => update({ category: value })} options={["ROYALTY_PAYMENTS", "ISBN_METADATA", "PRINTING_QUALITY", "DISTRIBUTION_AVAILABILITY", "BOOK_STATUS_PRODUCTION", "GENERAL_INQUIRY"]} />
        </div>
      </section>
      {ticket.aiDraft && <div className="rounded-xl border border-blue-200 bg-blue-50 p-4"><p className="font-semibold">AI-generated draft</p><p className="mt-2 whitespace-pre-wrap">{ticket.aiDraft}</p><button type="button" onClick={() => setReply(ticket.aiDraft)} className="mt-3 rounded border border-blue-400 px-3 py-1 text-sm">Use AI draft in response</button></div>}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Conversation</h2>
        {ticket.messages?.map((message) => <div key={message.id} className="rounded border p-3"><p className="text-xs font-semibold uppercase text-gray-500">{message.sender?.role}</p><p>{message.content}</p></div>)}
        <form onSubmit={sendReply} className="space-y-2"><textarea className="w-full rounded border p-2" value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write or edit the response..." required /><button className="rounded bg-black px-4 py-2 text-white">Send response</button></form>
      </section>
      <section className="rounded-xl border p-4">
        <h2 className="font-semibold">Internal notes</h2>
        {ticket.notes?.map((item) => <p key={item.id} className="mt-2 rounded bg-yellow-50 p-2 text-sm">{item.content}</p>)}
        <form onSubmit={addNote} className="mt-3 flex gap-2"><input className="min-w-0 flex-1 rounded border p-2" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Only admins can see this" required /><button className="rounded border px-4 py-2">Add note</button></form>
      </section>
    </main>
  );
}

function Select({ label, value, onChange, options }) {
  return <label className="text-sm font-medium">{label}<select className="mt-1 w-full rounded border p-2" value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}
