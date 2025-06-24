"use client";
import { usePathname } from "next/navigation";
import * as React from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/sidebar/site-header";
import { SidebarRight } from "@/components/sidebar/sidebar-right";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const pathname = usePathname();
  const appId = pathname.split("/")[3];
  // Keyboard shortcut handler for Cmd+I
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === "i") {
        event.preventDefault();
        setIsChatOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant='inset' />
      <SidebarInset>
        <SiteHeader />
        <div className='flex flex-1 flex-col'>
          <div className='@container/main flex flex-1 flex-col gap-2'>
            <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
      {appId && (
        <SidebarRight
          appId={appId}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </SidebarProvider>
  );
}
