"use client";

import { useState } from "react";
import { signIn, useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function handleRegister() {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      const res2 = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res2?.ok) window.location.reload();
    } else {
      alert("Registration failed: " + JSON.stringify(await res.json()));
    }
  }

  async function handleLogin() {
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.ok) {
      window.location.reload();
    } else {
      alert("Login failed");
    }
  }

  if (!session) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center gap-4 p-8">
        <h1 className="text-2xl font-bold">Authentication</h1>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name (optional)"
          className="input input-bordered"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="input input-bordered"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="input input-bordered"
        />

        <button onClick={handleRegister} className="btn btn-primary">
          Register
        </button>
        <button onClick={handleLogin} className="btn btn-neutral">
          Log in
        </button>

        <div className="divider">OR</div>

        <button onClick={() => signIn("google")} className="btn btn-outline">
          Sign in with Google
        </button>
      </div>
    );
  }

  return <div className="w-full h-screen"></div>;
}
