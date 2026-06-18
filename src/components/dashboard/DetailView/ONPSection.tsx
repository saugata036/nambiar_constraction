import { useState } from 'react';
import toast from 'react-hot-toast';
import { useMarkOnpRead } from '../../../hooks/useProject';
import type { Level, ONPType } from '../../../types/project.types';
import { ONP_TYPE_COLORS } from '../../../utils/constants';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';

interface ONPSectionProps {
  level: Level;
}

const filterOptions: Array<ONPType | 'all'> = ['all', 'info', 'warning', 'error', 'success'];

export function ONPSection({ level }: ONPSectionProps) {
  const [filter, setFilter] = useState<ONPType | 'all'>('all');
  const markRead = useMarkOnpRead(level.id);

  const filtered = level.onp.filter((n) => filter === 'all' || n.type === filter);
  const unreadCount = level.onp.filter((n) => !n.read).length;

  const handleMarkRead = async (onpId: string) => {
    await markRead.mutateAsync(onpId);
    toast.success('Marked as read');
  };

  const handleMarkAllRead = async () => {
    const unread = level.onp.filter((n) => !n.read);
    for (const n of unread) {
      await markRead.mutateAsync(n.id);
    }
    toast.success('All notifications marked as read');
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            ONP Notifications
          </h3>
          <p className="text-sm text-gray-500">{unreadCount} unread</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                filter === f
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {unreadCount > 0 && (
        <div className="mb-4">
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            Mark all as read
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((notification) => (
          <Card
            key={notification.id}
            className={`!p-4 ${!notification.read ? 'border-l-4 border-l-primary-500' : ''}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${ONP_TYPE_COLORS[notification.type]}`}
                  >
                    {notification.type}
                  </span>
                  {!notification.read && (
                    <span className="h-2 w-2 rounded-full bg-primary-500" />
                  )}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {notification.message}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {new Date(notification.timestamp).toLocaleString()}
                </p>
              </div>
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMarkRead(notification.id)}
                  isLoading={markRead.isPending}
                >
                  Mark read
                </Button>
              )}
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-gray-500">No notifications found</p>
        )}
      </div>
    </div>
  );
}
