import type { CapturedImage, DroneMission, Level, Phase, Project, Tower } from '../types/project.types';
import {
  BUILDING_IMAGES,
  DRONE_AUTO_INTERVAL_HOURS,
  DRONE_FLIGHT_DURATION_MS,
  MOCK_PROJECTS,
} from '../utils/constants';
import { getAutocadFloorPlanImage } from '../utils/autocad';
import { delay } from './client';

let projectsStore = structuredClone(MOCK_PROJECTS);

function findLevel(levelId: string): Level | undefined {
  for (const project of projectsStore) {
    for (const phase of project.phases) {
      for (const tower of phase.towers) {
        const level = tower.levels.find((l) => l.id === levelId);
        if (level) return level;
      }
    }
  }
  return undefined;
}

function captureDronePhotos(level: Level, mission: DroneMission): string[] {
  const capturedIds: string[] = [];
  const dronePhotos = BUILDING_IMAGES.drone.slice(0, 2);

  dronePhotos.forEach((url, i) => {
    const imgId = `drone-${mission.id}-${Date.now()}-${i}`;
    const captured: CapturedImage = {
      id: imgId,
      url,
      thumbnail: `${url}&w=200&h=150&fit=crop`,
      capturedAt: new Date(),
      source: 'drone',
    };
    level.images.captured.unshift(captured);
    capturedIds.push(imgId);
  });

  mission.capturedImageIds = capturedIds;
  mission.returnedAt = new Date();
  mission.status = 'completed';

  return capturedIds;
}

function scheduleNextAutoFlight(level: Level) {
  const hours = level.schedule.autoFlight?.intervalHours ?? DRONE_AUTO_INTERVAL_HOURS;
  level.schedule.autoFlight.lastFlightAt = new Date();
  level.schedule.autoFlight.nextFlightAt = new Date(Date.now() + hours * 3600000);
}

async function mergeImagesOnCanvas(imageUrls: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const images: HTMLImageElement[] = [];
    let loaded = 0;

    imageUrls.forEach((url, i) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        images[i] = img;
        loaded++;
        if (loaded === imageUrls.length) {
          const width = 400 * imageUrls.length;
          const height = 300;
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas not supported'));
            return;
          }
          ctx.fillStyle = '#f3f4f6';
          ctx.fillRect(0, 0, width, height);
          images.forEach((image, idx) => {
            ctx.drawImage(image, idx * 400, 0, 400, 300);
          });
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = url;
    });
  });
}

