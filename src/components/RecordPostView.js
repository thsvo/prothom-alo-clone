"use client";

import { useEffect, useRef } from "react";

const storageKey = (slug) => `postView:${slug}`;

export default function RecordPostView({ slug }) {
  const sent = useRef(false);

  useEffect(() => {
    if (!slug || sent.current) return;
    if (typeof window === "undefined") return;

    try {
      if (sessionStorage.getItem(storageKey(slug))) return;
    } catch {
      // sessionStorage unavailable
    }

    sent.current = true;

    fetch("/api/posts/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
      keepalive: true,
    })
      .then((res) => {
        if (res.ok) {
          try {
            sessionStorage.setItem(storageKey(slug), "1");
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {
        sent.current = false;
      });
  }, [slug]);

  return null;
}
