import type { User } from '../types/auth.types';

export function canCustomSchedule(user: User | null): boolean {
  if (!user) return false;
  return user.role === 'admin' || user.permissions?.includes('custom_scheduler') === true;
}
