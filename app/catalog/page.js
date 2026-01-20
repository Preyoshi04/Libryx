"use client";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import {
  Trash2,
  Book as BookIcon,
  Layers,
  Hash,
  Calendar,
  Library,
  ChevronDown,
  Pen,
  Edit,
} from "lucide-react";
import DeleteModal from "@/components/DeleteModal";
import { toast, Toaster } from "sonner";
import EditBookModal from "@/components/EditBookModal";

export default function Catalog() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    const { data } = await supabase
      .from("books")
      .select("*")
      .order("created_at");
    setBooks(data || []);
  }

  /// --- THE FIXED SORTING LOGIC ---
  const processedBooks = useMemo(() => {
    // 1. Filter first
    let filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // 2. Sort a COPY of the array (Crucial for React to see the change)
    const sorted = [...filtered].sort((a, b) => {
      console.log("Current Sort Mode:", sortBy); // Check your console!

      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "quantity") {
        // We use || 0 to handle cases where quantity might be null/undefined
        return (Number(b.quantity) || 0) - (Number(a.quantity) || 0);
      }
      if (sortBy === "newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return 0;
    });

    return sorted;
  }, [books, searchQuery, sortBy]);

  // DELETING BOOKS
  const handleDeleteClick = (book) => {
    if (book.quantity > 1) {
      setSelectedBook(book);
      setIsModalOpen(true);
    } else {
      if (confirm("Are you sure you want to delete this book?")) {
        executeDeleteAll(book.id);
      }
    }
  };
  async function executeRemoveOne() {
    await supabase
      .from("books")
      .update({ quantity: selectedBook.quantity - 1 })
      .eq("id", selectedBook.id);
    setIsModalOpen(false);
    fetchBooks();
  }

  async function executeDeleteAll(id) {
    await supabase
      .from("books")
      .delete()
      .eq("id", id || selectedBook.id);
    setIsModalOpen(false);
    fetchBooks();
  }

  // EDITING BOOKS
  async function handleUpdateBook(updatedBook) {
    const { error } = await supabase
      .from("books")
      .update({
        title: updatedBook.title,
        author: updatedBook.author,
        quantity: updatedBook.quantity,
      })
      .eq("id", updatedBook.id);

    if (!error) fetchBooks();
  }

  return (
    <>
      <Toaster position="top-center" expand={false} richColors />
      <div className="max-w-6xl mx-auto pt-16 px-6 pb-20 min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-slate-700 to-slate-900 dark:from-slate-500 dark:via-slate-300 dark:to-slate-100 bg-clip-text text-transparent pb-1">
              Library Collection
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Inventory management and title tracking{" "}
              <span className="italic">with elegance.</span>
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm font-bold bg-secondary/50 backdrop-blur-sm text-secondary-foreground px-6 py-3 rounded-2xl border border-border shadow-sm">
            <Layers size={18} className="text-blue-600 dark:text-slate-400" />
            <span>{books.length} Books in Total</span>
          </div>

          {/* Toolbar: Search + Sort */}
          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
            <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-secondary/30 backdrop-blur-sm border border-border rounded-2xl pl-10 pr-10 py-2.5 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full md:w-auto">
              <select
                value={sortBy}
                onChange={(e) => {
                  console.log("Dropdown changed to:", e.target.value);
                  setSortBy(e.target.value);
                }}
                className="appearance-none w-full bg-secondary/50 border border-border rounded-2xl px-5 py-2.5 pr-10 text-sm font-bold focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="title">Title (A-Z)</option>
                <option value="quantity">Most Stocked</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                size={14}
              />
            </div>
          </div>
        </div>

        {/* Grid Section - Now using filteredBooks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {processedBooks.map((book) => (
            <div
              key={book.id}
              className="group bg-card text-card-foreground border border-border/60 rounded-3xl p-6 hover:border-blue-500/30 dark:hover:border-slate-400/30 transition-all hover:shadow-2xl hover:shadow-blue-500/5 shadow-sm relative flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent dark:from-slate-400/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />

              <div className="relative z-10">
                <div className="flex gap-6 items-start mb-6">
                  <div className="relative shrink-0">
                    <div className="w-16 h-24 rounded-xl bg-gradient-to-b from-secondary to-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-slate-200 transition-all shadow-inner relative z-10">
                      <BookIcon size={32} strokeWidth={1.5} />
                    </div>
                    {book.quantity > 1 && (
                      <div className="absolute top-1 left-1 w-16 h-24 bg-muted/40 rounded-xl border border-border -z-10 translate-x-1.5 -translate-y-1.5 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2" />
                    )}
                  </div>

                  <div className="flex flex-col h-24 justify-between py-1 w-full">
                    <div>
                      <h2 className="font-bold text-xl leading-tight mb-2 line-clamp-2 group-hover:text-blue-700 dark:group-hover:text-slate-100 transition-colors">
                        {book.title}
                      </h2>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="p-1 rounded-full bg-secondary">
                          <Pen
                            size={15}
                            className="text-blue-600/70 dark:text-slate-400"
                          />
                        </div>
                        <span className="text-sm font-medium truncate italic">
                          {book.author}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 dark:bg-slate-400/10 text-blue-700 dark:text-slate-300 text-xs font-bold ring-1 ring-inset ring-blue-500/20 dark:ring-slate-400/20">
                  <Hash size={14} />
                  <span>{book.quantity || 1} Copies in Stock</span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-border/40 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-1.5 text-muted-foreground/60">
                  <Calendar size={12} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">
                    {new Date(book.created_at).toLocaleDateString()}
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteClick(book)}
                  className="p-2 text-muted-foreground hover:text-destructive cursor-pointer hover:bg-destructive/10 transition-all rounded-xl opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 duration-300"
                  title="Delete Entry"
                >
                  <Trash2 size={20} />
                </button>
                <button
                  onClick={() => {
                    setBookToEdit(book);
                    setIsEditModalOpen(true);
                  }}
                  className="p-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-500/10 transition-all rounded-xl opacity-0 group-hover:opacity-100"
                >
                  <Edit size={18} /> 
                </button>
              </div>
            </div>
          ))}
        </div>

        <DeleteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirmOne={executeRemoveOne}
          onConfirmAll={() => executeDeleteAll()}
          bookTitle={selectedBook?.title}
          quantity={selectedBook?.quantity}
        />

        <EditBookModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          book={bookToEdit}
          onUpdate={handleUpdateBook}
        />

        {/* Empty States */}
        {books.length > 0 && processedBooks.length === 0 && (
          <div className="text-center py-20 bg-secondary/10 rounded-[2.5rem] border border-dashed border-border mt-10">
            <p className="text-muted-foreground text-lg italic tracking-tight">
              No books match "
              <span className="font-bold text-foreground">{searchQuery}</span>"
            </p>
          </div>
        )}

        {books.length === 0 && (
          <div className="text-center py-32 bg-secondary/20 rounded-[2.5rem] border-2 border-dashed border-border mt-10">
            <div className="bg-background w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-border">
              <Library className="text-muted-foreground opacity-30" size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-2">No books found</h3>
            <p className="text-muted-foreground max-w-xs mx-auto text-lg">
              Your inventory is currently empty. Start by adding a title.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
