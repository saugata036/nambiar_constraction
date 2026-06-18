import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useNavigation } from '../../hooks/useNavigation';
import { Breadcrumb } from '../dashboard/Breadcrumb';
import { Header } from '../dashboard/Header';
import { Sidebar } from '../dashboard/Sidebar';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { navigation } = useNavigation();

  const sidebarWidth = sidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-64';

  return (
    <div className="h-screen overflow-hidden bg-gray-50">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className={`flex h-screen flex-col transition-all duration-300 ${sidebarWidth}`}>
        <div className="sticky top-0 z-30 border-b border-gray-200 bg-white">
          <div className="flex h-12 items-center justify-between px-4 lg:h-11 lg:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 lg:hidden"
              >
                {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
              <Breadcrumb />
            </div>
            <Header />
          </div>
        </div>

        <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex h-full min-h-0 flex-1 flex-col"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {!navigation.projectId && (
          <button
            onClick={() => toast('Add feature coming soon')}
            className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-primary-700 hover:shadow-xl"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Project</span>
          </button>
        )}
      </div>
    </div>
  );
}
