import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { BreadcrumbItem, NavigationState } from '../types/navigation.types';
import { MOCK_PROJECTS } from '../utils/constants';

const initialState: NavigationState = {
  projectId: null,
  phaseId: null,
  towerId: null,
  levelId: null,
  activeTab: 'autocad',
};

interface NavigationContextValue {
  navigation: NavigationState;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  updateNavigation: (updates: Partial<NavigationState>) => void;
  resetNavigation: () => void;
  breadcrumbs: BreadcrumbItem[];
}

export const NavigationContext = createContext<NavigationContextValue | undefined>(
  undefined
);

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [navigation, setNavigation] = useState<NavigationState>(initialState);
  const [searchQuery, setSearchQuery] = useState('');

  const updateNavigation = useCallback((updates: Partial<NavigationState>) => {
    setNavigation((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetNavigation = useCallback(() => {
    setNavigation(initialState);
  }, []);

  const breadcrumbs = useMemo((): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      {
        label: 'Home',
        onClick: () =>
          setNavigation({ ...initialState }),
      },
    ];

    if (!navigation.projectId) return items;

    const project = MOCK_PROJECTS.find((p) => p.id === navigation.projectId);
    if (project) {
      items.push({
        label: project.name,
        onClick: () =>
          setNavigation({
            projectId: navigation.projectId,
            phaseId: null,
            towerId: null,
            levelId: null,
            activeTab: 'autocad',
          }),
      });
    }

    if (!navigation.phaseId) return items;

    const phase = project?.phases.find((p) => p.id === navigation.phaseId);
    if (phase) {
      items.push({
        label: phase.name,
        onClick: () =>
          setNavigation((prev) => ({
            ...prev,
            phaseId: navigation.phaseId,
            towerId: null,
            levelId: null,
            activeTab: 'autocad',
          })),
      });
    }

    if (!navigation.towerId) return items;

    const tower = phase?.towers.find((t) => t.id === navigation.towerId);
    if (tower) {
      items.push({
        label: tower.name,
        onClick: () =>
          setNavigation((prev) => ({
            ...prev,
            towerId: navigation.towerId,
            levelId: null,
            activeTab: 'autocad',
          })),
      });
    }

    if (!navigation.levelId) return items;

    const level = tower?.levels.find((l) => l.id === navigation.levelId);
    if (level) {
      items.push({ label: level.name });
    }

    return items;
  }, [navigation]);

  const value = useMemo(
    () => ({
      navigation,
      searchQuery,
      setSearchQuery,
      updateNavigation,
      resetNavigation,
      breadcrumbs,
    }),
    [navigation, searchQuery, updateNavigation, resetNavigation, breadcrumbs]
  );

  return (
    <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>
  );
}
