import {
  Briefcase,
  Building2,
  Layers,
  LayoutGrid,
  LogOut,
  PanelLeft,
  PanelLeftClose,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '../../hooks/useNavigation';
import type { SidebarLevel } from '../../types/navigation.types';
import { APP_VERSION } from '../../utils/constants';
import { Logo } from '../common/Logo';

interface SidebarProps {
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

function getSidebarLevel(
  projectId: string | null,
  phaseId: string | null,
  towerId: string | null
): SidebarLevel {
  if (!projectId) return 'projects';
  if (!phaseId) return 'phases';
  if (!towerId) return 'towers';
  return 'levels';
}

const SECTION_NAV: Record<
  SidebarLevel,
  { label: string; icon: typeof Briefcase }
> = {
  projects: { label: 'Projects', icon: Briefcase },
  phases: { label: 'Phases', icon: Layers },
  towers: { label: 'Towers', icon: Building2 },
  levels: { label: 'Levels', icon: LayoutGrid },
};

const sidebarPadding = 'px-4';
const itemRow = 'flex items-center gap-3';
const iconSlot = 'flex h-9 w-9 shrink-0 items-center justify-center';

export function Sidebar({ onClose, collapsed = false, onToggleCollapse }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { navigation, resetNavigation } = useNavigation();

  const sidebarLevel = getSidebarLevel(
    navigation.projectId,
    navigation.phaseId,
    navigation.towerId
  );

  const { label, icon: Icon } = SECTION_NAV[sidebarLevel];
  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase();

  const handleLogoClick = () => {
    resetNavigation();
    navigate('/dashboard');
    onClose?.();
  };

  return (
    <aside
      className={`flex h-screen flex-col border-r border-gray-200 bg-white text-gray-900 shadow-sm transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      <div className={`shrink-0 border-b border-gray-200 ${sidebarPadding}`}>
        {!collapsed ? (
          <>
            <button
              type="button"
              onClick={handleLogoClick}
              className="flex w-full justify-start pt-5 pb-3 transition-opacity hover:opacity-80"
              aria-label="Go to home"
            >
              <Logo size="sidebar" className="max-w-[180px]" />
            </button>
            <div className="flex items-center justify-between gap-2 pb-3">
              <p className="truncate text-xs text-gray-500">Construction Management</p>
              <div className="flex shrink-0 items-center gap-1">
                {onClose && (
                  <button
                    onClick={onClose}
                    className="rounded p-1 text-gray-500 hover:bg-gray-100 lg:hidden"
                    aria-label="Close sidebar"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                {onToggleCollapse && (
                  <button
                    onClick={onToggleCollapse}
                    className="hidden rounded p-1 text-gray-600 hover:bg-gray-100 lg:flex"
                    aria-label="Collapse sidebar"
                  >
                    <PanelLeftClose className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 py-4">
            <button
              type="button"
              onClick={handleLogoClick}
              className="transition-opacity hover:opacity-80"
              aria-label="Go to home"
            >
              <Logo size="md" />
            </button>
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="rounded p-1 text-gray-600 hover:bg-gray-100"
                aria-label="Expand sidebar"
              >
                <PanelLeft className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      <nav className={`flex-1 bg-gray-50/50 py-3 ${sidebarPadding}`}>
        <button
          className={`${itemRow} w-full rounded-lg border border-primary-100 bg-primary-50 py-2.5 text-sm font-medium text-primary-700 shadow-sm ${
            collapsed ? 'justify-center' : ''
          }`}
          title={label}
        >
          <span className={iconSlot}>
            <Icon className="h-5 w-5" />
          </span>
          {!collapsed && <span className="truncate">{label}</span>}
        </button>
      </nav>

      <div className={`border-t border-gray-100 bg-white py-4 ${sidebarPadding}`}>
        <div className={`${itemRow} ${collapsed ? 'justify-center' : ''}`}>
          {user?.avatar ? (
            <img src={user.avatar} alt={user.firstName} className="h-9 w-9 shrink-0 rounded-full" />
          ) : (
            <div className={`${iconSlot} rounded-full bg-gray-100 text-xs font-semibold text-gray-700`}>
              {initials}
            </div>
          )}
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-xs text-gray-500">{user?.email}</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <p className="mt-3 truncate pl-12 text-xs text-gray-400">Version: {APP_VERSION}</p>
        )}
        <button
          onClick={logout}
          className={`${itemRow} mt-3 w-full rounded-lg bg-primary-600 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <span className={iconSlot}>
            <LogOut className="h-4 w-4" />
          </span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
