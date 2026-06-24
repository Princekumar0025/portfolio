import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Swifty Partner Dashboard',
  description: 'Manage your restaurant orders and menu.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-neutral-100">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r flex flex-col hidden md:flex">
            <div className="h-16 flex items-center px-6 border-b">
              <span className="text-xl font-bold tracking-tight text-orange-600">Swifty Partner</span>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              <a href="/" className="flex items-center space-x-3 text-sm font-medium bg-orange-50 text-orange-600 px-3 py-2 rounded-lg">
                <span>📋 Live Orders</span>
              </a>
              <a href="/menu" className="flex items-center space-x-3 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 px-3 py-2 rounded-lg transition-colors">
                <span>🍔 Menu Management</span>
              </a>
              <a href="/earnings" className="flex items-center space-x-3 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 px-3 py-2 rounded-lg transition-colors">
                <span>💰 Earnings</span>
              </a>
              <a href="/store" className="flex items-center space-x-3 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 px-3 py-2 rounded-lg transition-colors">
                <span>⚙️ Store Settings</span>
              </a>
            </nav>
            <div className="p-4 border-t">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-neutral-200"></div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Behrouz Biryani</span>
                  <span className="text-xs text-green-600">● Accepting Orders</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="h-16 bg-white border-b flex items-center justify-between px-6">
              <h1 className="text-xl font-bold md:hidden">Swifty Partner</h1>
              <div className="ml-auto flex items-center space-x-4">
                <button className="bg-red-50 text-red-600 px-4 py-1.5 rounded-md text-sm font-bold hover:bg-red-100 transition-colors">Emergency Close Restuarant</button>
              </div>
            </header>
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-50 p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
