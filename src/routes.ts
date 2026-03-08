import { createBrowserRouter } from 'react-router';
import { Login } from './app/pages/Login';
import { Signup } from './app/pages/Signup';

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
