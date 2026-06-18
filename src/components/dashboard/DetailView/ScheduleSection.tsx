import { useEffect, useRef, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CalendarClock, Merge, Plane } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../hooks/useAuth';
import {
  useCancelDroneMission,
  useDispatchDrone,
  useMergeDroneMissionImages,
  useProcessAutoDroneFlight,
  useScheduleDrone,
} from '../../../hooks/useProject';
import type { Level } from '../../../types/project.types';
import { DRONE_AUTO_INTERVAL_HOURS } from '../../../utils/constants';
import { canCustomSchedule } from '../../../utils/permissions';
import { Badge } from '../../common/Badge';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';
import { Modal } from '../../common/Modal';

interface ScheduleSectionProps {
  level: Level;
  onPhotosCaptured?: () => void;
}

function Countdown({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const update = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('Departing soon');
        return;
      }
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return <span className="font-mono text-sm text-primary-600">{timeLeft}</span>;
}

export function ScheduleSection({ level, onPhotosCaptured }: ScheduleSectionProps) {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [time, setTime] = useState('10:00');
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [mergingMissionId, setMergingMissionId] = useState<string | null>(null);
  const [showCustomScheduler, setShowCustomScheduler] = useState(false);
  const lastCompletedMissionId = useRef<string | null>(null);

  const scheduleDrone = useScheduleDrone(level.id);
  const dispatchDrone = useDispatchDrone(level.id);
  const cancelMission = useCancelDroneMission(level.id);
  const mergeDroneMission = useMergeDroneMissionImages(level.id);
  const processAutoDrone = useProcessAutoDroneFlight(level.id);

  const hasCustomSchedulePermission = canCustomSchedule(user);
  const autoFlight = level.schedule.autoFlight;
  const intervalHours = autoFlight?.intervalHours ?? DRONE_AUTO_INTERVAL_HOURS;

  const activeAutoFlight = level.schedule.droneMissions.find(
    (m) => m.type === 'auto' && m.status === 'in_progress'
  );

  const readyToMergeMissions = level.schedule.droneMissions.filter(
    (m) =>
      m.status === 'completed' &&
      m.returnedAt &&
      m.capturedImageIds &&
      m.capturedImageIds.length >= 2 &&
      !m.mergedImageId
  );

  const customMissions = level.schedule.droneMissions.filter((m) => m.type === 'custom');

  useEffect(() => {
    if (!autoFlight?.enabled) return;

    const runAutoFlight = () => {
      processAutoDrone.mutate();
    };

    runAutoFlight();
    const interval = setInterval(runAutoFlight, 3000);
    return () => clearInterval(interval);
  }, [level.id, autoFlight?.enabled]);

  useEffect(() => {
    const latestCompleted = readyToMergeMissions[0];
    if (!latestCompleted) return;

    if (lastCompletedMissionId.current !== latestCompleted.id) {
      lastCompletedMissionId.current = latestCompleted.id;
      toast.success('Drone returned with site photos. Merge them into the Images tab.');
    }
  }, [readyToMergeMissions]);

  const handleSchedule = async () => {
    const [hours, minutes] = time.split(':').map(Number);
    const scheduledAt = new Date(selectedDate);
    scheduledAt.setHours(hours, minutes, 0, 0);

    if (scheduledAt <= new Date()) {
      toast.error('Please select a future date and time');
      return;
    }

    await scheduleDrone.mutateAsync(scheduledAt);
    toast.success('Custom drone flight scheduled!');
    setShowCustomScheduler(false);
  };

  const handleDispatch = async (missionId: string) => {
    await dispatchDrone.mutateAsync(missionId);
    toast.success('Drone flight complete! Photos added to Images tab.');
    onPhotosCaptured?.();
  };

  const handleCancel = async () => {
    if (!cancelId) return;
    await cancelMission.mutateAsync(cancelId);
    setCancelId(null);
    toast.success('Mission cancelled');
  };

  const handleMergeMission = async (missionId: string) => {
    setMergingMissionId(missionId);
    try {
      await mergeDroneMission.mutateAsync(missionId);
      toast.success('Drone photos merged! View in Images tab.');
      onPhotosCaptured?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to merge photos');
    } finally {
      setMergingMissionId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary-200 bg-primary-50/50">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Plane className="h-5 w-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">Automatic Drone Surveillance</h3>
            </div>
            <p className="text-sm text-gray-600">
              Drone flies automatically every {intervalHours} hours, captures construction site
              photos, and returns. After return, merge photos into the Images section.
            </p>
          </div>
          {hasCustomSchedulePermission && (
            <Button
              variant={showCustomScheduler ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setShowCustomScheduler((open) => !open)}
            >
              <CalendarClock className="h-4 w-4" />
              {showCustomScheduler ? 'Hide Custom Scheduler' : 'Custom Scheduler'}
            </Button>
          )}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-primary-100 bg-white p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Status</p>
            {activeAutoFlight ? (
              <p className="mt-1 text-sm font-medium text-primary-700">
                In flight — capturing site photos...
              </p>
            ) : readyToMergeMissions.length > 0 ? (
              <p className="mt-1 text-sm font-medium text-green-700">
                Returned — photos ready to merge
              </p>
            ) : (
              <p className="mt-1 text-sm font-medium text-gray-700">Idle — awaiting next flight</p>
            )}
          </div>
          <div className="rounded-lg border border-primary-100 bg-white p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Next auto flight
            </p>
            {activeAutoFlight ? (
              <p className="mt-1 text-sm text-gray-600">Drone currently airborne</p>
            ) : autoFlight?.nextFlightAt ? (
              <div className="mt-1">
                <Countdown targetDate={autoFlight.nextFlightAt} />
              </div>
            ) : (
              <p className="mt-1 text-sm text-gray-600">Scheduling...</p>
            )}
          </div>
        </div>

        {readyToMergeMissions.length > 0 && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="mb-3 text-sm text-green-800">
              Drone has returned with {readyToMergeMissions[0].capturedImageIds?.length} site
              photos. Merge them into the Images section.
            </p>
            <Button
              size="sm"
              onClick={() => handleMergeMission(readyToMergeMissions[0].id)}
              isLoading={mergingMissionId === readyToMergeMissions[0].id}
            >
              <Merge className="h-4 w-4" />
              Merge Drone Images to Image Section
            </Button>
          </div>
        )}
      </Card>

      {hasCustomSchedulePermission && showCustomScheduler && (
        <Card>
          <h3 className="mb-1 font-semibold text-gray-900">Custom Drone Scheduler</h3>
          <p className="mb-4 text-sm text-gray-500">
            Plan a one-time aerial survey outside the automatic {intervalHours}-hour schedule
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <Calendar
                onChange={(date) => setSelectedDate(date as Date)}
                value={selectedDate}
                minDate={new Date()}
              />
            </div>
            <div className="flex flex-col justify-end">
              <label className="mb-2 block text-sm font-medium text-gray-700">Flight Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mb-4 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              <Button onClick={handleSchedule} isLoading={scheduleDrone.isPending}>
                Schedule Custom Flight
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <h3 className="mb-4 font-semibold text-gray-900">Flight History</h3>
        <div className="space-y-3">
          {level.schedule.droneMissions.length === 0 && customMissions.length === 0 && (
            <p className="py-4 text-center text-sm text-gray-500">
              No flights yet. Auto surveillance will begin shortly.
            </p>
          )}
          {level.schedule.droneMissions.map((mission) => (
            <div
              key={mission.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 p-3"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(mission.scheduledAt).toLocaleString()}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      mission.type === 'auto'
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {mission.type}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge status={mission.status} />
                  {mission.returnedAt && (
                    <span className="text-xs text-gray-500">
                      Returned {new Date(mission.returnedAt).toLocaleString()}
                    </span>
                  )}
                </div>
                {mission.capturedImageIds && mission.capturedImageIds.length > 0 && (
                  <p className="mt-1 text-xs text-green-600">
                    {mission.capturedImageIds.length} photos captured
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {mission.type === 'custom' && mission.status === 'scheduled' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleDispatch(mission.id)}
                      isLoading={dispatchDrone.isPending}
                    >
                      Fly Now
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCancelId(mission.id)}>
                      Cancel
                    </Button>
                  </>
                )}
                {mission.status === 'in_progress' && (
                  <span className="text-sm text-primary-600">Flying...</span>
                )}
                {mission.status === 'completed' &&
                  mission.returnedAt &&
                  mission.capturedImageIds &&
                  mission.capturedImageIds.length >= 2 &&
                  (mission.mergedImageId ? (
                    <span className="text-sm font-medium text-green-600">Merged in Images</span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleMergeMission(mission.id)}
                      isLoading={mergingMissionId === mission.id}
                    >
                      <Merge className="h-4 w-4" />
                      Merge Photos
                    </Button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        title="Cancel Flight"
        confirmLabel="Cancel Flight"
        onConfirm={handleCancel}
        isLoading={cancelMission.isPending}
      >
        <p>Are you sure you want to cancel this custom drone flight?</p>
      </Modal>
    </div>
  );
}
