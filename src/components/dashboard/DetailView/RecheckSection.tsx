import { useState } from 'react';
import toast from 'react-hot-toast';
import { useUpdateLevelRecheck } from '../../../hooks/useProject';
import type { Level } from '../../../types/project.types';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';

interface RecheckSectionProps {
  level: Level;
}

export function RecheckSection({ level }: RecheckSectionProps) {
  const [required, setRequired] = useState(level.recheck.required);
  const [items, setItems] = useState(level.recheck.items);
  const [notes, setNotes] = useState('');
  const updateRecheck = useUpdateLevelRecheck(level.id);

  const completedCount = items.filter((i) => i.checked).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleSave = async () => {
    await updateRecheck.mutateAsync({ required, items });
    toast.success('Recheck settings saved');
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Recheck Required</h3>
            <p className="text-sm text-gray-500">Toggle if this level needs rechecking</p>
          </div>
          <button
            onClick={() => setRequired(!required)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              required ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                required ? 'translate-x-5' : ''
              }`}
            />
          </button>
        </div>

        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {completedCount}/{items.length} completed
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-primary-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mb-6 space-y-3">
          {items.map((item) => (
            <label
              key={item.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleItem(item.id)}
                className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <span
                className={`text-sm ${item.checked ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300'}`}
              >
                {item.label}
              </span>
            </label>
          ))}
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Add notes about the recheck..."
            className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <Button onClick={handleSave} isLoading={updateRecheck.isPending}>
          Save Changes
        </Button>
      </Card>
    </div>
  );
}
