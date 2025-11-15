// ...existing code...
"use client";
import { useState } from "react";

export default function Checkout() {
  const [name, setName] = useState("");
  const [response, setResponse] = useState<Record<string, unknown> | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function callGet() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/hello?name=${encodeURIComponent(name)}`);
      const json = await res.json();
      setResponse(json);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  async function callPost() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/hello", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const json = await res.json();
      setResponse(json);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-full flex flex-col gap-4 justify-center items-center font-bold">
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-2 py-1"
          aria-label="name"
        />
        <button
          onClick={callGet}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Call GET
        </button>
        <button
          onClick={callPost}
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          Call POST
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">Error: {error}</div>}

      {response && (
        <pre className="max-w-xl overflow-auto whitespace-pre-wrap bg-black p-4 rounded">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}
// ...existing code...
