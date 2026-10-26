"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function AuthorBooksPage() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/books")
      .then(setBooks)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/author/dashboard" className="text-sm text-gray-500 hover:text-black">
            Back to dashboard
          </Link>
          <h1 className="mt-2 text-3xl font-bold">My Books</h1>
          <p className="mt-1 text-gray-600">Sales and royalty performance from your BookLeaf catalog.</p>
        </div>
        <Link href="/author/tickets/new" className="rounded bg-black px-4 py-2 text-white">
          Get support
        </Link>
      </div>

      {error && <p className="rounded border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>}
      {!error && books.length === 0 && <p className="rounded border p-6">No books found for this account.</p>}

      <div className="grid gap-5 md:grid-cols-2">
        {books.map((book) => (
          <article key={book.id} className="rounded-2xl border p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{book.genre}</p>
                <h2 className="mt-1 text-xl font-bold">{book.title}</h2>
                <p className="mt-1 text-sm text-gray-500">{book.isbn}</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {book.status}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Metric label="Copies sold" value={book.totalCopiesSold.toLocaleString("en-IN")} />
              <Metric label="MRP" value={book.mrp ? currency.format(book.mrp) : "Not set"} />
              <Metric label="Royalty earned" value={currency.format(book.totalRoyaltyEarned)} />
              <Metric label="Pending royalty" value={currency.format(book.royaltyPending)} />
            </div>

            <p className="mt-4 text-sm text-gray-600">
              Available on: {book.availableOn?.length ? book.availableOn.join(", ") : "Not yet distributed"}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
