import { createBrowserRouter } from 'react-router';
import { Login } from './app/pages/Login';
import { Signup } from './app/pages/Signup';
import { Dashboard } from './app/pages/Dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
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
]);