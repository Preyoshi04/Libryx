"use client";
import { Trash2, CopyMinus, AlertTriangle, X } from "lucide-react";

export default function DeleteModal({ isOpen, onClose, onConfirmOne, onConfirmAll, bookTitle, quantity }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border w-full max-w-md rounded-[2rem] shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors">
          <X size={20} />
        </button>

        {/* Warning Icon */}
        <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-6">
          <AlertTriangle size={24} />
        </div>

        <h3 className="text-xl font-bold mb-2">Manage Inventory</h3>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          The book <span className="text-foreground font-semibold">"{bookTitle}"</span> has <span className="text-foreground font-semibold">{quantity} copies</span>. How would you like to proceed?
        </p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={onConfirmOne}
            className="flex items-center justify-center gap-2 w-full bg-slate-200 dark:bg-slate-950/20 dark:border-1 dark:hover:bg-slate-800 cursor-pointer hover:bg-slate-400/80 text-secondary-foreground font-bold py-3.5 rounded-2xl transition-all"
          >
            <CopyMinus size={18} />
            Remove One Copy
          </button>
          
          <button 
            onClick={onConfirmAll}
            className="flex items-center justify-center gap-2 w-full bg-red-500 cursor-pointer hover:bg-destructive/90 text-destructive-foreground font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-destructive/20"
          >
            <Trash2 size={18} />
            Delete Entire Entry
          </button>
        </div>
      </div>
    </div>
  );
}