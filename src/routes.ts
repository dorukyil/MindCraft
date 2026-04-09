import { createBrowserRouter } from 'react-router';
import { Login } from './app/pages/Login';
import { Signup } from './app/pages/Signup';
import { Dashboard } from './app/pages/Dashboard';
import { AuthCallback } from './app/auth/callback/page';
import { SelectRole } from './app/pages/SelectRole';
import { Landing } from './app/pages/Landing';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Landing,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/signup',
    Component: Signup,
  },
  {
    path: '/dashboard',
    Component: Dashboard,
  },
  {
    path: '/auth/callback',
    Component: AuthCallback,
  },
  {
    path: '/select-role',
    Component: SelectRole,
  },
]);