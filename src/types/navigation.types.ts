export type DetailTab = 'autocad' | 'images' | 'onp' | 'status' | 'recheck' | 'schedule';

export interface NavigationState {
  projectId: string | null;
  phaseId: string | null;
  towerId: string | null;
  levelId: string | null;
  activeTab: DetailTab;
}

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

export type SidebarLevel = 'projects' | 'phases' | 'towers' | 'levels';
