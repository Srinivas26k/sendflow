import { Mail } from 'lucide-react';

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary p-2 rounded-lg">
            <Mail className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">SendFlow</h1>
        </div>
        <p className="text-muted-foreground">
          Professional email campaigns powered by Resend
        </p>
      </div>
    </header>
  );
}
