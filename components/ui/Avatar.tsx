import { getInitials } from "~/lib/utils";

export function Avatar({ name }: { name: string }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-xs font-bold text-black">
      {getInitials(name)}
    </div>
  );
}
