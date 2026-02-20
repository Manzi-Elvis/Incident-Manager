'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/context/theme-context';
import { useAuth } from '@/lib/context/auth-context';
import { useRouter } from 'next/navigation';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="fixed bottom-8 right-8 flex gap-3 items-center z-50">
      <button
        onClick={toggleTheme}
        className="p-2.5 rounded-lg bg-card hover:bg-secondary border border-border transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-amber-400" />
        ) : (
          <Moon className="w-5 h-5 text-slate-600" />
        )}
      </button>

      <button
        onClick={handleLogout}
        className="px-4 py-2.5 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors text-sm font-medium"
      >
        Logout
      </button>
    </div>
  );
}
