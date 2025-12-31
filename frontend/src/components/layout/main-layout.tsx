"use client";

import { Sidebar } from "./sidebar";
import { RightSidebar } from "./right-sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
  showRightSidebar?: boolean;
}

export function MainLayout({ children, showRightSidebar = true }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <aside className="sticky top-0 h-screen shrink-0">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 border-r border-border min-w-0">
        {children}
      </main>

      {/* Right Sidebar */}
      {showRightSidebar && (
        <aside className="sticky top-0 h-screen shrink-0 hidden lg:block">
          <RightSidebar />
        </aside>
      )}
    </div>
  );
}
