# Quick Start: Authentication & Theme

Get up and running in 5 minutes.

## 1. Configure Supabase (2 minutes)

### Get Your Credentials
1. Go to https://supabase.com and sign in
2. Find your project
3. Click Settings → API → Copy these:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `Anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Create .env.local
In your project root, create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 2. Run Database Setup (1 minute)

### Copy Migration SQL
1. Go to Supabase Dashboard → SQL Editor
2. Create new query
3. Copy all from `scripts/01_init_incident_db.sql`
4. Paste and click Run
5. Do same for `scripts/02_seed_demo_data.sql`

### Done!
Tables and demo data are now in your database.

## 3. Start App (1 minute)

```bash
pnpm install  # If not done yet
pnpm dev
```

Open http://localhost:3000

## 4. Test Everything (1 minute)

### Test Landing Page
- You see the landing page (not authenticated)
- Click "Get Started" → Signup page
- Click "Sign In" → Login page

### Test Signup
- Create new account with email/password
- Should auto-login and show dashboard

### Test Login
- Click logout button
- Go to `/auth/login`
- Use: `demo@example.com` / `demo123456`
- Should login and show dashboard

### Test Theme Toggle
- Click sun/moon icon in top navigation
- Theme changes to light/dark
- Reload page
- Theme persists

### Done!
Everything is working!

## Common Tasks

### Add a New Authenticated Page
```tsx
import { ProtectedRoute } from '@/components/protected-route';

export default function MyPage() {
  return (
    <ProtectedRoute>
      <h1>This page requires login</h1>
    </ProtectedRoute>
  );
}
```

### Check User in Component
```tsx
import { useAuth } from '@/lib/context/auth-context';

export function MyComponent() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Use Theme in Component
```tsx
import { useTheme } from '@/lib/context/theme-context';

export function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}
```

### Protect Route by Role
```tsx
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>
```

## Troubleshooting

### "Supabase URL not found"
- Check `.env.local` has `NEXT_PUBLIC_SUPABASE_URL`
- Restart dev server after changing env
- Run `pnpm env` to verify variables

### "Failed to sign up"
- Check Supabase auth is enabled
- Check email provider configured
- Check credentials in .env.local
- Check network in browser DevTools

### "Theme not changing"
- Try clearing localStorage
- Check ThemeProvider wraps app in layout.tsx
- Verify JavaScript enabled
- Reload page

### "Still seeing landing page after login"
- Try logging in again
- Clear browser cache
- Check Supabase session is stored
- Check auth context initializes

## Demo Account

Use this to test without signup:
```
Email: demo@example.com
Password: demo123456
```

## Key Files

| What | Where |
|------|-------|
| Login Page | `app/auth/login/page.tsx` |
| Signup Page | `app/auth/signup/page.tsx` |
| Auth Logic | `lib/context/auth-context.tsx` |
| Theme Logic | `lib/context/theme-context.tsx` |
| Colors | `app/globals.css` |
| Navigation | `components/navigation.tsx` |

## Next Steps

1. **Deploy to Vercel**
   ```bash
   git push origin main  # Push to GitHub
   ```
   Then connect repo to Vercel

2. **Customize Colors**
   - Edit `app/globals.css`
   - Change oklch color values
   - Reload page

3. **Add More Pages**
   - Create in `app/` directory
   - Wrap with `<ProtectedRoute>`
   - Add to navigation if needed

4. **Configure Email**
   - Go to Supabase Auth settings
   - Configure email provider
   - Test password reset

## Full Documentation

Need more details?
- **Authentication**: See `AUTH_GUIDE.md`
- **Setup**: See `SETUP_CHECKLIST.md`
- **Features**: See `NEW_FEATURES.md`
- **Implementation**: See `IMPLEMENTATION_SUMMARY.md`

## Support

- Supabase issues: https://supabase.com/docs
- Next.js help: https://nextjs.org/docs
- Questions: Check the docs above first

---

You're done! Start building. 🚀
