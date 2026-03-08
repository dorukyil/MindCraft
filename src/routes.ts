import { createBrowserRouter } from 'react-router';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Login,
  },
  {
    path: '/signup',
    Component: Signup,
  },
]);
