export type ProjectStatus = 'planning' | 'under_construction' | 'completed';

export interface Project {
  id: string;
  name: string;
  description?: string;
  image?: string;
  location?: string;
  status: ProjectStatus;
  createdAt: Date;
  phases: Phase[];
}

export interface Phase {
  id: string;
  name: string;
  projectId: string;
  order: number;
  towers: Tower[];
}

export interface Tower {
  id: string;
  name: string;
  phaseId: string;
  order: number;
  levels: Level[];
}

export type LevelStatus = 'pending' | 'in_progress' | 'approved' | 'rejected' | 'recheck';

export type ONPType = 'info' | 'warning' | 'error' | 'success';

export type ImageSource = 'mobile' | 'drone' | 'merged';

export interface CapturedImage {
  id: string;
  url: string;
  thumbnail: string;
  capturedAt: Date;
  source: ImageSource;
}

export interface MergedImage {
  id: string;
  url: string;
  thumbnail: string;
  sourceIds: string[];
  createdAt: Date;
}

export interface DroneMission {
  id: string;
  scheduledAt: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  type: 'auto' | 'custom';
  startedAt?: Date;
  returnedAt?: Date;
  capturedImageIds?: string[];
  mergedImageId?: string;
}

export interface AutoFlightSchedule {
  enabled: boolean;
  intervalHours: number;
  nextFlightAt: Date;
  lastFlightAt?: Date;
}

export interface AutocadDrawing {
  id: string;
  url: string;
  fileDataUrl?: string;
  fileName: string;
  label: string;
  fileType: 'dwg' | 'dxf';
  uploadedAt: Date;
}

export interface Level {
  id: string;
  name: string;
  towerId: string;
  order: number;
  images: {
    autocadDrawings: AutocadDrawing[];
    captured: CapturedImage[];
    merged: MergedImage[];
  };
  status: LevelStatus;
  onp: Array<{ id: string; message: string; timestamp: Date; type: ONPType; read: boolean }>;
  recheck: {
    required: boolean;
    completed: boolean;
    items: Array<{ id: string; label: string; checked: boolean }>;
  };
  schedule: {
    mode: 'auto' | 'custom';
    autoFlight: AutoFlightSchedule;
    droneMissions: DroneMission[];
  };
}
