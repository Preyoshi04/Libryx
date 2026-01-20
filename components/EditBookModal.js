"use client";
import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";

export default function EditBookModal({ isOpen, onClose, book, onUpdate }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setQuantity(book.quantity);
    }
  }, [book]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onUpdate({ ...book, title, author, quantity });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 relative animate-in zoom-in-95">
        <button onClick={onClose} className="absolute top-8 right-8 text-muted-foreground hover:text-foreground">
          <X size={24} />
        </button>

        <h2 className="text-3xl font-black mb-8">Edit Title</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1 text-muted-foreground uppercase tracking-widest">Book Title</label>
            <input 
              className="w-full bg-secondary/50 border border-border rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              value={title} onChange={(e) => setTitle(e.target.value)} required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1 text-muted-foreground uppercase tracking-widest">Author</label>
            <input 
              className="w-full bg-secondary/50 border border-border rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              value={author} onChange={(e) => setAuthor(e.target.value)} required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1 text-muted-foreground uppercase tracking-widest">Quantity</label>
            <input 
              type="number" min="0"
              className="w-full bg-secondary/50 border border-border rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} required
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
}