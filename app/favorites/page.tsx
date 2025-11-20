"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type FavoriteItem = {
  id: string;
  createdAt: string;
  image: {
    id: string;
    title?: string | null;
    data: string;
    createdAt: string;
    user: { id: string; name?: string | null; email?: string | null };
  };
};

export default function FavoritesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }
    loadFavorites();
  }, [session, router]);

  async function loadFavorites() {
    setLoading(true);
    try {
      const res = await fetch("/api/favorites/user");
      if (res.ok) {
        const data = await res.json();
        setFavorites(data);
      }
    } catch (err) {
      console.error("Error loading favorites:", err);
    } finally {
      setLoading(false);
    }
  }

  async function removeFavorite(imageId: string) {
    try {
      const res = await fetch(`/api/favorites?imageId=${imageId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFavorites((prev) => prev.filter((f) => f.image.id !== imageId));
      }
    } catch (err) {
      console.error("Error removing favorite:", err);
      alert("Failed to remove favorite");
    }
  }

  if (!session) {
    return null; // Redirecting
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Favorites</h1>

      {favorites.length === 0 && (
        <p className="text-gray-500">
          No favorites yet. Go to the gallery to add some!
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((fav) => (
          <div key={fav.id} className="card bg-base-200 shadow-xl">
            <figure>
              <img
                src={fav.image.data}
                alt={fav.image.title || "image"}
                className="w-full h-48 object-cover"
              />
            </figure>
            <div className="card-body">
              <h3 className="card-title">{fav.image.title || "Untitled"}</h3>
              <p className="text-sm text-gray-500">
                by {fav.image.user?.name || fav.image.user?.email || "Unknown"}
              </p>
              <p className="text-xs text-gray-400">
                Added {new Date(fav.createdAt).toLocaleDateString()}
              </p>

              <div className="card-actions justify-end mt-2">
                <button
                  onClick={() => removeFavorite(fav.image.id)}
                  className="btn btn-sm btn-error"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
