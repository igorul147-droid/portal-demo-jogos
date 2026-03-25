type StatsCardProps = {
  label: string;
  value: string;
  highlight?: boolean;
};

export default function StatsCard({
  label,
  value,
  highlight = false,
}: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <p className="text-xs text-white/50">{label}</p>
      <p
        className={`mt-1 text-lg font-semibold ${
          highlight ? "text-emerald-300" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}