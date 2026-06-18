import { API_DELAY } from '../utils/constants';

export function delay(ms: number = API_DELAY): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number = 400
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
