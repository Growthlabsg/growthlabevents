'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Something went wrong!
        </h2>
        <button
          onClick={reset}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

