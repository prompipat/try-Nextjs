"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import ProductCard from "./components/ProductCard";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      <h1>NextAuth.js with App Router</h1>

      {!session ? (
        <>
          <p>Please sign in to continue.</p>
          <button className="btn btn-primary" onClick={() => signIn("google")}>
            Sign in with Google
          </button>
        </>
      ) : (
        <>
          <p>Welcome, {session.user?.name}!</p>
          <p>Email: {session.user?.email}</p>
          <button className="btn btn-primary" onClick={() => signOut()}>
            Sign out
          </button>
        </>
      )}
    </div>
  );
}

// make pinterest but use 3D hover effect on images!!!! with daisy UI
