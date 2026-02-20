'use client';

import { useAuth, UserRole } from '@/lib/context/auth-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, Shield } from 'lucide-react';

const DEMO_USERS: Record<UserRole, { name: string; email: string; avatar: string }> = {
  admin: {
    name: 'Sarah Chen',
    email: 'sarah.chen@enterprise.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  engineer: {
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@enterprise.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  },
  client: {
    name: 'Morgan Blake',
    email: 'morgan.blake@client.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan',
  },
};

export function RoleSwitcher() {
  const { user, role, setUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleRoleSwitch = (newRole: UserRole) => {
    const userData = DEMO_USERS[newRole];
    setUser({
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name,
      email: userData.email,
      role: newRole,
      team_id: '1',
      avatar_url: userData.avatar,
    });
    setIsOpen(false);
    router.refresh();
  };

  if (!user || !role) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
        >
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium capitalize">{role}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>

        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-56 rounded-lg border border-border bg-card shadow-lg">
            <div className="p-2 space-y-1">
              {(Object.keys(DEMO_USERS) as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleSwitch(r)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                    role === r
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'hover:bg-card-foreground/10 text-foreground'
                  }`}
                >
                  <div className="font-medium capitalize">{r}</div>
                  <div className="text-xs text-muted-foreground">
                    {DEMO_USERS[r].name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
