import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Road Rash — browser tribute",
  description:
    "A from-scratch, non-commercial tribute to Road Rash (1991): pseudo-3D motorcycle racing with punches, kicks, traffic, pedestrians and roadside chaos.",
};

/**
 * The game lives in `public/roadrash` as a self-contained HTML/CSS/JS build so
 * it can be played (and audited) without a bundler. This route just hosts it
 * full-bleed; `/roadrash/index.html` also works on its own.
 */
export default function RoadRashPage() {
  return (
    <div className="fixed inset-0 bg-[#141019]">
      <iframe
        src="/roadrash/index.html"
        title="Road Rash — browser tribute"
        className="h-full w-full border-0"
        allow="autoplay; fullscreen"
      />
    </div>
  );
}
