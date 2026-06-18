import type { Level, LevelStatus, ONPType, Phase, Project, Tower } from '../types/project.types';
import type { User } from '../types/auth.types';

export const AUTH_TOKEN_KEY = 'nambiar_auth_token';
export const AUTH_USER_KEY = 'nambiar_auth_user';
export const DARK_MODE_KEY = 'nambiar_dark_mode';

export const MOCK_USER: User = {
  id: 'user-1',
  email: 'admin@nambiar.com',
  firstName: 'Alex',
  lastName: 'Nambiar',
  role: 'admin',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  permissions: ['custom_scheduler'],
};

export const DRONE_AUTO_INTERVAL_HOURS = 10;
export const DRONE_FLIGHT_DURATION_MS = 5000;

export const MOCK_PASSWORD = 'password123';

// Construction & building imagery (Unsplash)
export const BUILDING_IMAGES = {
  projects: [
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
  ],
  construction: [
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    'https://images.unsplash.com/photo-1590644365617-42c4b3aec816?w=800&q=80',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
    'https://images.unsplash.com/photo-1541976590-713941681591?w=800&q=80',
  ],
  drone: [
    'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80',
    'https://images.unsplash.com/photo-1524143983365-2aa436bcc909?w=800&q=80',
    'https://images.unsplash.com/photo-1579829366246-837f3316136c?w=800&q=80',
  ],
  blueprint: [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
    'https://images.unsplash.com/photo-1504307640774-f8ef1faffd3a?w=800&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
  ],
};

const AUTOCAD_LABELS = ['Floor Plan', 'Structural Layout', 'Elevation View', 'MEP Layout'];
const AUTOCAD_FILES = ['floor-plan.dwg', 'structural-layout.dwg', 'elevation-view.dxf', 'mep-layout.dwg'];

const STATUSES: LevelStatus[] = ['pending', 'in_progress', 'approved', 'rejected', 'recheck'];
const ONP_TYPES: ONPType[] = ['info', 'warning', 'error', 'success'];

const RECHECK_ITEMS = [
  'Verify structural alignment',
  'Check rebar placement',
  'Inspect formwork integrity',
  'Validate concrete pour quality',
  'Review safety compliance',
];

function createLevel(
  projectIdx: number,
  phaseIdx: number,
  towerIdx: number,
  levelIdx: number
): Level {
  const id = `p${projectIdx}-ph${phaseIdx}-t${towerIdx}-l${levelIdx}`;
  const status = STATUSES[(projectIdx + phaseIdx + towerIdx + levelIdx) % STATUSES.length];

  return {
    id,
    name: `Level ${levelIdx + 1}`,
    towerId: `p${projectIdx}-ph${phaseIdx}-t${towerIdx}`,
    order: levelIdx + 1,
    images: {
      autocadDrawings: Array.from({ length: 2 + (levelIdx % 2) }, (_, i) => {
        const bpIdx = (projectIdx + phaseIdx + towerIdx + levelIdx + i) % BUILDING_IMAGES.blueprint.length;
        const fileName = `L${levelIdx + 1}-${AUTOCAD_FILES[i % AUTOCAD_FILES.length]}`;
        return {
          id: `${id}-cad-${i}`,
          url: BUILDING_IMAGES.blueprint[bpIdx],
          fileName,
          label: AUTOCAD_LABELS[i % AUTOCAD_LABELS.length],
          fileType: fileName.endsWith('.dxf') ? ('dxf' as const) : ('dwg' as const),
          uploadedAt: new Date(Date.now() - (i + 1) * 7 * 86400000),
        };
      }),
      captured: Array.from({ length: 3 }, (_, i) => {
        const imgIdx = (projectIdx + phaseIdx + towerIdx + levelIdx + i) % BUILDING_IMAGES.construction.length;
        const url = BUILDING_IMAGES.construction[imgIdx];
        return {
          id: `${id}-img-${i}`,
          url,
          thumbnail: `${url}&w=200&h=150&fit=crop`,
          capturedAt: new Date(Date.now() - (i + 1) * 86400000),
          source: 'mobile' as const,
        };
      }),
      merged: [],
    },
    status,
    onp: Array.from({ length: 3 }, (_, i) => ({
      id: `${id}-onp-${i}`,
      message: `ONP notification ${i + 1} for ${id}: inspection update required.`,
      timestamp: new Date(Date.now() - i * 3600000 * 6),
      type: ONP_TYPES[i % ONP_TYPES.length],
      read: i > 0,
    })),
    recheck: {
      required: status === 'recheck',
      completed: false,
      items: RECHECK_ITEMS.map((label, i) => ({
        id: `${id}-recheck-${i}`,
        label,
        checked: i < 2,
      })),
    },
    schedule: {
      mode: 'auto',
      autoFlight: {
        enabled: true,
        intervalHours: DRONE_AUTO_INTERVAL_HOURS,
        nextFlightAt: new Date(),
      },
      droneMissions: [],
    },
  };
}

