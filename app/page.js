"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Library, 
  BookOpen, 
  Plus, 
  ArrowRight, 
  TrendingUp, 
  Hash,
  Sparkles,
  Clock
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [stats, setStats] = useState({
    totalTitles: 0,
    totalCopies: 0,
    lowStock: 0,
    recentBooks: []
  });

  useEffect(() => {
    async function getDashboardData() {
      const { data } = await supabase.from("books").select("*");
      if (data) {
        const totalCopies = data.reduce((sum, book) => sum + (book.quantity || 0), 0);
        const recent = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3);
        
        setStats({
          totalTitles: data.length,
          totalCopies: totalCopies,
          recentBooks: recent
        });
      }
    }
    getDashboardData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto pt-16 px-6 pb-20 min-h-screen text-foreground">
      {/* Hero Welcome */}
      <div className="mb-16 relative">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold w-fit mb-4 border border-blue-500/20 shadow-sm">
          <Sparkles size={14} />
          <span>System Live</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-slate-700 to-slate-900 dark:from-slate-500 dark:via-slate-300 dark:to-slate-100 bg-clip-text text-transparent pb-1">
          Library Overview
        </h1>
        <p className="text-muted-foreground mt-3 text-lg max-w-xl leading-relaxed">
          Welcome back. Your collection currently spans <span className="text-foreground font-semibold">{stats.totalCopies} volumes</span> across multiple genres.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <StatCard 
          icon={<Library size={24} />} 
          label="Unique Titles" 
          value={stats.totalTitles}
          color="blue"
        />
        <StatCard 
          icon={<Hash size={24} />} 
          label="Total Copies" 
          value={stats.totalCopies}
          color="slate"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Quick Actions - 2 Columns wide */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <TrendingUp size={18} className="text-blue-600" />
            </div>
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 gap-5">
            <ActionLink 
              href="/add-book" 
              icon={<Plus size={24} />} 
              title="Add New Entry" 
              desc="Expand your digital library" 
              active 
            />
            <ActionLink 
              href="/catalog" 
              icon={<BookOpen size={24} />} 
              title="Manage Catalog" 
              desc="Search and edit inventory" 
            />
          </div>
        </div>

        {/* Recent Additions - 3 Columns wide */}
        <div className="lg:col-span-3 space-y-8">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-foreground">
            <div className="w-8 h-8 rounded-lg bg-slate-500/10 flex items-center justify-center">
               <Clock size={18} className="text-slate-600 dark:text-slate-400" />
            </div>
            Recently Added
          </h2>
          
          <div className="bg-card/40 backdrop-blur-xl border border-border/60 rounded-[2.5rem] p-8 shadow-sm">
            <div className="space-y-6">
              {stats.recentBooks.length > 0 ? stats.recentBooks.map((book) => (
                <div key={book.id} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-secondary/80 transition-all border border-transparent hover:border-border/60">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-16 bg-gradient-to-b from-background to-secondary rounded-xl border border-border flex items-center justify-center text-muted-foreground group-hover:text-blue-600 transition-colors shadow-sm">
                      <Library size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-base line-clamp-1 group-hover:text-blue-700 dark:group-hover:text-slate-100 transition-colors">{book.title}</p>
                      <p className="text-sm text-muted-foreground italic font-medium">{book.author}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] uppercase font-bold tracking-tighter text-muted-foreground/50">Quantity</span>
                    <p className="text-sm font-black bg-blue-500/10 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-lg ring-1 ring-inset ring-blue-500/20">{book.quantity}</p>
                  </div>
                </div>
              )) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground italic">No books recorded yet.</p>
                </div>
              )}
            </div>
            
            {stats.recentBooks.length > 0 && (
              <Link href="/catalog" className="mt-8 flex items-center justify-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors pt-4 border-t border-border/40">
                View All Books <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component for Stats
function StatCard({ icon, label, value, color }) {
  const colors = {
    blue: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    emerald: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    green: "text-green-600 bg-green-500/10 border-green-500/20",
    slate: "text-slate-600 bg-slate-500/10 border-slate-500/20"
  };

  return (
    <div className="relative group overflow-hidden bg-card border border-border rounded-[2.5rem] p-8 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500 ${colors[color] || colors.slate} border`}>
        {icon}
      </div>
      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
      <p className="text-5xl font-black tracking-tighter">{value}</p>
      
      {/* Background Decorative Pattern */}
      <div className="absolute -bottom-4 -right-4 text-slate-500/5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
        {icon && typeof icon === 'object' && <icon.type size={120} />}
      </div>
    </div>
  );
}

// Sub-component for Action Buttons
function ActionLink({ href, icon, title, desc }) {
  return (
    <Link 
      href={href} 
      className="group relative p-6 rounded-[2rem] border border-border/60 bg-card/50 backdrop-blur-md transition-all duration-300 flex items-center justify-between shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/40 overflow-hidden"
    >
      {/* Subtle Background Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-center gap-5 relative z-10">
        {/* Icon Container */}
        <div className="p-4 rounded-2xl bg-secondary text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:bg-blue-900 group-hover:text-white transition-all duration-300 shadow-sm">
          {icon}
        </div>
        
        <div>
          <p className="font-extrabold text-lg tracking-tight group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </p>
          <p className="text-xs font-medium text-muted-foreground">
            {desc}
          </p>
        </div>
      </div>

      {/* Arrow Icon */}
      <div className="relative z-10 w-10 h-10 flex items-center justify-center rounded-full bg-secondary/50 group-hover:bg-blue-900 group-hover:text-white transition-all duration-300">
        <ArrowRight 
          className="transition-transform group-hover:translate-x-1" 
          size={18} 
        />
      </div>

      {/* Decorative Corner Element */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
    </Link>
  );
}