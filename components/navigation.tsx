'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { useTheme } from '@/lib/context/theme-context';
import {
  AlertTriangle,
  BarChart3,
  FileText,
  LogOut,
  Menu,
  Settings,
  Zap,
  Moon,
  Sun,
} from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  const navItems = [
    {
      href: '/',
      label: 'Incidents',
      icon: AlertTriangle,
      roles: ['admin', 'engineer', 'client'] as const,
    },
    {
      href: '/analytics',
      label: 'Analytics',
      icon: BarChart3,
      roles: ['admin', 'engineer'] as const,
    },
    {
      href: '/logs',
      label: 'Logs',
      icon: FileText,
      roles: ['admin', 'engineer'] as const,
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: Settings,
      roles: ['admin'] as const,
    },
  ];

  const filteredNav = navItems.filter((item) =>
    item.roles.includes(role || 'client')
  );

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="sticky top-0 z-50 hidden md:flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">IncidentAI</span>
          </Link>

          <div className="flex items-center gap-1">
            {filteredNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-card'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-3 px-3 py-2">
              {user.avatar_url && (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div>
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground capitalize">
                  {role}
                </div>
              </div>
            </div>
          )}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden sticky top-0 z-50 h-16 border-b border-border bg-card/80 backdrop-blur-sm px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold">IncidentAI</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-card transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-card border-b border-border">
            <div className="p-4 space-y-2">
              {filteredNav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
              <hr className="my-2 border-border" />
              {user && (
                <div className="px-3 py-2">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {role}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
