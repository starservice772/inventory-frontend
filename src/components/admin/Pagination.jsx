export default function Pagination({
  page,
  totalPages,
  setPage
}) {
  return (
    <div className="flex justify-end gap-2 p-4">
      <button
        disabled={page === 0}
        onClick={() => setPage(page - 1)}
        className="px-4 py-2 border rounded-lg disabled:opacity-40"
      >
        Prev
      </button>

      <span className="px-4 py-2">
        Page {page + 1} / {totalPages}
      </span>

      <button
        disabled={page + 1 >= totalPages}
        onClick={() => setPage(page + 1)}
        className="px-4 py-2 border rounded-lg disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}