import { Outlet } from "react-router";
import Navbar from "./Navbar";
import AppSidebar from "./Sidebar/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

// Layout is the frame every page shares: navbar on top, page below.
// <Outlet /> is the slot where the matched child route renders.
export default function Layout({ user, onLogout, authError }) {
  return (
    <SidebarProvider>
      <div className="w-full flex min-h-screen">
        <AppSidebar user={user} onLogout={onLogout} />

        <main className="flex-1">
          <Navbar user={user} onLogout={onLogout} />
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}

// {authError && (
//           <p
//             role='alert'
//             className='mb-6 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-500'
//           >
//             {authError}
//           </p>
//         )}