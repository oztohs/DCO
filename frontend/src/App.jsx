import React, { Suspense, lazy, Navigate } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/public/LoginPage';
import MainPage from './pages/public/MainPage';
import LoadingPage from './pages/public/LoadingPage';
import ProtectedRoute from './components/auth/ProtectedRoute';


// 비동기 로딩을 위한 Lazy 컴포넌트
const LeaderBoardPage = lazy(() => import('./pages/leaderboard/LeaderBoardPage'));
const ContestPage = lazy(() => import('./pages/ContestPage'));
const InstancesPage = lazy(() => import('./pages/InstancesPage'));
const MachinesPage = lazy(() => import('./pages/MachinesPage'));
const MyPage = lazy(() => import('./pages/user/MyPage'));

// 새로운 App 구성
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingPage />}>
          <Routes>
            {/* Public Routes */}
          <Route path="/login" element={ <LoginPage />} />

            {/* Protected Routes */}
          <Route
            path="/" 
            element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/LeaderBoard" 
            element={
              <ProtectedRoute>
                <LeaderBoardPage />
              </ProtectedRoute>
            } 
          />    
          <Route path="/Contest" 
            element={
              <ProtectedRoute>
                <ContestPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/Instances" 
            element={
              <ProtectedRoute>
                <InstancesPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/Machines" 
            element={
              <ProtectedRoute>
                <MachinesPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/mypage" 
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            } 
          />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
};

export default App;
