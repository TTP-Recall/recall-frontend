import { Outlet } from "react-router";
import AppSidebar from "./Sidebar/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

// Layout is the frame every authenticated page shares.
// The sidebar stays visible while <Outlet /> renders the current page.
export default function Layout({ user, onLogout, authError }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar user={user} onLogout={onLogout} />

        <main className="flex-1">
          {authError && (
            <p
              role="alert"
              className="m-4 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-500"
            >
              {authError}
            </p>
          )}

          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}