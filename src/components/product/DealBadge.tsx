import type { BadgeTone } from "@/lib/catalog/badges";

const tones: Record<BadgeTone, string> = {
  low: "bg-low/10 text-low",
  drop: "bg-drop/10 text-drop",
  caution: "bg-caution/10 text-caution",
  accent: "bg-accent/10 text-accent",
};

export function DealBadge({
  label,
  tone,
}: {
  label: string;
  tone: BadgeTone;
}) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {label}
    </span>
  );
}
