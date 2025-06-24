"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { TableProvider } from "./table-provider";

export function Provider({ children }: { children: ReactNode }) {
  return (
    <>
      <QueryProvider>
        <ThemeProvider>
          <Toaster />
          <TableProvider>{children}</TableProvider>
        </ThemeProvider>
      </QueryProvider>
    </>
  );
}
