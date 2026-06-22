import autocadFloorPlan1 from '../assets/autocad-floor-plan.png';
import autocadFloorPlan2 from '../assets/autocad-floor-plan-2.png';
import autocadFloorPlan3 from '../assets/autocad-floor-plan-3.png';

/** Technical AutoCAD-style floor plan previews — one unique image per drawing slot. */
export const AUTOCAD_FLOOR_PLAN_IMAGES = [
  autocadFloorPlan1,
  autocadFloorPlan2,
  autocadFloorPlan3,
];

export function getAutocadFloorPlanImage(index = 0): string {
  return AUTOCAD_FLOOR_PLAN_IMAGES[index % AUTOCAD_FLOOR_PLAN_IMAGES.length];
}
