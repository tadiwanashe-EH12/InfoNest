import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 p-6 space-y-6">
        <h1 className="text-2xl font-bold tracking-wide">InfoNest X</h1>
        <nav className="space-y-2">
          <Link href="/dashboard" className="block hover:text-indigo-400">Dashboard</Link>
          <Link href="/books" className="block hover:text-indigo-400">Books</Link>
          <Link href="/members" className="block hover:text-indigo-400">Members</Link>
          <Link href="/loans" className="block hover:text-indigo-400">Loans</Link>
          <Link href="/reports" className="block hover:text-indigo-400">Reports</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
