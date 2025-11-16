import Image from "next/image";
import Link from "next/link";
import ProductCard from "./components/ProductCard";

export default function Home() {
  return (
    <main>
      <h1 className="font-bold">Welcome to Next.js!</h1>
      {/* use <Link> instead of <a> for reduce full page reload */}
      <Link className="btn btn-link" href="/users">
        Go to Users
      </Link>
      <ProductCard />
    </main>
  );
}
