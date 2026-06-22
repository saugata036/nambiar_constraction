import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export function NotFoundPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center overflow-y-auto bg-background p-4 text-center">
      <h1 className="text-6xl font-bold text-primary-500">404</h1>
      <p className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Page not found</p>
      <p className="mt-2 text-gray-500">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="mt-6">
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
}
