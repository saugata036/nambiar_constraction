import { useState } from 'react';
import toast from 'react-hot-toast';
import { useUpdateLevelStatus } from '../../../hooks/useProject';
import type { Level, LevelStatus } from '../../../types/project.types';
import { STATUS_COLORS, STATUS_LABELS } from '../../../utils/constants';
import { Badge } from '../../common/Badge';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';

interface StatusSectionProps {
  level: Level;
}

const statusOptions: LevelStatus[] = [
  'pending',
  'in_progress',
  'approved',
  'rejected',
  'recheck',
];

export function StatusSection({ level }: StatusSectionProps) {
  const [status, setStatus] = useState<LevelStatus>(level.status);
  const [comment, setComment] = useState('');
  const updateStatus = useUpdateLevelStatus(level.id);

  const handleUpdate = async () => {
    await updateStatus.mutateAsync(status);
    toast.success('Status updated successfully');
  };

  const handleApprove = async () => {
    setStatus('approved');
    await updateStatus.mutateAsync('approved');
    toast.success('Level approved');
  };

  const handleReject = async () => {
    setStatus('rejected');
    await updateStatus.mutateAsync('rejected');
    toast.error('Level rejected');
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">Current Status</h3>
          <Badge status={level.status} />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Update Status
          </label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setStatus(opt)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-all ${
                  STATUS_COLORS[opt]
                } ${status === opt ? 'ring-2 ring-offset-2 ring-gray-400' : 'opacity-70 hover:opacity-100'}`}
              >
                {STATUS_LABELS[opt]}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Comments
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Add a comment about this status change..."
            className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleUpdate} isLoading={updateStatus.isPending}>
            Update Status
          </Button>
          <Button variant="secondary" onClick={handleApprove} isLoading={updateStatus.isPending}>
            Approve
          </Button>
          <Button variant="danger" onClick={handleReject} isLoading={updateStatus.isPending}>
            Reject
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Status Timeline</h3>
        <div className="space-y-4">
          {statusOptions.slice(0, 3).map((s, i) => (
            <div key={s} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`h-3 w-3 rounded-full ${STATUS_COLORS[s]}`} />
                {i < 2 && <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700" />}
              </div>
              <div className="pb-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {STATUS_LABELS[s]}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
