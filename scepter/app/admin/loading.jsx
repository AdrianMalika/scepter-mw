export default function AdminLoading() {
  return (
    <main className="min-h-screen bg-navy-deep px-6 py-10 text-warm-white">
      <div className="mx-auto max-w-7xl">
        <div className="h-3 w-28 animate-pulse bg-white/10" />
        <div className="mt-5 h-10 w-48 animate-pulse bg-white/10" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-36 animate-pulse bg-navy-panel" />
          ))}
        </div>
      </div>
    </main>
  );
}
