"use client";

import { useState } from "react";

export default function SearchControls({ defaultQ = "", defaultLocation = "", districts = [] }) {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [locating, setLocating] = useState(false);

  function detectLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(String(pos.coords.latitude));
        setLng(String(pos.coords.longitude));
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <form className="bg-slate-50 border border-gray-200 rounded-xl p-4 mb-8 grid grid-cols-1 md:grid-cols-4 gap-3">
      <input
        name="q"
        defaultValue={defaultQ}
        placeholder="যেমন: বাজেট, নির্বাচন, রেমিট্যান্স"
        className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-red"
      />
      <select
        name="location"
        defaultValue={defaultLocation}
        className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-red"
      >
        <option value="">সব জেলা</option>
        {districts.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={detectLocation}
        className="border border-gray-300 bg-white rounded-lg px-4 py-2 text-sm font-bold text-slate-700"
      >
        {locating ? "লোকেশন নিচ্ছি..." : "আমার কাছাকাছি"}
      </button>
      <button className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm font-bold">
        অনুসন্ধান
      </button>

      <input type="hidden" name="lat" value={lat} />
      <input type="hidden" name="lng" value={lng} />
    </form>
  );
}
