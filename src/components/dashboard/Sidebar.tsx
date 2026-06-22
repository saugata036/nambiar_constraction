import {
  Briefcase,
  Building2,
  ChevronRight,
  Layers,
  LayoutGrid,
  LogOut,
  PanelLeft,
  PanelLeftClose,
  X,
} from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '../../hooks/useNavigation';
import { useLevels, usePhases, useProjects, useTowers } from '../../hooks/useProject';
import { APP_VERSION } from '../../utils/constants';
import { Logo } from '../common/Logo';

interface SidebarProps {
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

type FlowStepKey = 'projects' | 'phases' | 'towers' | 'levels';

interface ChainItem {
  id: string;
  name: string;
  isSelected: boolean;
  onClick: () => void;
}

interface FlowStep {
  key: FlowStepKey;
  label: string;
  icon: typeof Briefcase;
  reachable: boolean;
  isActive: boolean;
  items: ChainItem[];
  onHeaderClick: () => void;
}

const sidebarPadding = 'px-3';
const itemRow = 'flex items-center gap-2';
const iconSlot = 'flex h-8 w-8 shrink-0 items-center justify-center';

function getActiveStep(navigation: {
  projectId: string | null;
  phaseId: string | null;
  towerId: string | null;
  levelId: string | null;
}): FlowStepKey {
  if (!navigation.projectId) return 'projects';
  if (!navigation.phaseId) return 'phases';
  if (!navigation.towerId) return 'towers';
  return 'levels';
}

export function Sidebar({ onClose, collapsed = false, onToggleCollapse }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { navigation, updateNavigation, resetNavigation } = useNavigation();
  const { data: projects = [] } = useProjects();
  const { data: phases = [] } = usePhases(navigation.projectId);
  const { data: towers = [] } = useTowers(navigation.phaseId);
  const { data: levels = [] } = useLevels(navigation.towerId);

  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase();
  const activeStep = getActiveStep(navigation);

  const flowSteps = useMemo((): FlowStep[] => {
    const navigateToStep = (key: FlowStepKey) => {
      switch (key) {
        case 'projects':
          resetNavigation();
          break;
        case 'phases':
          updateNavigation({
            projectId: navigation.projectId,
            phaseId: null,
            towerId: null,
            levelId: null,
            activeTab: 'autocad',
          });
          break;
        case 'towers':
          updateNavigation({
            projectId: navigation.projectId,
            phaseId: navigation.phaseId,
            towerId: null,
            levelId: null,
            activeTab: 'autocad',
          });
          break;
        case 'levels':
          updateNavigation({
            projectId: navigation.projectId,
            phaseId: navigation.phaseId,
            towerId: navigation.towerId,
            levelId: null,
            activeTab: 'autocad',
          });
          break;
      }
      onClose?.();
    };

    const projectItems: ChainItem[] = projects.map((project) => ({
      id: project.id,
      name: project.name,
      isSelected: navigation.projectId === project.id,
      onClick: () => {
        updateNavigation({
          projectId: project.id,
          phaseId: null,
          towerId: null,
          levelId: null,
          activeTab: 'autocad',
        });
        onClose?.();
      },
    }));

    const phaseItems: ChainItem[] = phases.map((phase) => ({
      id: phase.id,
      name: phase.name,
      isSelected: navigation.phaseId === phase.id,
      onClick: () => {
        updateNavigation({
          projectId: navigation.projectId,
          phaseId: phase.id,
          towerId: null,
          levelId: null,
          activeTab: 'autocad',
        });
        onClose?.();
      },
    }));

    const towerItems: ChainItem[] = towers.map((tower) => ({
      id: tower.id,
      name: tower.name,
      isSelected: navigation.towerId === tower.id,
      onClick: () => {
        updateNavigation({
          projectId: navigation.projectId,
          phaseId: navigation.phaseId,
          towerId: tower.id,
          levelId: null,
          activeTab: 'autocad',
        });
        onClose?.();
      },
    }));

    const levelItems: ChainItem[] = levels.map((level) => ({
      id: level.id,
      name: level.name,
      isSelected: navigation.levelId === level.id,
      onClick: () => {
        updateNavigation({
          projectId: navigation.projectId,
          phaseId: navigation.phaseId,
          towerId: navigation.towerId,
          levelId: level.id,
          activeTab: 'autocad',
        });
        onClose?.();
      },
    }));

    const stepDefs: {
      key: FlowStepKey;
      label: string;
      icon: typeof Briefcase;
      reachable: boolean;
      items: ChainItem[];
    }[] = [
      { key: 'projects', label: 'Projects', icon: Briefcase, reachable: true, items: projectItems },
      {
        key: 'phases',
        label: 'Phases',
        icon: Layers,
        reachable: !!navigation.projectId,
        items: phaseItems,
      },
      {
        key: 'towers',
        label: 'Towers',
        icon: Building2,
        reachable: !!navigation.phaseId,
        items: towerItems,
      },
      {
        key: 'levels',
        label: 'Levels',
        icon: LayoutGrid,
        reachable: !!navigation.towerId,
        items: levelItems,
      },
    ];

    return stepDefs.map((step) => ({
      ...step,
      isActive: activeStep === step.key,
      onHeaderClick: () => {
        if (!step.reachable && step.key !== 'projects') return;
        navigateToStep(step.key);
      },
    }));
  }, [
    projects,
    phases,
    towers,
    levels,
    navigation,
    activeStep,
    updateNavigation,
    resetNavigation,
    onClose,
  ]);

  const handleLogoClick = () => {
    resetNavigation();
    navigate('/dashboard');
    onClose?.();
  };

  return (
    <aside
      className={`flex h-screen flex-col border-r border-gray-200 bg-white text-gray-900 shadow-sm transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      <div className={`shrink-0 border-b border-gray-200 ${sidebarPadding}`}>
        {!collapsed ? (
          <>
            <button
              type="button"
              onClick={handleLogoClick}
              className="flex w-full justify-start pt-3 pb-2 transition-opacity hover:opacity-80"
              aria-label="Go to home"
            >
              <Logo size="sidebar" className="max-w-[140px]" />
            </button>
            <div className="flex items-center justify-between gap-2 pb-2">
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
          <div className="flex flex-col items-center gap-2 py-3">
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

      <nav className={`flex-1 overflow-y-auto bg-gray-50/50 py-2 ${sidebarPadding} scrollbar-auto-hide`}>
        {!collapsed ? (
          <div className="space-y-1">
            <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Navigation
            </p>
            {flowSteps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === flowSteps.length - 1;
              const hasSelection = step.items.some((item) => item.isSelected);

              return (
                <div key={step.key}>
                  <button
                    type="button"
                    onClick={step.onHeaderClick}
                    disabled={!step.reachable && step.key !== 'projects'}
                    className={`${itemRow} w-full rounded-lg px-1 py-1.5 text-left transition-all duration-200 ${
                      step.isActive
                        ? 'border border-primary-100 bg-primary-50 text-primary-700 shadow-sm'
                        : hasSelection
                          ? 'text-gray-700 hover:bg-white'
                          : step.reachable
                            ? 'text-gray-600 hover:bg-white'
                            : 'cursor-not-allowed text-gray-300 opacity-50'
                    }`}
                  >
                    <span
                      className={`${iconSlot} rounded-lg ${
                        step.isActive
                          ? 'bg-primary-100 text-primary-700'
                          : hasSelection
                            ? 'bg-primary-50 text-primary-600'
                            : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{step.label}</span>
                    {step.isActive && <ChevronRight className="h-4 w-4 shrink-0 text-primary-500" />}
                  </button>

                  {step.reachable && step.items.length > 0 && (
                    <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-gray-200 pl-2">
                      {step.items.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={item.onClick}
                          title={item.name}
                          className={`block w-full truncate rounded-md px-2 py-1.5 text-left text-xs transition-colors ${
                            item.isSelected
                              ? 'border-l-2 border-primary-500 bg-primary-50 font-semibold text-primary-700'
                              : 'text-gray-500 hover:bg-white hover:text-gray-700'
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {!isLast && step.reachable && <div className="h-1.5" />}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            {flowSteps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === flowSteps.length - 1;
              const selectedItem = step.items.find((item) => item.isSelected);

              return (
                <div key={step.key} className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={step.onHeaderClick}
                    disabled={!step.reachable && step.key !== 'projects'}
                    title={selectedItem ? `${step.label}: ${selectedItem.name}` : step.label}
                    className={`${iconSlot} rounded-lg transition-all duration-200 ${
                      step.isActive
                        ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500/30'
                        : selectedItem
                          ? 'bg-primary-50 text-primary-600 ring-1 ring-primary-200'
                          : step.reachable
                            ? 'bg-gray-100 text-gray-500 hover:bg-white'
                            : 'cursor-not-allowed bg-gray-50 text-gray-300 opacity-40'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                  {!isLast && step.reachable && <div className="my-0.5 h-3 w-0.5 bg-gray-200" />}
                </div>
              );
            })}
          </div>
        )}
      </nav>

      <div className={`border-t border-gray-100 bg-white py-3 ${sidebarPadding}`}>
        <div className={`${itemRow} ${collapsed ? 'justify-center' : ''}`}>
          {user?.avatar ? (
            <img src={user.avatar} alt={user.firstName} className="h-8 w-8 shrink-0 rounded-full" />
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
          <p className="mt-2 truncate pl-10 text-xs text-gray-400">Version: {APP_VERSION}</p>
        )}
        <button
          onClick={logout}
          className={`${itemRow} mt-2 w-full rounded-lg bg-primary-600 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 ${
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
