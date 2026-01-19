import { ArrowRight, BookCheck, BookDashed, ListChecks } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    /* h-full and flex-grow here ensures the content centers 
       vertically between the Navbar and Footer */
    <div className="max-w-5xl mx-auto px-6 h-[calc(100dvh-160px)] flex flex-col justify-center text-center">
      
      {/* Badge */}
      <div className="inline-flex items-center self-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-8 border border-border">
        <BookCheck size={14} className="text-primary" />
        <span>Find Your Books Now</span>
      </div>

      {/* Hero Title with your Blueish/Slate Gradient */}
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-600 via-slate-700 to-slate-900 dark:from-slate-500 dark:via-slate-300 dark:to-slate-100 bg-clip-text text-transparent pb-2">
        Manage your library <br />
        <span className="italic font-serif font-semibold pb-2">with elegance.</span>
      </h1>

      <p className="text-md md:text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
        Libryx is a minimal, high-performance platform for organizing your book
        collection. Track inventory, manage authors, and enjoy a seamless dark
        mode experience.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link href="/catalog" className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
          <ListChecks /> Explore Catalog <ArrowRight size={20} />
        </Link>
        <Link href="/add-book" className="bg-secondary text-secondary-foreground border border-border px-8 py-4 rounded-xl font-semibold hover:bg-accent transition-all flex items-center justify-center gap-2">
          <BookDashed /> Add New Book
        </Link>
      </div>
    </div>
  );
}