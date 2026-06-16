import React from "react";

interface Props {
  page: number;
  total: number;
  onChange: (page: number) => void;
}

const Pagination = React.memo(function Pagination({
  page,
  total,
  onChange,
}: Props) {
  if (total <= 1) return null;

  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <nav aria-label="Пагинация" className="flex items-center gap-1">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1.5 rounded border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-50 disabled:cursor-not-allowed"
      >
        ←
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={`px-3 py-1.5 rounded border text-sm ${
            p === page
              ? "bg-indigo-600 text-white border-indigo-600"
              : "hover:bg-gray-50"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === total}
        className="px-3 py-1.5 rounded border text-sm disabled:opacity-40 hover:bg-gray-50 disabled:cursor-not-allowed"
      >
        →
      </button>
    </nav>
  );
});

export default Pagination;
