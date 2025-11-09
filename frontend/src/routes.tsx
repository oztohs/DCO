import React from 'react';
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';
import NotFound from './components/public/notfound';
import Unauthorized from './pages/Unauthorized';
import Loading from './components/public/Loading';
import App from './App';
import AdminLayout from './components/admin/AdminLayout';
import MachineCompleteModal from './components/modal/MachineCompleteModal';
import ContestCompleteModal from './components/modal/ContestCompleteMD';
import { PlayProvider } from './contexts/PlayContext';

// ✅ Shop 관련 페이지
const ShopPage = React.lazy(() => import('./pages/shop/ShopPage'));
const InventoryPage = React.lazy(() => import('./pages/shop/InventoryPage'));
const RoulettePage = React.lazy(() => import('./pages/shop/RoulettePage'));

// ✅ Lazy-loaded 페이지들
const LoginPage = React.lazy(() => import('./pages/public/LoginPage'));
const MainPage = React.lazy(() => import('./pages/public/MainPage'));
const LeaderBoardPage = React.lazy(() => import('./pages/leaderboard/LeaderBoardPage'));
const ManualPage = React.lazy(() => import('./pages/ManualPage'));
const TutorialPage = React.lazy(() => import('./pages/TutorialPage'));
const TutorialPlayPage = React.lazy(() => import('./pages/TutorialPlayPage'));
const BattlePage = React.lazy(() => import('./pages/battle/BattlePage'));
const ArenaPage = React.lazy(() => import('./pages/arena/ArenaPage'));
const CreateArenaPage = React.lazy(() => import('./pages/arena/CreateArenaPage'));
const ArenaRoomPage = React.lazy(() => import('./pages/arena/ArenaRoomPage'));
const ArenaPlayPage = React.lazy(() => import('./pages/arena/ArenaPlayPage'));
const ArenaResultPage = React.lazy(() => import('./pages/arena/ArenaResultPage'));
const MatchPage = React.lazy(() => import('./pages/match/MatchPage'));
const ContestListPage = React.lazy(() => import('./pages/contest/ContestListPage'));
const ContestRegisterPage = React.lazy(() => import('./pages/contest/ContestRegisterPage'));
const ContestDetailPage = React.lazy(() => import('./pages/contest/ContestDetailPage'));
const PreContestPage = React.lazy(() => import('./pages/contest/PreContestPage'));
const ContestPlayPage = React.lazy(() => import('./pages/contest/ContestPlayPage'));
const MyStats = React.lazy(() => import('./pages/user/MyStats'));
const MyPage = React.lazy(() => import('./pages/user/MyPage'));
const LearningMainPage = React.lazy(() => import('./pages/learning/LearningMainPage'));
const MachineListPage = React.lazy(() => import('./pages/machine/MachineListPage'));
const MachineRegisterPage = React.lazy(() => import('./pages/machine/MachineRegisterPage'));
const MachineDetailPage = React.lazy(() => import('./pages/machine/MachineDetailPage'));
const MachinePlayPage = React.lazy(() => import('./pages/machine/MachinePlayPage'));
const DashboardHome = React.lazy(() => import('./pages/admin/DashboardHome'));
const UsersManagement = React.lazy(() => import('./pages/admin/UsersManagement'));
const MachinesManagement = React.lazy(() => import('./pages/admin/MachinesManagement'));
const ContestsManagement = React.lazy(() => import('./pages/admin/ContestsManagement'));
const InstancesManagement = React.lazy(() => import('./pages/admin/InstancesManagement'));
const ItemManagement = React.lazy(() => import('./pages/admin/ItemManagement'));
const LandingPage = React.lazy(() => import('./pages/landing/LandingPage'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      // === Public Routes ===
      { path: 'login', element: <LoginPage /> },
      { path: 'intro', element: <LandingPage /> },

      // === Protected Routes ===
      { index: true, element: <ProtectedRoute><MainPage /></ProtectedRoute> },
      { path: 'manual', element: <ProtectedRoute><ManualPage /></ProtectedRoute> },
      { path: 'leaderboard', element: <ProtectedRoute><LeaderBoardPage /></ProtectedRoute> },
      { path: 'tutorial', element: <ProtectedRoute><TutorialPage /></ProtectedRoute> },
      { path: 'tutorial/play', element: <ProtectedRoute><TutorialPlayPage /></ProtectedRoute> },
      { path: 'battle', element: <ProtectedRoute><BattlePage /></ProtectedRoute> },
      { path: 'mystats', element: <ProtectedRoute><MyStats /></ProtectedRoute> },
      { path: 'mypage', element: <ProtectedRoute><MyPage /></ProtectedRoute> },

      // === Shop ===
      { path: 'shop', element: <ProtectedRoute><ShopPage /></ProtectedRoute> },
      { path: 'inventory', element: <ProtectedRoute><InventoryPage /></ProtectedRoute> },
      { path: 'roulette', element: <ProtectedRoute><RoulettePage /></ProtectedRoute> },

      // === Arena ===
      { path: 'arena', element: <ProtectedRoute><ArenaPage /></ProtectedRoute> },
      { path: 'arena/create', element: <ProtectedRoute><CreateArenaPage /></ProtectedRoute> },
      { path: 'arena/:id', element: <ProtectedRoute><ArenaRoomPage /></ProtectedRoute> },
      {
        path: 'arena/play/:id',
        element: (
          <ProtectedRoute>
            <PlayProvider>
              <ArenaPlayPage />
            </PlayProvider>
          </ProtectedRoute>
        ),
      },
      { path: 'arena/result/:id', element: <ProtectedRoute><ArenaResultPage /></ProtectedRoute> },
      { path: 'match', element: <ProtectedRoute><MatchPage /></ProtectedRoute> },

      // === Contest ===
      { path: 'contest', element: <ProtectedRoute><ContestListPage /></ProtectedRoute> },
      { path: 'contest/register', element: <ProtectedRoute><ContestRegisterPage /></ProtectedRoute> },
      { path: 'contest/:contestId', element: <ProtectedRoute><ContestDetailPage /></ProtectedRoute> },
      { path: 'contest/:contestId/pre', element: <ProtectedRoute><PreContestPage /></ProtectedRoute> },
      { path: 'contest/:contestId/play', element: <ProtectedRoute><ContestPlayPage /></ProtectedRoute> },
      { path: 'contest/:contestId/complete', element: <ProtectedRoute><ContestCompleteModal onClose={() => {}} expEarned={9999} /></ProtectedRoute> },

      // === Machine ===
      { path: 'machine', element: <ProtectedRoute><MachineListPage /></ProtectedRoute> },
      { path: 'machine/register', element: <ProtectedRoute><MachineRegisterPage /></ProtectedRoute> },
      { path: 'machine/:machineId', element: <ProtectedRoute><MachineDetailPage /></ProtectedRoute> },
      { path: 'machine/:machineId/play', element: <ProtectedRoute><MachinePlayPage /></ProtectedRoute> },
      { path: 'machine/:machineId/complete', element: <ProtectedRoute><MachineCompleteModal onClose={() => {}} expEarned={9999} /></ProtectedRoute> },

      // === Learning ===
      { path: 'learning', element: <ProtectedRoute><LearningMainPage /></ProtectedRoute> },

      // === Common ===
      { path: 'unauthorized', element: <Unauthorized /> },
      { path: 'loading', element: <Loading /> },
      { path: '*', element: <NotFound /> },

      // === Admin ===
      {
        path: 'admin',
        element: (
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        ),
        children: [
          { index: true, element: <DashboardHome /> },
          { path: 'users', element: <UsersManagement /> },
          { path: 'machines', element: <MachinesManagement /> },
          { path: 'contests', element: <ContestsManagement /> },
          { path: 'instances', element: <InstancesManagement /> },
          { path: 'item', element: <ItemManagement /> },
        ],
      },
    ],
  },
];

export default routes;
