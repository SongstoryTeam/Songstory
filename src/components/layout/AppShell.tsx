"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { StickyPlayer } from "@/components/player/StickyPlayer";

interface AppShellProps {
  locale: string;
  children: React.ReactNode;
}

export function AppShell({ locale, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar — always visible via CSS on lg+ */}
      <div className="hidden lg:block" style={{ width: "var(--sidebar-w)", flexShrink: 0 }} />
      <div
        className="hidden lg:flex"
        style={{ position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 100 }}
      >
        <Sidebar locale={locale} open={true} onClose={() => {}} />
      </div>

      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <Sidebar
          locale={locale}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main content column */}
      <div className="flex flex-col flex-1 min-w-0" style={{ paddingLeft: 0 }}>
        <TopBar locale={locale} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1">{children}</main>
      </div>

      {/* Global sticky player */}
      <StickyPlayer />
    </>
  );
}
