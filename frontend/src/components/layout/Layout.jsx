import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {}
      <div className="md:hidden flex items-center p-4 border-b border-border bg-card sticky top-0 z-30">
        <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-accent rounded-lg mr-3"
        >
            <Menu size={24} />
        </button>
        <span className="font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            PlacementTrack
        </span>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-[calc(100vh-65px)] md:h-screen">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
