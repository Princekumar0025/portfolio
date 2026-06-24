import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Swifty | Super Admin',
  description: 'Manage users, financials, and disputes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-slate-50">
          {/* Admin Sidebar */}
          <aside className="w-64 bg-slate-900 border-r flex flex-col hidden md:flex text-slate-300">
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
              <span className="text-xl font-bold tracking-tight text-white">Swifty Admin</span>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              <a href="/" className="flex items-center space-x-3 text-sm font-medium bg-slate-800 text-white px-3 py-2 rounded-lg">
                <span>📈 Dashboard & Financials</span>
              </a>
              <a href="/users" className="flex items-center space-x-3 text-sm font-medium hover:bg-slate-800 hover:text-white px-3 py-2 rounded-lg transition-colors">
                <span>👥 Users & Restaurants</span>
              </a>
              <a href="/content" className="flex items-center space-x-3 text-sm font-medium hover:bg-slate-800 hover:text-white px-3 py-2 rounded-lg transition-colors">
                <span>🖼️ Content Management</span>
              </a>
              <a href="/disputes" className="flex items-center space-x-3 text-sm font-medium hover:bg-slate-800 hover:text-white px-3 py-2 rounded-lg transition-colors">
                <span>⚖️ Disputes & Refunds <span className="ml-2 bg-red-600 text-white text-xs px-2 rounded-full">3</span></span>
              </a>
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm z-10">
              <h1 className="text-xl font-bold text-slate-800">Overview</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-slate-500">Super Admin Mode</span>
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xs">A</div>
              </div>
            </header>
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
