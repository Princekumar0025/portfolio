import type { Metadata } from 'next';
import { Inter, Geist } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Swifty | Order Food Online',
  description: 'Enterprise food delivery platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={inter.className}>
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <div className="mr-8 hidden md:flex">
              <span className="text-2xl font-bold tracking-tight text-orange-600">Swifty</span>
            </div>
            
            <div className="flex flex-1 items-center space-x-4">
              <div className="flex bg-neutral-100 rounded-md p-2 w-full max-w-sm">
                📍 <input type="text" placeholder="Set Location" className="bg-transparent border-none outline-none text-sm ml-2 w-full"/>
              </div>
              <div className="flex bg-neutral-100 rounded-md p-2 w-full max-w-lg">
                🔍 <input type="text" placeholder="Search for restaurant, cuisine or a dish" className="bg-transparent border-none outline-none text-sm ml-2 w-full"/>
              </div>
            </div>

            <div className="ml-auto flex items-center space-x-4">
              <button className="text-sm font-medium hover:text-orange-600 transition-colors">Log In</button>
              <button className="text-sm font-medium hover:text-orange-600 transition-colors">Sign Up</button>
              <button className="text-sm font-medium bg-black text-white px-4 py-2 rounded-md hover:bg-neutral-800 transition-all">Cart (0)</button>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
