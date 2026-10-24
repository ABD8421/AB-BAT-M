"use client";

import { useState, useRef } from "react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
}

export function ImageUpload({
  value,
  onChange,
  label = "Upload Image",
  hint = "PNG, JPG, WebP, SVG up to 10MB",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        onChange(data.url);
      } else {
        setError(data.message || "Failed to upload image.");
      }
    } catch {
      setError("Network error while uploading image.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="field">
      <label>{label}</label>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          background: "rgba(0,0,0,0.3)",
          border: "1px dashed rgba(255,255,255,0.2)",
          padding: "1rem",
          borderRadius: "6px",
        }}
      >
        {value ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div
              style={{
                width: "120px",
                height: "80px",
                borderRadius: "4px",
                overflow: "hidden",
                border: "1px solid var(--accent)",
                position: "relative",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ flex: 1, minWidth: "180px" }}>
              <p className="meta" style={{ margin: 0, wordBreak: "break-all" }}>
                {value}
              </p>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  className="btn btn--ghost"
                  style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem" }}
                  onClick={() => inputRef.current?.click()}
                  disabled={uploading}
                >
                  Change Image
                </button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem", color: "#ff6b6b" }}
                  onClick={() => onChange("")}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "0.5rem" }}>
            <p className="meta" style={{ marginBottom: "0.5rem" }}>{hint}</p>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading to Server…" : "Select Image to Upload"}
            </button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {error && (
          <p style={{ color: "#ff6b6b", fontSize: "0.8rem", margin: 0 }}>{error}</p>
        )}
      </div>
    </div>
  );
}

