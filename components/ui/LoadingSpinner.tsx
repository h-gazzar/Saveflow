"use client";

export function LoadingSpinner({
  label,
  className = ""
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span className="loading-spinner" aria-hidden="true" />
      {label ? <span>{label}</span> : null}
    </span>
  );
}
