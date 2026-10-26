"use client";



import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      router.push("/author/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-xl border p-6"
      >
        <div>
          <h1 className="text-2xl font-bold">Create your BookLeaf account</h1>
          <p className="mt-1 text-sm text-gray-600">Sign up as an author to manage support tickets.</p>
        </div>

        <input
          className="w-full rounded border p-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          className="w-full rounded border p-2"
          type="password"
          placeholder="Password (8+ characters)"
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <input
          className="w-full rounded border p-2"
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button className="w-full rounded bg-black p-2 text-white" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-black underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}
