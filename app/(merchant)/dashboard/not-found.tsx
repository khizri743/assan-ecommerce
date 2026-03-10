import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function DashboardNotFound() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <div className="bg-orange-100 p-4 rounded-full mb-4">
        <AlertTriangle className="h-10 w-10 text-orange-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
      <p className="text-gray-500 mt-2 max-w-sm">
        The module you are looking for hasn't been built yet or doesn't exist.
      </p>
      <Link 
        href="/dashboard" 
        className="mt-6 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}