export const projectApi = {
  async getProjects(): Promise<Project[]> {
    await delay();
    return structuredClone(projectsStore);
  },

  async getProjectById(id: string): Promise<Project | undefined> {
    await delay();
    const project = projectsStore.find((p) => p.id === id);
    return project ? structuredClone(project) : undefined;
  },

  async getPhases(projectId: string): Promise<Phase[]> {
    await delay();
    const project = projectsStore.find((p) => p.id === projectId);
    return project ? structuredClone(project.phases) : [];
  },

  async getTowers(phaseId: string): Promise<Tower[]> {
    await delay();
    for (const project of projectsStore) {
      const phase = project.phases.find((p) => p.id === phaseId);
      if (phase) return structuredClone(phase.towers);
    }
    return [];
  },

  async getLevels(towerId: string): Promise<Level[]> {
    await delay();
    for (const project of projectsStore) {
      for (const phase of project.phases) {
        const tower = phase.towers.find((t) => t.id === towerId);
        if (tower) return structuredClone(tower.levels);
      }
    }
    return [];
  },

  async getLevelDetails(levelId: string): Promise<Level | undefined> {
    await delay();
    const level = findLevel(levelId);
    return level ? structuredClone(level) : undefined;
  },

  async uploadAutocad(
    levelId: string,
    fileDataUrl: string,
    fileName: string,
    label?: string
  ): Promise<Level> {
    await delay();
    const level = findLevel(levelId);
    if (!level) throw new Error('Level not found');

    const lowerName = fileName.toLowerCase();
    if (!lowerName.endsWith('.dwg') && !lowerName.endsWith('.dxf')) {
      throw new Error('Only DWG and DXF files are supported');
    }

    const fileType = lowerName.endsWith('.dxf') ? 'dxf' : 'dwg';
    const previewUrl = getAutocadFloorPlanImage(level.images.autocadDrawings.length);

    level.images.autocadDrawings.push({
      id: `cad-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      url: previewUrl,
      fileDataUrl,
      fileName,
      fileType,
      label: label || fileName.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
      uploadedAt: new Date(),
    });
    return structuredClone(level);
  },

  async deleteAutocadDrawing(levelId: string, drawingId: string): Promise<Level> {
    await delay(300);
    const level = findLevel(levelId);
    if (!level) throw new Error('Level not found');
    level.images.autocadDrawings = level.images.autocadDrawings.filter((d) => d.id !== drawingId);
    return structuredClone(level);
  },

  async mergeImages(levelId: string, imageIds: string[]): Promise<Level> {
    await delay(800);
    const level = findLevel(levelId);
    if (!level) throw new Error('Level not found');
    if (imageIds.length < 2) throw new Error('Select at least 2 images to merge');

    const selected = level.images.captured.filter((img) => imageIds.includes(img.id));
    if (selected.length < 2) throw new Error('Invalid image selection');

    const mergedUrl = await mergeImagesOnCanvas(selected.map((s) => s.url));
    const mergedId = `merged-${Date.now()}`;

    level.images.merged.push({
      id: mergedId,
      url: mergedUrl,
      thumbnail: mergedUrl,
      sourceIds: imageIds,
      createdAt: new Date(),
    });

    level.images.captured.push({
      id: mergedId,
      url: mergedUrl,
      thumbnail: mergedUrl,
      capturedAt: new Date(),
      source: 'merged',
    });

    return structuredClone(level);
  },

  async mergeDroneMissionImages(levelId: string, missionId: string): Promise<Level> {
    await delay(800);
    const level = findLevel(levelId);
    if (!level) throw new Error('Level not found');

    const mission = level.schedule.droneMissions.find((m) => m.id === missionId);
    if (!mission) throw new Error('Mission not found');
    if (mission.status !== 'completed') throw new Error('Mission is not completed');
    if (mission.mergedImageId) throw new Error('Photos already merged');
    if (!mission.capturedImageIds || mission.capturedImageIds.length < 2) {
      throw new Error('Not enough drone photos to merge');
    }

    const selected = level.images.captured.filter((img) =>
      mission.capturedImageIds!.includes(img.id)
    );
    if (selected.length < 2) throw new Error('Drone photos not found in image gallery');

    const mergedUrl = await mergeImagesOnCanvas(selected.map((s) => s.url));
    const mergedId = `merged-${Date.now()}`;

    level.images.merged.push({
      id: mergedId,
      url: mergedUrl,
      thumbnail: mergedUrl,
      sourceIds: mission.capturedImageIds,
      createdAt: new Date(),
    });

    level.images.captured.push({
      id: mergedId,
      url: mergedUrl,
      thumbnail: mergedUrl,
      capturedAt: new Date(),
      source: 'merged',
    });

    mission.mergedImageId = mergedId;

    return structuredClone(level);
  },

  async updateLevelStatus(levelId: string, status: Level['status']): Promise<Level> {
    await delay();
    const level = findLevel(levelId);
    if (!level) throw new Error('Level not found');
    level.status = status;
    return structuredClone(level);
  },

  async updateLevelRecheck(
    levelId: string,
    data: Partial<Level['recheck']>
  ): Promise<Level> {
    await delay();
    const level = findLevel(levelId);
    if (!level) throw new Error('Level not found');
    level.recheck = { ...level.recheck, ...data };
    level.recheck.completed = level.recheck.items.every((item) => item.checked);
    return structuredClone(level);
  },

  async markOnpRead(levelId: string, onpId: string): Promise<Level> {
    await delay(300);
    const level = findLevel(levelId);
    if (!level) throw new Error('Level not found');
    const onp = level.onp.find((n) => n.id === onpId);
    if (onp) onp.read = true;
    return structuredClone(level);
  },

  async scheduleDrone(levelId: string, scheduledAt: Date): Promise<Level> {
    await delay();
    const level = findLevel(levelId);
    if (!level) throw new Error('Level not found');
    level.schedule.droneMissions.unshift({
      id: `drone-${Date.now()}`,
      scheduledAt,
      status: 'scheduled',
      type: 'custom',
    });
    level.schedule.mode = 'custom';
    return structuredClone(level);
  },

  async processAutoDroneFlight(levelId: string): Promise<Level> {
    const level = findLevel(levelId);
    if (!level) throw new Error('Level not found');

    const autoFlight = level.schedule.autoFlight;
    if (!autoFlight?.enabled) return structuredClone(level);

    const flyingMission = level.schedule.droneMissions.find(
      (m) => m.type === 'auto' && m.status === 'in_progress'
    );

    if (flyingMission?.startedAt) {
      const elapsed = Date.now() - new Date(flyingMission.startedAt).getTime();
      if (elapsed >= DRONE_FLIGHT_DURATION_MS) {
        captureDronePhotos(level, flyingMission);
        scheduleNextAutoFlight(level);
      }
      return structuredClone(level);
    }

    const now = new Date();
    if (now < new Date(autoFlight.nextFlightAt)) {
      return structuredClone(level);
    }

    level.schedule.droneMissions.unshift({
      id: `drone-auto-${Date.now()}`,
      scheduledAt: now,
      startedAt: now,
      status: 'in_progress',
      type: 'auto',
    });

    return structuredClone(level);
  },

  async dispatchDrone(levelId: string, missionId: string): Promise<Level> {
    await delay(1200);
    const level = findLevel(levelId);
    if (!level) throw new Error('Level not found');
    const mission = level.schedule.droneMissions.find((m) => m.id === missionId);
    if (!mission) throw new Error('Mission not found');
    if (mission.status !== 'scheduled') throw new Error('Mission cannot be dispatched');
    if (mission.type === 'auto') throw new Error('Auto flights dispatch automatically');

    mission.status = 'in_progress';
    mission.startedAt = new Date();
    await delay(1500);

    captureDronePhotos(level, mission);

    return structuredClone(level);
  },

  async cancelDroneMission(levelId: string, missionId: string): Promise<Level> {
    await delay(300);
    const level = findLevel(levelId);
    if (!level) throw new Error('Level not found');
    const mission = level.schedule.droneMissions.find((m) => m.id === missionId);
    if (mission) mission.status = 'cancelled';
    return structuredClone(level);
  },
};