function createTower(projectIdx: number, phaseIdx: number, towerIdx: number): Tower {
  const id = `p${projectIdx}-ph${phaseIdx}-t${towerIdx}`;
  return {
    id,
    name: `Tower ${String.fromCharCode(65 + towerIdx)}`,
    phaseId: `p${projectIdx}-ph${phaseIdx}`,
    order: towerIdx + 1,
    levels: Array.from({ length: 3 }, (_, i) => createLevel(projectIdx, phaseIdx, towerIdx, i)),
  };
}

function createPhase(projectIdx: number, phaseIdx: number): Phase {
  const id = `p${projectIdx}-ph${phaseIdx}`;
  return {
    id,
    name: `Phase ${phaseIdx + 1}`,
    projectId: `project-${projectIdx}`,
    order: phaseIdx + 1,
    towers: Array.from({ length: 3 }, (_, i) => createTower(projectIdx, phaseIdx, i)),
  };
}

function createProject(idx: number, data: {
  name: string;
  description: string;
  location: string;
  status: 'planning' | 'under_construction' | 'completed';
  imageIndex: number;
}): Project {
  return {
    id: `project-${idx}`,
    name: data.name,
    description: data.description,
    image: BUILDING_IMAGES.projects[data.imageIndex % BUILDING_IMAGES.projects.length],
    location: data.location,
    status: data.status,
    createdAt: new Date(Date.now() - (idx + 1) * 30 * 86400000),
    phases: Array.from({ length: 3 }, (_, i) => createPhase(idx, i)),
  };
}

const PROJECTS_DATA = [
  { name: 'Skyline Residences', description: 'Premium residential development with 3 towers', location: 'Mumbai', status: 'under_construction' as const, imageIndex: 0 },
  { name: 'Harbor View Complex', description: 'Mixed-use waterfront commercial and residential project', location: 'Chennai', status: 'under_construction' as const, imageIndex: 1 },
  { name: 'Greenfield Towers', description: 'Sustainable eco-friendly tower complex', location: 'Bangalore', status: 'planning' as const, imageIndex: 2 },
  { name: 'Metro Heights', description: 'Urban high-rise with retail and office spaces', location: 'Delhi', status: 'planning' as const, imageIndex: 0 },
  { name: 'Lakefront Plaza', description: 'Completed luxury residential township', location: 'Pune', status: 'completed' as const, imageIndex: 1 },
  { name: 'Sunrise Enclave', description: 'Completed gated community with amenities', location: 'Hyderabad', status: 'completed' as const, imageIndex: 2 },
];

export const MOCK_PROJECTS: Project[] = PROJECTS_DATA.map((data, i) => createProject(i, data));

export const STATUS_LABELS: Record<LevelStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  approved: 'Approved',
  rejected: 'Rejected',
  recheck: 'Recheck',
};

export const STATUS_COLORS: Record<LevelStatus, string> = {
  pending: 'bg-yellow-500',
  in_progress: 'bg-primary-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500',
  recheck: 'bg-orange-500',
};

export const ONP_TYPE_COLORS: Record<ONPType, string> = {
  info: 'bg-primary-100 text-primary-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  success: 'bg-green-100 text-green-700',
};

export const DETAIL_TABS = [
  { id: 'autocad' as const, label: 'AutoCAD' },
  { id: 'images' as const, label: 'Images' },
  { id: 'onp' as const, label: 'ONP' },
  { id: 'status' as const, label: 'Status' },
  { id: 'recheck' as const, label: 'Recheck' },
  { id: 'schedule' as const, label: 'Schedule' },
];

export const API_DELAY = 600;

export const APP_VERSION = '1.0.0';

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  planning: 'Planning',
  under_construction: 'Under Construction',
  completed: 'Completed',
};

export const PROJECT_STATUS_FILTER_OPTIONS = [
  'All Status',
  'Planning',
  'Under Construction',
  'Completed',
] as const;
