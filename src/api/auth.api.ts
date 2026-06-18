import type { LoginCredentials, User } from '../types/auth.types';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, MOCK_PASSWORD, MOCK_USER } from '../utils/constants';
import { delay } from './client';

export interface LoginResponse {
  user: User;
  token: string;
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    await delay();

    if (
      credentials.email === MOCK_USER.email &&
      credentials.password === MOCK_PASSWORD
    ) {
      const token = `mock-jwt-token-${Date.now()}`;
      return { user: MOCK_USER, token };
    }

    throw new Error('Invalid email or password');
  },

  async logout(): Promise<void> {
    await delay(300);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(400);
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userStr = localStorage.getItem(AUTH_USER_KEY);
    if (!token || !userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },
};
