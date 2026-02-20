'use client';

import { useAuth, type UserRole } from '@/lib/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useRoleGuard(requiredRoles: UserRole[]) {
  const { role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!role || !requiredRoles.includes(role))) {
      router.push('/');
    }
  }, [role, loading, requiredRoles, router]);

  return { isAuthorized: role ? requiredRoles.includes(role) : false, loading };
}
