import { ArrowRight, BookCheck, BookDashed, ListChecks } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    /* h-[calc(100dvh-64px)]: Subtracts the navbar height (assumed 64px) 
       to prevent the "extra" height that causes scrolling.
    */
    <div className="max-w-5xl mx-auto h-[500px] flex flex-col justify-center text-center overflow-hidden">
      
      {/* Badge - Reduced margin to pull it closer to the top */}
      <div className="inline-flex items-center self-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-4 border border-border">
        <BookCheck size={14} className="text-primary" />
        <span>Find Your Books Now</span>
      </div>

      {/* Hero Title - Gradient logic refined */}
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 inline-block w-full bg-gradient-to-r from-blue-600 via-slate-700 to-slate-900 dark:from-slate-500 dark:via-slate-300 dark:to-slate-100 bg-clip-text text-transparent pb-2">
        Manage your library <br />
        <span className="text-muted-foreground italic font-medium">
          with elegance.
        </span>
      </h1>

      {/* Description - Reduced bottom margin */}
      <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
        Libryx is a minimal, high-performance platform for organizing your book
        collection. Track inventory, manage authors, and enjoy a seamless dark
        mode experience.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          href="/catalog"
          className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
        >
          <ListChecks />
          Explore Catalog <ArrowRight size={20} />
        </Link>
        <Link
          href="/add-book"
          className="bg-secondary text-secondary-foreground border border-border px-8 py-4 rounded-xl font-semibold hover:bg-accent transition-all flex items-center justify-center gap-2"
        >
          <BookDashed />
          Add New Book
        </Link>
      </div>
      
    </div>
  );
}