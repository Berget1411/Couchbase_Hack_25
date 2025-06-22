"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";

export function Provider({ children }: { children: ReactNode }) {
  return (
    <>
      <QueryProvider>
        <ThemeProvider>
          <Toaster />
          {children}
        </ThemeProvider>
      </QueryProvider>
    </>
  );
}
