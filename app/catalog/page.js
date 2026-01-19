"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Book as BookIcon, User, Layers, Hash, Calendar, Library } from "lucide-react";

export default function Catalog() {
  const [books, setBooks] = useState([]);

  useEffect(() => { fetchBooks(); }, []);

  async function fetchBooks() {
    const { data } = await supabase
      .from("books")
      .select("*")
      .order('created_at', { ascending: false });
    setBooks(data || []);
  }

  async function deleteBook(id) {
    if(!confirm("Are you sure you want to remove this book entry?")) return;
    await supabase.from("books").delete().eq("id", id);
    fetchBooks();
  }

  return (
    <div className="max-w-6xl mx-auto pt-16 px-6 pb-20 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-slate-700 to-slate-900 dark:from-slate-500 dark:via-slate-300 dark:to-slate-100 bg-clip-text text-transparent pb-1">
            Library Collection
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Inventory management and title tracking <span className="italic">with elegance.</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3 text-sm font-bold bg-secondary/50 backdrop-blur-sm text-secondary-foreground px-6 py-3 rounded-2xl border border-border shadow-sm">
          <Layers size={18} className="text-blue-600 dark:text-slate-400" />
          <span>{books.length} Unique Titles</span>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.map((book) => (
          <div 
            key={book.id} 
            className="group bg-card text-card-foreground border border-border/60 rounded-3xl p-6 hover:border-blue-500/30 dark:hover:border-slate-400/30 transition-all hover:shadow-2xl hover:shadow-blue-500/5 shadow-sm relative flex flex-col justify-between overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent dark:from-slate-400/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
            
            <div className="relative z-10">
              <div className="flex gap-6 items-start mb-6">
                {/* Visual Book Icon with "Stack" effect for quantity */}
                <div className="relative shrink-0">
                  <div className="w-16 h-24 rounded-xl bg-gradient-to-b from-secondary to-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-slate-200 transition-all shadow-inner relative z-10">
                    <BookIcon size={32} strokeWidth={1.5} />
                  </div>
                  {book.quantity > 1 && (
                    <>
                      <div className="absolute top-1 left-1 w-16 h-24 bg-muted/40 rounded-xl border border-border -z-10 translate-x-1.5 -translate-y-1.5 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2" />
                    </>
                  )}
                </div>

                <div className="flex flex-col h-24 justify-between py-1 w-full">
                  <div>
                    <h2 className="font-bold text-xl leading-tight mb-2 line-clamp-2 group-hover:text-blue-700 dark:group-hover:text-slate-100 transition-colors">
                      {book.title}
                    </h2>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="p-1 rounded-full bg-secondary">
                        <User size={12} className="text-blue-600/70 dark:text-slate-400" /> 
                      </div>
                      <span className="text-sm font-medium truncate italic">{book.author}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 dark:bg-slate-400/10 text-blue-700 dark:text-slate-300 text-xs font-bold ring-1 ring-inset ring-blue-500/20 dark:ring-slate-400/20">
                <Hash size={14} />
                <span>{book.quantity || 1} Copies in Stock</span>
              </div>
            </div>

            {/* Footer Section of Card */}
            <div className="mt-8 pt-4 border-t border-border/40 flex justify-between items-center relative z-10">
              <div className="flex items-center gap-1.5 text-muted-foreground/60">
                <Calendar size={12} />
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  {new Date(book.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <button 
                onClick={() => deleteBook(book.id)}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-xl opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 duration-300"
                title="Delete Entry"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {books.length === 0 && (
        <div className="text-center py-32 bg-secondary/20 rounded-[2.5rem] border-2 border-dashed border-border mt-10">
          <div className="bg-background w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-border">
            <Library className="text-muted-foreground opacity-30" size={40} />
          </div>
          <h3 className="text-2xl font-bold mb-2">No books found</h3>
          <p className="text-muted-foreground max-w-xs mx-auto text-lg">Your inventory is currently empty. Start by adding a title.</p>
        </div>
      )}
    </div>
  );
}