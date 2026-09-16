import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Menu, Users, PlusCircle, Search } from 'lucide-react';

export default function StudentManagement() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#061923] flex text-[#f0fdf4]">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-18 px-4 sm:px-6 lg:px-8 teal-glass-panel border-b border-emerald-500/20 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 transition cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Student Management</h1>
              <p className="text-xs text-emerald-200/60 font-semibold hidden sm:block">Module 4: Student CRUD, Enrollment & Profile Details</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
          <div className="teal-glass-card p-8 rounded-3xl text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white">Student Management Module</h3>
            <p className="text-xs text-emerald-200/70 max-w-md mx-auto">
              Ready for Module 4 implementation: Student CRUD, Full Name, Email, Mobile, Address, Qualification, Enrollment Date, Search & Pagination.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
