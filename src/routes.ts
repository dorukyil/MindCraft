import { createBrowserRouter } from 'react-router';
import { Login } from './app/pages/Login';
import { Signup } from './app/pages/Signup';
import { Dashboard } from './app/pages/Dashboard';
import { AuthCallback } from './app/auth/callback/page';
import { SelectRole } from './app/pages/SelectRole';
import { Landing } from './app/pages/Landing';
import { LessonPage } from './app/pages/LessonPage';
import { TeacherLessonView } from './app/pages/TeacherLessonView';
import { Profile } from './app/pages/Profile';
import { Subscriptions } from './app/pages/Subscriptions';

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
    path: '/lesson/:id',
    Component: LessonPage,
  },
  {
    path: '/teacher/lesson/:id',
    Component: TeacherLessonView,
  },
  {
    path: '/auth/callback',
    Component: AuthCallback,
  },
  {
    path: '/select-role',
    Component: SelectRole,
  },
  {
    path: '/profile',
    Component: Profile,
  },
  {
    path: '/subscriptions',
    Component: Subscriptions,
  },
]);