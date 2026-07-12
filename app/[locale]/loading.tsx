export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto flex min-h-[50dvh] max-w-[1400px] flex-col items-center justify-center gap-4 px-6"
    >
      <div className="h-3 w-48 animate-pulse rounded-full bg-muted" />
      <div className="h-3 w-32 animate-pulse rounded-full bg-muted" />
      <span className="sr-only">Cargando</span>
    </div>
  );
}
