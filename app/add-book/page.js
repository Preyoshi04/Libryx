"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Save, BookPlus, Loader2, Sparkles } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  // 1. Clean the strings (remove accidental spaces)
  const cleanTitle = title.trim();
  const cleanAuthor = author.trim();

  // 2. Check if the book already exists
  const { data: existingBook, error: fetchError } = await supabase
    .from('books')
    .select('id, quantity')
    .eq('title', cleanTitle)
    .eq('author', cleanAuthor)
    .single();

  if (existingBook) {
    // 3. Update existing book quantity
    const { error: updateError } = await supabase
      .from('books')
      .update({ quantity: (existingBook.quantity || 1) + 1 })
      .eq('id', existingBook.id);

    if (!updateError) toast.success("Added another copy to your library!");
  } else {
    // 4. Insert as new book
    const { error: insertError } = await supabase
      .from('books')
      .insert([{ title: cleanTitle, author: cleanAuthor, quantity: 1 }]);

    if (!insertError) toast.success("New title added to collection!");
  }

  setLoading(false);
  setTitle(""); 
  setAuthor("");
};

  return (
    <>
      <Toaster position="top-center" expand={false} richColors />
      <div className="max-w-xl mx-auto pt-24 px-6 min-h-[calc(100dvh-64px)] flex flex-col justify-start">
        <div className="relative group">
          {/* Decorative background glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-slate-400 dark:from-slate-600 dark:to-slate-800 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative bg-card/80 backdrop-blur-xl text-card-foreground border border-border rounded-3xl shadow-2xl p-8 md:p-12 overflow-hidden">
            {/* Subtle Gradient Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent dark:from-slate-400/5 rounded-full -mr-16 -mt-16" />

            <div className="flex items-center gap-5 mb-12">
              <div className="p-4 bg-gradient-to-br from-blue-600 to-slate-800 dark:from-slate-500 dark:to-slate-200 text-white dark:text-slate-900 rounded-2xl shadow-lg shadow-blue-500/20 dark:shadow-none">
                <BookPlus size={32} strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-slate-700 to-slate-900 dark:from-slate-500 dark:via-slate-300 dark:to-slate-100 bg-clip-text text-transparent">
                  New Entry
                </h1>
                <p className="text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <Sparkles size={14} className="text-blue-500" />
                  Expand your digital library
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-md font-bold ml-1 uppercase tracking-wider text-muted-foreground/80">Title</label>
                <input 
                  className="w-full bg-background/50 border border-input rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 dark:focus:border-slate-400/50 outline-none transition-all placeholder:text-muted-foreground/50 text-lg"
                  placeholder="e.g. The Great Gatsby"
                  value={title} onChange={(e) => setTitle(e.target.value)} required
                />
              </div>

              <div className="space-y-3">
                <label className="text-md font-bold ml-1 uppercase tracking-wider text-muted-foreground/80">Author</label>
                <input 
                  className="w-full bg-background/50 border border-input rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 dark:focus:border-slate-400/50 outline-none transition-all placeholder:text-muted-foreground/50 text-lg"
                  placeholder="e.g. F. Scott Fitzgerald"
                  value={author} onChange={(e) => setAuthor(e.target.value)} required
                />
              </div>

              <button 
                type="submit" disabled={loading}
                className="w-full mt-4 bg-primary text-primary-foreground py-5 rounded-2xl font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-50 cursor-pointer group"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <Save size={20} className="group-hover:translate-y-[-1px] transition-transform" /> 
                    <span className="text-lg">Add to Collection</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}