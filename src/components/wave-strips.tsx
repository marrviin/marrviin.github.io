/**
 * Quilled wave underline — three stacked paper-strip lines echoing the
 * divider edges, drifting gently like strips laid on water.
 */
export function WaveStrips({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 172 26" aria-hidden="true">
      <path
        className="[animation:strip-drift_5.4s_ease-in-out_infinite_alternate] stroke-[#0b6a8c]"
        d="M3 7 Q16 1 29 7 T55 7 T81 7 T107 7 T133 7 T159 7 T185 7"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        className="[animation:strip-drift_6s_-1.2s_ease-in-out_infinite_alternate] stroke-[#2f95b7]"
        d="M3 14 Q16 8 29 14 T55 14 T81 14 T107 14 T133 14 T159 14 T185 14"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        className="[animation:strip-drift_7.2s_-2.6s_ease-in-out_infinite_alternate] stroke-[#8fc6da]"
        d="M3 21 Q16 15 29 21 T55 21 T81 21 T107 21 T133 21 T159 21 T185 21"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}
