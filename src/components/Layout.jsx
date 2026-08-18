import { Outlet } from 'react-router';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

// Layout is the frame every page shares: navbar on top, page below.
// <Outlet /> is the slot where the matched child route renders.
//
// It takes user and onLogout only to hand them straight down to Navbar. App
// owns that state; Layout just happens to sit in between. authError is shown
// here rather than on one page, because a broken login affects all of them.
export default function Layout({ user, onLogout, authError }) {
  return (
    <div className='w-full flex min-h-screen'>
      <Sidebar />
      <main className='flex-1'>
        <Navbar user={user} onLogout={onLogout} />
        <Outlet />
      </main>
    </div>
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