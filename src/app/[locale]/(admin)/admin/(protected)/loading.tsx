// Shown inside the admin shell while a page loads its data, so a menu click responds at once.
export default function AdminLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Yükleniyor…</span>
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8">
          <div className="h-8 w-56 rounded-md bg-surface-2" />
          <div className="mt-2 h-5 w-80 max-w-full rounded-md bg-surface-2" />
        </div>
      </div>
      <div className="mx-auto max-w-6xl space-y-3 px-4 py-6 sm:px-8 sm:py-8">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 rounded-md bg-surface-2" />
        ))}
      </div>
    </div>
  );
}
