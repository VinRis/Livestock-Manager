
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4 text-center">
      <h1 className="text-4xl font-bold">404 - Not Found</h1>
      <p className="text-muted-foreground">
        The livestock you are looking for does not exist.
      </p>
      <Button asChild>
        <Link href="/livestock">Return to Livestock List</Link>
      </Button>
    </div>
  );
}

    