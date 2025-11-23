import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

type address = {
  street: string;
  postNumber: number;
  city: string;
};

function useDebounced<T>(value: T, delay = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

const Autocomplete: React.FC = () => {
  const [query, setQuery] = useState("");
  const debounced = useDebounced(query);
  const [results, setResults] = useState<address[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!debounced || debounced.trim().length < 3) {
        setResults([]);
        setOpen(false);
        return;
      }
      setLoading(true);
      try {
        const query = encodeURIComponent(debounced.trim());
        const res = await axios.get<address[]>(`${API_BASE_URL}/search/${query}`);
        setResults(res.data.slice(0, 20));
        setOpen(true);
        setActiveIndex(-1);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [debounced]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        select(results[activeIndex]);
      }
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const select = (r: address) => {
    setQuery(`${r.street} — ${r.postNumber} ${r.city}`);
    setOpen(false);
  };

  const onBlur = (e: React.FocusEvent) => {
    setTimeout(() => setOpen(false), 150);
  };

  return (
    <div style={{ position: "relative", width: 480 }}>
      <input
        role="combobox"
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        onFocus={() => {
          if (results.length) setOpen(true);
        }}
        aria-autocomplete="list"
        aria-controls="address-listbox"
        aria-expanded={open}
        aria-activedescendant={activeIndex >= 0 ? `option-${activeIndex}` : undefined}
        style={{
          width: "100%",
          padding: "10px 12px",
          fontSize: 16,
          boxSizing: "border-box"
        }}
        placeholder="Start typing street, e.g. 'rod' or 'østen'..."
      />
      {open && (
        <ul
          id="address-listbox"
          ref={listRef}
          role="listbox"
          style={{
            position: "absolute",
            zIndex: 1000,
            left: 0,
            right: 0,
            marginTop: 6,
            maxHeight: 300,
            overflow: "auto",
            listStyle: "none",
            padding: 0,
            border: "1px solid #ddd",
            background: "white",
            boxShadow: "0 4px 8px rgba(0,0,0,0.08)"
          }}
        >
          {loading && <li style={{ padding: 12 }}>Loading…</li>}
          {!loading && results.length === 0 && <li style={{ padding: 12 }}>No results</li>}
          {!loading &&
            results.map((r, i) => {
              const isActive = i === activeIndex;
              return (
                <li
                  key={`${r.street}-${r.postNumber}-${i}`}
                  id={`option-${i}`}
                  role="option"
                  aria-selected={isActive}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    select(r);
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                  style={{
                    padding: 12,
                    cursor: "pointer",
                    background: isActive ? "#f0f6ff" : "white"
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{r.street}</div>
                  <div style={{ fontSize: 13, color: "#555" }}>
                    {r.postNumber} — {r.city}
                  </div>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
