# Authentication & Theme System Guide

This document covers the new authentication system and dark/light mode theme switching functionality.

## Overview

The Incident Management Dashboard now includes:
- Full Supabase authentication (signup, login, password reset)
- Dark/Light mode theme support
- Role-based access control (Admin, Engineer, Client)
- Protected routes with automatic redirects
- Persistent user sessions
- Professional landing page for public users

## Authentication Features

### Sign Up Flow
Users can create new accounts at `/auth/signup`:
- Requires full name, email, and password (minimum 8 characters)
- Password confirmation validation
- Success notification with redirect to dashboard
- Validation error messages

### Login Flow
Users can sign in at `/auth/login`:
- Email and password authentication
- Persistent session storage
- Demo credentials available for testing
- Error handling with clear messages

### Password Reset
Users can reset forgotten passwords at `/auth/forgot-password`:
- Email-based password reset link
- Confirmation screen
- Seamless redirection after confirmation

### Session Management
- Automatic session initialization on app load
- Real-time auth state subscriptions
- Automatic logout on unauthorized requests
- Session persistence via localStorage

## Theme System

### Dark/Light Mode Toggle
- Toggle button in navigation bar (Sun/Moon icon)
- Persistent theme preference in localStorage
- Respects system color scheme preference
- Smooth transitions between themes

### Theme Colors

#### Light Mode
```
Background: Near-white (oklch(0.98 0 0))
Foreground: Near-black (oklch(0.15 0 0))
Primary: Purple accent (oklch(0.52 0.194 271.476))
Borders: Light gray
```

#### Dark Mode
```
Background: Very dark (oklch(0.08 0 0))
Foreground: Near-white (oklch(0.95 0 0))
Primary: Purple accent (oklch(0.52 0.194 271.476))
Borders: Dark gray
```

### Custom CSS Classes
The theme system supports custom status and severity badges:
- `.status-badge` - Base badge styling
- `.severity-critical` - Red badges
- `.severity-high` - Orange badges
- `.severity-medium` - Yellow badges
- `.severity-low` - Blue badges

## Landing Page

### Public Pages
The home page (`/`) now shows:
- Unauthenticated users: Professional landing page with features and CTA
- Authenticated users: Incident management dashboard

### Landing Page Sections
- **Hero**: Main value proposition with CTA buttons
- **Features**: Key features with icons (Real-time tracking, AI analysis, SLA management)
- **Stats**: Social proof (500+ customers, 99.9% uptime)
- **Call-to-Action**: Prominent signup button
- **Navigation**: Login and signup links in header

## Role-Based Access Control

### User Roles
- **Admin**: Full access to all features including settings and user management
- **Engineer**: Access to incidents, analytics, and logs
- **Client**: Read-only access to incidents

### Permission Checks
Methods in auth context:
- `canView(roles)` - Check if user has required role
- `canAssign()` - Can assign incidents (admin/engineer)
- `canResolve()` - Can resolve incidents (admin/engineer)
- `canDelete()` - Can delete incidents (admin only)

### Protected Routes
Use `<ProtectedRoute>` component to protect pages:
```tsx
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>
```

## Implementation Details

### Auth Service (`lib/services/auth-service.ts`)
Supabase integration layer providing:
- `signup()` - Create new account
- `login()` - Authenticate user
- `logout()` - Clear session
- `resetPassword()` - Send reset email
- `updatePassword()` - Update password
- `getSession()` - Retrieve current session
- `onAuthStateChange()` - Subscribe to auth changes

### Auth Context (`lib/context/auth-context.tsx`)
React context providing:
- `user` - Current authenticated user
- `isAuthenticated` - Authentication state
- `loading` - Loading state during auth init
- `login(email, password)` - Login handler
- `signup(email, password, fullName)` - Signup handler
- `logout()` - Logout handler
- `switchRole(role)` - Role switcher for testing (for development)
- RBAC permission methods

### Theme Context (`lib/context/theme-context.tsx`)
React context providing:
- `theme` - Current theme ('light' or 'dark')
- `toggleTheme()` - Switch between themes
- Automatic localStorage persistence
- System preference detection

## Navigation Updates

### Theme Toggle
- Located in top navigation bar
- Sun icon for dark mode, Moon icon for light mode
- Smooth color transitions

### Logout Button
- Logout button in top navigation bar
- Clears session and redirects to home
- Works across all authenticated pages

## Environment Variables

Required Supabase credentials (add to `.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing the System

### Demo Credentials
```
Email: demo@example.com
Password: demo123456
```

### Test Flows
1. **Signup**: Navigate to `/auth/signup` and create new account
2. **Login**: Use demo credentials at `/auth/login`
3. **Theme Toggle**: Click sun/moon icon in navigation
4. **Logout**: Click logout button in navigation
5. **Protected Routes**: Try accessing `/settings` without authentication

## Customization

### Changing Color Scheme
Edit `app/globals.css` color variables in `:root` and `.dark` selectors

### Custom Auth Pages
Styled login/signup pages can be customized in:
- `app/auth/login/page.tsx`
- `app/auth/signup/page.tsx`
- `app/auth/forgot-password/page.tsx`

### Landing Page
Customize landing page in `app/page.tsx` (LandingPage component)

## Best Practices

1. Always wrap protected pages with `<ProtectedRoute>`
2. Use auth context hooks in client components
3. Store theme preference in localStorage for persistence
4. Handle loading states during auth transitions
5. Provide clear error messages on auth failures
6. Validate form inputs before submission
7. Use password confirmation for account creation
8. Implement rate limiting for auth endpoints in production

## Security Considerations

- All auth operations use Supabase's built-in security
- Sessions are HTTP-only when configured
- Password hashing is handled server-side
- RLS policies prevent unauthorized data access
- Auth state is verified on every request
- CSRF protection is built-in

## Troubleshooting

### Theme Not Persisting
- Check browser localStorage settings
- Verify ThemeProvider is wrapping the app
- Clear cache and reload

### Auth State Not Loading
- Ensure Supabase credentials are set
- Check browser console for errors
- Verify network tab for failed requests

### Protected Routes Not Working
- Confirm ProtectedRoute wrapping the component
- Check user role in browser dev tools
- Verify auth context is available
