import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Code2, Building2, FileText, MessageSquare, LogOut, X, User, Bot } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Code2, label: 'DSA Tracker', path: '/dsa' },
    { icon: Building2, label: 'Company Patterns', path: '/patterns' },
    { icon: FileText, label: 'Resume ATS', path: '/resume' },
    { icon: MessageSquare, label: 'Mock Interview', path: '/interview' },
    { icon: Bot, label: 'AI Interview', path: '/ai-interview' }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          PlacementTrack
        </h1>
        <button onClick={onClose} className="md:hidden p-2 hover:bg-accent rounded-lg">
            <X size={20} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        {user && (
          <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-accent/30 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User size={14} />}
              </div>
              <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate opacity-75">{user.email}</p>
              </div>
          </div>
        )}
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {}
      <aside className="hidden md:flex w-64 bg-card border-r border-border h-screen flex-col fixed left-0 top-0">
        <SidebarContent />
      </aside>

      {}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
