"use client";
import Link from 'next/link';
import { Book, PlusCircle, Library, Sun, Moon } from 'lucide-react';
import { useTheme } from './theme-provider';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <Library className="text-primary" />
          <span>Libryx</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/catalog" className="hover:text-primary transition-colors flex items-center gap-1">
              <Book size={18} /> Catalog
            </Link>
            <Link href="/add-book" className="hover:text-primary transition-colors flex items-center gap-1">
              <PlusCircle size={18} /> Add Book
            </Link>
          </div>

          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
}