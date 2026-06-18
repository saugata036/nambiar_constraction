import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '../api/project.api';
import type { Level } from '../types/project.types';

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: projectApi.getProjects,
  });
}

export function useProject(projectId: string | null) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectApi.getProjectById(projectId!),
    enabled: !!projectId,
  });
}

export function usePhases(projectId: string | null) {
  return useQuery({
    queryKey: ['phases', projectId],
    queryFn: () => projectApi.getPhases(projectId!),
    enabled: !!projectId,
  });
}

export function useTowers(phaseId: string | null) {
  return useQuery({
    queryKey: ['towers', phaseId],
    queryFn: () => projectApi.getTowers(phaseId!),
    enabled: !!phaseId,
  });
}

export function useLevels(towerId: string | null) {
  return useQuery({
    queryKey: ['levels', towerId],
    queryFn: () => projectApi.getLevels(towerId!),
    enabled: !!towerId,
  });
}

export function useLevelDetails(levelId: string | null) {
  return useQuery({
    queryKey: ['level', levelId],
    queryFn: () => projectApi.getLevelDetails(levelId!),
    enabled: !!levelId,
  });
}

export function useUploadAutocad(levelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      fileDataUrl,
      fileName,
      label,
    }: {
      fileDataUrl: string;
      fileName: string;
      label?: string;
    }) => projectApi.uploadAutocad(levelId, fileDataUrl, fileName, label),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['level', levelId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useDeleteAutocadDrawing(levelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (drawingId: string) => projectApi.deleteAutocadDrawing(levelId, drawingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['level', levelId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useMergeImages(levelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (imageIds: string[]) => projectApi.mergeImages(levelId, imageIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['level', levelId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useMergeDroneMissionImages(levelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (missionId: string) => projectApi.mergeDroneMissionImages(levelId, missionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['level', levelId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateLevelStatus(levelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: Level['status']) => projectApi.updateLevelStatus(levelId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['level', levelId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateLevelRecheck(levelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Level['recheck']>) =>
      projectApi.updateLevelRecheck(levelId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['level', levelId] });
    },
  });
}

export function useMarkOnpRead(levelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (onpId: string) => projectApi.markOnpRead(levelId, onpId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['level', levelId] });
    },
  });
}

export function useProcessAutoDroneFlight(levelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => projectApi.processAutoDroneFlight(levelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['level', levelId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useScheduleDrone(levelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (scheduledAt: Date) => projectApi.scheduleDrone(levelId, scheduledAt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['level', levelId] });
    },
  });
}

export function useDispatchDrone(levelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (missionId: string) => projectApi.dispatchDrone(levelId, missionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['level', levelId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useCancelDroneMission(levelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (missionId: string) => projectApi.cancelDroneMission(levelId, missionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['level', levelId] });
    },
  });
}
