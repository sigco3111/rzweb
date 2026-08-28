import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold">페이지를 찾을 수 없습니다</h2>
        </div>
        <p className="text-muted-foreground">
          요청하신 경로를 찾을 수 없습니다.
          <br />
          <code className="mt-2 inline-block rounded bg-card px-2 py-1 text-sm">
            {location.pathname}
          </code>
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              홈으로
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            뒤로
          </Button>
        </div>
      </div>
    </div>
  );
}