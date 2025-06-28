import React from "react";
import { cn } from "@/lib/utils";
import { Spotlight } from "./spotlight";

export function HeroBackground({
  showSpotlight = true,
}: {
  showSpotlight?: boolean;
}) {
  return (
    <div className='absolute inset-0 flex w-full overflow-hidden bg-background antialiased'>
      {/* Subtle grid background */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none opacity-10",
          "bg-[linear-gradient(to_right,theme(colors.border)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.border)_1px,transparent_1px)]"
        )}
      />

      {/* Enhanced grid that appears in spotlight area */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none opacity-0",
          "bg-[linear-gradient(to_right,theme(colors.border)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.border)_1px,transparent_1px)]",
          "animate-[grid-enhance_2s_ease_0.75s_1_forwards]"
        )}
        style={{
          maskImage:
            "radial-gradient(600px circle at var(--spotlight-x, 300px) var(--spotlight-y, 200px), white, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(600px circle at var(--spotlight-x, 300px) var(--spotlight-y, 200px), white, transparent 70%)",
        }}
      />

      {showSpotlight && (
        <Spotlight
          className='-top-40 left-0 md:-top-20 md:left-60'
          fill='currentColor'
        />
      )}
    </div>
  );
}
