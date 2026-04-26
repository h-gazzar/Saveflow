import Link from "next/link";

import { cn } from "~/lib/utils";

type BrandMarkProps = {
  href?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: {
    wordmark: "brand-wordmark--sm"
  },
  md: {
    wordmark: "brand-wordmark--md"
  },
  lg: {
    wordmark: "brand-wordmark--lg"
  }
} as const;

export function BrandMark({ href = "/", className, size = "md" }: BrandMarkProps) {
  const scale = sizes[size];

  return (
    <Link href={href} className={cn("brand-mark inline-flex items-center text-off-white", className)}>
      <span className={cn("brand-wordmark", scale.wordmark)}>
        <span className="brand-wordmark__save">save</span>
        <span className="brand-wordmark__flowWrap">
          <span className="brand-wordmark__flow">flow</span>
          <span className="brand-wordmark__tail" aria-hidden="true" />
        </span>
      </span>
    </Link>
  );
}
