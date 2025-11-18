"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type ImageItem = {
  id: string;
  title?: string | null;
  data: string;
  createdAt: string;
  user: { id: string; name?: string | null; email?: string | null };
};

export default function ImagesPage() {
  const { data: session } = useSession();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadImages() {
    const res = await fetch("/api/images");
    const data = await res.json();
    setImages(data);
  }

  useEffect(() => {
    loadImages();
  }, []);

  function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleUpload() {
    if (!file) return alert("Select a file");
    setLoading(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const res = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, data: dataUrl }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Upload failed");
      }

      setTitle("");
      setFile(null);
      await loadImages();
      alert("Upload successful!");
    } catch (e) {
      alert("Upload failed: " + String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(`/api/images/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`Delete failed with status: ${res.status}`);
      }

      // Success
      setImages((prev) => prev.filter((img) => img.id !== id));
      alert("Image deleted successfully!");
    } catch (e) {
      alert("Delete failed: " + String(e));
      console.error(e);
    }
  }

  function canDelete(img: ImageItem): boolean {
    if (!session?.user?.email) return false;
    return img.user?.email === session.user.email;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Image Gallery</h1>

      {!session && (
        <p className="mb-4 text-warning">Sign in to upload images.</p>
      )}

      {session && (
        <div className="card bg-base-200 p-4 mb-6">
          <h2 className="text-xl mb-4">Upload New Image</h2>
          <div className="flex flex-col gap-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (optional)"
              className="input input-bordered"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="file-input file-input-bordered"
            />
            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className="btn btn-primary"
            >
              {loading ? "Uploading..." : "Upload Image"}
            </button>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">All Images ({images.length})</h2>

      {images.length === 0 && (
        <p className="text-gray-500">No images yet. Upload one!</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img) => (
          <div key={img.id} className="card bg-base-200 shadow-xl">
            <figure>
              <img
                src={img.data}
                alt={img.title || "image"}
                className="w-full h-48 object-cover"
              />
            </figure>
            <div className="card-body">
              <h3 className="card-title">{img.title || "Untitled"}</h3>
              <p className="text-sm text-gray-500">
                by {img.user?.name || img.user?.email || "Unknown"}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(img.createdAt).toLocaleDateString()}
              </p>

              {canDelete(img) && (
                <div className="card-actions justify-end mt-2">
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="btn btn-error btn-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
