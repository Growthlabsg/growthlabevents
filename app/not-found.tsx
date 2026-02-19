import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { HorizontalNav } from '@/components/layout/HorizontalNav';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <HorizontalNav />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-slate-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">Page Not Found</h2>
          <p className="text-slate-600 mb-8">The page you're looking for doesn't exist.</p>
          <Link href="/">
            <Button variant="primary">Go Home</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

