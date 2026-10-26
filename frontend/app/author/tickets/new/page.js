"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function NewTicketPage() {
  const router = useRouter();

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [bookId, setBookId] = useState("");
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch("/books")
      .then(setBooks)
      .catch((err) => setError(err.message));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const ticket = await apiFetch("/tickets", {
        method: "POST",
        body: JSON.stringify({
          subject,
          description,
          bookId: bookId || null,
        }),
      });

      router.push(`/author/tickets/${ticket.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Create Support Ticket</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full rounded border p-2"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />

        <textarea
          className="w-full rounded border p-2"
          placeholder="Describe your issue"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <select
          className="w-full rounded border p-2"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
        >
          <option value="">General / Account Level</option>

          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title}
            </option>
          ))}
        </select>

        <label className="block rounded border border-dashed p-3 text-sm text-gray-600">
          Optional attachment (UI only)
          <input className="mt-2 block w-full text-sm" type="file" />
        </label>

        {error && <p className="text-red-500">{error}</p>}

        <button
          className="rounded border border-black bg-white px-4 py-2 text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Ticket"}
        </button>
      </form>
      </div>
    </main>
  );
}