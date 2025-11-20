"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (session) {
      router.push("/gallery");
    }
  }, [session, router]);

  async function handleLogin() {
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.ok) {
      router.push("/gallery");
    } else {
      alert("Login failed");
    }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex flex-col items-center gap-4 p-8 min-w-[450px]">
        <h1 className="text-2xl font-bold">Login</h1>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="input input-bordered w-full"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="input input-bordered w-full"
        />

        <button onClick={handleLogin} className="btn btn-neutral w-full">
          Log in
        </button>

        <div className="divider">OR</div>

        <button
          onClick={() => signIn("google")}
          className="btn btn-outline w-full"
        >
          Sign in with Google
        </button>

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
