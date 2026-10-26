import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            BookLeaf
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-slate-700 px-5 py-2 text-sm font-medium transition hover:border-emerald-400 hover:text-emerald-300"
          >
            Sign in
          </Link>
        </nav>

        <section className="grid gap-12 py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
              Author support, simplified
            </p>
            <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
              Spend more time writing. We&apos;ll help with the rest.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              BookLeaf keeps your publishing support in one place. Track
              requests, connect tickets to your books, and stay in the loop
              with the team.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="rounded-full bg-emerald-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                Open your workspace
              </Link>
              <Link
                href="/author/dashboard"
                className="rounded-full border border-slate-700 px-6 py-3 font-semibold transition hover:border-emerald-400"
              >
                View author dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-emerald-950/30">
            <p className="text-sm font-semibold text-emerald-300">Everything connected</p>
            <div className="mt-6 space-y-4">
              {[
                ["01", "Create a support ticket", "Describe the issue and link a book when needed."],
                ["02", "Get smart triage", "Tickets are categorized and prioritized for faster help."],
                ["03", "Follow the conversation", "Reply in one place until your issue is resolved."],
              ].map(([number, title, description]) => (
                <div key={number} className="flex gap-4 rounded-2xl bg-slate-800/70 p-4">
                  <span className="text-sm font-bold text-emerald-300">{number}</span>
                  <div>
                    <h2 className="font-semibold">{title}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-800 py-10">
          <h2 className="text-lg font-semibold">Explore BookLeaf</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["/login", "Login", "Access your account"],
              ["/author/dashboard", "Author dashboard", "Review your support activity"],
              ["/author/books", "My books", "View sales and royalty data"],
              ["/author/tickets/new", "New ticket", "Ask the support team for help"],
              ["/admin/tickets", "Admin queue", "Manage incoming tickets"],
            ].map(([href, title, description]) => (
              <Link
                key={href}
                href={href}
                className="rounded-2xl border border-slate-800 p-4 transition hover:border-emerald-400 hover:bg-slate-900"
              >
                <span className="font-semibold">{title}</span>
                <span className="mt-1 block text-sm text-slate-400">{description}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
