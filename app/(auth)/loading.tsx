import { LoadingSpinner } from "~/components/ui/LoadingSpinner";

export default function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="surface-card px-6 py-4 text-sm uppercase tracking-[0.2em] text-muted">
        <LoadingSpinner label="Loading SaveFlow..." className="text-accent" />
      </div>
    </div>
  );
}
